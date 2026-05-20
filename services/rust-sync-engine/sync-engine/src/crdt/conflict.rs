use serde::{Deserialize, Serialize};

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct Conflict {
    pub entity_id: String,
    pub entity_type: String,
    pub server_timestamp: i64,
    pub client_timestamp: i64,
    pub resolution: String,
}

pub trait ConflictResolver {
    fn resolve_lww(
        &self,
        server_value: &[u8],
        client_value: &[u8],
        server_timestamp: i64,
        client_timestamp: i64,
    ) -> Vec<u8>;

    fn resolve_state_based(
        &self,
        server_state: &[u8],
        client_state: &[u8],
    ) -> Vec<u8>;

    fn resolve_add_wins<T: Clone>(
        &self,
        server_set: &[T],
        client_set: &[T],
    ) -> Vec<T>;
}

pub struct DefaultConflictResolver;

impl ConflictResolver for DefaultConflictResolver {
    fn resolve_lww(
        &self,
        _server_value: &[u8],
        _client_value: &[u8],
        _server_timestamp: i64,
        client_timestamp: i64,
    ) -> Vec<u8> {
        _client_value.to_vec()
    }

    fn resolve_state_based(
        &self,
        server_state: &[u8],
        client_state: &[u8],
    ) -> Vec<u8> {
        let mut merged = server_state.to_vec();
        merged.extend_from_slice(client_state);
        merged
    }

    fn resolve_add_wins<T: Clone + PartialEq>(
        &self,
        server_set: &[T],
        client_set: &[T],
    ) -> Vec<T> {
        let mut result = server_set.to_vec();
        for item in client_set {
            if !result.contains(item) {
                result.push(item.clone());
            }
        }
        result
    }
}
