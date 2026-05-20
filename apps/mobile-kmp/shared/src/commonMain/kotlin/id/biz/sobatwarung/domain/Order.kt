package id.biz.sobatwarung.domain

import kotlinx.serialization.Serializable

@Serializable
data class Order(
    val id: String,
    val agenMitraId: String,
    val agenUtamaId: String,
    val status: OrderStatus = OrderStatus.DRAFT,
    val totalAmount: Long = 0,
    val notes: String? = null,
    val createdAt: Long,
    val updatedAt: Long,
    val syncedAt: Long? = null,
    val items: List<OrderItem> = emptyList()
)

@Serializable
enum class OrderStatus(val displayName: String) {
    DRAFT("Draft"),
    PENDING("Menunggu"),
    CONFIRMED("Dikonfirmasi"),
    PROCESSING("Diproses"),
    SHIPPED("Dikirim"),
    COMPLETED("Selesai"),
    CANCELLED("Dibatalkan")
}

@Serializable
data class OrderItem(
    val id: String,
    val orderId: String,
    val productId: String,
    val quantity: Int,
    val unitPrice: Long
)
