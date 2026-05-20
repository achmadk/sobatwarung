# Product Requirements Document (PRD)

## Project SobatWarung: Independent Keagenan & Komunal Ecosystem

- **Status:** Ready for Development / Hackathon Pitch
- **Version:** 2.0 (Agentic & Keagenan Update)
- **Date:** May 2026
- **Target Release:** Q3 2026
- **Author:** Project Team

---

## 1. Executive Summary & Product Mindset

### 1.1 Executive Summary

**SobatWarung** is an independent, decentralized, digital ecosystem designed for mom-and-pop shops (_warung_) outside Java. It bridges the gap caused by unstable internet connectivity and high logistics costs through a resilient **Offline-First Data Architecture** combined with a local **Multi-Agent Smart Layer**.

Instead of forcing a centralized, cloud-dependent marketplace model, SobatWarung structures local supply chains into an autonomous, community-driven **Keagenan (Agency) Framework**. This empowers local merchants to aggregate buying power and run hyper-local digital storefronts entirely under their own sovereignty, free from rigid government bureaucracy or cloud-centric single points of failure.

### 1.2 Core Product Mindset

- **Local-First, Cloud-Later:** Internet is treated as an optimization, not a dependency. Core marketplace utilities work seamlessly in deep offline environments.
- **Resilience over Bloat:** Four hyper-optimized, high-utility features working flawlessly on low-end hardware outweigh dozens of fragile, cloud-dependent modules.
- **Community as the Engine:** Digitalizing existing, trust-based social interactions rather than trying to engineer new consumer behaviors from scratch.
- **Sovereign & Private:** Empowering independent merchants with secure, local data control (_Data Milik Anda_), keeping operational records close to the edge.

---

## 2. Market Context & Competitive Strategy

SobatWarung targets the underserved retail landscape outside Java, operating under clear, contrasting principles against both tech giants and top-down government programs:

- **vs. Cloud Giants (GoBiz, GrabMerchant, Mitra Tokopedia):** Big tech platforms fail when connectivity drops or when rigid, centralized logistics schemes inflate operational costs. SobatWarung delivers absolute reliability via an offline-first infrastructure and cost-effective, decentralized local transport consolidation.
- **vs. Bureaucratic Solutions (Koperasi Desa Merah Putih):** Government-sponsored co-ops are typically slow, procedure-bound, and strictly cloud-dependent. SobatWarung champions absolute agility, direct profit motives for local owners, and total privacy protection through decentralized edge processing—avoiding administrative lock-in and policy risks.

---

## 3. Structural Hierarchy (The Keagenan Framework)

To drive efficient distribution, the platform organizes local supply networks into three clearly defined tiers:

```
[ Distributor Pusat / Pemasok Lokal ]
                 │
                 ▼
       ┌──────────────────┐
       │   Level 1:       │
       │   AGEN UTAMA     │ ◄─── (Warung Hub / High Inventory / High Trust)
       └─────────┬────────┘
                 │
                 ├──────────────────────┐
                 ▼                      ▼
       ┌──────────────────┐    ┌──────────────────┐
       │   Level 2:       │    │   Level 2:       │
       │   AGEN MITRA     │    │   AGEN MITRA     │ ◄─── (Small Warung / Community Buyers)
       └─────────┬────────┘    └──────────────────┘
                 │
                 ▼
       ┌──────────────────┐
       │   Level 3:       │
       │   RESELLER       │ ◄─── (Individuals / Home-based Sellers using WA)
       └──────────────────┘

```

1. **Level 1: Agen Utama (Warung Hub):** Established local bulk-stores acting as transit inventory nodes. They receive direct preferential wholesale pricing and serve as the physical collection point for community orders.
2. **Level 2: Agen Mitra (Sub-Agen):** Neighborhood convenience shops that source from the _Agen Utama_ or co-finance shared freight shipments through group buying activities.
3. **Level 3: Reseller Tetangga:** Dynamic individuals (e.g., homemakers, local youth) without a physical storefront who leverage consumer-facing digital catalogs to sell neighborhood inventory via WhatsApp.

---

## 4. User Personas

### 4.1 Pak Edi – The Agen Utama (Warung Hub Co-ordinator)

- **Demographics:** 42 years old, runs the largest grocery store in a district center outside Balikpapan.
- **Tech Stack:** Mid-range Android smartphone (4GB RAM), variable 3G/4G connectivity.
- **Pain Points:** Unstable inventory pricing from distant urban centers, excessive freight costs for standalone shipments, manual record-keeping for smaller sub-stores.

### 4.2 Ibu Siti – The Agen Mitra (Neighborhood Sub-Agent)

- **Demographics:** 35 years old, owns a small home-based kiosk in a rural village 15km from Pak Edi.
- **Tech Stack:** Low-end Android Go device (2GB RAM), unstable EDGE/2G connection.
- **Pain Points:** Inability to match urban retail prices due to tiny purchasing power, constant connection dropouts on conventional apps.

---

## 5. Functional Requirements (Core Features)

### FR-01: Group Buying System (Pengadaan Kolektif)

- **Description:** Allows multiple _Agen Mitra_ to pool their orders under an _Agen Utama_ to unlock bulk wholesale tiers and split transport costs.
- **Priority:** P0
- **Offline Capability:** Users can draft orders, adjust contributions, and join a local buying pool offline. The local host aggregates data locally before executing a cloud synchronization pass.

### FR-02: Offline-First Marketplace Data Engine

- **Description:** A robust data architecture that processes catalog browsing, stock checks, and transactional entries natively on-device.
- **Priority:** P0
- **Technical Requirement:** Local embedded storage (e.g., SQLite via WebAssembly or PouchDB) handling transactions safely. Background workers must handle multi-client transaction queues silently, automatically reconciling state differences once network signal becomes available.

### FR-03: Hyper-Local Sourcing & Tracking

- **Description:** A flexible local catalog engine connecting regional producers (e.g., local farmers, fishermen, artisans) straight to nearby _Agen Utama_ nodes.
- **Priority:** P1
- **Offline Capability:** Local suppliers can publish product availability updates without a persistent cloud connection; availability profiles sync immediately to adjacent hubs via opportunistic data handshakes.

### FR-04: B2B2C Digital Storefront (Etalase Tetangga)

- **Description:** Auto-generates clean, fast-loading, lightweight web catalogs for agents. Local end-consumers can browse inventory and place local delivery orders directly through standard WhatsApp interfaces.
- **Priority:** P1
- **Technical Requirement:** Highly compressed web views utilizing optimized image assets (WebP/SVG) to minimize data consumption for the end user.

---

## 6. Multi-Agent System (MAS) Specification

SobatWarung implements a highly modular, decoupled **Intelligence Layer** on top of its core data framework. These autonomous software agents handle routine operational decisions natively on the edge.

```
       ┌────────────────────────────────────────────────────────┐
       │                  SOBATWARUNG APP (EDGE)                │
       │                                                        │
       │  ┌─────────────────┐            ┌──────────────────┐   │
       │  │   Stock Agent   ├───────────►│ Community Agent  │   │
       │  └────────┬────────┘            └────────┬─────────┘   │
       │           │                              │             │
       │           ▼                              ▼             │
       │  ┌─────────────────┐            ┌──────────────────┐   │
       │  │  Privacy Agent  │            │   Sales Agent    │   │
       │  └─────────────────┘            └──────────────────┘   │
       └────────────────────────────────────────────────────────┘

```

### 6.1 Agent Definitions & Workflows

#### A. Stock Agent

- **Role:** Autonomous Inventory Intelligence.
- **Behavior:** Operates directly on the local database. It tracks item velocity offline, flags imminent out-of-stock items, and predicts restocking needs without needing explicit user inputs.
- **Trigger Workflow:** Inventory crosses minimum safe threshold $\rightarrow$ Pushes predictive restock payload to the _Community Agent_.

#### B. Community Agent

- **Role:** Collective Procurement Negotiator.
- **Behavior:** Monitors cross-store procurement deficits. It automatically initializes digital buying pools for nearby agents when shared stocking patterns match.
- **Trigger Workflow:** Receives restock payloads $\rightarrow$ Opens local procurement pool $\rightarrow$ Prepares optimal order distribution options for the group.

#### C. Sales Agent

- **Role:** Hyper-local Micro-Marketing Assistant.
- **Behavior:** Processes local buying histories to auto-generate contextually accurate, highly personalized marketing copy tailored for WhatsApp outreach.
- **Trigger Workflow:** Local inventory surplus detected $\rightarrow$ Synthesizes targeted promotional text drafts $\rightarrow$ Prepares ready-to-send interaction prompts for the merchant.

#### D. Privacy-Guard Agent

- **Role:** Edge Security & Encryption Overseer.
- **Behavior:** Runs inside a secure WebAssembly layer. It handles cryptographic signatures, secures local database logs, and strips sensitive identity tags before syncing metrics externally.
- **Trigger Workflow:** Inter-agent communication event occurring offline $\rightarrow$ Encrypts communication state securely to local storage using client-side cryptographic keys.

### 6.2 Agent Communication Log Schema

All inter-agent messages are cleanly appended to an asynchronous, auditable transaction log. This log updates locally on the device and queues for secure transmission when online.

```json
{
  "timestamp": "2026-05-17T01:45:00Z",
  "trace_id": "sw-agent-trace-88291-edge",
  "interaction": {
    "from": "Stock_Agent_01",
    "to": "Community_Agent_Global",
    "action": "INITIATE_GROUP_BUY_POOL",
    "payload": {
      "item_id": "rice-premium-10k",
      "predicted_deficit_qty": 150,
      "target_price_ceiling_idr": 135000
    },
    "status": "QUEUED_OFFLINE"
  }
}
```

---

## 7. Technical Architecture & Non-Functional Requirements

### 7.1 Tech Stack Strategy

- **Frontend Core:** React.js / Next.js with TypeScript for structured, reliable components.
- **High-Performance Edge Execution:** Logic modules compiled to **WebAssembly (WASM) via Rust**. This is used for fast cryptographic processing, clean offline routing calculations, and local data filtering.
- **Data Layer:** PouchDB/SQLite client-side pairing with automated data syncing algorithms to handle concurrent online resolution gracefully.

### 7.2 Non-Functional Requirements

- **Extreme Performance Footprint:** Core application shell must execute cleanly on low-tier smartphones with 2GB RAM.
- **Data Budget Efficiency:** Main bundle payload sizes and updates must optimize aggressively for limited, metered 2G/3G connections.
- **Guaranteed Transactional Atomicity:** Local transactional state mutations must handle unexpected application shutdowns or device battery depletion safely without causing data corruption.

---

## 8. Key Metrics for Success (KPIs)

- **Procurement Cost Optimization:** Average reduction of 10-15% in baseline wholesale sourcing costs for individual _Agen Mitra_ via combined group-buying pools.
- **Offline Operational Continuity:** 100% of standard core ledger entries and local order actions must process flawlessly with zero network connection.
- **Community Network Retention:** Percentage of active nodes maintaining ongoing, week-over-week collective buying interactions.
