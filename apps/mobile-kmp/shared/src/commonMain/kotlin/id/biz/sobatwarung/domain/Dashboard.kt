package id.biz.sobatwarung.domain

import kotlinx.serialization.Serializable

@Serializable
data class DashboardMetrics(
    val totalProducts: Int = 0,
    val lowStockProducts: Int = 0,
    val pendingOrders: Int = 0,
    val completedOrders: Int = 0,
    val totalRevenue: Long = 0,
    val activeGroupBuyings: Int = 0,
    val communityMembers: Int = 0
)

@Serializable
data class SalesMetrics(
    val totalSales: Long = 0,
    val orderCount: Int = 0,
    val averageOrderValue: Long = 0,
    val topProducts: List<Product> = emptyList()
)
