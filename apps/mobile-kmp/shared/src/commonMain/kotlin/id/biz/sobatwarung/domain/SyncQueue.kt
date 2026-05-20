package id.biz.sobatwarung.domain

import kotlinx.serialization.Serializable

@Serializable
data class SyncQueueItem(
    val id: Long = 0,
    val tableName: String,
    val recordId: String,
    val operation: SyncOperation,
    val payload: String,
    val timestamp: Long,
    val retryCount: Int = 0,
    val status: SyncStatus = SyncStatus.PENDING
)

@Serializable
enum class SyncOperation {
    CREATE,
    UPDATE,
    DELETE
}

@Serializable
enum class SyncStatus {
    PENDING,
    IN_PROGRESS,
    COMPLETED,
    FAILED
}

@Serializable
data class SyncMetadata(
    val key: String,
    val value: String
)
