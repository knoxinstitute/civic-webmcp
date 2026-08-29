# Provenance model

Civic WebMCP treats provenance as a graph between **resources**, **claims**, and **sources**.

## Claim taxonomy

A claim has one of four kinds:

- **fact** — an assertion presented as directly verifiable from a source or observed state;
- **analysis** — interpretation, synthesis, causal reasoning, or comparison;
- **projection** — an expectation or forecast about a future or counterfactual outcome;
- **value_judgment** — a normative judgment about what should be preferred, protected, prioritized, or traded off.

The taxonomy describes the publisher's role for the statement. It does not certify that the statement is correct.

## Source taxonomy

v0.1 defines:

- **primary** — first-party source material not better described as legal text or official data;
- **legal_text** — legislation, regulation, ordinance, court text, model legislation, or similar legal material;
- **empirical** — research reporting empirical methods or findings;
- **official_data** — public data published by a responsible authority;
- **analysis** — interpretive research, modeling, policy analysis, or synthesis;
- **commentary** — argument, testimony, organizational response, editorial material, or other perspective content.

## Example

```json
{
  "id": "claim-17",
  "text": "Supporters expect faster permitting to increase housing production over time.",
  "kind": "projection",
  "sourceIds": ["source-proponent-model"]
}
```

The important outcome is that an agent can say:

> “The permit change is in the draft legal text. The housing-production effect is a projection from the proponent's model.”

instead of flattening both statements into the same epistemic category.

## Publisher attribution

Every resource, source, and position should identify its publisher or actor. Publishers should preserve external authorship rather than importing an outside argument into their own institutional voice.

## Demonstration data

Synthetic or demonstration content MUST carry `demo: true`. Reference implementations should also disclose the synthetic nature of the dataset visibly to human readers.
