/**
 * Agent Stats Merger
 * Merges old and new agent statistics
 */

import { createMerger, mergeSeasonPerformance } from './baseMerger';
import type { AgentStatType, AgentSeasonPerformance } from '@types';

/**
 * Merge agent stats
 */
export const mergeAgentStats = createMerger<AgentStatType>({
  // Use agent ID as unique identifier
  getId: (agent) => agent.agent.id,
  
  // Merge season performance data
  mergeSeasons: (oldAgent, newAgent) => {
    const mergedSeasons = mergeSeasonPerformance<AgentSeasonPerformance>(
      oldAgent.performanceBySeason,
      newAgent.performanceBySeason,
      (season) => season.id
    );

    return {
      ...newAgent,
      performanceBySeason: mergedSeasons,
    };
  },
});
