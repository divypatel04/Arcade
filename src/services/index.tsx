import { supabase } from '../lib/supabase';
import {
  processAgentStatsData,
  processMapStatsData,
  processWeaponStatsData,
  processSeasonStatsData,
  processMatchStatsData
} from './processService';

// A simple state object to track the last processed data
export const dataUpdateTracker = {
  lastProcessedPuuid: null as string | null,
  lastUpdateTimestamp: null as Date | null,

  // Update the tracker when processing is complete
  markUpdated: function(puuid: string) {
    this.lastProcessedPuuid = puuid;
    this.lastUpdateTimestamp = new Date();
    console.log('✅ Data updated at:', this.lastUpdateTimestamp);
  }
};

/**
 * Process user statistics data
 * Fetches data from Supabase, processes it, and updates it back
 *
 * @param puuid User's PUUID to process data for
 */
export const processUserData = async (puuid: string): Promise<void> => {
  console.log('🔄 Processing data for PUUID:', puuid);

  try {
    // Process all data types in parallel for efficiency
    await Promise.all([
      processAgentStats(puuid),
      processMapStats(puuid),
      processWeaponStats(puuid),
      processSeasonStats(puuid),
      processMatchStats(puuid)
    ]);

    console.log('✅ All data processed successfully');

    // Update the tracker to signal that processing is complete
    dataUpdateTracker.markUpdated(puuid);

  } catch (error) {
    console.error('❌ Error processing data:', error);
    throw error;
  }
};

/**
 * Process agent statistics
 */
async function processAgentStats(puuid: string): Promise<void> {
  console.log('🔄 Processing agent stats...');
  try {
    // 1. Fetch the raw data from Supabase
    const { data, error } = await supabase
      .from('agentstats')
      .select('*')
      .eq('puuid', puuid);

    if (error) throw error;
    if (!data || data.length === 0) {
      console.log('No agent stats found for processing');
      return;
    }

    // 2. Process the data using the imported function from processService
    const processedData = processAgentStatsData(data);

    // 3. Update the database with processed data
    const { error: updateError } = await supabase
      .from('agentstats')
      .upsert(processedData, { onConflict: 'puuid,agent' });

    if (updateError) throw updateError;
    console.log('✅ Agent stats processed and updated');

  } catch (error) {
    console.error('Error processing agent stats:', error);
    throw error;
  }
}

/**
 * Process map statistics
 */
async function processMapStats(puuid: string): Promise<void> {
  console.log('🔄 Processing map stats...');
  try {
    const { data, error } = await supabase
      .from('mapstats')
      .select('*')
      .eq('puuid', puuid);

    if (error) throw error;
    if (!data || data.length === 0) {
      console.log('No map stats found for processing');
      return;
    }

    // Process the data using the imported function
    const processedData = processMapStatsData(data);

    const { error: updateError } = await supabase
      .from('mapstats')
      .upsert(processedData, { onConflict: 'puuid,map' });

    if (updateError) throw updateError;
    console.log('✅ Map stats processed and updated');

  } catch (error) {
    console.error('Error processing map stats:', error);
    throw error;
  }
}

/**
 * Process weapon statistics
 */
async function processWeaponStats(puuid: string): Promise<void> {
  console.log('🔄 Processing weapon stats...');
  try {
    const { data, error } = await supabase
      .from('weaponstats')
      .select('*')
      .eq('puuid', puuid);

    if (error) throw error;
    if (!data || data.length === 0) {
      console.log('No weapon stats found for processing');
      return;
    }

    // Process the data using the imported function
    const processedData = processWeaponStatsData(data);

    const { error: updateError } = await supabase
      .from('weaponstats')
      .upsert(processedData, { onConflict: 'puuid,weapon' });

    if (updateError) throw updateError;
    console.log('✅ Weapon stats processed and updated');

  } catch (error) {
    console.error('Error processing weapon stats:', error);
    throw error;
  }
}

/**
 * Process season statistics
 */
async function processSeasonStats(puuid: string): Promise<void> {
  console.log('🔄 Processing season stats...');
  try {
    const { data, error } = await supabase
      .from('seasonstats')
      .select('*')
      .eq('puuid', puuid);

    if (error) throw error;
    if (!data || data.length === 0) {
      console.log('No season stats found for processing');
      return;
    }

    // Process the data using the imported function
    const processedData = processSeasonStatsData(data);

    const { error: updateError } = await supabase
      .from('seasonstats')
      .upsert(processedData, { onConflict: 'puuid,season' });

    if (updateError) throw updateError;
    console.log('✅ Season stats processed and updated');

  } catch (error) {
    console.error('Error processing season stats:', error);
    throw error;
  }
}

/**
 * Process match statistics
 */
async function processMatchStats(puuid: string): Promise<void> {
  console.log('🔄 Processing match stats...');
  try {
    const { data, error } = await supabase
      .from('matchstats')
      .select('*')
      .eq('puuid', puuid)
      .order('createdat', { ascending: false });

    if (error) throw error;
    if (!data || data.length === 0) {
      console.log('No match stats found for processing');
      return;
    }

    // Process the data using the imported function
    const processedData = processMatchStatsData(data);

    const { error: updateError } = await supabase
      .from('matchstats')
      .upsert(processedData, { onConflict: 'puuid,matchid' });

    if (updateError) throw updateError;
    console.log('✅ Match stats processed and updated');

  } catch (error) {
    console.error('Error processing match stats:', error);
    throw error;
  }
}
