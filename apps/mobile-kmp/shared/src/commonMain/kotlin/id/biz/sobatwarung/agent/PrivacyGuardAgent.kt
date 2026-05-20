package id.biz.sobatwarung.agent

import id.biz.sobatwarung.domain.AgentType
import id.biz.sobatwarung.domain.User

class PrivacyGuardAgent(
    private val onNotification: (AgentNotification) -> Unit
) : Agent {

    override val name = "PrivacyGuardAgent"

    private val accessRules = mapOf(
        AgentType.AGEN_UTAMA to setOf(
            Resource.CATALOG_WRITE,
            Resource.CATALOG_READ,
            Resource.ORDER_MANAGEMENT,
            Resource.INVENTORY_VIEW,
            Resource.GROUP_BUYING_CREATE,
            Resource.GROUP_BUYING_MANAGE,
            Resource.SALES_VIEW,
            Resource.SALES_VIEW_OWN
        ),
        AgentType.AGEN_MITRA to setOf(
            Resource.CATALOG_READ,
            Resource.ORDER_CREATE,
            Resource.ORDER_VIEW_OWN,
            Resource.GROUP_BUYING_VIEW,
            Resource.GROUP_BUYING_JOIN,
            Resource.SALES_VIEW_OWN
        )
    )

    override suspend fun execute() {
    }

    override fun schedule(intervalMs: Long) {
    }

    fun validateAccess(user: User, resource: Resource): Boolean {
        val allowedResources = accessRules[user.agentType] ?: emptySet()
        val hasAccess = resource in allowedResources

        if (!hasAccess) {
            onNotification(AgentNotification.AccessDenied(
                resource = resource.name,
                userId = user.id
            ))
        }

        return hasAccess
    }

    fun canAccessAgenUtamaFeatures(user: User): Boolean {
        return user.agentType == AgentType.AGEN_UTAMA
    }

    fun canManageCatalog(user: User): Boolean {
        return user.agentType == AgentType.AGEN_UTAMA
    }

    fun canManageOrders(user: User): Boolean {
        return user.agentType == AgentType.AGEN_UTAMA
    }

    fun canCreateGroupBuying(user: User): Boolean {
        return user.agentType == AgentType.AGEN_UTAMA
    }

    fun canViewAllSales(user: User): Boolean {
        return user.agentType == AgentType.AGEN_UTAMA
    }
}

enum class Resource {
    CATALOG_READ,
    CATALOG_WRITE,
    ORDER_VIEW_OWN,
    ORDER_CREATE,
    ORDER_MANAGEMENT,
    INVENTORY_VIEW,
    GROUP_BUYING_VIEW,
    GROUP_BUYING_JOIN,
    GROUP_BUYING_CREATE,
    GROUP_BUYING_MANAGE,
    SALES_VIEW_OWN,
    SALES_VIEW
}
