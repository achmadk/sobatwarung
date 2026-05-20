use serde::{Deserialize, Serialize};

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct IncomingMessage {
    #[serde(rename = "type")]
    pub msg_type: String,
    #[serde(default)]
    pub agency_id: Option<String>,
    #[serde(default)]
    pub client_id: Option<String>,
    #[serde(default)]
    pub batch_id: Option<String>,
    #[serde(default)]
    pub payload: Option<serde_json::Value>,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct OutgoingMessage {
    #[serde(rename = "type")]
    pub msg_type: String,
    #[serde(default)]
    pub payload: Option<serde_json::Value>,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct SyncMessage {
    pub batch_id: String,
    pub mutations: Vec<Mutation>,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct Mutation {
    pub id: String,
    pub entity_type: String,
    pub entity_id: String,
    pub payload: Vec<u8>,
    pub vector_clock: std::collections::HashMap<String, i64>,
    pub timestamp: i64,
}
