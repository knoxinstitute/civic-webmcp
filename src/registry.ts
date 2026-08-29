import type { CivicActionOpportunity, CivicDataset, CivicPosition, CivicResource, CivicSource, CivicTimelineEvent, ResourceStatus, ResourceType } from './types';

export interface CivicSearchInput { query?: string; topic?: string; jurisdiction?: string; resourceType?: ResourceType; status?: ResourceStatus; limit?: number; }

const includesInsensitive = (value: string, query: string) => value.toLocaleLowerCase().includes(query.toLocaleLowerCase());

export class CivicRegistry {
  constructor(private readonly dataset: CivicDataset) {}

  search(input: CivicSearchInput = {}): CivicResource[] {
    const { query, topic, jurisdiction, resourceType, status } = input;
    const limit = Math.min(Math.max(input.limit ?? 10, 1), 50);
    return this.dataset.resources.filter((resource) => {
      if (resourceType && resource.resourceType !== resourceType) return false;
      if (status && resource.status !== status) return false;
      if (jurisdiction && !includesInsensitive(resource.jurisdiction.name, jurisdiction)) return false;
      if (topic && !resource.topics.some((value) => includesInsensitive(value, topic))) return false;
      if (query) {
        const haystack = [resource.title, resource.summary, resource.jurisdiction.name, ...resource.topics, ...resource.claims.map((claim) => claim.text)].join(' ');
        if (!includesInsensitive(haystack, query)) return false;
      }
      return true;
    }).slice(0, limit);
  }

  getResource(id: string): CivicResource | undefined { return this.dataset.resources.find((resource) => resource.id === id); }
  getSources(resourceId: string): CivicSource[] { const resource = this.requireResource(resourceId); return resource.sourceIds.map((id) => this.dataset.sources.find((source) => source.id === id)).filter((source): source is CivicSource => Boolean(source)); }
  getPositions(resourceId: string): CivicPosition[] { this.requireResource(resourceId); return this.dataset.positions.filter((position) => position.resourceId === resourceId); }
  getTimeline(resourceId: string): CivicTimelineEvent[] { this.requireResource(resourceId); return this.dataset.timeline.filter((event) => event.resourceId === resourceId).sort((a,b) => a.date.localeCompare(b.date)); }
  getRelated(resourceId: string): CivicResource[] { const resource = this.requireResource(resourceId); return resource.relatedResourceIds.map((id) => this.getResource(id)).filter((item): item is CivicResource => Boolean(item)); }
  getActionOpportunities(resourceId?: string): CivicActionOpportunity[] { if (!resourceId) return [...this.dataset.actionOpportunities]; this.requireResource(resourceId); return this.dataset.actionOpportunities.filter((item) => item.resourceId === resourceId); }
  private requireResource(resourceId: string): CivicResource { const resource = this.getResource(resourceId); if (!resource) throw new Error(`Unknown civic resource: ${resourceId}`); return resource; }
}
