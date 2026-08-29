import type { CivicRegistry, CivicSearchInput } from './registry';
import { CIVIC_WEBMCP_PROFILE } from './types';

export interface ModelContextTool {
  name: string;
  title?: string;
  description: string;
  inputSchema?: Record<string, unknown>;
  annotations?: {
    readOnlyHint?: boolean;
    untrustedContentHint?: boolean;
  };
  execute: (input: Record<string, unknown>, options?: { signal?: AbortSignal }) => unknown | Promise<unknown>;
}

export interface ModelContextLike {
  registerTool: (tool: ModelContextTool, options?: { signal?: AbortSignal }) => Promise<void>;
}

export interface CivicWebMCPHooks {
  onSearchResults?: (resourceIds: string[]) => void;
  onResourceSelected?: (resourceId: string) => void;
}

const readOnlyAnnotations = {
  readOnlyHint: true,
  untrustedContentHint: true,
} as const;

const resourceIdSchema = {
  type: 'object',
  properties: {
    resourceId: {
      type: 'string',
      description: 'Stable Civic WebMCP resource identifier returned by civic_search.',
    },
  },
  required: ['resourceId'],
  additionalProperties: false,
};

const envelope = <T>(data: T) => ({
  civicWebMcpProfile: CIVIC_WEBMCP_PROFILE,
  generatedAt: new Date().toISOString(),
  data,
});

const requiredString = (input: Record<string, unknown>, key: string): string => {
  const value = input[key];
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`${key} must be a non-empty string`);
  }
  return value;
};

export const createCivicTools = (
  registry: CivicRegistry,
  hooks: CivicWebMCPHooks = {},
): ModelContextTool[] => [
  {
    name: 'civic_search',
    title: 'Search civic policy resources',
    description:
      'Search this publisher\'s public-policy resources by keyword, topic, jurisdiction, resource type, or status. Use this before assuming a policy resource exists. Results preserve publisher attribution and stable resource IDs for follow-up calls.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Free-text search across titles, summaries, topics, and claims.' },
        topic: { type: 'string', description: 'Policy topic such as housing, childcare, or licensing.' },
        jurisdiction: { type: 'string', description: 'Jurisdiction name or fragment.' },
        resourceType: {
          type: 'string',
          enum: ['policy_proposal', 'legislation', 'policy_analysis', 'research', 'regulation', 'legal_document'],
        },
        status: {
          type: 'string',
          enum: ['proposed', 'introduced', 'active', 'enacted', 'implemented', 'archived'],
        },
        limit: { type: 'integer', minimum: 1, maximum: 50, default: 10 },
      },
      additionalProperties: false,
    },
    annotations: readOnlyAnnotations,
    execute: async (input) => {
      const results = registry.search(input as CivicSearchInput);
      hooks.onSearchResults?.(results.map((resource) => resource.id));
      return envelope({
        count: results.length,
        resources: results.map(({ claims, sourceIds, positionIds, timelineIds, relatedResourceIds, actionOpportunityIds, ...summary }) => summary),
      });
    },
  },
  {
    name: 'civic_get_resource',
    title: 'Get a civic policy resource',
    description:
      'Retrieve one policy resource with its publisher, jurisdiction, status, topics, and explicitly typed claims. Claims distinguish factual statements, analysis, projections, and value judgments and carry source IDs for provenance checks.',
    inputSchema: resourceIdSchema,
    annotations: readOnlyAnnotations,
    execute: async (input) => {
      const resourceId = requiredString(input, 'resourceId');
      const resource = registry.getResource(resourceId);
      if (!resource) throw new Error(`Unknown civic resource: ${resourceId}`);
      hooks.onResourceSelected?.(resourceId);
      return envelope(resource);
    },
  },
  {
    name: 'civic_get_sources',
    title: 'Get evidence and sources',
    description:
      'Retrieve the sources associated with a policy resource. Each source is typed (for example legal text, primary source, empirical evidence, official data, analysis, or commentary) so an agent can distinguish evidence from interpretation and preserve provenance.',
    inputSchema: resourceIdSchema,
    annotations: readOnlyAnnotations,
    execute: async (input) => envelope({ sources: registry.getSources(requiredString(input, 'resourceId')) }),
  },
  {
    name: 'civic_get_positions',
    title: 'Get attributed policy positions',
    description:
      'Retrieve clearly attributed perspectives on a policy resource, including supportive, opposing, mixed, and neutral-analysis positions. Use this to represent disagreement as attributed civic data rather than inventing an opposing argument.',
    inputSchema: resourceIdSchema,
    annotations: readOnlyAnnotations,
    execute: async (input) => envelope({ positions: registry.getPositions(requiredString(input, 'resourceId')) }),
  },
  {
    name: 'civic_get_timeline',
    title: 'Get policy timeline',
    description:
      'Retrieve dated events relevant to a policy resource, such as publication, introduction, hearings, adoption, implementation, or review. Use this to distinguish historical, current, and upcoming policy events.',
    inputSchema: resourceIdSchema,
    annotations: readOnlyAnnotations,
    execute: async (input) => envelope({ timeline: registry.getTimeline(requiredString(input, 'resourceId')) }),
  },
  {
    name: 'civic_get_related',
    title: 'Get related civic resources',
    description:
      'Retrieve resources the publisher has explicitly related to the current policy resource. Use this for transparent navigation across policy topics rather than guessing semantic relationships that the publisher has not asserted.',
    inputSchema: resourceIdSchema,
    annotations: readOnlyAnnotations,
    execute: async (input) => envelope({ resources: registry.getRelated(requiredString(input, 'resourceId')) }),
  },
  {
    name: 'civic_get_action_opportunities',
    title: 'Get public participation opportunities',
    description:
      'Retrieve published civic participation opportunities such as hearings, public-comment periods, meetings, deadlines, or information sessions. This tool provides authoritative opportunity metadata; it does not automate persuasion, targeting, or submission on the user\'s behalf.',
    inputSchema: {
      type: 'object',
      properties: {
        resourceId: {
          type: 'string',
          description: 'Optional resource ID. Omit to return all published participation opportunities.',
        },
      },
      additionalProperties: false,
    },
    annotations: readOnlyAnnotations,
    execute: async (input) => {
      const resourceId = typeof input.resourceId === 'string' ? input.resourceId : undefined;
      return envelope({ opportunities: registry.getActionOpportunities(resourceId) });
    },
  },
];

export const registerCivicWebMCP = async ({
  modelContext,
  registry,
  signal,
  hooks,
}: {
  modelContext: ModelContextLike;
  registry: CivicRegistry;
  signal?: AbortSignal;
  hooks?: CivicWebMCPHooks;
}) => {
  const tools = createCivicTools(registry, hooks);
  await Promise.all(tools.map((tool) => modelContext.registerTool(tool, { signal })));
  return tools.map(({ name, title, description }) => ({ name, title, description }));
};
