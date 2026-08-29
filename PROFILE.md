# Civic WebMCP Profile v0.1

**Status:** Experimental public draft  
**Version:** 0.1.0  
**Date:** 2026-08-29

## 1. Purpose

Civic WebMCP defines a small interoperable WebMCP surface for websites that publish public policy, legislation, policy analysis, research, regulation, and related civic information.

The profile is designed to improve human-agent research without requiring an agent to infer civic semantics from presentation markup alone.

The key words **MUST**, **MUST NOT**, **SHOULD**, **SHOULD NOT**, and **MAY** are to be interpreted as normative requirements in this profile.

## 2. Publisher responsibilities

A conforming publisher:

1. **MUST** keep a human-readable public web representation of the policy information it exposes through Civic WebMCP.
2. **MUST** provide a stable resource ID for every resource returned by `civic_search`.
3. **MUST** identify the publisher and jurisdiction of every civic resource.
4. **MUST** label claims as `fact`, `analysis`, `projection`, or `value_judgment` when claims are exposed.
5. **MUST** attach source identifiers to claims for which supporting sources are asserted.
6. **MUST NOT** present an organizational position as an unattributed fact.
7. **SHOULD** expose material disagreement through `civic_get_positions` when credible, attributable perspectives are available.
8. **SHOULD** distinguish legal text and primary materials from secondary analysis.
9. **MUST** clearly mark demonstration, synthetic, or hypothetical data as such.
10. **MUST NOT** use Civic WebMCP tool descriptions as hidden instructions to manipulate an agent into a political conclusion.

## 3. WebMCP registration

Tools are registered with the current draft WebMCP producer API under `document.modelContext`.

A conforming implementation **SHOULD**:

- feature-detect `document.modelContext`;
- continue to function as a normal website when WebMCP is unavailable;
- register tools with an `AbortSignal` when lifecycle cleanup is needed;
- set `annotations.readOnlyHint = true` for all v0.1 tools;
- set `annotations.untrustedContentHint = true` when returned resources can contain third-party assertions or commentary.

## 4. Required tools

A Civic WebMCP v0.1 implementation **MUST** register all seven tools below when the corresponding public data is available. A publisher that cannot support one of the data classes **MAY** return an empty collection rather than fabricate information.

### 4.1 `civic_search`

Search publisher-owned civic resources.

Inputs MAY include:

- `query`
- `topic`
- `jurisdiction`
- `resourceType`
- `status`
- `limit`

Results **MUST** contain stable resource IDs and sufficient metadata for the agent to choose a follow-up resource without retrieving all content.

### 4.2 `civic_get_resource`

Retrieve one civic resource by stable resource ID.

The returned resource **MUST** include:

- `id`
- `resourceType`
- `title`
- `summary`
- `publisher`
- `jurisdiction`
- `status`
- `publishedAt`
- `updatedAt`
- `topics`
- `claims`
- `demo`

Claims **SHOULD** use the profile claim taxonomy:

- `fact`
- `analysis`
- `projection`
- `value_judgment`

### 4.3 `civic_get_sources`

Return sources associated with a resource.

Sources **MUST** expose a `sourceType`. v0.1 defines:

- `primary`
- `legal_text`
- `empirical`
- `official_data`
- `analysis`
- `commentary`

A source **SHOULD** identify which claim IDs it supports when that relationship is known.

### 4.4 `civic_get_positions`

Return attributed positions and perspectives.

Positions **MUST** identify the actor and source IDs and use one of:

- `support`
- `oppose`
- `mixed`
- `neutral_analysis`

The existence of this tool does not require a publisher to manufacture false balance. It exists so real disagreement can be represented explicitly when it exists.

### 4.5 `civic_get_timeline`

Return dated policy events associated with the resource.

Events **SHOULD** identify supporting source IDs and **MUST** use machine-readable dates.

### 4.6 `civic_get_related`

Return resources the publisher explicitly relates to the current resource.

An implementation **MUST NOT** claim a publisher-endorsed relationship merely because an embedding model or agent inferred similarity. Inferred relationships should be clearly identified as inferred outside this profile.

### 4.7 `civic_get_action_opportunities`

Return published opportunities for human civic participation, including:

- hearings;
- public-comment periods;
- meetings;
- deadlines;
- information sessions.

The v0.1 tool is informational and read-only. It **MUST NOT** automatically submit comments, contact officials, register political preferences, or perform other consequential civic actions on the user's behalf.

## 5. Common result envelope

Implementations **SHOULD** return a common envelope:

```json
{
  "civicWebMcpProfile": "0.1.0",
  "generatedAt": "2026-08-29T12:00:00.000Z",
  "data": {}
}
```

The WebMCP draft serializes the JavaScript return value of a tool execution. A Civic WebMCP implementation therefore MAY return ordinary structured JavaScript objects rather than an MCP-specific content envelope.

## 6. Resource identity

Resource IDs **MUST** be stable within a publisher's origin. Publishers **SHOULD** avoid database IDs that are likely to change during migration.

Recommended patterns include:

```text
housing/adu-by-right
legislation/co/hb-1234/2027
analysis/licensing/universal-recognition
```

## 7. Provenance

Provenance is a first-class requirement, not optional metadata.

A publisher **SHOULD** allow an agent to answer:

- Is this statement in the underlying legal text?
- Is it an empirical finding?
- Is it the publisher's analysis?
- Is it a projection?
- Is it an attributed outside perspective?
- What source supports it?
- When was that source published or updated?

See `docs/provenance.md`.

## 8. Human-agent coherence

A WebMCP execution MAY update the visible page when doing so helps the human and agent maintain shared context.

Examples:

- `civic_search` filters the visible policy list to the returned results.
- `civic_get_resource` navigates or selects the corresponding human-readable resource.

A tool **SHOULD NOT** unexpectedly navigate away from a page or hide material information merely to optimize the agent experience.

## 9. Privacy and safety

Civic WebMCP v0.1 is designed for public information.

A conforming v0.1 implementation **SHOULD NOT** expose private constituent data, voter files, private donor records, individualized political targeting data, or other non-public personal information through these tools.

## 10. Extension model

Publishers MAY define additional tools. Custom tools SHOULD use a publisher namespace if they are not part of this profile, for example:

```text
knox_compare_principles
city_lookup_zoning_case
publisher_get_fiscal_model
```

Custom tools MUST NOT reuse a `civic_*` name defined by a different version of this profile with incompatible semantics.

## 11. Versioning

Until a 1.0 release, breaking changes MAY occur between minor versions. Implementations SHOULD expose the profile version in every result envelope.
