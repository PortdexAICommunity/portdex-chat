# Technical Architecture for the AI-Powered Product Sourcing Module

## 1. System Components & Technologies

The architecture is designed to be modern, **serverless-first**, and highly scalable.

### Frontend

- Built with **Next.js**
- Uses **TypeScript** for type safety
- Styled with **TailwindCSS** (utility-first styling)
- UI components from **shadcn/ui** for a consistent and accessible interface

### Backend

- Implemented via **Next.js API routes**, providing a unified full-stack framework
- Handles orchestration of AI/MCP requests and database interactions

### AI Layer

- Powered by **Vercel AI SDK v4** for response streaming
- **DeepSeek** model → used for MCP capabilities
- **Qwen** model → handles general conversational responses

### Data Layer

- Database: **PostgreSQL (Amazon Aurora)**
- Purpose: Store authenticated user chat history only
- ORM: **Drizzle ORM** for schema management and queries

### MCP Layer

- Custom-built component
- Responsible for **crawling, scraping, and API requests** to external product sources
- Orchestrates and aggregates live product data

---

## 2. Data & Request Flow

The following describes the lifecycle of a request:

1. User submits a **product query** via the **Next.js chat UI**.
2. Query sent to **Backend API route**.
3. Backend forwards query to **AI Layer (Vercel AI SDK)**.
4. **AI model (DeepSeek)** detects need for product data → invokes **MCP Layer**.
5. **MCP Layer** performs scraping, crawling, or API calls to fetch real-time product listings.
6. MCP returns product data to the **AI Layer**.
7. AI Layer structures the response and streams it back to **Backend API**.
8. Backend API formats the final response → returns it to **Frontend**.
9. Next.js **Frontend renders the response** → displays **Product Artifact Cards** interactively.
10. If user is authenticated, messages are saved to **Aurora PostgreSQL** via the backend.

---

## 3. Infrastructure & Deployment

The application runs on a **cloud-native, scalable stack**.

- **Deployment:**
  - Managed by **AWS Amplify** (CI/CD, hosting, and environment management).

- **Authentication:**
  - Secured via **AWS Cognito** (sign-up, sign-in, session handling).

- **Database:**
  - **Amazon Aurora (PostgreSQL-compatible)** for reliable, scalable persistence of chat history.

- **Secrets Management:**
  - API keys & credentials managed with **Amplify environment variables**.

---

## 4. Key Architectural Decisions

- **Transient Product Data:**
  - No internal product DB – all product data is **live-fetched** via MCP.
  - Ensures **fresh and lightweight** system.

- **Serverless-First Approach:**
  - Backend powered by **Next.js API routes on AWS Amplify**.
  - Scales automatically, cost-efficient (pay-per-use).

- **Separation of Concerns:**
  - **Backend + AI Layer → data retrieval & manipulation**
  - **Frontend → presentation & interactivity**
  - Improves maintainability and modularity.

- **Leverage Managed Services:**
  - Using **Amplify, Cognito, Aurora** reduces infra management load.
  - Focus remains on **core product features** instead of DevOps overhead.

---
