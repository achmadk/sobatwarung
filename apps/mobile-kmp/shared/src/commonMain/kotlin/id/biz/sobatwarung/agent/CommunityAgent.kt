package id.biz.sobatwarung.agent

import id.biz.sobatwarung.data.GroupBuyingRepository
import id.biz.sobatwarung.domain.GroupBuyingParticipant
import id.biz.sobatwarung.domain.GroupBuyingRoom
import id.biz.sobatwarung.network.GroupBuyingEvent
import id.biz.sobatwarung.network.WebSocketManager
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

class CommunityAgent(
    private val groupBuyingRepository: GroupBuyingRepository,
    private val webSocketManager: WebSocketManager,
    private val onNotification: (AgentNotification) -> Unit
) : Agent {

    override val name = "CommunityAgent"

    private var eventProcessingJob: Job? = null

    override suspend fun execute() {
        processGroupBuyingEvents()
    }

    override fun schedule(intervalMs: Long) {
        eventProcessingJob?.cancel()
        eventProcessingJob = CoroutineScope(Dispatchers.IO).launch {
            webSocketManager.groupBuyingEvents.collect { event ->
                handleGroupBuyingEvent(event)
            }
        }
    }

    private suspend fun processGroupBuyingEvents() {
        groupBuyingRepository.getActiveRooms().first().forEach { room ->
            val participantCount = groupBuyingRepository.getParticipantsByRoom(room.id).first().size
            if (participantCount > 0) {
                onNotification(AgentNotification.CommunityEvent(
                    event = "Active room with participants",
                    roomId = room.id
                ))
            }
        }
    }

    private suspend fun handleGroupBuyingEvent(event: GroupBuyingEvent) {
        when (event) {
            is GroupBuyingEvent.RoomCreated -> {
                onNotification(AgentNotification.CommunityEvent("New room created", event.room.id))
            }
            is GroupBuyingEvent.RoomUpdated -> {
                onNotification(AgentNotification.CommunityEvent("Room updated", event.room.id))
            }
            is GroupBuyingEvent.MemberJoined -> {
                onNotification(AgentNotification.CommunityEvent("Member joined", event.roomId))
            }
            is GroupBuyingEvent.MemberLeft -> {
                onNotification(AgentNotification.CommunityEvent("Member left", event.roomId))
            }
        }
    }

    fun subscribeToHub(hubId: String) {
        webSocketManager.subscribeToGroupBuying(hubId)
    }

    fun unsubscribeFromHub(hubId: String) {
        webSocketManager.unsubscribeFromGroupBuying(hubId)
    }

    fun stop() {
        eventProcessingJob?.cancel()
    }
}
