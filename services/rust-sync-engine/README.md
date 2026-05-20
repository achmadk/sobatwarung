# Rust Sync Engine Service

High-performance CRDT-based synchronization microservice built with Rust.

## Architecture

- **Axum** - HTTP/WebSocket server
- **Tokio** - Async runtime
- **Tonic** - gRPC framework
- **Yrs** - CRDT implementation
- **NATS** - Message queue with JetStream
- **sqlx** - PostgreSQL async driver

## Service Endpoints

### gRPC (port 50051)

```protobuf
service SyncService {
  rpc SyncBatch(SyncBatchRequest) returns (SyncBatchResponse);
  rpc GetState(GetStateRequest) returns (GetStateResponse);
  rpc HealthCheck(HealthCheckRequest) returns (HealthCheckResponse);
}
```

### WebSocket (port 8080)

- `GET /ws/sync` - WebSocket endpoint for real-time sync
- `GET /health` - Health check endpoint

### Message Protocol

```json
// Client -> Server
{ "type": "auth", "agency_id": "...", "client_id": "..." }
{ "type": "sync", "batch_id": "...", "mutations": [...] }
{ "type": "ping" }

// Server -> Client
{ "type": "auth_ack" }
{ "type": "sync_ack", "payload": {...} }
{ "type": "broadcast", "entity": "...", "change": {...} }
```

## NATS Topics

- `sync.events` - All sync events
- `sync.conflict_resolved` - Conflict resolution events
- `sync.mutation_result` - Mutation processing results
- `sync.state_snapshot.{agency_id}` - State snapshots

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgres://...` |
| `NATS_URL` | NATS server URL | `nats://localhost:4222` |
| `RUST_LOG` | Logging level | `info` |

## Development

```bash
# Start dependencies
docker-compose up -d postgres nats

# Build
cargo build --release -p sync-engine

# Run
cargo run -p sync-engine

# Test
cargo test
```

## Docker

```bash
docker build -f docker/Dockerfile -t sobatwarung/sync-engine:latest .
docker run -p 50051:50051 -p 8080:8080 sobatwarung/sync-engine:latest
```
