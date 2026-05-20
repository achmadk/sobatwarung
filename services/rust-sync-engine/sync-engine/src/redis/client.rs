use fred::prelude::*;
use std::env;
use tracing::info;

pub struct RedisStreamClient {
    client: RedisClient,
}

impl RedisStreamClient {
    pub async fn new() -> Result<Self, fred::error::RedisError> {
        let redis_url = env::var("REDIS_URL").unwrap_or_else(|_| "redis://127.0.0.1:6379".to_string());

        let config = RedisConfig {
            url: Some(redis_url),
            ..Default::default()
        };

        let client = RedisClient::new(config, None, None);

        client.connect();
        client.wait_for_connect().await?;

        info!("Redis Stream client connected");

        Ok(Self { client })
    }

    pub fn client(&self) -> &RedisClient {
        &self.client
    }

    pub async fn xadd(
        &self,
        stream: &str,
        fields: &[(&str, &str)],
    ) -> Result<String, fred::error::RedisError> {
        let mut args = vec!["*".to_string()];
        for (field, value) in fields {
            args.push(field.to_string());
            args.push(value.to_string());
        }

        self.client
            .xadd(stream, None, None, None, None, &args)
            .await
    }

    pub async fn xreadgroup(
        &self,
        stream: &str,
        group: &str,
        consumer: &str,
        count: Option<i64>,
        block: Option<i64>,
    ) -> Result<Vec<(String, Vec<(String, Vec<(String, String)>)>)>, fred::error::RedisError> {
        let streams = vec![stream];
        let ids = vec!["0".to_string()];

        let mut args = vec![];
        args.push(group.to_string());
        args.push(consumer.to_string());

        if let Some(c) = count {
            args.push("COUNT".to_string());
            args.push(c.to_string());
        }

        if let Some(b) = block {
            args.push("BLOCK".to_string());
            args.push(b.to_string());
        }

        let result = self
            .client
            .xreadgroup(&streams, &ids, false, &args)
            .await?;

        parse_xreadgroup_result(result)
    }

    pub async fn xack(
        &self,
        stream: &str,
        group: &str,
        ids: &[String],
    ) -> Result<i64, fred::error::RedisError> {
        self.client.xack(stream, group, ids).await
    }

    pub async fn create_consumer_group(
        &self,
        stream: &str,
        group: &str,
    ) -> Result<(), fred::error::RedisError> {
        let result = self.client.xgroup_create(stream, group, "0", true).await;

        match result {
            Ok(_) => {
                info!("Created consumer group {} for stream {}", group, stream);
                Ok(())
            }
            Err(e) if e.is_group_exists() => {
                info!("Consumer group {} already exists", group);
                Ok(())
            }
            Err(e) => Err(e),
        }
    }
}

fn parse_xreadgroup_result(
    result: fred::types::XReadGroupValue,
) -> Result<Vec<(String, Vec<(String, Vec<(String, String)>)>)>, fred::error::RedisError> {
    let mut parsed = Vec::new();

    if let Some(groups) = result.first() {
        for group in groups {
            let stream = group.name.clone();
            let messages = group.ids.iter().map(|msg| {
                let id = msg.id.clone();
                let fields = msg.fields.iter().map(|(k, v)| (k.clone(), v.clone())).collect();
                (id, fields)
            }).collect();
            parsed.push((stream, messages));
        }
    }

    Ok(parsed)
}

impl Drop for RedisStreamClient {
    fn drop(&mut self) {
        self.client.disconnect(false);
    }
}
