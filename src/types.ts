export const CIVIC_WEBMCP_PROFILE = '0.1.0';

export type ResourceType =
  | 'policy_proposal'
  | 'legislation'
  | 'policy_analysis'
  | 'research'
  | 'regulation'
  | 'legal_document';

export type ResourceStatus =
  | 'proposed'
  | 'introduced'
  | 'active'
  | 'enacted'
  | 'implemented'
  | 'archived';

export type SourceType =
  | 'primary'
  | 'legal_text'
  | 'empirical'
  | 'official_data'
  | 'analysis'
  | 'commentary';

export type PositionStance = 'support' | 'oppose' | 'mixed' | 'neutral_analysis';

export interface Publisher { name: string; url?: string; }
export interface Jurisdiction { type: 'federal' | 'state' | 'local' | 'tribal' | 'international' | 'illustrative'; name: string; code?: string; }
export interface CivicClaim { id: string; text: string; kind: 'fact' | 'analysis' | 'projection' | 'value_judgment'; sourceIds: string[]; }
export interface CivicResource { id: string; resourceType: ResourceType; title: string; summary: string; publisher: Publisher; jurisdiction: Jurisdiction; publishedAt: string; updatedAt: string; status: ResourceStatus; topics: string[]; url?: string; claims: CivicClaim[]; sourceIds: string[]; positionIds: string[]; timelineIds: string[]; relatedResourceIds: string[]; actionOpportunityIds: string[]; demo: boolean; }
export interface CivicSource { id: string; title: string; sourceType: SourceType; publisher: Publisher; publicationDate?: string; url?: string; description: string; supportsClaimIds: string[]; demo: boolean; }
export interface CivicPosition { id: string; resourceId: string; actor: Publisher; stance: PositionStance; summary: string; sourceIds: string[]; demo: boolean; }
export interface CivicTimelineEvent { id: string; resourceId: string; date: string; label: string; description: string; sourceIds: string[]; demo: boolean; }
export interface CivicActionOpportunity { id: string; resourceId: string; actionType: 'hearing' | 'public_comment' | 'meeting' | 'deadline' | 'information_session'; title: string; description: string; startsAt?: string; endsAt?: string; jurisdiction: Jurisdiction; url?: string; sourceIds: string[]; demo: boolean; }
export interface CivicDataset { resources: CivicResource[]; sources: CivicSource[]; positions: CivicPosition[]; timeline: CivicTimelineEvent[]; actionOpportunities: CivicActionOpportunity[]; }
