package id.biz.sobatwarung.presentation.navigation

import androidx.compose.runtime.*
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import id.biz.sobatwarung.domain.AgentType

sealed class Screen(val route: String) {
    object Dashboard : Screen("dashboard")
    object Catalog : Screen("catalog")
    object Orders : Screen("orders")
    object Inventory : Screen("inventory")
    object GroupBuying : Screen("group_buying")
    object Community : Screen("community")
    object Sales : Screen("sales")
}

@Composable
fun MainNavigation(
    agentType: AgentType,
    navController: NavHostController = rememberNavController()
) {
    NavHost(
        navController = navController,
        startDestination = when (agentType) {
            AgentType.AGEN_UTAMA -> Screen.Dashboard.route
            AgentType.AGEN_MITRA -> Screen.Dashboard.route
        }
    ) {
        composable(Screen.Dashboard.route) {
            when (agentType) {
                AgentType.AGEN_UTAMA -> AgenUtamaDashboardScreen(navController)
                AgentType.AGEN_MITRA -> AgenMitraDashboardScreen(navController)
            }
        }

        composable(Screen.Catalog.route) {
            when (agentType) {
                AgentType.AGEN_UTAMA -> CatalogManagementScreen(navController)
                AgentType.AGEN_MITRA -> CatalogBrowserScreen(navController)
            }
        }

        composable(Screen.Orders.route) {
            when (agentType) {
                AgentType.AGEN_UTAMA -> OrderManagementScreen(navController)
                AgentType.AGEN_MITRA -> OrderDraftingScreen(navController)
            }
        }

        composable(Screen.Inventory.route) {
            if (agentType == AgentType.AGEN_UTAMA) {
                InventoryTrackingScreen(navController)
            }
        }

        composable(Screen.GroupBuying.route) {
            if (agentType == AgentType.AGEN_UTAMA) {
                GroupBuyingCoordinatorScreen(navController)
            }
        }

        composable(Screen.Community.route) {
            if (agentType == AgentType.AGEN_MITRA) {
                CommunityViewScreen(navController)
            }
        }

        composable(Screen.Sales.route) {
            when (agentType) {
                AgentType.AGEN_UTAMA -> SalesOverviewScreen(navController)
                AgentType.AGEN_MITRA -> SalesTrackingScreen(navController)
            }
        }
    }
}
