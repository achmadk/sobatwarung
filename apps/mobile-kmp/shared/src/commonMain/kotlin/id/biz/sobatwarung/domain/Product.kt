package id.biz.sobatwarung.domain

import kotlinx.serialization.Serializable

@Serializable
data class Product(
    val id: String,
    val name: String,
    val description: String? = null,
    val price: Long,
    val stock: Int,
    val lowStockThreshold: Int = 10,
    val imageUrl: String? = null,
    val category: String? = null,
    val agenUtamaId: String,
    val createdAt: Long,
    val updatedAt: Long,
    val syncedAt: Long? = null
)

@Serializable
enum class ProductCategory(val displayName: String) {
    FOOD("Makanan"),
    BEVERAGE("Minuman"),
    HOUSEHOLD("Barang Rumah Tangga"),
    OTHER("Lainnya")
}
