/**
 * AnyList client singleton wrapper.
 * Provides lazy initialization and connection management for MCP tools.
 */

const AnyList = require('anylist');
const path = require('path');
const os = require('os');
const fs = require('fs');

let clientInstance = null;
let connectionPromise = null;

/**
 * Get the path to the credentials file.
 * @returns {string}
 */
function getCredentialsPath() {
  if (process.env.ANYLIST_CREDENTIALS_FILE) {
    return process.env.ANYLIST_CREDENTIALS_FILE;
  }

  return path.join(os.homedir(), '.mcp-anylist-credentials');
}

/**
 * Check if credentials file exists.
 * @returns {boolean}
 */
function hasStoredCredentials() {
  return fs.existsSync(getCredentialsPath());
}

/**
 * Get or create the AnyList client singleton.
 * Uses stored credentials if available, falls back to environment variables.
 * @returns {Promise<AnyList>} Connected AnyList client
 * @throws {Error} If credentials are missing or connection fails
 */
async function getClient() {
  if (clientInstance) {
    return clientInstance;
  }

  if (connectionPromise) {
    return connectionPromise;
  }

  connectionPromise = (async () => {
    const credentialsFile = getCredentialsPath();
    const hasStored = hasStoredCredentials();

    // Check for environment variables (legacy/override method)
    const email = process.env.ANYLIST_EMAIL;
    const password = process.env.ANYLIST_PASSWORD;

    if (!hasStored && (!email || !password)) {
      throw new Error(
        'AnyList credentials not configured. Run "npx mcp-anylist --setup" to authenticate.'
      );
    }

    const options = { credentialsFile };

    // If env vars provided, use them (allows override of stored credentials)
    if (email && password) {
      options.email = email;
      options.password = password;
    }

    const client = new AnyList(options);

    // Login without WebSocket for stateless MCP tools
    await client.login(false);

    clientInstance = client;
    return client;
  })();

  return connectionPromise;
}

/**
 * Disconnect the client and reset singleton state.
 * Call this for cleanup before process exit.
 */
function disconnect() {
  if (clientInstance) {
    clientInstance.teardown();
    clientInstance = null;
    connectionPromise = null;
  }
}

/**
 * Check if client is currently connected.
 * @returns {boolean}
 */
function isConnected() {
  return clientInstance !== null;
}

module.exports = {
  getClient,
  disconnect,
  isConnected,
  getCredentialsPath,
  hasStoredCredentials,
};
