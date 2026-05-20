package id.biz.sobatwarung.sync

import id.biz.sobatwarung.data.SyncQueueRepository
import id.biz.sobatwarung.domain.*
import id.biz.sobatwarung.network.ApiClient
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

interface SyncManager {
    val pendingSyncCount: StateFlow<Int>
    val isSyncing: StateFlow<Boolean>
    val lastSyncTime: StateFlow<Long?>
    suspend fun sync()
    suspend fun queueMutation(tableName: String, recordId: String, operation: SyncOperation, payload: String)
}

class DefaultSyncManager(
    private val syncQueueRepository: SyncQueueRepository,
    private val apiClient: ApiClient,
    private val productRepository: ProductRepository,
    private val orderRepository: OrderRepository,
    private val groupBuyingRepository: GroupBuyingRepository
) : SyncManager {

    private val _pendingSyncCount = MutableStateFlow(0)
    override val pendingSyncCount: StateFlow<Int> = _pendingSyncCount.asStateFlow()

    private val _isSyncing = MutableStateFlow(false)
    override val isSyncing: StateFlow<Boolean> = _isSyncing.asStateFlow()

    private val _lastSyncTime = MutableStateFlow<Long?>(null)
    override val lastSyncTime: StateFlow<Long?> = _lastSyncTime.asStateFlow()

    private var lastSyncTimestamp: Long = 0

    companion object {
        private const val MAX_RETRIES = 3
        private val RETRY_DELAYS = listOf(1000L, 2000L, 4000L)
    }

    init {
        CoroutineScope(Dispatchers.IO).launch {
            syncQueueRepository.getPendingCount().collect { count ->
                _pendingSyncCount.value = count
            }
        }
    }

    override suspend fun sync() {
        if (_isSyncing.value) return

        _isSyncing.value = true

        try {
            pullRemoteChanges()

            pushPendingMutations()

            _lastSyncTime.value = System.currentTimeMillis()
        } finally {
            _isSyncing.value = false
        }
    }

    override suspend fun queueMutation(
        tableName: String,
        recordId: String,
        operation: SyncOperation,
        payload: String
    ) {
        val item = SyncQueueItem(
            tableName = tableName,
            recordId = recordId,
            operation = operation,
            payload = payload,
            timestamp = System.currentTimeMillis(),
            status = SyncStatus.PENDING
        )
        syncQueueRepository.addItem(item)
    }

    private suspend fun pullRemoteChanges() {
        val result = apiClient.pullChanges(lastSyncTimestamp)
        result.onSuccess { response ->
            response.products.forEach { product ->
                productRepository.insertProduct(product)
            }
            response.orders.forEach { order ->
                orderRepository.insertOrder(order)
            }
            response.groupBuyingRooms.forEach { room ->
                groupBuyingRepository.insertRoom(room)
            }
            lastSyncTimestamp = response.serverTimestamp
        }
    }

    private suspend fun pushPendingMutations() {
        syncQueueRepository.getPendingItems().first().forEach { item ->
            if (item.retryCount >= MAX_RETRIES) {
                syncQueueRepository.markFailed(item.id)
                return@forEach
            }

            syncQueueRepository.markInProgress(item.id)

            val result = apiClient.pushSyncMutations(listOf(item))
            result.onSuccess { response ->
                if (response.success) {
                    syncQueueRepository.markCompleted(item.id)
                } else {
                    handlePushFailure(item, response)
                }
            }.onFailure {
                handlePushError(item)
            }
        }
    }

    private suspend fun handlePushFailure(item: SyncQueueItem, response: id.biz.sobatwarung.network.SyncPushResponse) {
        val conflict = response.conflicts.find { it.recordId == item.recordId }
        if (conflict != null) {
            if (conflict.serverTimestamp > conflict.clientTimestamp) {
                syncQueueRepository.markCompleted(item.id)
            } else {
                syncQueueRepository.incrementRetryCount(item.id)
                delay(RETRY_DELAYS.getOrElse(item.retryCount) { 4000L })
            }
        }
    }

    private suspend fun handlePushError(item: SyncQueueItem) {
        syncQueueRepository.incrementRetryCount(item.id)
        delay(RETRY_DELAYS.getOrElse(item.retryCount) { 4000L })
    }
}
