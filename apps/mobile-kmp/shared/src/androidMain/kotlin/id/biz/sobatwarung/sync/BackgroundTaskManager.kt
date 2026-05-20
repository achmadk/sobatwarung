package id.biz.sobatwarung.sync

import android.content.Context
import androidx.work.*
import id.biz.sobatwarung.agent.AgentManager
import org.koin.core.component.KoinComponent
import org.koin.core.component.inject
import java.util.concurrent.TimeUnit

class SyncWorker(
    context: Context,
    workerParams: WorkerParameters
) : CoroutineWorker(context, workerParams), KoinComponent {

    private val syncManager: SyncManager by inject()

    override suspend fun doWork(): Result {
        return try {
            syncManager.sync()
            Result.success()
        } catch (e: Exception) {
            if (runAttemptCount < 3) {
                Result.retry()
            } else {
                Result.failure()
            }
        }
    }
}

class AgentWorker(
    context: Context,
    workerParams: WorkerParameters
) : CoroutineWorker(context, workerParams), KoinComponent {

    private val agentManager: AgentManager by inject()

    override suspend fun doWork(): Result {
        return try {
            agentManager.startAllAgents()
            Result.success()
        } catch (e: Exception) {
            Result.failure()
        }
    }
}

object BackgroundTaskManager {

    private const val SYNC_WORK_NAME = "sync_work"
    private const val AGENT_WORK_NAME = "agent_work"

    fun scheduleSync(context: Context) {
        val constraints = Constraints.Builder()
            .setRequiredNetworkType(NetworkType.CONNECTED)
            .build()

        val syncRequest = PeriodicWorkRequestBuilder<SyncWorker>(
            15, TimeUnit.MINUTES
        )
            .setConstraints(constraints)
            .setBackoffCriteria(
                BackoffPolicy.EXPONENTIAL,
                WorkRequest.MIN_BACKOFF_MILLIS,
                TimeUnit.MILLISECONDS
            )
            .build()

        WorkManager.getInstance(context).enqueueUniquePeriodicWork(
            SYNC_WORK_NAME,
            ExistingPeriodicWorkPolicy.KEEP,
            syncRequest
        )
    }

    fun scheduleAgents(context: Context) {
        val agentRequest = PeriodicWorkRequestBuilder<AgentWorker>(
            1, TimeUnit.HOURS
        )
            .setConstraints(
                Constraints.Builder()
                    .setRequiresBatteryNotLow(true)
                    .build()
            )
            .build()

        WorkManager.getInstance(context).enqueueUniquePeriodicWork(
            AGENT_WORK_NAME,
            ExistingPeriodicWorkPolicy.KEEP,
            agentRequest
        )
    }

    fun cancelAll(context: Context) {
        WorkManager.getInstance(context).cancelUniqueWork(SYNC_WORK_NAME)
        WorkManager.getInstance(context).cancelUniqueWork(AGENT_WORK_NAME)
    }
}
