# AI-Powered Product Sourcing Module PRD

## Overview

The **AI-Powered Product Sourcing Module** enables users to describe product needs in natural language (e.g., “MacBook Air”) and instantly receive curated product listings from external sources.  
Instead of relying on a pre-seeded internal database, the system uses AI + **MCP (Model Context Protocol)** tools to fetch live product data through crawling, scraping, or APIs.

Designed for **B2B buyers and sourcing professionals** who need quick, reliable access to supplier information, the module:

- **Simplifies discovery**
- **Improves supplier trust**
- Offers a **chat-based, intuitive interface**

---

## Core Features

- **Chat-Based Product Search**
  - Users input product requests via chat
  - Reduces friction compared to forms or filters
  - AI interprets query, MCP fetches live product data, results displayed in real-time

- **Product Artifact Display**
  - Search results shown as interactive product cards (similar to Accio) on the right of the chat
  - Visual, structured browsing
  - Cards include: product name, supplier, price range, MOQ, ratings, buyer interest

- **Supplier Trust Metrics**
  - Shows trust signals: years active, reorder rate, verification badges
  - Builds buyer confidence, reduces risk
  - If MCP supplies these, they're shown; otherwise, omitted gracefully

- **Chat History Persistence**
  - Stores user sessions
  - Authenticated users: saved to DB
  - Guests: temporary session memory only

---

## User Experience

### User Personas

- Startup founders sourcing products for resale
- Procurement managers at SMEs
- Independent resellers testing suppliers

### Key User Flows

1. User types a product query in chat
2. AI + MCP retrieve and rank relevant product listings
3. Results appear in product card artifacts on the right side
4. User clicks card → redirected to supplier site
5. User continues chat to refine search (filters, attributes)

### UI/UX Considerations

- **Chat** is the primary input surface
- **Product cards** appear alongside the chat feed (not replacing it)
- Filters (price, MOQ, verification) shown contextually
- Minimalist, usability-focused design

---

## Technical Architecture

### System Components

- **Frontend:** Next.js, TypeScript, TailwindCSS, shadcn components
- **AI Layer:** Vercel AI SDK v4
  - DeepSeek (MCP-enabled) for product data
  - Qwen for base chat responses
- **MCP Layer:** Handles scraping, crawling, API requests for live product data
- **Backend:** Next.js API routes
- **Database:** PostgreSQL (Drizzle ORM) — only for chat history

### Data Models

- **Chat:**
  - id
  - userId
  - messages[]
  - timestamp
- **No internal product tables** (all product data is transient from MCP)

### APIs & Integrations

- MCP for crawling/scraping external product data
- (Future) Optional: Alibaba/other sourcing APIs

### Infrastructure Requirements

- **Deployment:** AWS Amplify (handles CI/CD, hosting, environment management)
- **Backend Services:** Amplify for API/MCP integration
- **Authentication:** AWS Cognito (user/identity pools)
- **Database:** Amazon Aurora PostgreSQL (dynamic connection URL for Drizzle ORM)
- **Secrets/Config:** Managed with Amplify env variables (DB, AI, MCP credentials)
- **Scalability:** Amplify auto-scaling; Aurora for DB scaling

---

## Development Roadmap

### MVP Requirements

- Chat UI with AI-powered query handling
- MCP integration for live product listings
- Product artifact cards in chat UI
- Trust metrics display (if provided)
- Chat history (auth vs guest)

### Future Enhancements

- Filters and advanced query refinement
- Multi-source aggregation (Alibaba, Amazon Business, etc.)
- AI-driven supplier recommendation scoring
- Export/share product lists

---

## Logical Dependency Chain

**Foundation:**

- Chat UI + AI response streaming
- MCP integration for product retrieval
- Amplify deployment setup
- Authentication (Cognito)
- Aurora PostgreSQL integration (chat history via Drizzle ORM)

**Usable Demo:**

- Product artifact cards alongside chat

**Enhancement Layer:**

- Trust metrics parsing and display
- Chat history across sessions (auth/guest)

**Advanced Features:**

- Filters
- Multi-source support
- Supplier scoring

---

## Risks and Mitigations

- **MCP Data Reliability**
  - _Risk_: Inconsistent/incomplete data
  - _Mitigation_: AI fallback summaries for missing info, user feedback loop for inaccuracies

- **AI Hallucination**
  - _Risk_: AI fabricates or misinterprets info
  - _Mitigation_: Confidence scoring—low-confidence data marked as speculative/AI-generated

- **MCP Scalability and Performance**
  - _Risk_: Slow response or rate limits under load
  - _Mitigation_: Layered caching, preemptive refresh for popular searches

- **Data Freshness and Accuracy**
  - _Risk_: Stale data (prices, MOQs, etc.)
  - _Mitigation_: Product cards display timestamp, UI indicates “Live” vs “Cached” data

- **No Internal Product DB**
  - _Risk_: Limited historical search
  - _Mitigation_: Store chat references only, consider cached product snapshots later

- **Frontend Complexity**
  - _Risk_: Balancing chat and product artifact UI
  - _Mitigation_: Minimalist first, iterate UI with feedback

---

## Appendix

- Reference: Accio-style UI with chat + product sidebar
- Screenshot: Provided design example for product list layout
- Research: Perplexity-like crawling via MCP for live data
