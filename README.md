# 🛠 Microservices Backend Test - Order System

This project simulates a distributed order/inventory/notification system using microservices and RabbitMQ.

## Services Overview

| Service               | Description |
|-----------------------|-------------|
| `order-service`       | Exposes POST /orders and publishes `order.created` |
| `inventory-service`   | Listens to `order.created`, updates stock, publishes `iinventory.processed` |
| `notification-service`| Listens to `inventory.processed` and logs messages |

## Tech Stack
- Node.js + TypeScript + NestJS
- RabbitMQ
- Docker & Docker Compose
- PostgreSQL (TypeORM)

## Prerequisites
- Docker & Docker Compose installed
- ports 3001, 5672, 15672, 5432 free

## Run (via Docker)
```bash
docker-compose up --build
```

## Test the flow (via cURL)

```bash
curl --location 'localhost:3001/orders' \
--header 'Content-Type: application/json' \
--data '{
  "userId": 1,
  "items": [
    { "itemId": 1, "quantity": 2 },
    { "itemId": 1, "quantity": 1 }
  ]
}'
```