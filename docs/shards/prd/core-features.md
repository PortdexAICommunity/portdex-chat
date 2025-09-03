# Core Features

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
