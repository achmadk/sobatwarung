use crate::crypto::CryptoOps;
use crate::redis::client::RedisStreamClient;
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use tokio::sync::RwLock;
use tracing::{error, info, warn};

const STREAM_KEY: &str = "agents";
const CONSUMER_GROUP: &str = "sync-engine-group";
const CONSUMER_NAME: &str = "sync-engine-1";

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AgentEvent {
    pub event_type: String,
    pub target_audience: String,
    pub timestamp: String,
    pub device_id: String,
    pub trace_id: String,
    pub source_agent: String,
    pub action: String,
    pub payload: String,
    pub signature: String,
    #[serde(default)]
    pub encryption_flags: Option<String>,
}

impl AgentEvent {
    pub fn from_fields(fields: Vec<(String, String)>) -> Option<Self> {
        let mut event = AgentEvent {
            event_type: String::new(),
            target_audience: String::new(),
            timestamp: String::new(),
            device_id: String::new(),
            trace_id: String::new(),
            source_agent: String::new(),
            action: String::new(),
            payload: String::new(),
            signature: String::new(),
            encryption_flags: None,
        };

        for (key, value) in fields {
            match key.as_str() {
                "eventType" => event.event_type = value,
                "targetAudience" => event.target_audience = value,
                "timestamp" => event.timestamp = value,
                "deviceId" => event.device_id = value,
                "traceId" => event.trace_id = value,
                "sourceAgent" => event.source_agent = value,
                "action" => event.action = value,
                "payload" => event.payload = value,
                "signature" => event.signature = value,
                "encryptionFlags" => event.encryption_flags = Some(value),
                _ => {}
            }
        }

        if event.event_type.is_empty() && event.action.is_empty() {
            return None;
        }

        Some(event)
    }

    pub fn has_encryption_flags(&self) -> bool {
        self.encryption_flags.is_some()
    }
}

pub struct RedisStreamConsumer {
    client: Arc<RwLock<RedisStreamClient>>,
}

impl RedisStreamConsumer {
    pub async fn new() -> Result<Self, Box<dyn std::error::Error + Send + Sync>> {
        let client = RedisStreamClient::new().await?;
        let client = Arc::new(RwLock::new(client));

        let consumer = Self { client };
        consumer.setup_consumer_group().await?;

        Ok(consumer)
    }

    async fn setup_consumer_group(&self) -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
        let client = self.client.read().await;
        client.create_consumer_group(STREAM_KEY, CONSUMER_GROUP).await?;
        Ok(())
    }

    pub async fn consume(&self) -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
        loop {
            match self.read_events().await {
                Ok(events) => {
                    for event in events {
                        if let Err(e) = self.process_event(event).await {
                            error!("Failed to process event: {}", e);
                        }
                    }
                }
                Err(e) => {
                    error!("Failed to read events: {}", e);
                    tokio::time::sleep(tokio::time::Duration::from_secs(1)).await;
                }
            }
        }
    }

    async fn read_events(
        &self,
    ) -> Result<Vec<(String, AgentEvent)>, Box<dyn std::error::Error + Send + Sync>> {
        let client = self.client.read().await;

        let result = client
            .xreadgroup(STREAM_KEY, CONSUMER_GROUP, CONSUMER_NAME, Some(10), Some(5000))
            .await?;

        let mut events = Vec::new();

        for (_stream, messages) in result {
            for (id, fields) in messages {
                if let Some(event) = AgentEvent::from_fields(fields) {
                    events.push((id, event));
                }
            }
        }

        Ok(events)
    }

    async fn process_event(
        &self,
        (id, event): (String, AgentEvent),
    ) -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
        info!(
            "Processing event: {} from device: {}",
            event.event_type, event.device_id
        );

        if event.has_encryption_flags() {
            match self.verify_cryptographic_signature(&event).await {
                Ok(true) => {
                    info!(
                        "Cryptographic signature verified for event: {}",
                        event.event_type
                    );
                }
                Ok(false) => {
                    warn!(
                        "Cryptographic signature verification failed for event: {}",
                        event.event_type
                    );
                    self.acknowledge_message(&id).await?;
                    return Ok(());
                }
                Err(e) => {
                    error!("Failed to verify signature: {}", e);
                    self.acknowledge_message(&id).await?;
                    return Err(e);
                }
            }
        }

        self.trigger_event_logic(&event).await?;

        self.acknowledge_message(&id).await?;

        Ok(())
    }

    async fn verify_cryptographic_signature(
        &self,
        event: &AgentEvent,
    ) -> Result<bool, Box<dyn std::error::Error + Send + Sync>> {
        let payload_bytes = event.payload.as_bytes();
        let signature_bytes = &hex::decode(&event.signature).unwrap_or_default();

        let device_public_key = self.get_device_public_key(&event.device_id).await?;

        if device_public_key.is_empty() {
            warn!("No public key found for device: {}", event.device_id);
            return Ok(false);
        }

        let is_valid = CryptoOps::verify_ed25519(payload_bytes, signature_bytes, &device_public_key);

        Ok(is_valid)
    }

    async fn get_device_public_key(&self, _device_id: &str) -> Result<Vec<u8>, Box<dyn std::error::Error + Send + Sync>> {
        Ok(vec![])
    }

    async fn trigger_event_logic(
        &self,
        event: &AgentEvent,
    ) -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
        info!(
            "Triggering event logic for action: {} (target: {})",
            event.action, event.target_audience
        );

        match event.action.as_str() {
            "INITIATE_GROUP_BUY_POOL" => {
                info!("Group buy pool initiation event received");
            }
            _ => {
                info!("Unhandled event action: {}", event.action);
            }
        }

        Ok(())
    }

    async fn acknowledge_message(&self, id: &str) -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
        let client = self.client.read().await;
        client.xack(STREAM_KEY, CONSUMER_GROUP, &[id.to_string()]).await?;
        Ok(())
    }
}
