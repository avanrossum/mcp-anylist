# mcp-anylist - Project Roadmap

## What is mcp-anylist?

MCP server that enables Claude to interact with AnyList meal planning, recipes, and shopping lists.

### Core Features

- **Meal Planning** - CRUD for calendar events
- **Labels** - Manage meal categories (Breakfast, Lunch, Dinner)
- **Recipes** - Read recipes and collections
- **Shopping Lists** - Basic list management

## Current Sprint

### Done

- [x] Project setup (package.json, vitest, .gitignore)
- [x] Core library modules (anylist-client, validators, formatters, date-utils)
- [x] MCP server setup (server.js, index.js)
- [x] Meal planning tools (4 event tools)
- [x] Label tools (4 label tools)
- [x] Recipe tools (2 recipe tools)
- [x] Shopping list tools (4 list tools)
- [x] Unit tests for lib modules (66 tests passing)
- [x] Documentation (README, ROADMAP.md)
- [x] Interactive setup command (`--setup`)
- [x] Encrypted credential storage
- [x] GitHub Actions CI (macOS + Ubuntu, Node 18/20/22)

### In Progress

- [ ] Test with real AnyList credentials
- [ ] Test with Claude Desktop
- [ ] Complete code review (DRY, separation of concerns, best practices, sane tests)

### Up Next

- [ ] Publish to npm
- [ ] Submit to MCP registry

## Feature Backlog

### High Priority

- [ ] Add `anylist_check_item` tool for checking/unchecking items
- [ ] Add date range helpers for common queries (this week, next week)
- [ ] Windows compatibility testing

### Medium Priority

- [ ] Recipe creation tool
- [ ] Recipe search by ingredient
- [ ] Bulk meal planning (plan a week at once)

### Low Priority / Ideas

- [ ] Recipe scaling
- [ ] Shopping list from recipe ingredients
- [ ] Category management
- [ ] macOS Keychain integration for credentials

## Technical Debt

- [ ] Update anylist dependency to upstream npm when PR merged
- [ ] Add integration test script for manual verification

## Version History

| Version | Date | Highlights |
|---------|------|------------|
| 0.1.1 | 2026-02-15 | Interactive setup, CI/CD, simplified config |
| 0.1.0 | 2026-02-15 | Initial implementation with 14 tools |
