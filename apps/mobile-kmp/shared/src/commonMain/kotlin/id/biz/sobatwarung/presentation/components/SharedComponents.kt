package id.biz.sobatwarung.presentation.components

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import id.biz.sobatwarung.domain.*

@Composable
fun ProductCard(
    product: Product,
    onClick: () -> Unit = {},
    modifier: Modifier = Modifier
) {
    Card(
        onClick = onClick,
        modifier = modifier.fillMaxWidth()
    ) {
        Column(
            modifier = Modifier.padding(16.dp)
        ) {
            Text(
                text = product.name,
                style = MaterialTheme.typography.titleMedium
            )
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = product.description ?: "",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
            Spacer(modifier = Modifier.height(8.dp))
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text(
                    text = "Rp ${product.price}",
                    style = MaterialTheme.typography.titleSmall,
                    color = MaterialTheme.colorScheme.primary
                )
                StockBadge(
                    stock = product.stock,
                    threshold = product.lowStockThreshold
                )
            }
        }
    }
}

@Composable
fun StockBadge(
    stock: Int,
    threshold: Int,
    modifier: Modifier = Modifier
) {
    val color = when {
        stock <= 0 -> MaterialTheme.colorScheme.error
        stock <= threshold -> MaterialTheme.colorScheme.secondary
        else -> MaterialTheme.colorScheme.primary
    }

    Surface(
        color = color.copy(alpha = 0.1f),
        shape = MaterialTheme.shapes.small,
        modifier = modifier
    ) {
        Text(
            text = "Stok: $stock",
            style = MaterialTheme.typography.labelSmall,
            color = color,
            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
        )
    }
}

@Composable
fun OrderCard(
    order: Order,
    onClick: () -> Unit = {},
    modifier: Modifier = Modifier
) {
    Card(
        onClick = onClick,
        modifier = modifier.fillMaxWidth()
    ) {
        Column(
            modifier = Modifier.padding(16.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "Order #${order.id.take(8)}",
                    style = MaterialTheme.typography.titleMedium
                )
                OrderStatusBadge(status = order.status)
            }
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = "Total: Rp ${order.totalAmount}",
                style = MaterialTheme.typography.bodyMedium
            )
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = "Items: ${order.items.size}",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
    }
}

@Composable
fun OrderStatusBadge(
    status: OrderStatus,
    modifier: Modifier = Modifier
) {
    val (color, text) = when (status) {
        OrderStatus.DRAFT -> MaterialTheme.colorScheme.outline to "Draft"
        OrderStatus.PENDING -> MaterialTheme.colorScheme.secondary to "Menunggu"
        OrderStatus.CONFIRMED -> MaterialTheme.colorScheme.primary to "Dikonfirmasi"
        OrderStatus.PROCESSING -> MaterialTheme.colorScheme.tertiary to "Diproses"
        OrderStatus.SHIPPED -> MaterialTheme.colorScheme.primary to "Dikirim"
        OrderStatus.COMPLETED -> MaterialTheme.colorScheme.primary to "Selesai"
        OrderStatus.CANCELLED -> MaterialTheme.colorScheme.error to "Dibatalkan"
    }

    Surface(
        color = color.copy(alpha = 0.1f),
        shape = MaterialTheme.shapes.small,
        modifier = modifier
    ) {
        Text(
            text = text,
            style = MaterialTheme.typography.labelSmall,
            color = color,
            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
        )
    }
}

@Composable
fun SyncStatusBadge(
    pendingCount: Int,
    isSyncing: Boolean,
    modifier: Modifier = Modifier
) {
    val (color, text) = when {
        isSyncing -> MaterialTheme.colorScheme.tertiary to "Syncing..."
        pendingCount > 0 -> MaterialTheme.colorScheme.secondary to "$pendingCount pending"
        else -> MaterialTheme.colorScheme.primary to "Synced"
    }

    Surface(
        color = color.copy(alpha = 0.1f),
        shape = MaterialTheme.shapes.small,
        modifier = modifier
    ) {
        Row(
            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(4.dp)
        ) {
            if (isSyncing) {
                CircularProgressIndicator(
                    modifier = Modifier.size(12.dp),
                    strokeWidth = 2.dp
                )
            }
            Text(
                text = text,
                style = MaterialTheme.typography.labelSmall,
                color = color
            )
        }
    }
}

@Composable
fun MetricCard(
    title: String,
    value: String,
    subtitle: String? = null,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier
    ) {
        Column(
            modifier = Modifier.padding(16.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(
                text = title,
                style = MaterialTheme.typography.labelMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = value,
                style = MaterialTheme.typography.headlineMedium,
                color = MaterialTheme.colorScheme.primary
            )
            subtitle?.let {
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = it,
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        }
    }
}
