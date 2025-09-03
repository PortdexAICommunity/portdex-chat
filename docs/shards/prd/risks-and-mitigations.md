# Risks and Mitigations

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
