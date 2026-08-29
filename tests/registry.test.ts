import { describe, expect, it } from 'vitest';
import { demoData } from '../src/demoData';
import { CivicRegistry } from '../src/registry';

const registry = new CivicRegistry(demoData);

describe('CivicRegistry', () => {
  it('searches across topics and claim text', () => {
    expect(registry.search({ query: 'housing' }).map((item) => item.id)).toContain('housing-adus');
    expect(registry.search({ query: 'equivalency' }).map((item) => item.id)).toContain('licensing-recognition');
  });
  it('filters by topic and status', () => { const results = registry.search({ topic: 'childcare', status: 'active' }); expect(results).toHaveLength(1); expect(results[0]?.id).toBe('childcare-home'); });
  it('returns provenance sources in resource order', () => { expect(registry.getSources('housing-adus').map((source) => source.id)).toEqual(['housing-draft-text','housing-support-memo','housing-local-response']); });
  it('throws for unknown resource IDs on scoped calls', () => { expect(() => registry.getPositions('missing')).toThrow('Unknown civic resource'); });
});
