use serde::{Deserialize, Serialize};
use std::collections::BTreeMap;
use std::cmp::Ordering;

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct VectorClock {
    clock: BTreeMap<String, u64>,
}

impl VectorClock {
    pub fn new() -> Self {
        Self {
            clock: BTreeMap::new(),
        }
    }

    pub fn increment(&mut self, client_id: &str) {
        *self.clock.entry(client_id.to_string()).or_insert(0) += 1;
    }

    pub fn merge(&mut self, other: &VectorClock) {
        for (client, &count) in &other.clock {
            let entry = self.clock.entry(client.clone()).or_insert(0);
            *entry = (*entry).max(count);
        }
    }

    pub fn compare(&self, other: &VectorClock) -> Ordering {
        let mut self_greater = false;
        let mut other_greater = false;

        let all_keys: std::collections::HashSet<_> = self
            .clock
            .keys()
            .chain(other.clock.keys())
            .collect();

        for key in all_keys {
            let self_val = self.clock.get(key).unwrap_or(&0);
            let other_val = other.clock.get(key).unwrap_or(&0);

            match self_val.cmp(other_val) {
                Ordering::Greater => self_greater = true,
                Ordering::Less => other_greater = true,
                Ordering::Equal => {}
            }
        }

        if self_greater && other_greater {
            Ordering::Equal
        } else if self_greater {
            Ordering::Greater
        } else if other_greater {
            Ordering::Less
        } else {
            Ordering::Equal
        }
    }

    pub fn contains(&self, other: &VectorClock) -> bool {
        for (client, &count) in &other.clock {
            let self_count = self.clock.get(client).unwrap_or(&0);
            if self_count < &count {
                return false;
            }
        }
        true
    }
}

impl Default for VectorClock {
    fn default() -> Self {
        Self::new()
    }
}
