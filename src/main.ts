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
    const entities: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' };
    return entities[character];
  });

const badge = (value: string) => `<span class="badge">${escapeHtml(value.replaceAll('_', ' '))}</span>`;

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
  const visible = visibleResourceIds.map((id) => registry.getResource(id)).filter((item): item is CivicResource => Boolean(item));
  const sources = registry.getSources(active.id);
  const positions = registry.getPositions(active.id);
  const timeline = registry.getTimeline(active.id);
  const opportunities = registry.getActionOpportunities(active.id);
  const toolNames = createCivicTools(registry).map((tool) => tool.name);
  const webMcpAvailable = Boolean(document.modelContext);

  app.innerHTML = `
    <header class="site-header">
      <a class="brand" href="#" aria-label="Civic WebMCP home"><span class="brand-mark">K</span><span><strong>Civic WebMCP</strong><small>Knox Policy Lab</small></span></a>
      <nav><a href="https://github.com/knoxinstitute/civic-webmcp">GitHub</a><a href="https://github.com/knoxinstitute/civic-webmcp/blob/main/PROFILE.md">Profile v0.1</a></nav>
    </header>
    <main>
      <section class="hero">
        <div>
          <p class="eyebrow">Open civic infrastructure for the agentic web</p>
          <h1>Policy information humans and AI can interrogate together.</h1>
          <p class="lede">Civic WebMCP is an open profile for publishing policy resources with explicit provenance, attributed disagreement, timelines, and public participation opportunities through the browser-native WebMCP interface.</p>
          <div class="hero-actions"><a class="primary-action" href="https://github.com/knoxinstitute/civic-webmcp">View the open source project</a><a class="secondary-action" href="#policy-lab">Explore the reference implementation</a></div>
        </div>
        <aside class="agent-card">
          <div class="status-line"><span class="status-dot ${webMcpAvailable ? 'available' : ''}"></span><strong>${webMcpAvailable ? 'WebMCP detected' : 'WebMCP not detected'}</strong></div>
          <p>${webMcpAvailable ? 'This page has registered its civic tools with your browser.' : 'The human website still works normally. In a WebMCP-enabled browser, the same policy data is exposed as structured tools.'}</p>
          <div class="tool-list">${toolNames.map((name) => `<code>${name}</code>`).join('')}</div>
        </aside>
      </section>
      <section class="principles-band" aria-label="Civic WebMCP principles"><span>Provenance before persuasion</span><span>Facts ≠ analysis ≠ values</span><span>Disagreement is data</span><span>Humans retain civic agency</span><span>The open web remains the source of record</span></section>
      <section class="lab" id="policy-lab">
        <div class="lab-heading"><div><p class="eyebrow">Reference implementation</p><h2>Knox Policy Lab</h2><p>The content below is <strong>fictional demonstration data</strong>. It illustrates the Civic WebMCP data model and should not be interpreted as an official Henry Knox Institute policy position.</p></div><label class="search-box"><span>Search policy resources</span><input id="policy-search" type="search" placeholder="Try “housing” or “mobility”" /></label></div>
        <div class="lab-grid">
          <div class="resource-list" aria-live="polite">${visible.length ? visible.map(renderResourceCard).join('') : '<p class="empty-state">No resources match that search.</p>'}</div>
          <article class="resource-detail">
            <div class="resource-card-topline">${badge(active.resourceType)} ${badge(active.status)} ${badge(active.jurisdiction.name)}</div>
            <h2>${escapeHtml(active.title)}</h2><p class="detail-summary">${escapeHtml(active.summary)}</p>
            <section><h3>Claims, explicitly typed</h3><div class="claim-list">${active.claims.map((claim) => `<div class="claim">${badge(claim.kind)}<p>${escapeHtml(claim.text)}</p><small>Source IDs: ${claim.sourceIds.map(escapeHtml).join(', ')}</small></div>`).join('')}</div></section>
            <section><h3>Sources & provenance</h3>${sources.map((source) => `<div class="evidence-row"><div>${badge(source.sourceType)}</div><div><strong>${escapeHtml(source.title)}</strong><p>${escapeHtml(source.description)}</p><small>${escapeHtml(source.publisher.name)}</small></div></div>`).join('')}</section>
            <section><h3>Attributed perspectives</h3><div class="position-grid">${positions.map((position) => `<div class="position-card">${badge(position.stance)}<strong>${escapeHtml(position.actor.name)}</strong><p>${escapeHtml(position.summary)}</p></div>`).join('')}</div></section>
            <section><h3>Timeline</h3><ol class="timeline">${timeline.map((event) => `<li><time>${escapeHtml(event.date)}</time><div><strong>${escapeHtml(event.label)}</strong><p>${escapeHtml(event.description)}</p></div></li>`).join('')}</ol></section>
            <section><h3>Public participation</h3>${opportunities.length ? opportunities.map((item) => `<div class="opportunity">${badge(item.actionType)}<strong>${escapeHtml(item.title)}</strong><p>${escapeHtml(item.description)}</p></div>`).join('') : '<p class="muted">No participation opportunities are currently published for this resource.</p>'}</section>
          </article>
        </div>
      </section>
      <section class="prompt-section"><p class="eyebrow">Try it with an agent</p><h2>Questions the page can answer structurally</h2><div class="prompt-grid"><blockquote>“Which parts of this proposal are in the policy text, and which are analysis?”</blockquote><blockquote>“What are the strongest attributed perspectives on the other side?”</blockquote><blockquote>“What sources support the claim about housing supply?”</blockquote><blockquote>“Is there an upcoming public hearing or comment opportunity?”</blockquote></div></section>
    </main>
    <footer><p><strong>Civic WebMCP v0.1</strong> · An open civic technology project from the Henry Knox Institute.</p><p>MIT licensed · Built on the draft WebMCP API at <code>document.modelContext</code>.</p></footer>
  `;

  app.querySelectorAll<HTMLButtonElement>('[data-resource-id]').forEach((button) => {
    button.addEventListener('click', () => { activeResourceId = button.dataset.resourceId ?? activeResourceId; render(); document.querySelector('#policy-lab')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); });
  });
  const search = app.querySelector<HTMLInputElement>('#policy-search');
  search?.addEventListener('input', () => {
    visibleResourceIds = registry.search({ query: search.value, limit: 50 }).map((resource) => resource.id);
    const searchValue = search.value;
    render();
    const restored = app.querySelector<HTMLInputElement>('#policy-search');
    if (restored) { restored.value = searchValue; restored.focus(); restored.setSelectionRange(searchValue.length, searchValue.length); }
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
      onSearchResults: (ids) => { visibleResourceIds = ids; render(); },
      onResourceSelected: (id) => { activeResourceId = id; render(); },
    },
  }).then(() => render()).catch((error) => console.warn('[Civic WebMCP] Tool registration failed', error));
}
