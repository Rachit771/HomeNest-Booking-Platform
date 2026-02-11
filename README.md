**Project Architecture & Flow**
**Overall Flow**
**When a user visits the application, the request follows this path:**

Client → Load Balancer (Nginx) → Node.js App Server → Redis (cache/locks) → MongoDB

This ensures scalability, performance, and data consistency.

**1️⃣ Client Layer**

The client interacts with the application through server-side rendered views using EJS.
All pages are rendered on the server and sent to the browser as fully built HTML.

**2️⃣ Reverse Proxy Layer (Nginx)**

Nginx acts as a reverse proxy in front of the application servers. It:

Handles SSL (HTTPS)

Routes incoming traffic to the correct server

Supports load balancing (for horizontal scaling in the future)

This improves security and scalability.

**3️⃣ Application Layer (Node.js)**

This is the core of the system.

The application is structured into:

Controllers – Handle incoming requests

Services – Contain business logic

Booking logic – Includes conflict resolution to prevent double bookings

This layer processes requests, applies business rules, and communicates with Redis and MongoDB.

**4️⃣ Caching Layer (Redis) – Upcoming**

Redis is used to improve performance and reliability.

It will handle:

Caching frequently requested property listings

Rate limiting requests

Temporary booking locks to prevent race conditions during checkout

This reduces database load and improves response times.

**5️⃣ Database Layer (MongoDB)**
MongoDB stores all persistent data including users, properties, and bookings.

Optimizations include:

Indexed queries for faster searches

TTL (Time-To-Live) indexes for automatic payment expiration cleanup
