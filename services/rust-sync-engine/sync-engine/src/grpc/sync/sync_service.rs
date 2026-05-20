use crate::crdt::{Conflict, DocumentStore};
use crate::error::SyncError;
use crate::state::AppState;
use crate::crdt::vector_clock::VectorClock;
use std::sync::Arc;
use tokio::sync::RwLock;
use tonic::{Request, Response, Status};

pub struct SyncServiceImpl {
    state: AppState,
}

impl SyncServiceImpl {
    pub fn new(state: AppState) -> Self {
        Self { state }
    }
}

#[tonic::async_trait]
impl super::sync::sync_service_server::SyncService for SyncServiceImpl {
    async fn sync_batch(
        &self,
        request: Request<super::sync::SyncBatchRequest>,
    ) -> Result<Response<super::sync::SyncBatchResponse>, Status> {
        let req = request.into_inner();

        let mut store = self.state.document_store.write().await;

        let mut conflicts = Vec::new();

        for mutation in &req.mutations {
            let mut vc = VectorClock::new();
            if let Some(vc_map) = mutation.vector_clock.as_ref() {
                for (k, v) in vc_map {
                    vc.clock.insert(k.clone(), *v as u64);
                }
            }

            let result = store.apply_mutation(
                &req.agency_id,
                &mutation.entity_type,
                &mutation.entity_id,
                &mutation.payload,
                &vc,
            );

            if let Err(e) = result {
                conflicts.push(Conflict {
                    entity_id: mutation.entity_id.clone(),
                    entity_type: mutation.entity_type.clone(),
                    server_timestamp: chrono::Utc::now().timestamp_millis(),
                    client_timestamp: mutation.timestamp,
                    resolution: e.to_string(),
                });
            }
        }

        let merged_state = store
            .get_document_state(&req.agency_id, "sync")
            .unwrap_or_default();

        let response = super::sync::SyncBatchResponse {
            batch_id: req.batch_id,
            merged_state,
            conflicts,
            sync_timestamp: chrono::Utc::now().timestamp_millis(),
        };

        Ok(Response::new(response))
    }

    async fn get_state(
        &self,
        request: Request<super::sync::GetStateRequest>,
    ) -> Result<Response<super::sync::GetStateResponse>, Status> {
        let req = request.into_inner();

        let store = self.state.document_store.read().await;

        let state = store
            .get_document_state(&req.agency_id, "sync")
            .unwrap_or_default();

        let response = super::sync::GetStateResponse {
            state,
            sync_timestamp: chrono::Utc::now().timestamp_millis(),
        };

        Ok(Response::new(response))
    }

    async fn health_check(
        &self,
        _request: Request<super::sync::HealthCheckRequest>,
    ) -> Result<Response<super::sync::HealthCheckResponse>, Status> {
        let mut deps = std::collections::HashMap::new();

        deps.insert("nats".to_string(), "connected".to_string());

        let response = super::sync::HealthCheckResponse {
            serving: true,
            dependencies: deps,
        };

        Ok(Response::new(response))
    }
}
