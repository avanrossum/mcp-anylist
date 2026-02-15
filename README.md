# mcp-anylist

MCP server for AnyList meal planning and shopping lists.

## Quick Start

### 1. Install and authenticate

```bash
npx mcp-anylist --setup
```

This will prompt for your AnyList email and password, then store your credentials securely.

### 2. Add to Claude

#### Claude Code (CLI or Desktop) — Recommended

Add to your project's `.mcp.json` (for project-specific) or `~/.claude/settings.json` (for global):

```json
{
  "mcpServers": {
    "anylist": {
      "command": "npx",
      "args": ["mcp-anylist"]
    }
  }
}
```

This is ideal for meal planning projects where you have control docs (preferences, staples, etc.) in your project's `CLAUDE.md`.

#### Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "anylist": {
      "command": "npx",
      "args": ["mcp-anylist"]
    }
  }
}
```

### 3. Restart Claude

Restart Claude Code or Claude Desktop. That's it! You can now ask Claude to manage your meals and shopping lists.

## Available Tools

### Meal Planning

| Tool | Description |
|------|-------------|
| `anylist_get_meal_planning_events` | Get calendar events (optional date filter) |
| `anylist_create_meal_planning_event` | Add a meal to the calendar |
| `anylist_update_meal_planning_event` | Update an existing meal |
| `anylist_delete_meal_planning_event` | Remove a meal from the calendar |

### Labels

| Tool | Description |
|------|-------------|
| `anylist_get_labels` | Get all labels (Breakfast, Lunch, Dinner, etc.) |
| `anylist_create_label` | Create a new label |
| `anylist_update_label` | Update a label's name or color |
| `anylist_delete_label` | Delete a label |

### Recipes

| Tool | Description |
|------|-------------|
| `anylist_get_recipes` | Search/list recipes |
| `anylist_get_recipe_collections` | List recipe collections |

### Shopping Lists

| Tool | Description |
|------|-------------|
| `anylist_get_lists` | Get all shopping lists |
| `anylist_get_list_items` | Get items from a list |
| `anylist_add_list_item` | Add an item to a list |
| `anylist_remove_list_item` | Remove an item from a list |

## Example Usage

Once configured, you can ask Claude:

- "Add 'Spaghetti Carbonara' to my meal plan for dinner on Friday"
- "What meals do I have planned for next week?"
- "Show me my recipes that contain chicken"
- "Add milk and eggs to my grocery list"

## Advanced Configuration

### Re-authenticate

If you need to change accounts or refresh credentials:

```bash
npx mcp-anylist --setup
```

### Environment Variables (Optional)

For advanced users or CI environments, you can use environment variables instead of the setup command:

| Variable | Description |
|----------|-------------|
| `ANYLIST_EMAIL` | Your AnyList account email |
| `ANYLIST_PASSWORD` | Your AnyList account password |
| `ANYLIST_CREDENTIALS_FILE` | Custom path for credentials (default: `~/.mcp-anylist-credentials`) |

## Development

```bash
# Clone and install
git clone https://github.com/avanrossum/mcp-anylist.git
cd mcp-anylist
npm install

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with MCP Inspector
npx @modelcontextprotocol/inspector node src/index.js
```

## Development Methodology

mcp-anylist is built using AI-assisted development with structured engineering practices. Every feature follows a full software development lifecycle: requirements are captured in a living roadmap, architecture decisions and lessons learned are documented in session context files, and a shared set of design standards (coding conventions, style guides, and testing standards) governs consistency across projects. AI tooling accelerates implementation, but the engineering rigor is human-driven: clear specifications, incremental commits, extracted and tested pure logic, CI/CD gates (lint + test on every push), and a release script that enforces quality checks before any build ships. The methodology treats AI as a collaborator operating within well-defined constraints, not as an autonomous agent — the standards, architecture documentation, and accumulated project memory are what make AI-assisted development effective at scale.

## Platform Support

This project is developed and tested on **macOS**. It should work on Linux, but Windows compatibility has not been tested.

If you're on a different platform and encounter issues, or would like to contribute platform-specific improvements, please fork and submit a PR. Contributions are welcome!

## Disclaimer

This project uses [anylist-api](https://github.com/codetheweb/anylist), an unofficial reverse-engineered API wrapper. It is not affiliated with or endorsed by AnyList.

The author has discussed the use of reverse-engineered APIs with the AnyList team. While they have not explicitly approved this project, they have indicated they do not intend to intentionally break compatibility.

**Note:** This package currently depends on a [fork of anylist-api](https://github.com/avanrossum/anylist) that adds calendar label CRUD and recipe collection support. A PR has been submitted to the upstream repository. Once merged, this dependency will switch to the official npm package.

Use at your own risk.

## License

MIT
