import './styles.css';
import { demoData } from './demoData';
import { CivicRegistry } from './registry';
import { createCivicTools, registerCivicWebMCP } from './webmcp';
import type { CivicResource } from './types';

const registry = new CivicRegistry(demoData);
const app = document.querySelector<HTMLDivElement>('#app');
if (!app) throw new Error('Missing #app');

let activeResourceId = demoData.resources[0]?.id ?? '';
let visibleResourceIds = demoData.resources.map((resource) => resource.id);

const escapeHtml = (value: string) =>
  value.replace(/[&<>'"]/g, (character) => {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;',
    };
    return entities[character];
  });

const badge = (value: string) =>
  `<span class="badge">${escapeHtml(value.replaceAll('_', ' '))}</span>`;

const toolDescriptions = [
  ['civic_search', 'Discover policy resources by topic, jurisdiction, type, date, or keyword.'],
  ['civic_get_resource', 'Retrieve one policy resource with typed claims, context, and provenance.'],
  ['civic_get_sources', 'Separate primary material, empirical evidence, official data, analysis, and commentary.'],
  ['civic_get_positions', 'Return clearly attributed perspectives instead of flattening disagreement into prose.'],
  ['civic_get_timeline', 'Expose legislative, regulatory, historical, and implementation events in order.'],
  ['civic_get_related', 'Connect a resource to related bills, studies, organizations, issues, and events.'],
  ['civic_get_action_opportunities', 'Surface hearings, comment periods, meetings, and deadlines without automating civic action.'],
] as const;

const renderResourceCard = (resource: CivicResource) => `
  <button class="resource-card ${resource.id === activeResourceId ? 'active' : ''}" data-resource-id="${resource.id}">
    <div class="resource-card-topline">${badge(resource.resourceType)}${badge(resource.status)}</div>
    <h3>${escapeHtml(resource.title)}</h3>
    <p>${escapeHtml(resource.summary)}</p>
    <div class="topic-row">${resource.topics.slice(0, 3).map(badge).join('')}</div>
  </button>
`;

const render = () => {
  const active = registry.getResource(activeResourceId) ?? demoData.resources[0];
  if (!active) return;

  const visible = visibleResourceIds
    .map((id) => registry.getResource(id))
    .filter((item): item is CivicResource => Boolean(item));
  const sources = registry.getSources(active.id);
  const positions = registry.getPositions(active.id);
  const timeline = registry.getTimeline(active.id);
  const opportunities = registry.getActionOpportunities(active.id);
  const toolNames = createCivicTools(registry).map((tool) => tool.name);
  const webMcpAvailable = Boolean(document.modelContext);

  app.innerHTML = `
    <header class="site-header" id="top">
      <a class="brand" href="#top" aria-label="PolicyMCP home">
        <span class="brand-mark">P</span>
        <span><strong>PolicyMCP</strong><small>Civic WebMCP by the Henry Knox Institute</small></span>
      </a>
      <nav aria-label="Primary navigation">
        <a href="#why">Why it matters</a>
        <a href="#tools">The profile</a>
        <a href="#policy-lab">Demo</a>
        <a href="https://github.com/knoxinstitute/civic-webmcp">GitHub</a>
      </nav>
    </header>

    <main>
      <section class="hero">
        <div>
          <p class="eyebrow">Open infrastructure for public policy in the agentic web</p>
          <h1>Make public policy legible to people and AI.</h1>
          <p class="lede">PolicyMCP is the public home of <strong>Civic WebMCP</strong>, an open profile for publishing policy information with explicit provenance, attributed disagreement, timelines, and civic participation opportunities through WebMCP.</p>
          <div class="hero-actions">
            <a class="primary-action" href="https://github.com/knoxinstitute/civic-webmcp/blob/main/PROFILE.md">Read Profile v0.1</a>
            <a class="secondary-action" href="#policy-lab">Explore the live reference implementation</a>
          </div>
          <p class="site-kicker">Open source · MIT licensed · initiated by the Henry Knox Institute</p>
        </div>
        <aside class="agent-card" aria-label="WebMCP status">
          <p class="agent-card-label">Live agent interface</p>
          <div class="status-line"><span class="status-dot ${webMcpAvailable ? 'available' : ''}"></span><strong>${webMcpAvailable ? 'WebMCP detected' : 'WebMCP not detected'}</strong></div>
          <p>${webMcpAvailable ? 'This page has registered the Civic WebMCP tools with your browser.' : 'The website works normally for humans. In a WebMCP-enabled browser, the same published policy data becomes a structured agent interface.'}</p>
          <div class="tool-list">${toolNames.map((name) => `<code>${name}</code>`).join('')}</div>
        </aside>
      </section>

      <section class="why-section" id="why">
        <div class="why-copy">
          <p class="eyebrow">Why PolicyMCP</p>
          <h2>AI should make civic knowledge easier to inspect, not harder to trust.</h2>
          <p>Policy pages routinely mix legal text, factual claims, projections, evidence, institutional analysis, value judgments, opposing perspectives, and public deadlines into one stream of prose. Humans can often infer those distinctions. Agents should not have to guess.</p>
          <p>Civic WebMCP gives publishers a small, interoperable way to make those semantics explicit while keeping the public website—not an opaque AI database—as the source of record.</p>
        </div>
        <div class="value-grid">
          <article class="value-card"><span>01</span><h3>For publishers</h3><p>Publish once for humans and expose the same first-party knowledge to browser agents through structured tools.</p></article>
          <article class="value-card"><span>02</span><h3>For agents</h3><p>Retrieve sources, claims, perspectives, timelines, and relationships without screen scraping or inventing missing context.</p></article>
          <article class="value-card"><span>03</span><h3>For the public</h3><p>Ask better questions while preserving provenance, visible disagreement, and deliberate human civic agency.</p></article>
        </div>
      </section>

      <section class="tool-section" id="tools">
        <div class="section-heading">
          <div><p class="eyebrow">Civic WebMCP Profile v0.1</p><h2>Seven tools. One shared civic vocabulary.</h2></div>
          <p>The profile is intentionally small. It complements existing civic and legal data standards and defines the agent interaction layer for a live public website.</p>
        </div>
        <div class="tool-grid">
          ${toolDescriptions.map(([name, description]) => `<article class="tool-card"><code>${name}</code><p>${description}</p></article>`).join('')}
        </div>
      </section>

      <section class="principles-wrap">
        <div class="section-heading compact"><div><p class="eyebrow">Publishing principles</p><h2>Transparency is part of the interface.</h2></div></div>
        <div class="principles-band" aria-label="Civic WebMCP principles"><span>Provenance before persuasion</span><span>Facts ≠ analysis ≠ values</span><span>Disagreement is data</span><span>Humans retain civic agency</span><span>The open web remains the source of record</span></div>
      </section>

      <section class="lab" id="policy-lab">
        <div class="lab-heading">
          <div>
            <p class="eyebrow">Working reference implementation</p>
            <h2>Knox Policy Lab</h2>
            <p>The content below is <strong>fictional demonstration data</strong>. It illustrates the Civic WebMCP data model and should not be interpreted as an official Henry Knox Institute policy position.</p>
          </div>
          <label class="search-box"><span>Search policy resources</span><input id="policy-search" type="search" placeholder="Try “housing” or “mobility”" /></label>
        </div>
        <div class="lab-grid">
          <div class="resource-list" aria-live="polite">${visible.length ? visible.map(renderResourceCard).join('') : '<p class="empty-state">No resources match that search.</p>'}</div>
          <article class="resource-detail">
            <div class="resource-card-topline">${badge(active.resourceType)} ${badge(active.status)} ${badge(active.jurisdiction.name)}</div>
            <h2>${escapeHtml(active.title)}</h2>
            <p class="detail-summary">${escapeHtml(active.summary)}</p>
            <section><h3>Claims, explicitly typed</h3><div class="claim-list">${active.claims.map((claim) => `<div class="claim">${badge(claim.kind)}<p>${escapeHtml(claim.text)}</p><small>Source IDs: ${claim.sourceIds.map(escapeHtml).join(', ')}</small></div>`).join('')}</div></section>
            <section><h3>Sources & provenance</h3>${sources.map((source) => `<div class="evidence-row"><div>${badge(source.sourceType)}</div><div><strong>${escapeHtml(source.title)}</strong><p>${escapeHtml(source.description)}</p><small>${escapeHtml(source.publisher.name)}</small></div></div>`).join('')}</section>
            <section><h3>Attributed perspectives</h3><div class="position-grid">${positions.map((position) => `<div class="position-card">${badge(position.stance)}<strong>${escapeHtml(position.actor.name)}</strong><p>${escapeHtml(position.summary)}</p></div>`).join('')}</div></section>
            <section><h3>Timeline</h3><ol class="timeline">${timeline.map((event) => `<li><time>${escapeHtml(event.date)}</time><div><strong>${escapeHtml(event.label)}</strong><p>${escapeHtml(event.description)}</p></div></li>`).join('')}</ol></section>
            <section><h3>Public participation</h3>${opportunities.length ? opportunities.map((item) => `<div class="opportunity">${badge(item.actionType)}<strong>${escapeHtml(item.title)}</strong><p>${escapeHtml(item.description)}</p></div>`).join('') : '<p class="muted">No participation opportunities are currently published for this resource.</p>'}</section>
          </article>
        </div>
      </section>

      <section class="prompt-section">
        <p class="eyebrow">What becomes possible</p>
        <h2>Ask the website, not just the model.</h2>
        <div class="prompt-grid"><blockquote>“Which parts of this proposal are in the policy text, and which are analysis?”</blockquote><blockquote>“What are the strongest attributed perspectives on the other side?”</blockquote><blockquote>“What sources support the claim about housing supply?”</blockquote><blockquote>“Is there an upcoming public hearing or comment opportunity?”</blockquote></div>
      </section>

      <section class="closing-section">
        <p class="eyebrow">An open civic good</p>
        <h2>Help define the policy web for an age of human-agent collaboration.</h2>
        <p>Civic WebMCP is experimental, public, and intentionally small enough to implement. Think tanks, government agencies, universities, newsrooms, legislative services, and civic organizations are invited to test the profile and help improve it.</p>
        <div class="hero-actions"><a class="primary-action" href="https://github.com/knoxinstitute/civic-webmcp">View on GitHub</a><a class="secondary-action" href="https://github.com/knoxinstitute/civic-webmcp/blob/main/CONTRIBUTING.md">Contribute</a></div>
      </section>
    </main>

    <footer>
      <p><strong>PolicyMCP</strong> · Public home of the Civic WebMCP project.</p>
      <p>An open civic technology initiative of the Henry Knox Institute · MIT licensed · <a href="https://github.com/knoxinstitute/civic-webmcp">GitHub</a></p>
    </footer>
  `;

  app.querySelectorAll<HTMLButtonElement>('[data-resource-id]').forEach((button) => {
    button.addEventListener('click', () => {
      activeResourceId = button.dataset.resourceId ?? activeResourceId;
      render();
      document.querySelector('#policy-lab')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  const search = app.querySelector<HTMLInputElement>('#policy-search');
  search?.addEventListener('input', () => {
    visibleResourceIds = registry.search({ query: search.value, limit: 50 }).map((resource) => resource.id);
    const searchValue = search.value;
    render();
    const restored = app.querySelector<HTMLInputElement>('#policy-search');
    if (restored) {
      restored.value = searchValue;
      restored.focus();
      restored.setSelectionRange(searchValue.length, searchValue.length);
    }
  });
};

render();

if (document.modelContext) {
  const controller = new AbortController();
  registerCivicWebMCP({
    modelContext: document.modelContext,
    registry,
    signal: controller.signal,
    hooks: {
      onSearchResults: (ids) => {
        visibleResourceIds = ids;
        render();
      },
      onResourceSelected: (id) => {
        activeResourceId = id;
        render();
      },
    },
  })
    .then(() => render())
    .catch((error) => console.warn('[Civic WebMCP] Tool registration failed', error));
}
