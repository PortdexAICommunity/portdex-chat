# Technical Architecture

## System Components

- **Frontend:** Next.js, TypeScript, TailwindCSS, shadcn components
- **AI Layer:** Vercel AI SDK v4
  - DeepSeek (MCP-enabled) for product data
  - Qwen for base chat responses
- **MCP Layer:** Handles scraping, crawling, API requests for live product data
- **Backend:** Next.js API routes
- **Database:** PostgreSQL (Drizzle ORM) — only for chat history

## Data Models

- **Chat:**
  - id
  - userId
  - messages[]
  - timestamp
- **No internal product tables** (all product data is transient from MCP)

## APIs & Integrations

- MCP for crawling/scraping external product data
- (Future) Optional: Alibaba/other sourcing APIs

## Infrastructure Requirements

- **Deployment:** AWS Amplify (handles CI/CD, hosting, environment management)
- **Backend Services:** Amplify for API/MCP integration
- **Authentication:** AWS Cognito (user/identity pools)
- **Database:** Amazon Aurora PostgreSQL (dynamic connection URL for Drizzle ORM)
- **Secrets/Config:** Managed with Amplify env variables (DB, AI, MCP credentials)
- **Scalability:** Amplify auto-scaling; Aurora for DB scaling
