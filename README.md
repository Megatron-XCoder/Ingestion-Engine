# High-Scale Energy Ingestion Engine

## Executive Summary

This project implements a robust ingestion layer for handling high-frequency telemetry data from Smart Meters and Electric Vehicles. It is designed to handle write-heavy ingestion and provide read-heavy analytics for fleet operators, correlating AC consumed (Grid) with DC delivered (Vehicle) to detect efficiency drops.

## Architecture

### 1. Polymorphic Ingestion

- **Separate Endpoints**: `/ingestion/meter` and `/ingestion/vehicle` handle distinct data streams.
- **DTO Validation**: Strict validation using `class-validator` ensures data integrity before processing.

### 2. Database Strategy (PostgreSQL)

We utilize a **Hot/Cold storage strategy** to balance write performance and read optimization:

- **Hot Store (Operational)**:
  - Tables: `meter_status_latest`, `vehicle_status_latest`
  - Pattern: **Upsert** (Insert or Update).
  - Purpose: Provides instant access to the "Current Status" of any device without scanning history.

- **Cold Store (Historical)**:
  - Tables: `meter_telemetry_history`, `vehicle_telemetry_history`
  - Pattern: **Append-Only Insert**.
  - Purpose: Audit trail and long-term reporting.
  - Optimization: Indexed on `(meterId/vehicleId, timestamp)` for efficient time-range queries.

### 3. Analytics Engine

- **Endpoint**: `GET /v1/analytics/performance/:vehicleId`
- **Logic**:
  - Correlates Vehicle and Meter data (assuming 1:1 mapping `vehicle-XXX` <-> `meter-XXX`).
  - Aggregates data over the last 24 hours using `MAX - MIN` logic for cumulative counters (or tailored aggregation based on stream type).
  - **Optimization**: Uses indexed time-range queries to avoid full table scans.

## Setup & Running

### Prerequisites

- Docker & Docker Compose
- Node.js (v18+)

### Steps

1. **Start Database**:

   ```bash
   docker-compose up -d
   ```

   This spins up PostgreSQL on port 5432 and pgAdmin on port 8080.

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Run Application**:

   ```bash
   npm run start:dev
   ```

   Server starts on `http://localhost:3000`.

4. **Seed Data (Optional)**:
   Generate 24 hours of sample telemetry:
   ```bash
   npx ts-node seed.ts
   ```

## API endpoints

### Ingestion

- `POST /ingestion/meter`
  ```json
  {
    "meterId": "meter-001",
    "kwhConsumedAc": 100.5,
    "voltage": 230,
    "timestamp": "2023-10-27T10:00:00Z"
  }
  ```
- `POST /ingestion/vehicle`
  ```json
  {
    "vehicleId": "vehicle-001",
    "soc": 55,
    "kwhDeliveredDc": 98.0,
    "batteryTemp": 32.5,
    "timestamp": "2023-10-27T10:00:00Z"
  }
  ```

### Analytics

- `GET /v1/analytics/performance/:vehicleId`
  - Returns efficiency stats for the last 24 hours.

## Performance Verification

To verify the analytics query does not perform a full table scan, you can check the query plan (conceptually):
`EXPLAIN ANALYZE SELECT ... FROM meter_telemetry_history WHERE meterId = ... AND timestamp > ...`
The definition of the index `['meterId', 'timestamp']` ensures this is an Index Scan.
