package id.biz.sobatwarung.di

import android.content.Context
import androidx.work.*
import id.biz.sobatwarung.AndroidDatabaseProvider
import id.biz.sobatwarung.agent.*
import id.biz.sobatwarung.data.DatabaseProvider
import id.biz.sobatwarung.network.ApiClient
import id.biz.sobatwarung.network.KtorApiClient
import id.biz.sobatwarung.network.KtorWebSocketManager
import id.biz.sobatwarung.network.WebSocketManager
import id.biz.sobatwarung.sync.DefaultSyncManager
import id.biz.sobatwarung.sync.SyncManager
import io.ktor.client.*
import io.ktor.client.engine.android.*
import io.ktor.client.plugins.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.client.plugins.websocket.*
import io.ktor.serialization.kotlinx.json.*
import kotlinx.serialization.json.Json
import org.koin.android.ext.koin.androidContext
import org.koin.dsl.module
import java.util.concurrent.TimeUnit

val json = Json {
    ignoreUnknownKeys = true
    isLenient = true
    encodeDefaults = true
}

val databaseModule = module {
    single<DatabaseProvider> { AndroidDatabaseProvider(androidContext()) }
}

val networkModule = module {
    single {
        HttpClient(Android) {
            install(WebSockets)
            install(ContentNegotiation) {
                json(json)
            }
            install(HttpTimeout) {
                requestTimeoutMillis = 30000
                connectTimeoutMillis = 15000
            }
        }
    }

    single<ApiClient> {
        KtorApiClient(
            baseUrl = "https://api.sobatwarung.com",
            client = get(),
            json = get()
        )
    }

    single<WebSocketManager> {
        KtorWebSocketManager(
            baseUrl = "wss://api.sobatwarung.com",
            client = get(),
            json = get()
        )
    }
}

val syncModule = module {
    single<SyncManager> {
        DefaultSyncManager(
            syncQueueRepository = get<DatabaseProvider>().syncQueueRepository,
            apiClient = get(),
            productRepository = get<DatabaseProvider>().productRepository,
            orderRepository = get<DatabaseProvider>().orderRepository,
            groupBuyingRepository = get<DatabaseProvider>().groupBuyingRepository
        )
    }
}

val agentModule = module {
    single { StockAgent(get(), get(), json) { } }
    single { CommunityAgent(get(), get()) { } }
    single { SalesAgent(get(), get()) { } }
    single { PrivacyGuardAgent { } }
    single { AgentManager(get(), get(), get(), get()) }
}

val appModules = listOf(
    databaseModule,
    networkModule,
    syncModule,
    agentModule
)

fun initKoin(block: org.koin.core.module.Module.() -> Unit) {
    org.koin.core.context.startKoin {
        modules(appModules)
        block()
    }
}
