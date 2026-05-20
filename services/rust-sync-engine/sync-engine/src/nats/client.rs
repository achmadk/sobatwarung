use nats::asynk::Connection;
use tracing::info;

pub struct NatsClient {
    conn: Option<Connection>,
}

impl NatsClient {
    pub fn new() -> Self {
        Self { conn: None }
    }

    pub async fn connect(&mut self, url: &str) -> Result<(), nats::Error> {
        let conn = nats::asynk::Connection::connect(url).await?;
        self.conn = Some(conn);
        info!("Connected to NATS at {}", url);
        Ok(())
    }

    pub fn get_connection(&self) -> Option<&Connection> {
        self.conn.as_ref()
    }

    pub async fn publish(&self, subject: &str, payload: &[u8]) -> Result<(), nats::Error> {
        if let Some(conn) = &self.conn {
            conn.publish(subject, payload).await?;
        }
        Ok(())
    }

    pub async fn subscribe(&self, subject: &str) -> Result<nats::asynk::Subscription, nats::Error> {
        if let Some(conn) = &self.conn {
            conn.subscribe(subject).await
        } else {
            Err(nats::Error::Custom("Not connected".into()))
        }
    }
}

impl Default for NatsClient {
    fn default() -> Self {
        Self::new()
    }
}
