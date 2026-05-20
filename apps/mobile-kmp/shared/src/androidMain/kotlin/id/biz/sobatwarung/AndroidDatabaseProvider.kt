package id.biz.sobatwarung

import android.content.Context
import app.cash.sqldelight.android.AndroidSqliteDriver
import app.cash.sqldelight.coroutines.asFlow
import id.biz.sobatwarung.data.*
import id.biz.sobatwarung.db.SobatWarungDatabase
import id.biz.sobatwarung.domain.*
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json

class AndroidDatabaseProvider(context: Context) : DatabaseProvider {
    private val driver = AndroidSqliteDriver(
        schema = SobatWarungDatabase.Schema,
        context = context,
        name = "sobatwarung.db"
    )

    override val database = SobatWarungDatabase(driver)

    override val productRepository = AndroidProductRepository(database, Json)
    override val orderRepository = AndroidOrderRepository(database, Json)
    override val syncQueueRepository = AndroidSyncQueueRepository(database)
    override val groupBuyingRepository = AndroidGroupBuyingRepository(database, Json)
}

class AndroidProductRepository(
    private val db: SobatWarungDatabase,
    private val json: Json
) : ProductRepository {
    override fun getAllProducts(): Flow<List<Product>> {
        return db.productQueries.selectAll().asFlow().map { rows ->
            rows.map { row ->
                Product(
                    id = row.id,
                    name = row.name,
                    description = row.description,
                    price = row.price,
                    stock = row.stock.toInt(),
                    lowStockThreshold = row.low_stock_threshold.toInt(),
                    imageUrl = row.image_url,
                    category = row.category,
                    agenUtamaId = row.agen_utama_id,
                    createdAt = row.created_at,
                    updatedAt = row.updated_at,
                    syncedAt = row.synced_at
                )
            }
        }
    }

    override fun getProductsByAgenUtama(agenUtamaId: String): Flow<List<Product>> {
        return db.productQueries.selectByAgenUtama(agenUtamaId).asFlow().map { rows ->
            rows.map { row ->
                Product(
                    id = row.id,
                    name = row.name,
                    description = row.description,
                    price = row.price,
                    stock = row.stock.toInt(),
                    lowStockThreshold = row.low_stock_threshold.toInt(),
                    imageUrl = row.image_url,
                    category = row.category,
                    agenUtamaId = row.agen_utama_id,
                    createdAt = row.created_at,
                    updatedAt = row.updated_at,
                    syncedAt = row.synced_at
                )
            }
        }
    }

    override fun getProductById(id: String): Flow<Product?> {
        return db.productQueries.selectById(id).asFlow().map { row ->
            row?.let {
                Product(
                    id = it.id,
                    name = it.name,
                    description = it.description,
                    price = it.price,
                    stock = it.stock.toInt(),
                    lowStockThreshold = it.low_stock_threshold.toInt(),
                    imageUrl = it.image_url,
                    category = it.category,
                    agenUtamaId = it.agen_utama_id,
                    createdAt = it.created_at,
                    updatedAt = it.updated_at,
                    syncedAt = it.synced_at
                )
            }
        }
    }

    override fun getLowStockProducts(threshold: Int): Flow<List<Product>> {
        return db.productQueries.selectLowStock(threshold.toLong()).asFlow().map { rows ->
            rows.map { row ->
                Product(
                    id = row.id,
                    name = row.name,
                    description = row.description,
                    price = row.price,
                    stock = row.stock.toInt(),
                    lowStockThreshold = row.low_stock_threshold.toInt(),
                    imageUrl = row.image_url,
                    category = row.category,
                    agenUtamaId = row.agen_utama_id,
                    createdAt = row.created_at,
                    updatedAt = row.updated_at,
                    syncedAt = row.synced_at
                )
            }
        }
    }

    override suspend fun insertProduct(product: Product) {
        db.productQueries.insert(
            id = product.id,
            name = product.name,
            description = product.description,
            price = product.price,
            stock = product.stock.toLong(),
            low_stock_threshold = product.lowStockThreshold.toLong(),
            image_url = product.imageUrl,
            category = product.category,
            agen_utama_id = product.agenUtamaId,
            created_at = product.createdAt,
            updated_at = product.updatedAt,
            synced_at = product.syncedAt
        )
    }

    override suspend fun updateProduct(product: Product) {
        db.productQueries.update(
            name = product.name,
            description = product.description,
            price = product.price,
            stock = product.stock.toLong(),
            low_stock_threshold = product.lowStockThreshold.toLong(),
            image_url = product.imageUrl,
            category = product.category,
            agen_utama_id = product.agenUtamaId,
            updated_at = product.updatedAt,
            synced_at = product.syncedAt,
            id = product.id
        )
    }

    override suspend fun deleteProduct(id: String) {
        db.productQueries.delete(id)
    }
}

class AndroidOrderRepository(
    private val db: SobatWarungDatabase,
    private val json: Json
) : OrderRepository {
    override fun getAllOrders(): Flow<List<Order>> {
        return db.orderQueries.selectAll().asFlow().map { rows ->
            rows.map { row ->
                Order(
                    id = row.id,
                    agenMitraId = row.agen_mitra_id,
                    agenUtamaId = row.agen_utama_id,
                    status = OrderStatus.valueOf(row.status.uppercase()),
                    totalAmount = row.total_amount,
                    notes = row.notes,
                    createdAt = row.created_at,
                    updatedAt = row.updated_at,
                    syncedAt = row.synced_at
                )
            }
        }
    }

    override fun getOrdersByAgenMitra(agenMitraId: String): Flow<List<Order>> {
        return db.orderQueries.selectByAgenMitra(agenMitraId).asFlow().map { rows ->
            rows.map { row ->
                Order(
                    id = row.id,
                    agenMitraId = row.agen_mitra_id,
                    agenUtamaId = row.agen_utama_id,
                    status = OrderStatus.valueOf(row.status.uppercase()),
                    totalAmount = row.total_amount,
                    notes = row.notes,
                    createdAt = row.created_at,
                    updatedAt = row.updated_at,
                    syncedAt = row.synced_at
                )
            }
        }
    }

    override fun getOrdersByAgenUtama(agenUtamaId: String): Flow<List<Order>> {
        return db.orderQueries.selectByAgenUtama(agenUtamaId).asFlow().map { rows ->
            rows.map { row ->
                Order(
                    id = row.id,
                    agenMitraId = row.agen_mitra_id,
                    agenUtamaId = row.agen_utama_id,
                    status = OrderStatus.valueOf(row.status.uppercase()),
                    totalAmount = row.total_amount,
                    notes = row.notes,
                    createdAt = row.created_at,
                    updatedAt = row.updated_at,
                    syncedAt = row.synced_at
                )
            }
        }
    }

    override fun getOrderById(id: String): Flow<Order?> {
        return db.orderQueries.selectById(id).asFlow().map { row ->
            row?.let {
                Order(
                    id = it.id,
                    agenMitraId = it.agen_mitra_id,
                    agenUtamaId = it.agen_utama_id,
                    status = OrderStatus.valueOf(it.status.uppercase()),
                    totalAmount = it.total_amount,
                    notes = it.notes,
                    createdAt = it.created_at,
                    updatedAt = it.updated_at,
                    syncedAt = it.synced_at
                )
            }
        }
    }

    override fun getOrdersByStatus(status: OrderStatus): Flow<List<Order>> {
        return db.orderQueries.selectByStatus(status.name.lowercase()).asFlow().map { rows ->
            rows.map { row ->
                Order(
                    id = row.id,
                    agenMitraId = row.agen_mitra_id,
                    agenUtamaId = row.agen_utama_id,
                    status = OrderStatus.valueOf(row.status.uppercase()),
                    totalAmount = row.total_amount,
                    notes = row.notes,
                    createdAt = row.created_at,
                    updatedAt = row.updated_at,
                    syncedAt = row.synced_at
                )
            }
        }
    }

    override suspend fun insertOrder(order: Order) {
        db.orderQueries.insert(
            id = order.id,
            agen_mitra_id = order.agenMitraId,
            agen_utama_id = order.agenUtamaId,
            status = order.status.name.lowercase(),
            total_amount = order.totalAmount,
            notes = order.notes,
            created_at = order.createdAt,
            updated_at = order.updatedAt,
            synced_at = order.syncedAt
        )
    }

    override suspend fun updateOrder(order: Order) {
        db.orderQueries.update(
            agen_mitra_id = order.agenMitraId,
            agen_utama_id = order.agenUtamaId,
            status = order.status.name.lowercase(),
            total_amount = order.totalAmount,
            notes = order.notes,
            updated_at = order.updatedAt,
            synced_at = order.syncedAt,
            id = order.id
        )
    }

    override suspend fun deleteOrder(id: String) {
        db.orderQueries.delete(id)
    }
}

class AndroidSyncQueueRepository(
    private val db: SobatWarungDatabase
) : SyncQueueRepository {
    override fun getPendingItems(): Flow<List<SyncQueueItem>> {
        return db.syncQueueQueries.selectPending().asFlow().map { rows ->
            rows.map { row ->
                SyncQueueItem(
                    id = row.id,
                    tableName = row.table_name,
                    recordId = row.record_id,
                    operation = SyncOperation.valueOf(row.operation.uppercase()),
                    payload = row.payload,
                    timestamp = row.timestamp,
                    retryCount = row.retry_count.toInt(),
                    status = SyncStatus.valueOf(row.status.uppercase())
                )
            }
        }
    }

    override fun getPendingCount(): Flow<Int> {
        return db.syncQueueQueries.countPending().asFlow().map { it.toInt() }
    }

    override suspend fun addItem(item: SyncQueueItem) {
        db.syncQueueQueries.insert(
            table_name = item.tableName,
            record_id = item.recordId,
            operation = item.operation.name.lowercase(),
            payload = item.payload,
            timestamp = item.timestamp,
            retry_count = item.retryCount.toLong(),
            status = item.status.name.lowercase()
        )
    }

    override suspend fun markInProgress(id: Long) {
        db.syncQueueQueries.markInProgress(id)
    }

    override suspend fun markCompleted(id: Long) {
        db.syncQueueQueries.markCompleted(id)
    }

    override suspend fun markFailed(id: Long) {
        db.syncQueueQueries.markFailed(id)
    }

    override suspend fun incrementRetryCount(id: Long) {
        db.syncQueueQueries.incrementRetryCount(id)
    }

    override suspend fun removeItem(id: Long) {
        db.syncQueueQueries.remove(id)
    }
}

class AndroidGroupBuyingRepository(
    private val db: SobatWarungDatabase,
    private val json: Json
) : GroupBuyingRepository {
    override fun getAllRooms(): Flow<List<GroupBuyingRoom>> {
        return db.groupBuyingRoomQueries.selectAll().asFlow().map { rows ->
            rows.map { row ->
                GroupBuyingRoom(
                    id = row.id,
                    agenUtamaId = row.agen_utama_id,
                    name = row.name,
                    description = row.description,
                    startTime = row.start_time,
                    endTime = row.end_time,
                    status = GroupBuyingStatus.valueOf(row.status.uppercase()),
                    createdAt = row.created_at,
                    updatedAt = row.updated_at,
                    syncedAt = row.synced_at
                )
            }
        }
    }

    override fun getRoomsByAgenUtama(agenUtamaId: String): Flow<List<GroupBuyingRoom>> {
        return db.groupBuyingRoomQueries.selectByAgenUtama(agenUtamaId).asFlow().map { rows ->
            rows.map { row ->
                GroupBuyingRoom(
                    id = row.id,
                    agenUtamaId = row.agen_utama_id,
                    name = row.name,
                    description = row.description,
                    startTime = row.start_time,
                    endTime = row.end_time,
                    status = GroupBuyingStatus.valueOf(row.status.uppercase()),
                    createdAt = row.created_at,
                    updatedAt = row.updated_at,
                    syncedAt = row.synced_at
                )
            }
        }
    }

    override fun getRoomById(id: String): Flow<GroupBuyingRoom?> {
        return db.groupBuyingRoomQueries.selectById(id).asFlow().map { row ->
            row?.let {
                GroupBuyingRoom(
                    id = it.id,
                    agenUtamaId = it.agen_utama_id,
                    name = it.name,
                    description = it.description,
                    startTime = it.start_time,
                    endTime = it.end_time,
                    status = GroupBuyingStatus.valueOf(it.status.uppercase()),
                    createdAt = it.created_at,
                    updatedAt = it.updated_at,
                    syncedAt = it.synced_at
                )
            }
        }
    }

    override fun getActiveRooms(): Flow<List<GroupBuyingRoom>> {
        return db.groupBuyingRoomQueries.selectActive().asFlow().map { rows ->
            rows.map { row ->
                GroupBuyingRoom(
                    id = row.id,
                    agenUtamaId = row.agen_utama_id,
                    name = row.name,
                    description = row.description,
                    startTime = row.start_time,
                    endTime = row.end_time,
                    status = GroupBuyingStatus.valueOf(row.status.uppercase()),
                    createdAt = row.created_at,
                    updatedAt = row.updated_at,
                    syncedAt = row.synced_at
                )
            }
        }
    }

    override fun getParticipantsByRoom(roomId: String): Flow<List<GroupBuyingParticipant>> {
        return db.groupBuyingParticipantQueries.selectByRoom(roomId).asFlow().map { rows ->
            rows.map { row ->
                GroupBuyingParticipant(
                    id = row.id,
                    roomId = row.room_id,
                    agenMitraId = row.agen_mitra_id,
                    joinedAt = row.joined_at
                )
            }
        }
    }

    override suspend fun insertRoom(room: GroupBuyingRoom) {
        db.groupBuyingRoomQueries.insert(
            id = room.id,
            agen_utama_id = room.agenUtamaId,
            name = room.name,
            description = room.description,
            start_time = room.startTime,
            end_time = room.endTime,
            status = room.status.name.lowercase(),
            created_at = room.createdAt,
            updated_at = room.updatedAt,
            synced_at = room.syncedAt
        )
    }

    override suspend fun updateRoom(room: GroupBuyingRoom) {
        db.groupBuyingRoomQueries.update(
            agen_utama_id = room.agenUtamaId,
            name = room.name,
            description = room.description,
            start_time = room.startTime,
            end_time = room.endTime,
            status = room.status.name.lowercase(),
            updated_at = room.updatedAt,
            synced_at = room.syncedAt,
            id = room.id
        )
    }

    override suspend fun insertParticipant(participant: GroupBuyingParticipant) {
        db.groupBuyingParticipantQueries.insert(
            id = participant.id,
            room_id = participant.roomId,
            agen_mitra_id = participant.agenMitraId,
            joined_at = participant.joinedAt
        )
    }

    override suspend fun removeParticipant(id: String) {
        db.groupBuyingParticipantQueries.delete(id)
    }
}
