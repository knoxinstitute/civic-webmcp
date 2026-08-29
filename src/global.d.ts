import type { ModelContextLike } from './webmcp';

declare global {
  interface Document {
    modelContext?: ModelContextLike;
  }
}

export {};
