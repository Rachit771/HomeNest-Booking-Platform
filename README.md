**System Architecture**
**Overall Request Flow**
Client → Nginx (Reverse Proxy) → Node.js Application → Redis → MongoDB


The system is designed as a containerized modular monolith using Docker.
Nginx acts as the public entry point, forwarding requests to the backend application.

**1️. Client Layer (Server-Side Rendering)**

The application uses EJS (Embedded JavaScript) for server-side rendering.

All views are rendered on the server.

Fully generated HTML is sent to the browser.

Reduces frontend complexity compared to SPA architecture.

**2️. Reverse Proxy Layer – Nginx**

Nginx runs in a separate Docker container and serves as the entry point for all incoming traffic.

**Responsibilities:**

Acts as a reverse proxy to the Node.js backend.

Forwards requests from port 80 to the backend container.

Prevents direct public exposure of the backend service.

Designed to support future horizontal scaling.

Ready to support SSL termination (HTTPS) in production environments.

Currently running over HTTP. SSL can be added via certificate configuration.

This setup improves modularity and production-readiness.

**3️. Application Layer – Node.js (Express)**

**The backend follows a layered architecture:**

routes → controllers → services → models

**Responsibilities:**

Handle HTTP requests and responses

Execute business logic

Prevent double booking using transactional logic

Communicate with Redis for caching and locks

Interact with MongoDB for persistent storage

Booking Conflict Prevention

**To prevent double booking:**

MongoDB transactions are used.

Overlapping date ranges are checked using:

startDate < existing.endDate
endDate > existing.startDate


**Only bookings with:**

CONFIRMED

PAYMENT_PENDING (not expired)

are considered blocking.

This ensures data consistency under concurrent requests.

**4️. Caching & Concurrency Layer – Redis**

Redis is integrated to improve performance and reliability.

**Responsibilities:**

Cache frequently accessed property listings

Implement request rate limiting

Support temporary booking locks during checkout

Reduce database load

This layer improves response time and scalability.

**5️. Database Layer – MongoDB**

MongoDB is used for persistent storage.

Collections:

Users

Properties

Bookings

Reviews

Messages (if implemented)

Optimizations:

Compound indexes on:

{ homeId: 1, startDate: 1, endDate: 1 }


TTL index on expiresAt field to auto-delete expired PAYMENT_PENDING bookings.

This ensures:

Fast conflict detection

Efficient search queries

Automatic cleanup of stale bookings

**Scalability Strategy**
**The system is designed to scale horizontally:**

Multiple Node.js instances can run behind Nginx.

Nginx can be configured for load balancing.

Redis reduces database pressure.

MongoDB replica set can support high availability.

**Security Considerations**
Backend service is not directly exposed to the internet.

Reverse proxy provides controlled traffic routing.

Booking transactions ensure atomic operations.

Rate limiting (via Redis) prevents abuse.

**Deployment**

The application is containerized using Docker and orchestrated with Docker Compose.

**Services include:**

Nginx

Node.js backend

MongoDB

Redis

This ensures consistent development and production environments.
