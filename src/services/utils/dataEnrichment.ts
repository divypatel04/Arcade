import { supabase } from "../../lib/supabase";
import { AgentStatType } from "../../types/AgentStatsType";
import { MapStatsType } from "../../types/MapStatsType";
import { SeasonStatsType } from "../../types/SeasonStatsType";
import { WeaponStatType } from "../../types/WeaponStatsType";

/**
 * Main function to enrich all stats with details
 */
export async function enrichStatsWithDetails(stats: {
  agentStats: AgentStatType[],
  mapStats: MapStatsType[],
  weaponStats: WeaponStatType[],
  seasonStats: SeasonStatsType[],
  matchStats?: any[] // Add optional matchStats parameter
}) {
  try {
    // Process agents
    for (const agentStat of stats.agentStats) {
      try {
        // Enrich agent details
        if (!agentStat.agent.name) {
          const agentDetails = await fetchAgentDetails(agentStat.agent.id);
          agentStat.agent = {
            ...agentStat.agent,
            ...agentDetails
          };
        }

        // Enrich seasons within agent performance
        for (const performance of agentStat.performanceBySeason) {
          if (!performance.season.name) {
            const seasonDetails = await fetchSeasonDetails(performance.season.id);
            performance.season = {
              ...performance.season,
              ...seasonDetails
            };
          }

          // Enrich map stats within season performance
          if (performance.mapStats) {
            for (const mapStat of performance.mapStats) {
              if (!mapStat.name || !mapStat.location) {
                const mapDetails = await fetchMapDetails(mapStat.id);
                Object.assign(mapStat, mapDetails);
              }
            }
          }
        }
      } catch (error) {
        console.error(`Error enriching agent stats for agent ${agentStat.agent.id}:`, error);
        // Continue with other agents rather than failing the whole process
      }
    }

    // Process maps
    for (const mapStat of stats.mapStats) {
      try {
        // Enrich map details
        if (!mapStat.map.name) {
          const mapDetails = await fetchMapDetails(mapStat.map.id);
          mapStat.map = {
            ...mapStat.map,
            ...mapDetails
          };
        }

        // Enrich seasons within map performance
        for (const performance of mapStat.performanceBySeason) {
          if (!performance.season.name) {
            const seasonDetails = await fetchSeasonDetails(performance.season.id);
            performance.season = {
              ...performance.season,
              ...seasonDetails
            };
          }
        }
      } catch (error) {
        console.error(`Error enriching map stats for map ${mapStat.map.id}:`, error);
      }
    }

    // Process weapons
    for (const weaponStat of stats.weaponStats) {
      try {
        // Enrich weapon details
        if (!weaponStat.weapon.name) {
          const weaponDetails = await fetchWeaponDetails(weaponStat.weapon.id);
          weaponStat.weapon = {
            ...weaponStat.weapon,
            ...weaponDetails
          };
        }

        // Enrich seasons within weapon performance
        for (const performance of weaponStat.performanceBySeason) {
          if (!performance.season.name) {
            const seasonDetails = await fetchSeasonDetails(performance.season.id);
            performance.season = {
              ...performance.season,
              ...seasonDetails
            };
          }
        }
      } catch (error) {
        console.error(`Error enriching weapon stats for weapon ${weaponStat.weapon.id}:`, error);
      }
    }

    // Process seasons
    for (const seasonStat of stats.seasonStats) {
      try {
        // Enrich season details
        if (!seasonStat.season.name) {
          const seasonDetails = await fetchSeasonDetails(seasonStat.season.id);
          seasonStat.season = {
            ...seasonStat.season,
            ...seasonDetails
          };
        }
      } catch (error) {
        console.error(`Error enriching season stats for season ${seasonStat.season.id}:`, error);
      }
    }

    // Process match stats if provided
    if (stats.matchStats && stats.matchStats.length > 0) {
      for (const matchStat of stats.matchStats) {
        try {
          if (matchStat.stats && matchStat.stats.general) {
            const general = matchStat.stats.general;

            // Enrich agent details
            if (general.agent && general.agent.id && (!general.agent.name || !general.agent.role)) {
              const agentDetails = await fetchAgentDetails(general.agent.id);
              general.agent = {
                ...general.agent,
                ...agentDetails
              };
            }

            // Enrich map details
            if (general.map && general.map.id && (!general.map.name || !general.map.location)) {
              const mapDetails = await fetchMapDetails(general.map.id);
              general.map = {
                ...general.map,
                ...mapDetails
              };
            }

            // Enrich season details
            if (general.season && general.season.id && !general.season.name) {
              const seasonDetails = await fetchSeasonDetails(general.season.id);
              general.season = {
                ...general.season,
                ...seasonDetails
              };
            }
          }
        } catch (error) {
          console.error(`Error enriching match stats for match ${matchStat.id || matchStat?.stats?.general?.matchId}:`, error);
        }
      }
    }
  } catch (error) {
    console.error('Error in enrichStatsWithDetails:', error);
    // Function continues despite errors
  }
}

/**
 * Fetches agent details from Supabase
 */
export async function fetchAgentDetails(agentId: string) {
  try {
    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .eq('id', agentId)
      .single();

    if (error) throw error;
    if (!data) throw new Error(`Agent with ID ${agentId} not found`);

    // Return agent data without the id field
    const { id, ...agentWithoutId } = data;
    return agentWithoutId;
  } catch (error) {
    console.error(`Error fetching agent details for ${agentId}:`, error);
    // Return a fallback in case of errors
    return {};
  }
}

/**
 * Fetches map details from Supabase
 */
export async function fetchMapDetails(mapId: string) {
  try {
    const { data, error } = await supabase
      .from('maps')
      .select('*')
      .eq('id', mapId)
      .single();

    if (error) throw error;
    if (!data) throw new Error(`Map with ID ${mapId} not found`);

    // Return map data without the id field
    const { id, ...mapWithoutId } = data;
    return mapWithoutId;
  } catch (error) {
    console.error(`Error fetching map details for ${mapId}:`, error);
    // Return a fallback in case of errors
    return {};
  }
}

/**
 * Fetches weapon details from Supabase
 */
export async function fetchWeaponDetails(weaponId: string) {
  try {
    const { data, error } = await supabase
      .from('weapons')
      .select('*')
      .eq('id', weaponId)
      .single();

    if (error) throw error;
    if (!data) throw new Error(`Weapon with ID ${weaponId} not found`);

    // Return weapon data without the id field
    const { id, ...weaponWithoutId } = data;
    return weaponWithoutId;
  } catch (error) {
    console.error(`Error fetching weapon details for ${weaponId}:`, error);
    // Return a fallback in case of errors
    return {};
  }
}

/**
 * Fetches season details from Supabase
 */
export async function fetchSeasonDetails(seasonId: string) {
  try {
    const { data, error } = await supabase
      .from('seasons')
      .select('*')
      .eq('id', seasonId)
      .single();

    if (error) throw error;
    if (!data) throw new Error(`Season with ID ${seasonId} not found`);

    // Return season data without the id field
    const { id, ...seasonWithoutId } = data;
    return seasonWithoutId;
  } catch (error) {
    console.error(`Error fetching season details for ${seasonId}:`, error);
    // Return a fallback in case of errors
    return {};
  }
}
