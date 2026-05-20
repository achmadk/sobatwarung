package id.biz.sobatwarung.presentation

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import id.biz.sobatwarung.domain.*
import id.biz.sobatwarung.presentation.components.*

@Composable
fun CatalogManagementScreen(navController: NavController) {
    var products by remember { mutableStateOf<List<Product>>(emptyList()) }
    var showAddDialog by remember { mutableStateOf(false) }

    LaunchedEffect(Unit) {
        products = listOf(
            Product("1", "Beras 5kg", "Beras premium kualitas tinggi", 75000, 25, 10, null, "FOOD", "au1", System.currentTimeMillis(), System.currentTimeMillis()),
            Product("2", "Minyak Goreng 2L", "Minyak goreng bersih", 28000, 8, 10, null, "FOOD", "au1", System.currentTimeMillis(), System.currentTimeMillis()),
            Product("3", "Gula Pasir 1kg", "Gula pasir pilihan", 15000, 50, 15, null, "FOOD", "au1", System.currentTimeMillis(), System.currentTimeMillis())
        )
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Text(
                text = "Catalog Management",
                style = MaterialTheme.typography.headlineMedium
            )
            FloatingActionButton(
                onClick = { showAddDialog = true }
            ) {
                Icon(Icons.Default.Add, contentDescription = "Add Product")
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        LazyColumn(
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            items(products) { product ->
                ProductCard(
                    product = product,
                    onClick = { }
                )
            }
        }
    }

    if (showAddDialog) {
        AddProductDialog(
            onDismiss = { showAddDialog = false },
            onConfirm = { name, price, stock ->
                val newProduct = Product(
                    id = "${System.currentTimeMillis()}",
                    name = name,
                    price = price,
                    stock = stock,
                    agenUtamaId = "au1",
                    createdAt = System.currentTimeMillis(),
                    updatedAt = System.currentTimeMillis()
                )
                products = products + newProduct
                showAddDialog = false
            }
        )
    }
}

@Composable
fun AddProductDialog(
    onDismiss: () -> Unit,
    onConfirm: (name: String, price: Long, stock: Int) -> Unit
) {
    var name by remember { mutableStateOf("") }
    var price by remember { mutableStateOf("") }
    var stock by remember { mutableStateOf("") }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("Add Product") },
        text = {
            Column {
                OutlinedTextField(
                    value = name,
                    onValueChange = { name = it },
                    label = { Text("Product Name") }
                )
                Spacer(modifier = Modifier.height(8.dp))
                OutlinedTextField(
                    value = price,
                    onValueChange = { price = it },
                    label = { Text("Price") }
                )
                Spacer(modifier = Modifier.height(8.dp))
                OutlinedTextField(
                    value = stock,
                    onValueChange = { stock = it },
                    label = { Text("Stock") }
                )
            }
        },
        confirmButton = {
            Button(
                onClick = {
                    onConfirm(name, price.toLongOrNull() ?: 0, stock.toIntOrNull() ?: 0)
                }
            ) {
                Text("Add")
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) {
                Text("Cancel")
            }
        }
    )
}

@Composable
fun InventoryTrackingScreen(navController: NavController) {
    var products by remember { mutableStateOf<List<Product>>(emptyList()) }

    LaunchedEffect(Unit) {
        products = listOf(
            Product("1", "Beras 5kg", null, 75000, 25, 10, null, null, "au1", 0, 0),
            Product("2", "Minyak Goreng 2L", null, 28000, 8, 10, null, null, "au1", 0, 0),
            Product("3", "Gula Pasir 1kg", null, 15000, 50, 15, null, null, "au1", 0, 0)
        )
    }

    val lowStockProducts = products.filter { it.stock <= it.lowStockThreshold }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        Text(
            text = "Inventory Tracking",
            style = MaterialTheme.typography.headlineMedium
        )
        Spacer(modifier = Modifier.height(16.dp))

        if (lowStockProducts.isNotEmpty()) {
            Card(
                colors = CardDefaults.cardColors(
                    containerColor = MaterialTheme.colorScheme.errorContainer
                )
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp)
                ) {
                    Icon(Icons.Default.Warning, null, tint = MaterialTheme.colorScheme.error)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("${lowStockProducts.size} products need restocking")
                }
            }
            Spacer(modifier = Modifier.height(16.dp))
        }

        LazyColumn(
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            items(products) { product ->
                InventoryItem(product = product)
            }
        }
    }
}

@Composable
fun InventoryItem(product: Product) {
    val isLowStock = product.stock <= product.lowStockThreshold

    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = if (isLowStock) {
            CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.errorContainer)
        } else {
            CardDefaults.cardColors()
        }
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp)
        ) {
            Column(modifier = Modifier.weight(1f)) {
                Text(product.name, style = MaterialTheme.typography.titleMedium)
                Text(
                    "Threshold: ${product.lowStockThreshold}",
                    style = MaterialTheme.typography.bodySmall
                )
            }
            Column(horizontalAlignment = androidx.compose.ui.Alignment.End) {
                Text(
                    "${product.stock}",
                    style = MaterialTheme.typography.headlineSmall,
                    color = when {
                        product.stock <= 0 -> MaterialTheme.colorScheme.error
                        isLowStock -> MaterialTheme.colorScheme.secondary
                        else -> MaterialTheme.colorScheme.primary
                    }
                )
                Text("units", style = MaterialTheme.typography.bodySmall)
            }
        }
    }
}

@Composable
fun OrderManagementScreen(navController: NavController) {
    var orders by remember { mutableStateOf<List<Order>>(emptyList()) }

    LaunchedEffect(Unit) {
        orders = listOf(
            Order("1", "am1", "au1", OrderStatus.PENDING, 150000, null, System.currentTimeMillis(), System.currentTimeMillis()),
            Order("2", "am2", "au1", OrderStatus.CONFIRMED, 75000, null, System.currentTimeMillis(), System.currentTimeMillis()),
            Order("3", "am1", "au1", OrderStatus.COMPLETED, 225000, null, System.currentTimeMillis(), System.currentTimeMillis())
        )
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        Text(
            text = "Order Management",
            style = MaterialTheme.typography.headlineMedium
        )
        Spacer(modifier = Modifier.height(16.dp))

        LazyColumn(
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            items(orders) { order ->
                OrderCard(order = order)
            }
        }
    }
}

@Composable
fun GroupBuyingCoordinatorScreen(navController: NavController) {
    var rooms by remember { mutableStateOf<List<GroupBuyingRoom>>(emptyList()) }
    var showCreateDialog by remember { mutableStateOf(false) }

    LaunchedEffect(Unit) {
        rooms = listOf(
            GroupBuyingRoom("1", "au1", "Belanja Bareng Mei", "Diskon 10% untuk pembelian di atas 500rb", System.currentTimeMillis(), System.currentTimeMillis() + 86400000, GroupBuyingStatus.ACTIVE, System.currentTimeMillis(), System.currentTimeMillis())
        )
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Text(
                text = "Group Buying Coordinator",
                style = MaterialTheme.typography.headlineMedium
            )
            FloatingActionButton(
                onClick = { showCreateDialog = true }
            ) {
                Icon(Icons.Default.Add, contentDescription = "Create Room")
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        LazyColumn(
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            items(rooms) { room ->
                GroupBuyingRoomCard(room = room)
            }
        }
    }

    if (showCreateDialog) {
        AlertDialog(
            onDismissRequest = { showCreateDialog = false },
            title = { Text("Create Group Buying Room") },
            text = { Text("Room creation form would go here") },
            confirmButton = {
                Button(onClick = { showCreateDialog = false }) {
                    Text("Create")
                }
            },
            dismissButton = {
                TextButton(onClick = { showCreateDialog = false }) {
                    Text("Cancel")
                }
            }
        )
    }
}

@Composable
fun GroupBuyingRoomCard(room: GroupBuyingRoom) {
    Card(
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(
            modifier = Modifier.padding(16.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text(room.name, style = MaterialTheme.typography.titleMedium)
                Surface(
                    color = MaterialTheme.colorScheme.primaryContainer,
                    shape = MaterialTheme.shapes.small
                ) {
                    Text(
                        room.status.displayName,
                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                        style = MaterialTheme.typography.labelSmall
                    )
                }
            }
            Spacer(modifier = Modifier.height(8.dp))
            Text(room.description ?: "", style = MaterialTheme.typography.bodyMedium)
        }
    }
}

@Composable
fun SalesOverviewScreen(navController: NavController) {
    var metrics by remember { mutableStateOf(SalesMetrics()) }

    LaunchedEffect(Unit) {
        metrics = SalesMetrics(
            totalSales = 15000000,
            orderCount = 89,
            averageOrderValue = 168539
        )
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        Text(
            text = "Sales Overview",
            style = MaterialTheme.typography.headlineMedium
        )
        Spacer(modifier = Modifier.height(16.dp))

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            MetricCard(
                title = "Total Sales",
                value = "Rp ${metrics.totalSales / 1000000}M",
                modifier = Modifier.weight(1f)
            )
            MetricCard(
                title = "Orders",
                value = "${metrics.orderCount}",
                modifier = Modifier.weight(1f)
            )
        }

        Spacer(modifier = Modifier.height(8.dp))

        MetricCard(
            title = "Average Order Value",
            value = "Rp ${metrics.averageOrderValue}",
            modifier = Modifier.fillMaxWidth()
        )
    }
}
