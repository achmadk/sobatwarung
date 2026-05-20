CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE crdt_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agency_id VARCHAR(255) NOT NULL,
    doc_type VARCHAR(50) NOT NULL,
    state BYTEA NOT NULL,
    vector_clock JSONB NOT NULL DEFAULT '{}',
    last_updated TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    version INTEGER NOT NULL DEFAULT 1,
    UNIQUE(agency_id, doc_type)
);

CREATE INDEX idx_crdt_documents_agency ON crdt_documents(agency_id);

CREATE TABLE sync_state (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agency_id VARCHAR(255) NOT NULL UNIQUE,
    client_id VARCHAR(255) NOT NULL,
    last_sync_timestamp BIGINT NOT NULL,
    last_sync_vector_clock JSONB NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sync_state_agency ON sync_state(agency_id);

CREATE TABLE agency_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agency_id VARCHAR(255) NOT NULL,
    device_id VARCHAR(255) NOT NULL,
    public_key BYTEA NOT NULL,
    key_type VARCHAR(50) NOT NULL DEFAULT 'x25519',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deprecated_at TIMESTAMPTZ,
    UNIQUE(agency_id, device_id)
);

CREATE INDEX idx_agency_keys_agency ON agency_keys(agency_id);
CREATE INDEX idx_agency_keys_device ON agency_keys(device_id);

CREATE TABLE sync_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agency_id VARCHAR(255) NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id VARCHAR(255),
    payload JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sync_events_agency ON sync_events(agency_id);
CREATE INDEX idx_sync_events_created ON sync_events(created_at);
