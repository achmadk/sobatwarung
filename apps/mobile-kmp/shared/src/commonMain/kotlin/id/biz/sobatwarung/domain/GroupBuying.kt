package id.biz.sobatwarung.domain

import kotlinx.serialization.Serializable

@Serializable
data class GroupBuyingRoom(
    val id: String,
    val agenUtamaId: String,
    val name: String,
    val description: String? = null,
    val startTime: Long,
    val endTime: Long,
    val status: GroupBuyingStatus = GroupBuyingStatus.ACTIVE,
    val createdAt: Long,
    val updatedAt: Long,
    val syncedAt: Long? = null,
    val participants: List<GroupBuyingParticipant> = emptyList()
)

@Serializable
enum class GroupBuyingStatus(val displayName: String) {
    ACTIVE("Aktif"),
    ENDED("Berakhir"),
    CANCELLED("Dibatalkan")
}

@Serializable
data class GroupBuyingParticipant(
    val id: String,
    val roomId: String,
    val agenMitraId: String,
    val joinedAt: Long
)
