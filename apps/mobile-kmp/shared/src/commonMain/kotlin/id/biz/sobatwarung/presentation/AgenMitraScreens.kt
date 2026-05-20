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
import id.biz.sobatwarung.presentation.navigation.Screen

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AgenMitraMainScreen() {
    val navController = rememberNavController()
    var selectedTab by remember { mutableIntStateOf(0) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Agen Mitra - Sobat Warung") },
                actions = {
                    IconButton(onClick = { }) {
                        Icon(Icons.Default.Notifications, contentDescription = "Notifications")
                    }
                }
            )
        },
        bottomBar = {
            NavigationBar {
                NavigationBarItem(
                    icon = { Icon(Icons.Default.Dashboard, contentDescription = null) },
                    label = { Text("Dashboard") },
                    selected = selectedTab == 0,
                    onClick = { selectedTab = 0; navController.navigate(Screen.Dashboard.route) }
                )
                NavigationBarItem(
                    icon = { Icon(Icons.Default.Store, contentDescription = null) },
                    label = { Text("Catalog") },
                    selected = selectedTab == 1,
                    onClick = { selectedTab = 1; navController.navigate(Screen.Catalog.route) }
                )
                NavigationBarItem(
                    icon = { Icon(Icons.Default.ShoppingCart, contentDescription = null) },
                    label = { Text("Orders") },
                    selected = selectedTab == 2,
                    onClick = { selectedTab = 2; navController.navigate(Screen.Orders.route) }
                )
                NavigationBarItem(
                    icon = { Icon(Icons.Default.People, contentDescription = null) },
                    label = { Text("Community") },
                    selected = selectedTab == 3,
                    onClick = { selectedTab = 3; navController.navigate(Screen.Community.route) }
                )
                NavigationBarItem(
                    icon = { Icon(Icons.Default.TrendingUp, contentDescription = null) },
                    label = { Text("Sales") },
                    selected = selectedTab == 4,
                    onClick = { selectedTab = 4; navController.navigate(Screen.Sales.route) }
                )
            }
        }
    ) { padding ->
        NavHost(
            navController = navController,
            startDestination = Screen.Dashboard.route,
            modifier = Modifier.padding(padding)
        ) {
            composable(Screen.Dashboard.route) { AgenMitraDashboardScreen(navController) }
            composable(Screen.Catalog.route) { CatalogBrowserScreen(navController) }
            composable(Screen.Orders.route) { OrderDraftingScreen(navController) }
            composable(Screen.Community.route) { CommunityViewScreen(navController) }
            composable(Screen.Sales.route) { SalesTrackingScreen(navController) }
        }
    }
}

@Composable
fun AgenMitraDashboardScreen(navController: NavController) {
    var metrics by remember { mutableStateOf(DashboardMetrics()) }

    LaunchedEffect(Unit) {
        metrics = DashboardMetrics(
            pendingOrders = 3,
            completedOrders = 12,
            activeGroupBuyings = 2,
            communityMembers = 5
        )
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        Text(
            text = "Dashboard",
            style = MaterialTheme.typography.headlineMedium
        )
        Spacer(modifier = Modifier.height(16.dp))

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            MetricCard(
                title = "Pending",
                value = "${metrics.pendingOrders}",
                subtitle = "orders",
                modifier = Modifier.weight(1f)
            )
            MetricCard(
                title = "Completed",
                value = "${metrics.completedOrders}",
                subtitle = "orders",
                modifier = Modifier.weight(1f)
            )
        }

        Spacer(modifier = Modifier.height(8.dp))

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            MetricCard(
                title = "Group Buys",
                value = "${metrics.activeGroupBuyings}",
                subtitle = "available",
                modifier = Modifier.weight(1f)
            )
            MetricCard(
                title = "Community",
                value = "${metrics.communityMembers}",
                subtitle = "members",
                modifier = Modifier.weight(1f)
            )
        }

        Spacer(modifier = Modifier.height(24.dp))

        Text(
            text = "Quick Actions",
            style = MaterialTheme.typography.titleMedium
        )
        Spacer(modifier = Modifier.height(8.dp))

        Button(
            onClick = { navController.navigate(Screen.Orders.route) },
            modifier = Modifier.fillMaxWidth()
        ) {
            Icon(Icons.Default.ShoppingCart, contentDescription = null)
            Spacer(modifier = Modifier.width(8.dp))
            Text("New Order")
        }

        Spacer(modifier = Modifier.height(8.dp))

        OutlinedButton(
            onClick = { navController.navigate(Screen.Community.route) },
            modifier = Modifier.fillMaxWidth()
        ) {
            Icon(Icons.Default.People, contentDescription = null)
            Spacer(modifier = Modifier.width(8.dp))
            Text("View Group Buys")
        }
    }
}

@Composable
fun CatalogBrowserScreen(navController: NavController) {
    var products by remember { mutableStateOf<List<Product>>(emptyList()) }
    var searchQuery by remember { mutableStateOf("") }

    LaunchedEffect(Unit) {
        products = listOf(
            Product("1", "Beras 5kg", "Beras premium", 75000, 100, 10, null, "FOOD", "au1", 0, 0),
            Product("2", "Minyak Goreng 2L", "Minyak goreng", 28000, 50, 10, null, "FOOD", "au1", 0, 0),
            Product("3", "Gula Pasir 1kg", "Gula pasir", 15000, 80, 15, null, "FOOD", "au1", 0, 0),
            Product("4", "Telur 1kg", "Telur ayam", 20000, 40, 10, null, "FOOD", "au1", 0, 0)
        )
    }

    val filteredProducts = products.filter {
        it.name.contains(searchQuery, ignoreCase = true)
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        Text(
            text = "Catalog",
            style = MaterialTheme.typography.headlineMedium
        )
        Spacer(modifier = Modifier.height(16.dp))

        OutlinedTextField(
            value = searchQuery,
            onValueChange = { searchQuery = it },
            modifier = Modifier.fillMaxWidth(),
            placeholder = { Text("Search products...") },
            leadingIcon = { Icon(Icons.Default.Search, contentDescription = null) }
        )

        Spacer(modifier = Modifier.height(16.dp))

        LazyColumn(
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            items(filteredProducts) { product ->
                ProductCard(
                    product = product,
                    onClick = { }
                )
            }
        }
    }
}

@Composable
fun OrderDraftingScreen(navController: NavController) {
    var cartItems by remember { mutableStateOf<List<Pair<Product, Int>>>(emptyList()) }
    var products by remember { mutableStateOf<List<Product>>(emptyList()) }

    LaunchedEffect(Unit) {
        products = listOf(
            Product("1", "Beras 5kg", null, 75000, 100, 10, null, null, "au1", 0, 0),
            Product("2", "Minyak Goreng 2L", null, 28000, 50, 10, null, null, "au1", 0, 0),
            Product("3", "Gula Pasir 1kg", null, 15000, 80, 10, null, null, "au1", 0, 0)
        )
    }

    val totalAmount = cartItems.sumOf { (product, qty) -> product.price * qty }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        Text(
            text = "New Order",
            style = MaterialTheme.typography.headlineMedium
        )
        Spacer(modifier = Modifier.height(16.dp))

        Text(
            text = "Available Products",
            style = MaterialTheme.typography.titleMedium
        )
        Spacer(modifier = Modifier.height(8.dp))

        LazyColumn(
            modifier = Modifier.weight(1f),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            items(products) { product ->
                CartProductItem(
                    product = product,
                    quantity = cartItems.find { it.first.id == product.id }?.second ?: 0,
                    onAdd = {
                        cartItems = cartItems + Pair(product, 1)
                    },
                    onRemove = {
                        cartItems = cartItems.filter { it.first.id != product.id }
                    }
                )
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        Card(
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Text("Total:", style = MaterialTheme.typography.titleMedium)
                    Text("Rp $totalAmount", style = MaterialTheme.typography.titleMedium)
                }
                Spacer(modifier = Modifier.height(8.dp))
                Button(
                    onClick = { },
                    modifier = Modifier.fillMaxWidth(),
                    enabled = cartItems.isNotEmpty()
                ) {
                    Text("Submit Order")
                }
            }
        }
    }
}

@Composable
fun CartProductItem(
    product: Product,
    quantity: Int,
    onAdd: () -> Unit,
    onRemove: () -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth()
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(12.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = androidx.compose.ui.Alignment.CenterVertically
        ) {
            Column(modifier = Modifier.weight(1f)) {
                Text(product.name, style = MaterialTheme.typography.titleSmall)
                Text("Rp ${product.price}", style = MaterialTheme.typography.bodySmall)
            }
            Row(
                verticalAlignment = androidx.compose.ui.Alignment.CenterVertically
            ) {
                IconButton(onClick = onRemove, enabled = quantity > 0) {
                    Icon(Icons.Default.Remove, contentDescription = "Remove")
                }
                Text("$quantity", style = MaterialTheme.typography.titleMedium)
                IconButton(onClick = onAdd) {
                    Icon(Icons.Default.Add, contentDescription = "Add")
                }
            }
        }
    }
}

@Composable
fun CommunityViewScreen(navController: NavController) {
    var rooms by remember { mutableStateOf<List<GroupBuyingRoom>>(emptyList()) }

    LaunchedEffect(Unit) {
        rooms = listOf(
            GroupBuyingRoom("1", "au1", "Belanja Bareng Mei", "Diskon 10%", System.currentTimeMillis(), System.currentTimeMillis() + 86400000, GroupBuyingStatus.ACTIVE, 0, 0),
            GroupBuyingRoom("2", "au1", "Promo Mingguan", "Hemat 15%", System.currentTimeMillis(), System.currentTimeMillis() + 172800000, GroupBuyingStatus.ACTIVE, 0, 0)
        )
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        Text(
            text = "Community - Group Buying",
            style = MaterialTheme.typography.headlineMedium
        )
        Spacer(modifier = Modifier.height(16.dp))

        LazyColumn(
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            items(rooms) { room ->
                GroupBuyingRoomCard(
                    room = room,
                    onJoin = { }
                )
            }
        }
    }
}

@Composable
fun SalesTrackingScreen(navController: NavController) {
    var metrics by remember { mutableStateOf(SalesMetrics()) }

    LaunchedEffect(Unit) {
        metrics = SalesMetrics(
            totalSales = 2500000,
            orderCount = 15,
            averageOrderValue = 166666
        )
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        Text(
            text = "My Sales",
            style = MaterialTheme.typography.headlineMedium
        )
        Spacer(modifier = Modifier.height(16.dp))

        MetricCard(
            title = "Total Sales",
            value = "Rp ${metrics.totalSales / 1000000}M",
            modifier = Modifier.fillMaxWidth()
        )

        Spacer(modifier = Modifier.height(8.dp))

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            MetricCard(
                title = "Orders",
                value = "${metrics.orderCount}",
                modifier = Modifier.weight(1f)
            )
            MetricCard(
                title = "Average",
                value = "Rp ${metrics.averageOrderValue}",
                modifier = Modifier.weight(1f)
            )
        }
    }
}
