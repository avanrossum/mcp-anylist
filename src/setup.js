/**
 * Interactive setup command for configuring AnyList credentials.
 * Prompts for email/password and stores them encrypted via anylist-api.
 */

const readline = require('readline');
const AnyList = require('anylist');
const { getCredentialsPath } = require('./lib/anylist-client.js');

/**
 * Prompt for user input (with optional hidden input for passwords).
 * @param {string} question - Prompt text
 * @param {boolean} hidden - Hide input (for passwords)
 * @returns {Promise<string>}
 */
function prompt(question, hidden = false) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    if (hidden && process.stdin.isTTY) {
      // Hide password input
      process.stdout.write(question);
      const stdin = process.stdin;
      stdin.setRawMode(true);
      stdin.resume();
      stdin.setEncoding('utf8');

      let password = '';
      const onData = (char) => {
        if (char === '\n' || char === '\r' || char === '\u0004') {
          stdin.setRawMode(false);
          stdin.removeListener('data', onData);
          rl.close();
          console.log(); // New line after password
          resolve(password);
        } else if (char === '\u0003') {
          // Ctrl+C
          process.exit();
        } else if (char === '\u007F' || char === '\b') {
          // Backspace
          password = password.slice(0, -1);
        } else {
          password += char;
        }
      };
      stdin.on('data', onData);
    } else {
      // Normal input (or non-TTY)
      rl.question(question, (answer) => {
        rl.close();
        resolve(answer);
      });
    }
  });
}

/**
 * Run the interactive setup.
 */
async function runSetup() {
  console.log('');
  console.log('┌─────────────────────────────────────────┐');
  console.log('│       mcp-anylist Setup                 │');
  console.log('└─────────────────────────────────────────┘');
  console.log('');
  console.log('This will configure your AnyList credentials.');
  console.log('Credentials are stored encrypted locally.');
  console.log('');

  const email = await prompt('AnyList Email: ');
  if (!email.trim()) {
    console.error('Error: Email is required.');
    process.exit(1);
  }

  const password = await prompt('AnyList Password: ', true);
  if (!password) {
    console.error('Error: Password is required.');
    process.exit(1);
  }

  console.log('');
  console.log('Authenticating with AnyList...');

  try {
    const credentialsFile = getCredentialsPath();
    const client = new AnyList({
      email: email.trim(),
      password,
      credentialsFile,
    });

    // Login to verify credentials and store tokens
    await client.login(false);
    client.teardown();

    console.log('');
    console.log('✓ Authentication successful!');
    console.log(`✓ Credentials saved to: ${credentialsFile}`);
    console.log('');
    console.log('You can now use mcp-anylist with Claude Desktop.');
    console.log('');
    console.log('Add this to your Claude Desktop config:');
    console.log('~/Library/Application Support/Claude/claude_desktop_config.json');
    console.log('');
    console.log(JSON.stringify({
      mcpServers: {
        anylist: {
          command: 'npx',
          args: ['mcp-anylist'],
        },
      },
    }, null, 2));
    console.log('');
  } catch (error) {
    console.error('');
    console.error('✗ Authentication failed:', error.message);
    console.error('');
    console.error('Please check your email and password and try again.');
    process.exit(1);
  }
}

module.exports = { runSetup };
