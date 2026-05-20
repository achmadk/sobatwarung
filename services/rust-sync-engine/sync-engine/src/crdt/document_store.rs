use crate::crdt::vector_clock::VectorClock;
use crate::error::SyncError;
use std::collections::HashMap;
use yrs::Doc;

#[derive(Clone)]
pub struct DocumentStore {
    documents: HashMap<String, Doc>,
}

impl DocumentStore {
    pub fn new() -> Self {
        Self {
            documents: HashMap::new(),
        }
    }

    pub fn get_or_create_doc(&mut self, agency_id: &str, doc_type: &str) -> &Doc {
        let key = format!("{}:{}", agency_id, doc_type);
        self.documents.entry(key).or_insert_with(Doc::new)
    }

    pub fn apply_mutation(
        &mut self,
        agency_id: &str,
        doc_type: &str,
        entity_id: &str,
        payload: &[u8],
        vector_clock: &VectorClock,
    ) -> Result<Vec<u8>, SyncError> {
        let doc = self.get_or_create_doc(agency_id, doc_type);
        let text = doc.get_or_create_text(entity_id);

        let mut transaction = doc.transact();
        text.push_data(&mut transaction, payload);

        let state = doc.state();
        Ok(state)
    }

    pub fn get_document_state(
        &self,
        agency_id: &str,
        doc_type: &str,
    ) -> Result<Vec<u8>, SyncError> {
        let key = format!("{}:{}", agency_id, doc_type);
        self.documents
            .get(&key)
            .map(|doc| doc.state())
            .ok_or_else(|| SyncError::DocumentNotFound(key))
    }

    pub fn merge(&mut self, agency_id: &str, doc_type: &str, state: &[u8]) -> Result<(), SyncError> {
        let doc = self.get_or_create_doc(agency_id, doc_type);
        Doc::apply_update(doc, state);
        Ok(())
    }
}

impl Default for DocumentStore {
    fn default() -> Self {
        Self::new()
    }
}
