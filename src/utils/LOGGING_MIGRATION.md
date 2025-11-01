# Logging Migration Guide

## Overview
This guide explains how to migrate from `console.log` to the centralized `logger` utility.

## Quick Start

### Before
```typescript
console.log('User logged in:', userId);
console.warn('API rate limit approaching');
console.error('Failed to fetch data:', error);
```

### After
```typescript
import { logger } from '@/utils/logger';

logger.debug('User logged in:', userId);  // Development only
logger.warn('API rate limit approaching'); // Always logged
logger.error('Failed to fetch data:', error); // Always logged
```

## Migration Rules

### 1. Debug Information (Development Only)
**Use:** `logger.debug()`  
**When:** Debugging, tracing execution flow, logging data for inspection

```typescript
// Before
console.log('Processing match data:', matchData);

// After
logger.debug('Processing match data:', matchData);
```

### 2. General Information (Development Only)
**Use:** `logger.info()`  
**When:** Important app flow events, state changes

```typescript
// Before
console.log('Successfully loaded user profile');

// After
logger.info('Successfully loaded user profile');
```

### 3. Warnings (Always Logged)
**Use:** `logger.warn()`  
**When:** Non-critical issues, deprecated features, unusual conditions

```typescript
// Before
console.warn('Using deprecated API endpoint');

// After
logger.warn('Using deprecated API endpoint');
```

### 4. Errors (Always Logged)
**Use:** `logger.error()`  
**When:** Exceptions, API failures, critical errors

```typescript
// Before
console.error('Failed to load data:', error);

// After
logger.error('Failed to load data:', error);
```

## Advanced Usage

### Scoped Logging (Module-Specific)
```typescript
import { logger } from '@/utils/logger';

// Create a scoped logger for your module
const log = logger.scope('DataContext');

// Use it like normal
log.info('Fetching user data');
log.error('API call failed', error);

// Output: [Arcade] [DataContext] [INFO] Fetching user data
```

### Function Tracing
```typescript
function processUserData(userId: string) {
  logger.enter('processUserData', { userId });
  
  // ... function logic ...
  
  const result = { success: true };
  logger.exit('processUserData', result);
  return result;
}
```

### Grouped Logs
```typescript
logger.group('User Authentication Flow', () => {
  logger.debug('Checking credentials');
  logger.debug('Validating token');
  logger.debug('Loading user profile');
});
```

## Migration Priority

### High Priority (Replace First)
1. **Error logging in services** - API calls, data fetching
2. **Context providers** - DataContext, AuthContext
3. **Navigation/routing** - App initialization
4. **Ad services** - Revenue-critical paths

### Medium Priority
5. **Component lifecycle** - useEffect, mount/unmount
6. **State management** - Complex state updates
7. **Form handling** - Validation, submission

### Low Priority
8. **Utility functions** - Pure functions, helpers
9. **Type definitions** - Usually no logging needed
10. **Configuration files** - Static data

## Files to Update

Based on grep search, these files have the most console.log statements:

1. **src/context/DataContext.tsx** (~20 logs) - HIGH PRIORITY
2. **src/data/legacy-index.ts** (~15 logs) - MEDIUM (deprecated file)
3. **src/services/generators/statsGenerator.ts** (~10 logs) - HIGH PRIORITY
4. **src/services/ads/** (~10 logs) - HIGH PRIORITY
5. **src/components/** (various) - MEDIUM PRIORITY

## Testing After Migration

1. **Development Build**
   - Verify debug/info logs appear in console
   - Check log formatting is consistent
   
2. **Production Build**
   - Verify debug/info logs DO NOT appear
   - Verify warn/error logs still appear
   - Test error scenarios to ensure errors are logged

## Notes

- The logger automatically detects `__DEV__` mode
- Debug/info logs are stripped in production builds
- Warn/error logs are always preserved
- Ready for integration with Sentry/LogRocket in the future

## Example: Before & After

### DataContext.tsx (Before)
```typescript
useEffect(() => {
  console.log('Fetching user data for:', userId);
  fetchData()
    .then(data => console.log('Data loaded:', data))
    .catch(error => console.error('Failed to fetch:', error));
}, [userId]);
```

### DataContext.tsx (After)
```typescript
import { logger } from '@/utils/logger';

const log = logger.scope('DataContext');

useEffect(() => {
  log.debug('Fetching user data for:', userId);
  fetchData()
    .then(data => log.info('Data loaded:', data))
    .catch(error => log.error('Failed to fetch:', error));
}, [userId]);
```
