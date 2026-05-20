package id.biz.sobatwarung.network

import id.biz.sobatwarung.domain.*
import kotlinx.serialization.Serializable

interface ApiClient {
    suspend fun login(email: String, password: String): Result<AuthResponse>
    suspend fun getProducts(agenUtamaId: String): Result<List<Product>>
    suspend fun getOrders(agenUtamaId: String): Result<List<Order>>
    suspend fun createOrder(order: Order): Result<Order>
    suspend fun updateOrder(order: Order): Result<Order>
    suspend fun getGroupBuyingRooms(agenUtamaId: String): Result<List<GroupBuyingRoom>>
    suspend fun createGroupBuyingRoom(room: GroupBuyingRoom): Result<GroupBuyingRoom>
    suspend fun joinGroupBuyingRoom(participant: GroupBuyingParticipant): Result<GroupBuyingParticipant>
    suspend fun pushSyncMutations(items: List<SyncQueueItem>): Result<SyncPushResponse>
    suspend fun pullChanges(lastSyncTimestamp: Long): Result<PullChangesResponse>
}

@Serializable
data class AuthResponse(
    val token: String,
    val user: User
)

@Serializable
data class SyncPushResponse(
    val success: Boolean,
    val failedItems: List<Long> = emptyList(),
    val conflicts: List<ConflictItem> = emptyList()
)

@Serializable
data class ConflictItem(
    val recordId: String,
    val serverTimestamp: Long,
    val clientTimestamp: Long
)

@Serializable
data class PullChangesResponse(
    val products: List<Product> = emptyList(),
    val orders: List<Order> = emptyList(),
    val groupBuyingRooms: List<GroupBuyingRoom> = emptyList(),
    val serverTimestamp: Long
)
