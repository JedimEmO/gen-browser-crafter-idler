# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

```bash
npm install      # Install dependencies
npm run dev      # Start development server at http://localhost:5173
npm run build    # Build for production (runs TypeScript check first)
npm run preview  # Preview production build
```

## Project Overview

IdleCrafter Singularity is a browser-based idle and automation game built with Solid.js, TypeScript, and Tailwind CSS. Players progress from manual resource gathering to building complex automated factories.

## High-Level Architecture

### Core State Management
- **gameStore.ts** (src/stores/gameStore.ts:1) - Central game state using Solid.js stores
  - Manages inventory, factory grid, world chunks, and player position
  - Provides actions for all game mutations
  - Handles world generation with biome-based resource distribution

### Game Loop System
- **gameLoop.ts** (src/systems/gameLoop.ts:1) - Processes machine operations every second
  - Handles furnace smelting with fuel consumption
  - Manages coke oven processing
  - Coordinates item transfer between machines via input/output sides

### Component Structure
- **App.tsx** (src/App.tsx:1) - Main layout with three-column design
  - Left: Inventory and machine details
  - Center: Main game grid (factory or exploration view)
  - Right: Recipe book
- **MainGrid.tsx** - Renders either factory grid or world exploration view
- **GridTile.tsx** - Individual tile handling for both factory machines and world resources

### Data Architecture
- **types/index.ts** - TypeScript definitions for all game entities
- **data/** directory contains game content:
  - items.ts - Item definitions with properties
  - recipes.ts - Crafting, smelting, and coke oven recipes
  - biomes.ts - World generation parameters
  - icons.tsx - SVG icon components

### Key Game Mechanics
1. **Dual View System**: Factory view for automation, Explore view for resource gathering
2. **Machine Configuration**: Machines have configurable input/output sides
3. **Tool Durability**: Tools degrade with use and must be replaced
4. **Chunk-Based World**: 10x10 tile chunks generated on-demand
5. **Drag & Drop**: Items can be dragged between inventory and machines

## Development Guidelines

When implementing new features:
1. Follow the existing state management pattern in gameStore
2. Add new machine types to the Machine union type
3. Process new machines in the game loop
4. Use the existing icon system for visual consistency
5. Maintain the chunk-based world generation approach

### Important: Avoiding Store Mutations in Solid.js

When updating stores in Solid.js, NEVER mutate nested objects or arrays directly. This will cause "Cannot mutate a Store directly" errors.

**Wrong way:**
```typescript
gameActions.updateMachine(index, (m) => {
  m.inventory.slot.count++; // DIRECT MUTATION - BAD!
  return m;
});
```

**Correct way:**
```typescript
gameActions.updateMachine(index, (m) => {
  return {
    ...m,
    inventory: {
      ...m.inventory,
      slot: { ...m.inventory.slot, count: m.inventory.slot.count + 1 }
    }
  };
});
```

For arrays, always create new arrays:
```typescript
const newInventory = [...m.inventory];
newInventory[i] = { ...newInventory[i], count: newCount };
```