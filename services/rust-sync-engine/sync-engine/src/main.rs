mod crdt;
mod grpc;
mod websocket;
mod nats;
mod crypto;
mod error;
mod state;

use crdt::document_store::DocumentStore;
use error::SyncError;
use state::AppState;

use std::sync::Arc;
use tokio::sync::RwLock;
use tonic::transport::Server;
use tracing::{info, Level};
use tracing_subscriber::FmtSubscriber;

use crate::grpc::sync::sync_service_server::SyncServiceServer;
use crate::websocket::handler::WebSocketHandler;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let subscriber = FmtSubscriber::builder()
        .with_max_level(Level::DEBUG)
        .finish();
    tracing::subscriber::set_global_default(subscriber)?;

    let document_store = Arc::new(RwLock::new(DocumentStore::new()));
    let app_state = AppState::new(document_store.clone());

    info!("Starting Rust Sync Engine");

    let grpc_addr = "[::1]:50051".parse()?;
    let ws_addr = "[::1]:8080".parse()?;

    let app_state_clone = app_state.clone();

    tokio::spawn(async move {
        let ws_handler = WebSocketHandler::new(app_state_clone);
        let app = axum::Router::new()
            .route("/ws/sync", axum::routing::get(websocket::handler::ws_handler))
            .route("/health", axum::routing::get(health_handler))
            .with_state(ws_handler);

        info!("WebSocket server listening on {}", ws_addr);
        let listener = tokio::net::TcpListener::bind(ws_addr).await.unwrap();
        axum::serve(listener, app).await.unwrap();
    });

    let app_state_grpc = app_state.clone();

    info!("gRPC server listening on {}", grpc_addr);
    Server::builder()
        .add_service(SyncServiceServer::new(grpc::SyncServiceImpl::new(
            app_state_grpc,
        )))
        .serve(grpc_addr)
        .await?;

    Ok(())
}

async fn health_handler() -> &'static str {
    "OK"
}
