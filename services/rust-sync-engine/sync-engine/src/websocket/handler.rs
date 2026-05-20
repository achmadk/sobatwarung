use crate::state::AppState;
use axum::{
    extract::{
        ws::{Message, WebSocket, WebSocketUpgrade},
        State,
    },
    response::Response,
    Json,
};
use futures_util::{SinkExt, StreamExt};
use std::sync::Arc;
use tokio::sync::RwLock;
use tower_service::Service;
use tracing::{info, warn};

use super::protocol::{IncomingMessage, OutgoingMessage};

#[derive(Clone)]
pub struct WebSocketHandler {
    state: AppState,
    connections: Arc<RwLock<std::collections::HashMap<String, ConnectedClient>>>,
}

#[derive(Clone)]
struct ConnectedClient {
    agency_id: String,
    client_id: String,
}

impl WebSocketHandler {
    pub fn new(state: AppState) -> Self {
        Self {
            state,
            connections: Arc::new(RwLock::new(std::collections::HashMap::new())),
        }
    }
}

impl Service<Request<()>> for WebSocketHandler {
    type Response = Response;
    type Error = std::convert::Infallible;
    type Future = std::pin::Pin<Box<dyn futures_util::Future<Output = Result<Self::Response, Self::Error>> + Send>>;

    fn poll_ready(
        &mut self,
        _cx: &mut std::task::Context<'_>,
    ) -> std::task::Poll<Result<(), Self::Error>> {
        std::task::Poll::Ready(Ok(()))
    }

    fn call(&mut self, _req: Request<()>) -> Self::Future {
        Box::pin(async { Ok(Response::builder().status(200).body(()).unwrap()) })
    }
}

pub async fn ws_handler(
    ws: WebSocketUpgrade,
    State(handler): State<WebSocketHandler>,
) -> Response {
    ws.on_upgrade(|socket| handle_socket(socket, handler))
}

async fn handle_socket(socket: WebSocket, handler: WebSocketHandler) {
    let (mut sender, mut receiver) = socket.split();
    let mut current_client: Option<ConnectedClient> = None;

    while let Some(msg) = receiver.next().await {
        match msg {
            Ok(Message::Text(text)) => {
                if let Ok(incoming) = serde_json::from_str::<IncomingMessage>(&text) {
                    match incoming.msg_type.as_str() {
                        "auth" => {
                            let client = ConnectedClient {
                                agency_id: incoming.agency_id.unwrap_or_default(),
                                client_id: incoming.client_id.unwrap_or_default(),
                            };
                            current_client = Some(client.clone());

                            let conn_id = format!("{}:{}", client.agency_id, client.client_id);
                            handler.connections.write().await.insert(conn_id, client);

                            let _ = sender
                                .send(Message::Text(serde_json::to_string(&OutgoingMessage {
                                    msg_type: "auth_ack".to_string(),
                                    payload: None,
                                }).unwrap()))
                                .await;
                        }
                        "sync" => {
                            let response = OutgoingMessage {
                                msg_type: "sync_ack".to_string(),
                                payload: Some(serde_json::json!({
                                    "status": "received"
                                })),
                            };
                            let _ = sender.send(Message::Text(serde_json::to_string(&response).unwrap().into())).await;
                        }
                        "ping" => {
                            let _ = sender.send(Message::Text("pong".into())).await;
                        }
                        _ => {
                            warn!("Unknown message type: {}", incoming.msg_type);
                        }
                    }
                }
            }
            Ok(Message::Close(_)) => {
                if let Some(client) = current_client {
                    let conn_id = format!("{}:{}", client.agency_id, client.client_id);
                    handler.connections.write().await.remove(&conn_id);
                    info!("Client disconnected: {}", conn_id);
                }
            }
            Err(e) => {
                warn!("WebSocket error: {}", e);
            }
            _ => {}
        }
    }
}
