package id.biz.sobatwarung.network

import id.biz.sobatwarung.domain.*
import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.plugins.*
import io.ktor.client.request.*
import io.ktor.http.*
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json

class KtorApiClient(
    private val baseUrl: String,
    private val client: HttpClient,
    private val json: Json
) : ApiClient {

    private var authToken: String? = null

    fun setAuthToken(token: String) {
        authToken = token
    }

    override suspend fun login(email: String, password: String): Result<AuthResponse> {
        return try {
            val response: AuthResponse = client.post("$baseUrl/auth/login") {
                contentType(ContentType.Application.Json)
                setBody("""{"email":"$email","password":"$password"}""")
            }.body()
            Result.success(response)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun getProducts(agenUtamaId: String): Result<List<Product>> {
        return try {
            val response: List<Product> = client.get("$baseUrl/products") {
                parameter("agenUtamaId", agenUtamaId)
                auth()
            }.body()
            Result.success(response)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun getOrders(agenUtamaId: String): Result<List<Order>> {
        return try {
            val response: List<Order> = client.get("$baseUrl/orders") {
                parameter("agenUtamaId", agenUtamaId)
                auth()
            }.body()
            Result.success(response)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun createOrder(order: Order): Result<Order> {
        return try {
            val response: Order = client.post("$baseUrl/orders") {
                auth()
                contentType(ContentType.Application.Json)
                setBody(json.encodeToString(order))
            }.body()
            Result.success(response)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun updateOrder(order: Order): Result<Order> {
        return try {
            val response: Order = client.put("$baseUrl/orders/${order.id}") {
                auth()
                contentType(ContentType.Application.Json)
                setBody(json.encodeToString(order))
            }.body()
            Result.success(response)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun getGroupBuyingRooms(agenUtamaId: String): Result<List<GroupBuyingRoom>> {
        return try {
            val response: List<GroupBuyingRoom> = client.get("$baseUrl/group-buying") {
                parameter("agenUtamaId", agenUtamaId)
                auth()
            }.body()
            Result.success(response)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun createGroupBuyingRoom(room: GroupBuyingRoom): Result<GroupBuyingRoom> {
        return try {
            val response: GroupBuyingRoom = client.post("$baseUrl/group-buying") {
                auth()
                contentType(ContentType.Application.Json)
                setBody(json.encodeToString(room))
            }.body()
            Result.success(response)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun joinGroupBuyingRoom(participant: GroupBuyingParticipant): Result<GroupBuyingParticipant> {
        return try {
            val response: GroupBuyingParticipant = client.post("$baseUrl/group-buying/join") {
                auth()
                contentType(ContentType.Application.Json)
                setBody(json.encodeToString(participant))
            }.body()
            Result.success(response)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun pushSyncMutations(items: List<SyncQueueItem>): Result<SyncPushResponse> {
        return try {
            val response: SyncPushResponse = client.post("$baseUrl/sync/push") {
                auth()
                contentType(ContentType.Application.Json)
                setBody(json.encodeToString(items))
            }.body()
            Result.success(response)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun pullChanges(lastSyncTimestamp: Long): Result<PullChangesResponse> {
        return try {
            val response: PullChangesResponse = client.get("$baseUrl/sync/pull") {
                parameter("since", lastSyncTimestamp)
                auth()
            }.body()
            Result.success(response)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    private fun HttpRequestBuilder.auth() {
        authToken?.let { token ->
            headers.append("Authorization", "Bearer $token")
        }
    }
}
