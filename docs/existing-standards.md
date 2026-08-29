# Relationship to existing civic standards

Civic WebMCP is an **agent interaction profile**, not a replacement ontology for civic data or legal documents.

Publishers should reuse established standards where they fit and map them into the Civic WebMCP surface.

## Open Civic Data

Open Civic Data provides interoperable models for civic entities such as jurisdictions, people, organizations, bills, votes, and events.

- https://opencivicdata.org/
- https://github.com/opencivicdata/

A publisher can use Open Civic Data IDs and objects behind `civic_get_resource`, `civic_get_timeline`, and related tools.

## Popolo

Popolo defines open specifications for people and organizations in civic systems.

- https://www.popoloproject.com/

Civic WebMCP can reference Popolo-compatible actors in publisher, organization, and position metadata.

## Schema.org Legislation

Schema.org includes `Legislation` and related structured web vocabulary.

- https://schema.org/Legislation

A policy website can continue emitting JSON-LD for crawlers and search engines while exposing richer interactive capabilities through WebMCP.

## Akoma Ntoso

Akoma Ntoso is an OASIS standard for machine-readable parliamentary, legislative, and judicial documents.

- https://www.oasis-open.org/standard/akn-v1-0/

A publisher using Akoma Ntoso can expose its canonical legal document identifiers and provisions through Civic WebMCP without replacing the underlying legal document format.

## Why another profile is useful

Existing standards primarily describe civic entities, documents, and relationships. WebMCP adds a browser-native interaction surface. Civic WebMCP specifies a small shared vocabulary for the questions agents repeatedly need to ask policy publishers:

- What resources do you have?
- What exactly is this resource?
- Which statements are source text versus analysis or projection?
- What sources support the claims?
- Who holds attributed positions?
- What happened when?
- What does the publisher say is related?
- Is there a legitimate public participation opportunity?
