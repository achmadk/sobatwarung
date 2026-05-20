package id.biz.sobatwarung.domain

import kotlinx.serialization.Serializable

@Serializable
enum class AgentType {
    AGEN_UTAMA,
    AGEN_MITRA
}

@Serializable
data class User(
    val id: String,
    val name: String,
    val agentType: AgentType,
    val parentAgenUtamaId: String? = null,
    val hubId: String? = null
)

@Serializable
data class AuthState(
    val isAuthenticated: Boolean = false,
    val user: User? = null,
    val token: String? = null
)
