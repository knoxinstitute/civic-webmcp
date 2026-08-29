import { describe, expect, it, vi } from 'vitest';
import { demoData } from '../src/demoData';
import { CivicRegistry } from '../src/registry';
import { createCivicTools, registerCivicWebMCP, type ModelContextLike } from '../src/webmcp';

const registry = new CivicRegistry(demoData);

describe('Civic WebMCP tools', () => {
  it('publishes the v0.1 seven-tool profile', () => { expect(createCivicTools(registry).map((tool) => tool.name)).toEqual(['civic_search','civic_get_resource','civic_get_sources','civic_get_positions','civic_get_timeline','civic_get_related','civic_get_action_opportunities']); });
  it('returns typed claims and updates the shared UI context hook', async () => { const onResourceSelected = vi.fn(); const tool = createCivicTools(registry,{onResourceSelected}).find((candidate)=>candidate.name==='civic_get_resource'); const result = await tool!.execute({resourceId:'housing-adus'}) as {data:{id:string;claims:Array<{kind:string}>}}; expect(result.data.id).toBe('housing-adus'); expect(result.data.claims.map((claim)=>claim.kind)).toContain('projection'); expect(onResourceSelected).toHaveBeenCalledWith('housing-adus'); });
  it('registers every tool with the supplied lifecycle signal', async () => { const registerTool = vi.fn(async()=>undefined); const modelContext: ModelContextLike = {registerTool}; const controller = new AbortController(); await registerCivicWebMCP({modelContext,registry,signal:controller.signal}); expect(registerTool).toHaveBeenCalledTimes(7); for (const call of registerTool.mock.calls) expect(call[1]).toEqual({signal:controller.signal}); });
  it('marks every v0.1 tool as read-only and third-party-content aware', () => { for (const tool of createCivicTools(registry)) { expect(tool.annotations?.readOnlyHint).toBe(true); expect(tool.annotations?.untrustedContentHint).toBe(true); } });
});
