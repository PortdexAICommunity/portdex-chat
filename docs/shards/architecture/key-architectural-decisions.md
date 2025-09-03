# Key Architectural Decisions

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
