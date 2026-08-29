# Adoption guide

A policy publisher can adopt Civic WebMCP incrementally.

## Minimum useful implementation

1. Model your existing public policy pages as stable `CivicResource` objects.
2. Give each major claim a type and source IDs.
3. Normalize your source library into `CivicSource` objects.
4. Implement a small registry over the same data your human site uses.
5. Register the seven v0.1 tools with `document.modelContext` when WebMCP is available.
6. Keep the normal website fully functional when WebMCP is not available.

## Do not create a second policy database just for AI

The ideal architecture is:

```text
CMS / policy data
       │
       ├── human web pages
       │
       └── Civic WebMCP adapter
               │
               └── document.modelContext
```

The agent interface and human interface should share the same source of record.

## Suggested adapter boundary

```ts
interface CivicPublisherAdapter {
  search(input: CivicSearchInput): Promise<CivicResourceSummary[]>;
  getResource(id: string): Promise<CivicResource>;
  getSources(id: string): Promise<CivicSource[]>;
  getPositions(id: string): Promise<CivicPosition[]>;
  getTimeline(id: string): Promise<CivicTimelineEvent[]>;
  getRelated(id: string): Promise<CivicResourceSummary[]>;
  getActionOpportunities(id?: string): Promise<CivicActionOpportunity[]>;
}
```

The reference implementation uses an in-memory registry for clarity. Production sites can adapt a CMS, database, static content collection, legislative API, or structured legal document store.

## WebMCP lifecycle

Feature-detect the draft API:

```ts
if (document.modelContext) {
  const controller = new AbortController();
  await registerCivicWebMCP({
    modelContext: document.modelContext,
    registry,
    signal: controller.signal,
  });
}
```

Abort the signal if the publisher changes authenticated/publication context in a single-page application or otherwise needs to retire registrations.

## Shared page state

Consider connecting tool calls to visible site state. In the reference site:

- `civic_search` filters the human-visible resource cards;
- `civic_get_resource` selects the human-visible resource detail.

This is not required for data interoperability, but it demonstrates one of WebMCP's distinctive strengths: the person and agent can remain oriented to the same page state.
