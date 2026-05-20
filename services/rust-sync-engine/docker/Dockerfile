FROM rust:1.75-slim-bookworm AS builder

RUN apt-get update && apt-get install -y protobuf-compiler && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY Cargo.toml Cargo.lock ./
COPY rust-toolchain.toml ./

RUN mkdir sync-engine sync-crypto

COPY sync-engine/Cargo.toml sync-engine/
COPY sync-crypto/Cargo.toml sync-crypto/

RUN cargo fetch 2>/dev/null || true

COPY proto/ proto/

RUN cargo build --release -p sync-engine

FROM debian:bookworm-slim

RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/target/release/sync-engine /usr/local/bin/

EXPOSE 50051 8080

ENV RUST_LOG=info

CMD ["sync-engine"]
