use thiserror::Error;

#[derive(Error, Debug)]
pub enum SyncError {
    #[error("CRDT error: {0}")]
    Crdt(String),

    #[error("Serialization error: {0}")]
    Serialization(#[from] serde_json::Error),

    #[error("Database error: {0}")]
    Database(String),

    #[error("Authentication error: {0}")]
    Authentication(String),

    #[error("NATS error: {0}")]
    Nats(String),

    #[error("WebSocket error: {0}")]
    WebSocket(String),

    #[error("Crypto error: {0}")]
    Crypto(String),

    #[error("Invalid vector clock")]
    InvalidVectorClock,

    #[error("Document not found: {0}")]
    DocumentNotFound(String),

    #[error("Conflict resolution failed: {0}")]
    ConflictResolution(String),
}

impl From<yrs::Error> for SyncError {
    fn from(e: yrs::Error) -> Self {
        SyncError::Crdt(e.to_string())
    }
}

impl From<sqlx::Error> for SyncError {
    fn from(e: sqlx::Error) -> Self {
        SyncError::Database(e.to_string())
    }
}

impl From<nats::asynk::Error> for SyncError {
    fn from(e: nats::asynk::Error) -> Self {
        SyncError::Nats(e.to_string())
    }
}

impl tonic::Status for SyncError {
    fn from(code: tonic::Code, message: String) -> Self {
        match code {
            tonic::Code::InvalidArgument => SyncError::Crdt(message),
            tonic::Code::NotFound => SyncError::DocumentNotFound(message),
            tonic::Code::Unauthenticated => SyncError::Authentication(message),
            _ => SyncError::Crdt(message),
        }
    }

    fn into_status(self) -> tonic::Status {
        tonic::Status::new(tonic::Code::Internal, self.to_string())
    }
}
