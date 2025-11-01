/**
 * Services Index - New Clean Exports
 * Central export for all service modules
 * 
 * This is the new organized structure replacing the old monolithic index.ts
 */

// Core service modules
export * from './database';
export * from './processors';
export * from './mergers';

// Third-party integrations
export * from './ads';
export * from './purchases';

// API functions (kept in api/ folder)
export * from './api/fetchMatchDetails';
export * from './api/fetchMatchList';
export * from './api/fetchRiotAccount';
export * from './api/fetchUserRegion';

// Legacy exports for backward compatibility
// TODO: Move these to orchestration/ folder
export { dataUpdateTracker, processUserData } from './legacy-index';

