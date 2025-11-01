/**
 * Input Validation Schemas using Zod
 * Provides runtime type checking and validation for all inputs
 */

import { z } from 'zod';
import { ValidationError, ErrorCodes } from './errors';

/**
 * PUUID validation schema
 * PUUIDs are UUIDs used by Riot to identify players
 */
export const puuidSchema = z.string().uuid({
  message: 'Invalid PUUID format. Must be a valid UUID.',
});

/**
 * Validate PUUID with custom error
 */
export function validatePuuid(puuid: unknown): string {
  try {
    return puuidSchema.parse(puuid);
  } catch (error) {
    throw new ValidationError(
      'Invalid PUUID provided',
      ErrorCodes.INVALID_PUUID,
      { puuid, error }
    );
  }
}

/**
 * Region validation schema
 */
export const regionSchema = z.enum(['na', 'eu', 'ap', 'kr', 'latam', 'br']);

/**
 * Validate region with custom error
 */
export function validateRegion(region: unknown): string {
  try {
    return regionSchema.parse(region);
  } catch (error) {
    throw new ValidationError(
      'Invalid region. Must be one of: na, eu, ap, kr, latam, br',
      ErrorCodes.INVALID_REGION,
      { region, error }
    );
  }
}

/**
 * Match ID validation schema
 */
export const matchIdSchema = z.string().min(1, {
  message: 'Match ID cannot be empty',
});

/**
 * Validate match ID with custom error
 */
export function validateMatchId(matchId: unknown): string {
  try {
    return matchIdSchema.parse(matchId);
  } catch (error) {
    throw new ValidationError(
      'Invalid match ID provided',
      ErrorCodes.INVALID_MATCH_ID,
      { matchId, error }
    );
  }
}

/**
 * Riot account schema (name + tag)
 */
export const riotAccountSchema = z.object({
  name: z.string().min(3).max(16),
  tag: z.string().min(3).max(5),
});

/**
 * Validate Riot account
 */
export function validateRiotAccount(account: unknown): { name: string; tag: string } {
  try {
    return riotAccountSchema.parse(account);
  } catch (error) {
    throw new ValidationError(
      'Invalid Riot account format',
      ErrorCodes.INVALID_INPUT,
      { account, error }
    );
  }
}

/**
 * Agent stats schema
 */
export const agentStatsSchema = z.object({
  id: z.string().uuid(),
  puuid: z.string().uuid(),
  agentId: z.string(),
  agentName: z.string(),
  stats: z.object({
    matchesPlayed: z.number().int().min(0),
    wins: z.number().int().min(0),
    losses: z.number().int().min(0),
    kills: z.number().int().min(0),
    deaths: z.number().int().min(0),
    assists: z.number().int().min(0),
    kda: z.number().min(0),
    winRate: z.number().min(0).max(100),
    avgScore: z.number().min(0),
  }),
  performanceBySeason: z.array(
    z.object({
      season: z.string(),
      matchesPlayed: z.number().int().min(0),
      wins: z.number().int().min(0),
      losses: z.number().int().min(0),
      kills: z.number().int().min(0),
      deaths: z.number().int().min(0),
      assists: z.number().int().min(0),
      kda: z.number().min(0),
      winRate: z.number().min(0).max(100),
      avgScore: z.number().min(0),
    })
  ),
  lastUpdated: z.string().or(z.date()),
});

/**
 * Map stats schema
 */
export const mapStatsSchema = z.object({
  id: z.string().uuid(),
  puuid: z.string().uuid(),
  mapId: z.string(),
  mapName: z.string(),
  stats: z.object({
    matchesPlayed: z.number().int().min(0),
    wins: z.number().int().min(0),
    losses: z.number().int().min(0),
    kills: z.number().int().min(0),
    deaths: z.number().int().min(0),
    assists: z.number().int().min(0),
    kda: z.number().min(0),
    winRate: z.number().min(0).max(100),
    avgScore: z.number().min(0),
  }),
  performanceBySeason: z.array(
    z.object({
      season: z.string(),
      matchesPlayed: z.number().int().min(0),
      wins: z.number().int().min(0),
      losses: z.number().int().min(0),
      kills: z.number().int().min(0),
      deaths: z.number().int().min(0),
      assists: z.number().int().min(0),
      kda: z.number().min(0),
      winRate: z.number().min(0).max(100),
      avgScore: z.number().min(0),
    })
  ),
  lastUpdated: z.string().or(z.date()),
});

/**
 * Weapon stats schema
 */
export const weaponStatsSchema = z.object({
  id: z.string().uuid(),
  puuid: z.string().uuid(),
  weaponId: z.string(),
  weaponName: z.string(),
  stats: z.object({
    kills: z.number().int().min(0),
    headshots: z.number().int().min(0),
    bodyshots: z.number().int().min(0),
    legshots: z.number().int().min(0),
    headshotPercentage: z.number().min(0).max(100),
  }),
  performanceBySeason: z.array(
    z.object({
      season: z.string(),
      kills: z.number().int().min(0),
      headshots: z.number().int().min(0),
      bodyshots: z.number().int().min(0),
      legshots: z.number().int().min(0),
      headshotPercentage: z.number().min(0).max(100),
    })
  ),
  lastUpdated: z.string().or(z.date()),
});

/**
 * Season stats schema
 */
export const seasonStatsSchema = z.object({
  id: z.string().uuid(),
  puuid: z.string().uuid(),
  season: z.string(),
  stats: z.object({
    matchesPlayed: z.number().int().min(0),
    wins: z.number().int().min(0),
    losses: z.number().int().min(0),
    kills: z.number().int().min(0),
    deaths: z.number().int().min(0),
    assists: z.number().int().min(0),
    kda: z.number().min(0),
    winRate: z.number().min(0).max(100),
    avgScore: z.number().min(0),
  }),
  lastUpdated: z.string().or(z.date()),
});

/**
 * Match stats schema
 */
export const matchStatsSchema = z.object({
  id: z.string().uuid(),
  puuid: z.string().uuid(),
  matchId: z.string(),
  mapName: z.string(),
  agentName: z.string(),
  result: z.enum(['win', 'loss']),
  kills: z.number().int().min(0),
  deaths: z.number().int().min(0),
  assists: z.number().int().min(0),
  score: z.number().int().min(0),
  kda: z.number().min(0),
  timestamp: z.string().or(z.date()),
});

/**
 * Generic validation helper
 */
export function validate<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  context?: string
): T {
  try {
    return schema.parse(data);
  } catch (error) {
    throw new ValidationError(
      `Validation failed${context ? ` for ${context}` : ''}`,
      ErrorCodes.INVALID_INPUT,
      { data, error }
    );
  }
}

/**
 * Safe parse - returns result instead of throwing
 */
export function safeParse<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: z.ZodError } {
  const result = schema.safeParse(data);
  return result;
}

/**
 * Array validation helper
 */
export function validateArray<T>(
  schema: z.ZodSchema<T>,
  data: unknown[],
  context?: string
): T[] {
  return data.map((item, index) => 
    validate(schema, item, `${context}[${index}]`)
  );
}
