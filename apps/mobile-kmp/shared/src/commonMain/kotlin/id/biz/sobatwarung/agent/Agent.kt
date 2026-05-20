package id.biz.sobatwarung.agent

import id.biz.sobatwarung.domain.*
import kotlinx.coroutines.*

interface Agent {
    val name: String
    suspend fun execute()
    fun schedule(intervalMs: Long)
}

data class AgentResult(
    val success: Boolean,
    val message: String,
    val data: Any? = null
)

sealed class AgentNotification {
    data class LowStockAlert(val product: Product) : AgentNotification()
    data class SalesAlert(val message: String, val metrics: SalesMetrics) : AgentNotification()
    data class CommunityEvent(val event: String, val roomId: String) : AgentNotification()
    data class AccessDenied(val resource: String, val userId: String) : AgentNotification()
}
