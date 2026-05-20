pub mod document_store;
pub mod conflict;
pub mod vector_clock;

pub use document_store::DocumentStore;
pub use conflict::{ConflictResolution, ConflictResolver};
pub use vector_clock::VectorClock;
