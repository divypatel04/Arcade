/**
 * Format large numbers with K, M, B suffixes
 */
export const formatNumber = (num: number): string => {
  if (num >= 1000000000) {
    const formatted = (num / 1000000000).toFixed(1);
    return formatted.endsWith('.0') ? formatted.slice(0, -2) + 'B' : formatted + 'B';
  }
  if (num >= 1000000) {
    const formatted = (num / 1000000).toFixed(1);
    return formatted.endsWith('.0') ? formatted.slice(0, -2) + 'M' : formatted + 'M';
  }
  if (num >= 1000) {
    const formatted = (num / 1000).toFixed(1);
    return formatted.endsWith('.0') ? formatted.slice(0, -2) + 'K' : formatted + 'K';
  }
  return num.toString();
};

/**
 * Format number with commas
 */
export const formatNumberWithCommas = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/**
 * Format percentage
 */
export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${(value * 100).toFixed(decimals)}%`;
};

/**
 * Format K/D ratio
 */
export const formatKD = (kd: number): string => {
  return kd.toFixed(2);
};

/**
 * Format date to relative time (e.g., "2 hours ago", "3 days ago")
 */
export const formatRelativeTime = (date: Date | string): string => {
  const now = new Date();
  const targetDate = typeof date === 'string' ? new Date(date) : date;
  const diffMs = now.getTime() - targetDate.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffWeek = Math.floor(diffDay / 7);
  const diffMonth = Math.floor(diffDay / 30);
  const diffYear = Math.floor(diffDay / 365);

  if (diffSec < 60) return 'just now';
  if (diffMin < 60) return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
  if (diffHour < 24) return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
  if (diffDay < 7) return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
  if (diffWeek < 4) return `${diffWeek} week${diffWeek > 1 ? 's' : ''} ago`;
  if (diffMonth < 12) return `${diffMonth} month${diffMonth > 1 ? 's' : ''} ago`;
  return `${diffYear} year${diffYear > 1 ? 's' : ''} ago`;
};

/**
 * Format date to short date string (e.g., "Jan 15, 2024")
 */
export const formatShortDate = (date: Date | string): string => {
  const targetDate = typeof date === 'string' ? new Date(date) : date;
  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  };
  return targetDate.toLocaleDateString('en-US', options);
};

/**
 * Format date to long date string (e.g., "January 15, 2024 at 3:45 PM")
 */
export const formatLongDate = (date: Date | string): string => {
  const targetDate = typeof date === 'string' ? new Date(date) : date;
  const dateOptions: Intl.DateTimeFormatOptions = {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  };
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  };
  const dateStr = targetDate.toLocaleDateString('en-US', dateOptions);
  const timeStr = targetDate.toLocaleTimeString('en-US', timeOptions);
  return `${dateStr} at ${timeStr}`;
};

/**
 * Format duration from milliseconds to readable string (e.g., "1h 23m 45s")
 */
export const formatDuration = (ms: number): string => {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days}d ${hours % 24}h`;
  }
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  }
  return `${seconds}s`;
};

/**
 * Format duration from seconds to MM:SS
 */
export const formatMMSS = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Format rank name with proper casing
 */
export const formatRankName = (rank: string): string => {
  // Handle special cases
  if (rank.toLowerCase() === 'radiant') return 'Radiant';
  if (rank.toLowerCase().includes('unranked')) return 'Unranked';
  
  // Split rank into parts (e.g., "diamond 2" -> ["Diamond", "2"])
  return rank
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

/**
 * Format Riot ID (GameName#TAG)
 */
export const formatRiotId = (gameName: string, tagLine: string): string => {
  return `${gameName}#${tagLine}`;
};

/**
 * Format combat score with proper spacing
 */
export const formatCombatScore = (score: number): string => {
  return formatNumberWithCommas(score);
};

/**
 * Format playtime to hours and minutes
 */
export const formatPlaytime = (milliseconds: number): string => {
  const hours = Math.floor(milliseconds / (1000 * 60 * 60));
  const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

/**
 * Format file size
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Truncate string with ellipsis
 */
export const truncateString = (str: string, maxLength: number): string => {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + '...';
};

/**
 * Format ordinal number (1st, 2nd, 3rd, etc.)
 */
export const formatOrdinal = (num: number): string => {
  const j = num % 10;
  const k = num % 100;
  
  if (j === 1 && k !== 11) return num + 'st';
  if (j === 2 && k !== 12) return num + 'nd';
  if (j === 3 && k !== 13) return num + 'rd';
  return num + 'th';
};
