/**
 * Premium Stats Utilities
 * 
 * DEPRECATED: This file is maintained for backward compatibility only.
 * All functionality has been moved to utils/premium/ modules.
 * 
 * Please import from:
 * - utils/premium (for all premium determination functions)
 * - utils/premium/scoringEngine (for agent scoring)
 * - utils/premium/mapScoring (for map scoring)
 * - utils/premium/seasonScoring (for season scoring)
 * - utils/premium/matchScoring (for match scoring)
 * - utils/premium/weaponScoring (for weapon scoring)
 */

// Re-export all functions from the new modular structure
export {
  determinePremiumAgentStats,
  determinePremiumMapStats,
  determinePremiumSeasonStats,
  determinePremiumMatchStats,
  determinePremiumWeaponStats,
  determineAllPremiumStats,
  calculateAgentPremiumScore,
  calculateMapPremiumScore,
  calculateSeasonPremiumScore,
  calculateMatchPremiumScore,
  calculateWeaponPremiumScore
} from './premium';
