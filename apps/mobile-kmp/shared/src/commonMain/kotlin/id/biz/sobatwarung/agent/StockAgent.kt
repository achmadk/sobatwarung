package id.biz.sobatwarung.agent

import id.biz.sobatwarung.data.ProductRepository
import id.biz.sobatwarung.domain.Product
import id.biz.sobatwarung.sync.SyncManager
import id.biz.sobatwarung.domain.SyncOperation
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json

class StockAgent(
    private val productRepository: ProductRepository,
    private val syncManager: SyncManager,
    private val json: Json,
    private val onNotification: (AgentNotification) -> Unit
) : Agent {

    override val name = "StockAgent"

    private var monitoringJob: Job? = null
    private val _lastCheck = MutableStateFlow<Long>(0)
    val lastCheck: StateFlow<Long> = _lastCheck.asStateFlow()

    override suspend fun execute() {
        _lastCheck.value = System.currentTimeMillis()
        checkInventoryLevels()
    }

    override fun schedule(intervalMs: Long) {
        monitoringJob?.cancel()
        monitoringJob = CoroutineScope(Dispatchers.IO).launch {
            while (isActive) {
                execute()
                delay(intervalMs)
            }
        }
    }

    private suspend fun checkInventoryLevels() {
        productRepository.getAllProducts().first().forEach { product ->
            if (product.stock <= product.lowStockThreshold) {
                onNotification(AgentNotification.LowStockAlert(product))
                syncManager.queueMutation(
                    tableName = "products",
                    recordId = product.id,
                    operation = SyncOperation.UPDATE,
                    payload = json.encodeToString(product)
                )
            }
        }
    }

    fun stop() {
        monitoringJob?.cancel()
    }
}
