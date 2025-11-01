/**
 * Agent Stats Database Service
 * CRUD operations for agent statistics
 */

import { createDbService, snakeToCamel, camelToSnake } from './baseDb';
import type { AgentStatType } from '@types';

/**
 * Transform DB snake_case to app camelCase
 * Note: Database schema is simpler than app types, enrichment happens at processor level
 */
function transformFromDb(dbRecord: Record<string, unknown>): AgentStatType {
  // The main issue is performancebyseason → performanceBySeason
  return {
    ...dbRecord,
    performanceBySeason: (dbRecord.performancebyseason || []) as AgentStatType['performanceBySeason'],
  } as AgentStatType;
}

/**
 * Transform app camelCase to DB snake_case  
 */
function transformToDb(appRecord: AgentStatType): Record<string, unknown> {
  return {
    ...appRecord,
    performancebyseason: appRecord.performanceBySeason,
  };
}

/**
 * Agent stats database service
 */
export const agentStatsDb = createDbService<AgentStatType>('agentstats', {
  transformFromDb,
  transformToDb,
});

// Export individual functions for backward compatibility
export const {
  fetchByPuuid: fetchAgentStats,
  fetchById: fetchAgentStatById,
  upsert: upsertAgentStats,
  deleteById: deleteAgentStatById,
  deleteByPuuid: deleteAllAgentStats,
  count: countAgentStats,
} = agentStatsDb;
