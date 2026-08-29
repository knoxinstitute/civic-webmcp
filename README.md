# Civic WebMCP

**An open profile and reference implementation for agent-ready public policy websites.**

Civic WebMCP asks a simple question: **what should public-policy publishing look like when humans increasingly research alongside AI agents?**

The project uses the browser-native WebMCP API (`document.modelContext`) to expose public policy as structured, attributable civic knowledge while keeping the normal human website as the source of record.

Civic WebMCP is an open civic technology project initiated by the **Henry Knox Institute**. The goal is not to make AI decide public questions. The goal is to make policy information more transparent, more attributable, easier to interrogate, and easier for humans to evaluate.

## What the profile adds

Normal policy pages blend many things into prose: legal text, factual claims, empirical evidence, projections, organizational analysis, value judgments, disagreement, timelines, and public participation opportunities.

Civic WebMCP makes those distinctions explicit.

Profile v0.1 defines seven read-only WebMCP tools:

- `civic_search`
- `civic_get_resource`
- `civic_get_sources`
- `civic_get_positions`
- `civic_get_timeline`
- `civic_get_related`
- `civic_get_action_opportunities`

See [PROFILE.md](./PROFILE.md) for the normative profile.

## Reference implementation

This repository includes the **Knox Policy Lab**, a runnable static reference site. Its policy examples are intentionally fictional and marked as demonstration data; they are not Henry Knox Institute policy positions.

```bash
npm install
npm run dev
```

Then open the local URL printed by Vite. The site works as an ordinary website in every modern browser. In a WebMCP-enabled browser, it additionally registers the seven Civic WebMCP tools through `document.modelContext.registerTool()`.

Run checks with:

```bash
npm test
npm run build
```

## Why WebMCP

The current WebMCP draft gives web pages a browser-native way to register structured tools for agents. Tool calls execute in the live page, which lets the human interface and agent share the same published context rather than requiring screen scraping or an entirely separate backend integration.

Civic WebMCP uses the current imperative API:

```ts
await document.modelContext.registerTool(
  {
    name: 'civic_get_resource',
    description: 'Retrieve a policy resource with typed claims and provenance.',
    inputSchema: {
      type: 'object',
      properties: { resourceId: { type: 'string' } },
      required: ['resourceId'],
      additionalProperties: false,
    },
    annotations: {
      readOnlyHint: true,
      untrustedContentHint: true,
    },
    execute: async ({ resourceId }) => getResource(resourceId),
  },
  { signal: controller.signal },
);
```

The authoritative draft specification is maintained by the Web Machine Learning Community Group:

- https://webmachinelearning.github.io/webmcp/
- https://github.com/webmachinelearning/webmcp

## Design principles

1. **Provenance before persuasion.** Agents should know where a claim came from before deciding how to use it.
2. **Facts, analysis, projections, and values are different things.** Publishers should label them accordingly.
3. **Disagreement is data.** Credible perspectives should be representable and attributable.
4. **Humans retain civic agency.** Civic research can be agent-assisted; consequential civic action should remain deliberate.
5. **The open web remains the source of record.** Agent interfaces should strengthen public publishing, not replace it with opaque data silos.

Read [PRINCIPLES.md](./PRINCIPLES.md) for more detail.

## Relationship to existing civic standards

Civic WebMCP is intended to complement, not replace, existing civic and legal data standards such as Open Civic Data, Popolo, Schema.org `Legislation`, and Akoma Ntoso. Those standards help describe civic entities and legal documents. Civic WebMCP defines an **agent interaction profile** for a live public website.

See [docs/existing-standards.md](./docs/existing-standards.md).

## Repository map

```text
schemas/           JSON Schemas for interoperable civic objects
src/               TypeScript reference implementation and demo site
tests/             Registry and WebMCP contract tests
docs/              Adoption, provenance, and standards guidance
PROFILE.md          Normative Civic WebMCP v0.1 profile
PRINCIPLES.md       Civic and technical design principles
```

## Status

Civic WebMCP v0.1 is an experimental open profile built against a fast-moving draft WebMCP API. It is deliberately small so publishers can implement it, test it with real agents, and improve the profile through public discussion.

Contributions, implementation reports, interoperability feedback, and critiques are welcome.

## License

MIT. See [LICENSE](./LICENSE).
