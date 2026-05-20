package id.biz.sobatwarung.data

import id.biz.sobatwarung.db.SobatWarungDatabase
import kotlinx.coroutines.flow.Flow

interface DatabaseProvider {
    val database: SobatWarungDatabase
    val productRepository: ProductRepository
    val orderRepository: OrderRepository
    val syncQueueRepository: SyncQueueRepository
    val groupBuyingRepository: GroupBuyingRepository
}

interface ProductRepository {
    fun getAllProducts(): Flow<List<Product>>
    fun getProductsByAgenUtama(agenUtamaId: String): Flow<List<Product>>
    fun getProductById(id: String): Flow<Product?>
    fun getLowStockProducts(threshold: Int): Flow<List<Product>>
    suspend fun insertProduct(product: Product)
    suspend fun updateProduct(product: Product)
    suspend fun deleteProduct(id: String)
}

interface OrderRepository {
    fun getAllOrders(): Flow<List<Order>>
    fun getOrdersByAgenMitra(agenMitraId: String): Flow<List<Order>>
    fun getOrdersByAgenUtama(agenUtamaId: String): Flow<List<Order>>
    fun getOrderById(id: String): Flow<Order?>
    fun getOrdersByStatus(status: OrderStatus): Flow<List<Order>>
    suspend fun insertOrder(order: Order)
    suspend fun updateOrder(order: Order)
    suspend fun deleteOrder(id: String)
}

interface SyncQueueRepository {
    fun getPendingItems(): Flow<List<SyncQueueItem>>
    fun getPendingCount(): Flow<Int>
    suspend fun addItem(item: SyncQueueItem)
    suspend fun markInProgress(id: Long)
    suspend fun markCompleted(id: Long)
    suspend fun markFailed(id: Long)
    suspend fun incrementRetryCount(id: Long)
    suspend fun removeItem(id: Long)
}

interface GroupBuyingRepository {
    fun getAllRooms(): Flow<List<GroupBuyingRoom>>
    fun getRoomsByAgenUtama(agenUtamaId: String): Flow<List<GroupBuyingRoom>>
    fun getRoomById(id: String): Flow<GroupBuyingRoom?>
    fun getActiveRooms(): Flow<List<GroupBuyingRoom>>
    fun getParticipantsByRoom(roomId: String): Flow<List<GroupBuyingParticipant>>
    suspend fun insertRoom(room: GroupBuyingRoom)
    suspend fun updateRoom(room: GroupBuyingRoom)
    suspend fun insertParticipant(participant: GroupBuyingParticipant)
    suspend fun removeParticipant(id: String)
}
