package id.biz.sobatwarung.agent

import id.biz.sobatwarung.data.OrderRepository
import id.biz.sobatwarung.data.ProductRepository
import id.biz.sobatwarung.domain.OrderStatus
import id.biz.sobatwarung.domain.Product
import id.biz.sobatwarung.domain.SalesMetrics
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

class SalesAgent(
    private val orderRepository: OrderRepository,
    private val productRepository: ProductRepository,
    private val salesTarget: Long = 10000000,
    private val onNotification: (AgentNotification) -> Unit
) : Agent {

    override val name = "SalesAgent"

    private var monitoringJob: Job? = null
    private val _currentMetrics = MutableStateFlow(SalesMetrics())
    val currentMetrics: StateFlow<SalesMetrics> = _currentMetrics.asStateFlow()

    override suspend fun execute() {
        updateSalesMetrics()
    }

    override fun schedule(intervalMs: Long) {
        monitoringJob?.cancel()
        monitoringJob = CoroutineScope(Dispatchers.IO).launch {
            while (isActive) {
                execute()
                delay(intervalMs)
            }
        }
    }

    private suspend fun updateSalesMetrics() {
        val orders = orderRepository.getOrdersByStatus(OrderStatus.COMPLETED).first()

        val totalSales = orders.sumOf { it.totalAmount }
        val orderCount = orders.size
        val averageOrderValue = if (orderCount > 0) totalSales / orderCount else 0L

        val topProducts = calculateTopProducts(orders.map { it.items }.flatten())

        val metrics = SalesMetrics(
            totalSales = totalSales,
            orderCount = orderCount,
            averageOrderValue = averageOrderValue,
            topProducts = topProducts
        )

        _currentMetrics.value = metrics

        if (totalSales < salesTarget) {
            val percentComplete = (totalSales.toDouble() / salesTarget * 100).toInt()
            onNotification(AgentNotification.SalesAlert(
                message = "Sales at $percentComplete% of target",
                metrics = metrics
            ))
        }
    }

    private fun calculateTopProducts(orderItems: List<id.biz.sobatwarung.domain.OrderItem>): List<Product> {
        val productSales = orderItems
            .groupBy { it.productId }
            .mapValues { (_, items) -> items.sumOf { it.quantity * it.unitPrice } }
            .entries
            .sortedByDescending { it.value }
            .take(5)

        return productSales.mapNotNull { (productId, _) ->
            productRepository.getProductById(productId).first()
        }
    }

    fun stop() {
        monitoringJob?.cancel()
    }
}
