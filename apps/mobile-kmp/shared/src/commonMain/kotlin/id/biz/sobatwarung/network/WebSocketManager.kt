package id.biz.sobatwarung.network

import id.biz.sobatwarung.domain.*
import io.ktor.client.*
import io.ktor.client.plugins.websocket.*
import io.ktor.websocket.*
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

interface WebSocketManager {
    val connectionState: StateFlow<ConnectionState>
    val groupBuyingEvents: SharedFlow<GroupBuyingEvent>
    suspend fun connect()
    suspend fun disconnect()
    fun subscribeToGroupBuying(hubId: String)
    fun unsubscribeFromGroupBuying(hubId: String)
}

enum class ConnectionState {
    DISCONNECTED,
    CONNECTING,
    CONNECTED,
    RECONNECTING
}

sealed class GroupBuyingEvent {
    data class RoomCreated(val room: GroupBuyingRoom) : GroupBuyingEvent()
    data class RoomUpdated(val room: GroupBuyingRoom) : GroupBuyingEvent()
    data class MemberJoined(val roomId: String, val memberId: String) : GroupBuyingEvent()
    data class MemberLeft(val roomId: String, val memberId: String) : GroupBuyingEvent()
}

class KtorWebSocketManager(
    private val baseUrl: String,
    private val client: HttpClient,
    private val json: Json
) : WebSocketManager {

    private val _connectionState = MutableStateFlow(ConnectionState.DISCONNECTED)
    override val connectionState: StateFlow<ConnectionState> = _connectionState.asStateFlow()

    private val _groupBuyingEvents = MutableSharedFlow<GroupBuyingEvent>(replay = 0)
    override val groupBuyingEvents: SharedFlow<GroupBuyingEvent> = _groupBuyingEvents.asSharedFlow()

    private var session: WebSocketSession? = null
    private val subscribedRooms = mutableSetOf<String>()
    private var reconnectJob: Job? = null

    override suspend fun connect() {
        if (_connectionState.value == ConnectionState.CONNECTED) return

        _connectionState.value = ConnectionState.CONNECTING

        try {
            session = client.webSocketSession("$baseUrl/ws")
            _connectionState.value = ConnectionState.CONNECTED

            session?.let { ws ->
                launch {
                    for (frame in ws.incoming) {
                        if (frame is Frame.Text) {
                            handleMessage(frame.readText())
                        }
                    }
                }
            }
        } catch (e: Exception) {
            _connectionState.value = ConnectionState.DISCONNECTED
            scheduleReconnect()
        }
    }

    override suspend fun disconnect() {
        reconnectJob?.cancel()
        session?.close()
        session = null
        _connectionState.value = ConnectionState.DISCONNECTED
    }

    override fun subscribeToGroupBuying(hubId: String) {
        subscribedRooms.add(hubId)
        sendSubscription(hubId)
    }

    override fun unsubscribeFromGroupBuying(hubId: String) {
        subscribedRooms.remove(hubId)
    }

    private fun handleMessage(text: String) {
        // Parse message and emit appropriate event
        // This is a stub - actual implementation would parse JSON message type
    }

    private fun sendSubscription(hubId: String) {
        val message = """{"type":"subscribe","hubId":"$hubId"}"""
        session?.let { ws ->
            launch {
                ws.send(Frame.Text(message))
            }
        }
    }

    private fun scheduleReconnect() {
        reconnectJob?.cancel()
        reconnectJob = launch {
            _connectionState.value = ConnectionState.RECONNECTING
            delay(5000)
            connect()
        }
    }
}
