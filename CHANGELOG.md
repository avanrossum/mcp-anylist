# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.1] - 2026-02-15

### Added

- Interactive setup command: `npx mcp-anylist --setup`
- Encrypted credential storage (no plaintext passwords in config)
- Help command: `npx mcp-anylist --help`
- GitHub Actions CI workflow (tests on macOS and Ubuntu, Node 18/20/22)
- Platform support disclaimer in README

### Changed

- Simplified Quick Start in README (3 steps instead of complex config)
- Credentials now stored at `~/.mcp-anylist-credentials` by default
- Environment variables now optional (for advanced users only)

## [0.1.0] - 2026-02-15

### Added

- Initial MCP server implementation
- Meal planning tools:
  - `anylist_get_meal_planning_events` - Get calendar events with optional date filter
  - `anylist_create_meal_planning_event` - Create calendar events
  - `anylist_update_meal_planning_event` - Update existing events
  - `anylist_delete_meal_planning_event` - Delete events
- Label tools:
  - `anylist_get_labels` - Get all calendar labels
  - `anylist_create_label` - Create new labels
  - `anylist_update_label` - Update label name/color
  - `anylist_delete_label` - Delete labels
- Recipe tools:
  - `anylist_get_recipes` - Get recipes with search/collection filter
  - `anylist_get_recipe_collections` - Get all collections
- Shopping list tools:
  - `anylist_get_lists` - Get all shopping lists
  - `anylist_get_list_items` - Get items from a list
  - `anylist_add_list_item` - Add items to a list
  - `anylist_remove_list_item` - Remove items from a list
- Core library modules:
  - Singleton AnyList client wrapper
  - Input validators with detailed error messages
  - Response formatters for clean JSON output
  - Date utilities for YYYY-MM-DD handling
- Unit tests for all pure library functions (66 tests)
- Documentation (README, ROADMAP.md)
