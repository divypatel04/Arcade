/**
 * A minimal polyfill for the Node.js 'tls' module in React Native
 * This provides empty implementations of commonly used methods
 */

// Import our net polyfill to extend from it
const net = require('./net-polyfill');

class TLSSocket extends net.Socket {
  constructor(options) {
    super(options);
    this.encrypted = true;
  }
}

// Export a minimal implementation of the 'tls' module
module.exports = {
  TLSSocket,
  connect: () => new TLSSocket(),
  createServer: () => ({
    listen: () => {},
    close: () => {},
    on: () => {}
  })
};
