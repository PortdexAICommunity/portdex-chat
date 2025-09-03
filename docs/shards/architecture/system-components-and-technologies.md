# System Components & Technologies

The architecture is designed to be modern, **serverless-first**, and highly scalable.

## Frontend

- Built with **Next.js**
- Uses **TypeScript** for type safety
- Styled with **TailwindCSS** (utility-first styling)
- UI components from **shadcn/ui** for a consistent and accessible interface

## Backend

- Implemented via **Next.js API routes**, providing a unified full-stack framework
- Handles orchestration of AI/MCP requests and database interactions

## AI Layer

- Powered by **Vercel AI SDK v4** for response streaming
- **DeepSeek** model → used for MCP capabilities
- **Qwen** model → handles general conversational responses

## Data Layer

- Database: **PostgreSQL (Amazon Aurora)**
- Purpose: Store authenticated user chat history only
- ORM: **Drizzle ORM** for schema management and queries

## MCP Layer

- Custom-built component
- Responsible for **crawling, scraping, and API requests** to external product sources
- Orchestrates and aggregates live product data
