import type { CivicDataset } from './types';

// The reference site intentionally uses fictional policy material. It demonstrates
// provenance and multi-perspective publishing without implying that the Henry Knox
// Institute has adopted these examples as organizational policy positions.
export const demoData: CivicDataset = {
  resources: [
    {
      id: 'housing-adus',
      resourceType: 'policy_proposal',
      title: 'By-Right Accessory Dwelling Units',
      summary:
        'An illustrative proposal allowing one accessory dwelling unit on qualifying residential lots through an administrative approval process, subject to health and safety rules.',
      publisher: { name: 'Knox Policy Lab' },
      jurisdiction: { type: 'illustrative', name: 'Example State' },
      publishedAt: '2026-08-29',
      updatedAt: '2026-08-29',
      status: 'proposed',
      topics: ['housing', 'land use', 'property rights', 'local government'],
      claims: [
        { id: 'housing-claim-mechanism', text: 'The proposal replaces discretionary approval for one qualifying accessory dwelling unit with an administrative approval path.', kind: 'fact', sourceIds: ['housing-draft-text'] },
        { id: 'housing-claim-supply', text: 'Supporters expect lower approval friction to increase the number of small, flexible housing units over time.', kind: 'projection', sourceIds: ['housing-support-memo'] },
        { id: 'housing-claim-local', text: 'Critics argue a statewide rule can reduce local discretion over infrastructure and neighborhood planning.', kind: 'analysis', sourceIds: ['housing-local-response'] },
      ],
      sourceIds: ['housing-draft-text', 'housing-support-memo', 'housing-local-response'],
      positionIds: ['housing-position-support', 'housing-position-local'],
      timelineIds: ['housing-timeline-draft', 'housing-timeline-hearing'],
      relatedResourceIds: ['licensing-recognition'],
      actionOpportunityIds: ['housing-hearing'],
      demo: true,
    },
    {
      id: 'licensing-recognition',
      resourceType: 'policy_proposal',
      title: 'Universal Recognition of Occupational Licenses',
      summary: 'An illustrative framework allowing qualified workers licensed in another U.S. jurisdiction to seek recognition without repeating substantially equivalent training requirements.',
      publisher: { name: 'Knox Policy Lab' },
      jurisdiction: { type: 'illustrative', name: 'Example State' },
      publishedAt: '2026-08-29', updatedAt: '2026-08-29', status: 'proposed',
      topics: ['occupational licensing', 'workforce mobility', 'economic opportunity'],
      claims: [
        { id: 'license-claim-mechanism', text: 'Applicants must remain in good standing and meet defined experience or equivalency criteria before recognition is granted.', kind: 'fact', sourceIds: ['license-draft-text'] },
        { id: 'license-claim-mobility', text: 'Supporters argue recognition can reduce delays for workers moving between states.', kind: 'analysis', sourceIds: ['license-support-memo'] },
        { id: 'license-claim-safety', text: 'Critics argue equivalency rules must be specific enough to preserve legitimate health and safety standards.', kind: 'analysis', sourceIds: ['license-safety-response'] },
      ],
      sourceIds: ['license-draft-text', 'license-support-memo', 'license-safety-response'],
      positionIds: ['license-position-support', 'license-position-safety'],
      timelineIds: ['license-timeline-draft'],
      relatedResourceIds: ['housing-adus', 'childcare-home'],
      actionOpportunityIds: [], demo: true,
    },
    {
      id: 'childcare-home', resourceType: 'policy_analysis', title: 'Expanding Home-Based Childcare Supply',
      summary: 'An illustrative analysis of regulatory options that could make it easier for small home-based childcare providers to enter the market while preserving baseline safety requirements.',
      publisher: { name: 'Knox Policy Lab' }, jurisdiction: { type: 'illustrative', name: 'Example State' },
      publishedAt: '2026-08-29', updatedAt: '2026-08-29', status: 'active',
      topics: ['childcare', 'small business', 'occupational regulation', 'family policy'],
      claims: [
        { id: 'childcare-claim-options', text: 'The analysis compares provider caps, zoning treatment, staff qualification rules, and streamlined licensing as separate policy levers.', kind: 'fact', sourceIds: ['childcare-analysis'] },
        { id: 'childcare-claim-tradeoff', text: 'The policy tradeoff is not simply regulation versus deregulation; different rules can impose very different costs while addressing different risks.', kind: 'analysis', sourceIds: ['childcare-analysis', 'childcare-safety-response'] },
      ],
      sourceIds: ['childcare-analysis', 'childcare-provider-response', 'childcare-safety-response'],
      positionIds: ['childcare-position-provider', 'childcare-position-safety'], timelineIds: ['childcare-timeline-roundtable'],
      relatedResourceIds: ['licensing-recognition'], actionOpportunityIds: ['childcare-roundtable'], demo: true,
    },
  ],
  sources: [
    { id: 'housing-draft-text', title: 'Illustrative ADU model language', sourceType: 'legal_text', publisher: { name: 'Knox Policy Lab' }, publicationDate: '2026-08-29', description: 'Demonstration legislative text defining the administrative approval mechanism and eligibility rules.', supportsClaimIds: ['housing-claim-mechanism'], demo: true },
    { id: 'housing-support-memo', title: 'Illustrative housing supply memorandum', sourceType: 'analysis', publisher: { name: 'Example Housing Coalition' }, publicationDate: '2026-08-20', description: 'Demonstration proponent analysis explaining the expected supply effects of reducing approval friction.', supportsClaimIds: ['housing-claim-supply'], demo: true },
    { id: 'housing-local-response', title: 'Illustrative local government response', sourceType: 'commentary', publisher: { name: 'Example Municipal Association' }, publicationDate: '2026-08-22', description: 'Demonstration critical perspective emphasizing local planning and infrastructure concerns.', supportsClaimIds: ['housing-claim-local'], demo: true },
    { id: 'license-draft-text', title: 'Illustrative license recognition model language', sourceType: 'legal_text', publisher: { name: 'Knox Policy Lab' }, publicationDate: '2026-08-29', description: 'Demonstration statutory language specifying eligibility, good standing, and recognition criteria.', supportsClaimIds: ['license-claim-mechanism'], demo: true },
    { id: 'license-support-memo', title: 'Illustrative workforce mobility memorandum', sourceType: 'analysis', publisher: { name: 'Example Workforce Coalition' }, publicationDate: '2026-08-18', description: 'Demonstration argument that recognition can reduce avoidable delays when licensed workers relocate.', supportsClaimIds: ['license-claim-mobility'], demo: true },
    { id: 'license-safety-response', title: 'Illustrative professional standards response', sourceType: 'commentary', publisher: { name: 'Example Professional Standards Council' }, publicationDate: '2026-08-21', description: 'Demonstration caution that equivalency criteria should remain clear for safety-sensitive occupations.', supportsClaimIds: ['license-claim-safety'], demo: true },
    { id: 'childcare-analysis', title: 'Illustrative home childcare regulatory analysis', sourceType: 'analysis', publisher: { name: 'Knox Policy Lab' }, publicationDate: '2026-08-29', description: 'Demonstration analysis separating distinct regulatory levers and their likely tradeoffs.', supportsClaimIds: ['childcare-claim-options', 'childcare-claim-tradeoff'], demo: true },
    { id: 'childcare-provider-response', title: 'Illustrative small-provider perspective', sourceType: 'commentary', publisher: { name: 'Example Home Childcare Network' }, publicationDate: '2026-08-24', description: 'Demonstration provider perspective focused on entry costs, zoning, and administrative burden.', supportsClaimIds: [], demo: true },
    { id: 'childcare-safety-response', title: 'Illustrative child safety perspective', sourceType: 'commentary', publisher: { name: 'Example Child Safety Council' }, publicationDate: '2026-08-25', description: 'Demonstration perspective focused on preserving risk-based safety safeguards.', supportsClaimIds: ['childcare-claim-tradeoff'], demo: true },
  ],
  positions: [
    { id: 'housing-position-support', resourceId: 'housing-adus', actor: { name: 'Example Housing Coalition' }, stance: 'support', summary: 'Supports a statewide administrative path as a way to expand small-scale housing choices.', sourceIds: ['housing-support-memo'], demo: true },
    { id: 'housing-position-local', resourceId: 'housing-adus', actor: { name: 'Example Municipal Association' }, stance: 'mixed', summary: 'Supports ADUs in principle but argues implementation should preserve more local control.', sourceIds: ['housing-local-response'], demo: true },
    { id: 'license-position-support', resourceId: 'licensing-recognition', actor: { name: 'Example Workforce Coalition' }, stance: 'support', summary: 'Supports broad recognition for workers in good standing who satisfy equivalency criteria.', sourceIds: ['license-support-memo'], demo: true },
    { id: 'license-position-safety', resourceId: 'licensing-recognition', actor: { name: 'Example Professional Standards Council' }, stance: 'mixed', summary: 'Supports mobility but wants occupation-specific safeguards for safety-sensitive professions.', sourceIds: ['license-safety-response'], demo: true },
    { id: 'childcare-position-provider', resourceId: 'childcare-home', actor: { name: 'Example Home Childcare Network' }, stance: 'support', summary: 'Supports simplifying entry and zoning rules for small home-based providers.', sourceIds: ['childcare-provider-response'], demo: true },
    { id: 'childcare-position-safety', resourceId: 'childcare-home', actor: { name: 'Example Child Safety Council' }, stance: 'mixed', summary: 'Supports targeted simplification but favors preserving rules tied directly to demonstrated safety risks.', sourceIds: ['childcare-safety-response'], demo: true },
  ],
  timeline: [
    { id: 'housing-timeline-draft', resourceId: 'housing-adus', date: '2026-08-15', label: 'Draft released', description: 'Illustrative model language released for public discussion.', sourceIds: ['housing-draft-text'], demo: true },
    { id: 'housing-timeline-hearing', resourceId: 'housing-adus', date: '2026-09-08', label: 'Illustrative committee hearing', description: 'Demonstration event showing how upcoming civic participation can be represented.', sourceIds: ['housing-draft-text'], demo: true },
    { id: 'license-timeline-draft', resourceId: 'licensing-recognition', date: '2026-08-19', label: 'Model framework published', description: 'Illustrative recognition framework published for review.', sourceIds: ['license-draft-text'], demo: true },
    { id: 'childcare-timeline-roundtable', resourceId: 'childcare-home', date: '2026-09-12', label: 'Illustrative stakeholder roundtable', description: 'Demonstration roundtable with providers, parents, and safety advocates.', sourceIds: ['childcare-analysis'], demo: true },
  ],
  actionOpportunities: [
    { id: 'housing-hearing', resourceId: 'housing-adus', actionType: 'hearing', title: 'Illustrative public hearing on ADU proposal', description: 'Demonstration-only hearing entry. A real publisher should link directly to the authoritative government notice.', startsAt: '2026-09-08T13:30:00-06:00', jurisdiction: { type: 'illustrative', name: 'Example State' }, sourceIds: ['housing-draft-text'], demo: true },
    { id: 'childcare-roundtable', resourceId: 'childcare-home', actionType: 'information_session', title: 'Illustrative childcare policy roundtable', description: 'Demonstration-only public information session showing how participation opportunities can be exposed without automating political persuasion.', startsAt: '2026-09-12T10:00:00-06:00', jurisdiction: { type: 'illustrative', name: 'Example State' }, sourceIds: ['childcare-analysis'], demo: true },
  ],
};
