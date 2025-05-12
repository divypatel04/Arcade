/**
 * A minimal polyfill for the Node.js 'url' module in React Native
 * This provides implementations for commonly used URL functionality
 */

// React Native already has global URL support, so we can use that
const URL = global.URL || require('react-native-url-polyfill/url').URL;
const URLSearchParams = global.URLSearchParams || require('react-native-url-polyfill/url').URLSearchParams;

// Parse function similar to Node's url.parse
function parse(urlStr, parseQueryString = false, slashesDenoteHost = false) {
  try {
    const url = new URL(urlStr);
    const result = {
      protocol: url.protocol,
      slashes: url.protocol === 'http:' || url.protocol === 'https:',
      auth: null,
      host: url.host,
      port: url.port,
      hostname: url.hostname,
      hash: url.hash,
      search: url.search,
      query: parseQueryString ? Object.fromEntries(new URLSearchParams(url.search)) : url.search.substr(1),
      pathname: url.pathname,
      path: `${url.pathname}${url.search}`,
      href: url.href
    };

    // Handle auth if present
    if (url.username || url.password) {
      result.auth = `${url.username || ''}${url.password ? `:${url.password}` : ''}`;
    }

    return result;
  } catch (e) {
    return {};
  }
}

// Format function similar to Node's url.format
function format(urlObject) {
  if (typeof urlObject === 'string') return urlObject;

  const { protocol, host, pathname, search, hash } = urlObject;
  let result = '';

  if (protocol) result += `${protocol}//`;
  if (host) result += host;
  if (pathname) result += pathname;
  if (search) result += search.startsWith('?') ? search : `?${search}`;
  if (hash) result += hash.startsWith('#') ? hash : `#${hash}`;

  return result;
}

// Export the URL module API
module.exports = {
  URL,
  URLSearchParams,
  parse,
  format,
  resolve: (from, to) => new URL(to, new URL(from, 'resolve://').href).toString().replace('resolve://', ''),
};
