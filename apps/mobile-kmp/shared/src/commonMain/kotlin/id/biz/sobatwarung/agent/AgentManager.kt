package id.biz.sobatwarung.agent

import kotlinx.coroutines.*

class AgentManager(
    private val stockAgent: StockAgent,
    private val communityAgent: CommunityAgent,
    private val salesAgent: SalesAgent,
    private val privacyGuardAgent: PrivacyGuardAgent
) {
    private val scope = CoroutineScope(Dispatchers.IO + SupervisorJob())

    private val agentCheckInterval = 15 * 60 * 1000L

    fun startAllAgents() {
        stockAgent.schedule(agentCheckInterval)
        communityAgent.schedule(agentCheckInterval)
        salesAgent.schedule(agentCheckInterval)
    }

    fun stopAllAgents() {
        stockAgent.stop()
        communityAgent.stop()
        salesAgent.stop()
    }

    fun getStockAgent(): StockAgent = stockAgent
    fun getCommunityAgent(): CommunityAgent = communityAgent
    fun getSalesAgent(): SalesAgent = salesAgent
    fun getPrivacyGuardAgent(): PrivacyGuardAgent = privacyGuardAgent

    fun shutdown() {
        stopAllAgents()
        scope.cancel()
    }
}
