# Data & Request Flow

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
