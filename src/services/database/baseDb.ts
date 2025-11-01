/**
 * Generic Database Service Base
 * Eliminates code duplication across all database operations
 */

import { supabase } from '@lib/supabase';
import { DatabaseError, ErrorCodes, retryWithBackoff, logError } from '@lib/errors';

/**
 * Generic database service factory
 * Creates CRUD operations for any table with type safety
 */
export function createDbService<TRecord extends { id?: string; puuid: string }>(
  tableName: string,
  options: {
    transformToDb?: (record: TRecord) => Record<string, unknown>;
    transformFromDb?: (record: Record<string, unknown>) => TRecord;
  } = {}
) {
  const { transformToDb, transformFromDb } = options;

  /**
   * Fetch all records for a given PUUID
   */
  const fetchByPuuid = async (puuid: string): Promise<TRecord[]> => {
    try {
      const result = await retryWithBackoff(
        async () => supabase.from(tableName).select('*').eq('puuid', puuid),
        { maxRetries: 2 }
      );

      const { data, error } = result as {
        data: Record<string, unknown>[] | null;
        error: Error | null;
      };

      if (error) {
        throw new DatabaseError(
          `Failed to fetch ${tableName} for puuid: ${puuid}`,
          ErrorCodes.DB_QUERY_FAILED,
          { tableName, puuid, error }
        );
      }

      const records = data || [];
      return transformFromDb ? records.map(transformFromDb) : (records as TRecord[]);
    } catch (error) {
      logError(error, { operation: 'fetchByPuuid', tableName, puuid });
      throw error;
    }
  };

  /**
   * Fetch a single record by ID
   */
  const fetchById = async (id: string): Promise<TRecord | null> => {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Not found
          return null;
        }
        throw new DatabaseError(
          `Failed to fetch ${tableName} by id: ${id}`,
          ErrorCodes.DB_QUERY_FAILED,
          { tableName, id, error }
        );
      }

      return transformFromDb ? transformFromDb(data) : data;
    } catch (error) {
      logError(error, { operation: 'fetchById', tableName, id });
      throw error;
    }
  };

  /**
   * Insert or update records (upsert)
   */
  const upsert = async (records: TRecord[]): Promise<void> => {
    if (!records || records.length === 0) {
      return;
    }

    try {
      const dataToInsert = transformToDb
        ? records.map(transformToDb)
        : records;

      const result = await retryWithBackoff(
        async () =>
          supabase.from(tableName).upsert(dataToInsert, {
            onConflict: 'id',
            ignoreDuplicates: false,
          }),
        { maxRetries: 2 }
      );

      const { error } = result as { error: Error | null };

      if (error) {
        throw new DatabaseError(
          `Failed to upsert ${records.length} records to ${tableName}`,
          ErrorCodes.DB_INSERT_FAILED,
          { tableName, recordCount: records.length, error }
        );
      }
    } catch (error) {
      logError(error, { operation: 'upsert', tableName, recordCount: records.length });
      throw error;
    }
  };

  /**
   * Delete a record by ID
   */
  const deleteById = async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);

      if (error) {
        throw new DatabaseError(
          `Failed to delete ${tableName} by id: ${id}`,
          ErrorCodes.DB_DELETE_FAILED,
          { tableName, id, error }
        );
      }
    } catch (error) {
      logError(error, { operation: 'deleteById', tableName, id });
      throw error;
    }
  };

  /**
   * Delete all records for a PUUID
   */
  const deleteByPuuid = async (puuid: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('puuid', puuid);

      if (error) {
        throw new DatabaseError(
          `Failed to delete ${tableName} for puuid: ${puuid}`,
          ErrorCodes.DB_DELETE_FAILED,
          { tableName, puuid, error }
        );
      }
    } catch (error) {
      logError(error, { operation: 'deleteByPuuid', tableName, puuid });
      throw error;
    }
  };

  /**
   * Count records for a PUUID
   */
  const count = async (puuid: string): Promise<number> => {
    try {
      const { count, error } = await supabase
        .from(tableName)
        .select('*', { count: 'exact', head: true })
        .eq('puuid', puuid);

      if (error) {
        throw new DatabaseError(
          `Failed to count ${tableName} for puuid: ${puuid}`,
          ErrorCodes.DB_QUERY_FAILED,
          { tableName, puuid, error }
        );
      }

      return count || 0;
    } catch (error) {
      logError(error, { operation: 'count', tableName, puuid });
      throw error;
    }
  };

  return {
    fetchByPuuid,
    fetchById,
    upsert,
    deleteById,
    deleteByPuuid,
    count,
  };
}

/**
 * Helper to transform snake_case DB columns to camelCase
 */
export function snakeToCamel<T = unknown>(obj: T): T {
  if (Array.isArray(obj)) {
    return obj.map(snakeToCamel) as T;
  }

  if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((acc, key: string) => {
      const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      acc[camelKey] = snakeToCamel((obj as Record<string, unknown>)[key]);
      return acc;
    }, {} as Record<string, unknown>) as T;
  }

  return obj;
}

/**
 * Helper to transform camelCase to snake_case DB columns
 */
export function camelToSnake<T = unknown>(obj: T): T {
  if (Array.isArray(obj)) {
    return obj.map(camelToSnake) as T;
  }

  if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((acc, key: string) => {
      const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
      acc[snakeKey] = camelToSnake((obj as Record<string, unknown>)[key]);
      return acc;
    }, {} as Record<string, unknown>) as T;
  }

  return obj;
}
