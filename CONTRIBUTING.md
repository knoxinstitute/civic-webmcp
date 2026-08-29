# Contributing

Civic WebMCP is an experimental civic interoperability project. Contributions are welcome from policy publishers, civic technologists, researchers, standards practitioners, browser-agent developers, and interested citizens.

## Useful contributions

- implementation reports from real public-policy sites;
- schema interoperability improvements;
- mappings to established civic/legal standards;
- WebMCP compatibility fixes as the draft evolves;
- provenance and attribution edge cases;
- accessibility improvements to the reference site;
- critiques of the profile's neutrality, safety, or practical implementability.

## Development

```bash
npm install
npm test
npm run build
npm run dev
```

Please keep the v0.1 core small. New publisher-specific capabilities generally belong in namespaced extension tools rather than the shared `civic_*` surface.
