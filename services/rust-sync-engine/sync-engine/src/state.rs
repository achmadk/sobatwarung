use crate::crdt::document_store::DocumentStore;
use std::sync::Arc;
use tokio::sync::RwLock;

#[derive(Clone)]
pub struct AppState {
    pub document_store: Arc<RwLock<DocumentStore>>,
    pub nats_client: Option<nats::asynk::Connection>,
}

impl AppState {
    pub fn new(document_store: Arc<RwLock<DocumentStore>>) -> Self {
        Self {
            document_store,
            nats_client: None,
        }
    }

    pub async fn set_nats_client(&mut self, client: nats::asynk::Connection) {
        self.nats_client = Some(client);
    }
}
