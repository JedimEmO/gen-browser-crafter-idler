import { createStore } from 'solid-js/store';
import type { GameState, Machine, WorldTile, Chunk, View, InventorySlot } from '../types';
import { itemData } from '../data/items';
import { biomes, worldResourceData } from '../data/biomes';
import { recipes } from '../data/recipes';

const initialState: GameState = {
  inventory: {
    hotbar: [
      { item: 'pickaxe', count: 1 },
      { item: 'wrench', count: 1 },
      { item: 'chest', count: 5 },
      { item: 'furnace', count: 3 },
      null,
      null,
      null,
      null,
      null
    ],
    main: Array(27).fill(null),
  },
  activeHotbarSlot: 0,
  cursorItem: null,
  toolDurability: { pickaxe: 59, iron_pickaxe: null },
  factoryGrid: Array(100).fill(null),
  currentView: 'factory',
  selectedGridIndex: null,
  world: {
    seed: Math.random() * 100000,
    chunks: {},
    playerX: 0,
    playerY: 0,
  },
};

const [gameState, setGameState] = createStore<GameState>(initialState);

// Game actions
export const gameActions = {
  setView: (view: View) => {
    setGameState('currentView', view);
    setGameState('selectedGridIndex', null);
  },
  
  
  selectGridIndex: (index: number | null) => {
    setGameState('selectedGridIndex', index);
  },
  
  addToInventory: (item: string, amount: number): number => {
    let remaining = amount;
    
    // First try to add to existing stacks in hotbar
    for (let i = 0; i < 9; i++) {
      if (remaining <= 0) break;
      const slot = gameState.inventory.hotbar[i];
      if (slot && slot.item === item && slot.count < 64) {
        const canAdd = Math.min(remaining, 64 - slot.count);
        setGameState('inventory', 'hotbar', i, 'count', (c) => c + canAdd);
        remaining -= canAdd;
      }
    }
    
    // Then try to add to existing stacks in main inventory
    for (let i = 0; i < 27; i++) {
      if (remaining <= 0) break;
      const slot = gameState.inventory.main[i];
      if (slot && slot.item === item && slot.count < 64) {
        const canAdd = Math.min(remaining, 64 - slot.count);
        setGameState('inventory', 'main', i, 'count', (c) => c + canAdd);
        remaining -= canAdd;
      }
    }
    
    // Then add to empty slots in hotbar
    for (let i = 0; i < 9; i++) {
      if (remaining <= 0) break;
      if (!gameState.inventory.hotbar[i]) {
        const canAdd = Math.min(remaining, 64);
        setGameState('inventory', 'hotbar', i, { item, count: canAdd });
        remaining -= canAdd;
      }
    }
    
    // Finally add to empty slots in main inventory
    for (let i = 0; i < 27; i++) {
      if (remaining <= 0) break;
      if (!gameState.inventory.main[i]) {
        const canAdd = Math.min(remaining, 64);
        setGameState('inventory', 'main', i, { item, count: canAdd });
        remaining -= canAdd;
      }
    }
    
    return amount - remaining; // Return amount actually added
  },
  
  addManyToInventory: (entries: Record<string, number>) => {
    for (const k in entries) {
      gameActions.addToInventory(k, entries[k] || 0);
    }
  },
  
  removeFromInventory: (item: string, amount: number): boolean => {
    // First count total available
    let total = 0;
    for (const slot of gameState.inventory.hotbar) {
      if (slot && slot.item === item) total += slot.count;
    }
    for (const slot of gameState.inventory.main) {
      if (slot && slot.item === item) total += slot.count;
    }
    
    if (total < amount) return false;
    
    let toRemove = amount;
    
    // Remove from main inventory first (Minecraft behavior)
    for (let i = 26; i >= 0; i--) {
      if (toRemove <= 0) break;
      const slot = gameState.inventory.main[i];
      if (slot && slot.item === item) {
        const removeCount = Math.min(toRemove, slot.count);
        if (removeCount === slot.count) {
          setGameState('inventory', 'main', i, null);
        } else {
          setGameState('inventory', 'main', i, 'count', (c) => c - removeCount);
        }
        toRemove -= removeCount;
      }
    }
    
    // Then remove from hotbar
    for (let i = 8; i >= 0; i--) {
      if (toRemove <= 0) break;
      const slot = gameState.inventory.hotbar[i];
      if (slot && slot.item === item) {
        const removeCount = Math.min(toRemove, slot.count);
        if (removeCount === slot.count) {
          setGameState('inventory', 'hotbar', i, null);
        } else {
          setGameState('inventory', 'hotbar', i, 'count', (c) => c - removeCount);
        }
        toRemove -= removeCount;
      }
    }
    
    return true;
  },
  
  setActiveHotbarSlot: (slot: number) => {
    if (slot >= 0 && slot <= 8) {
      setGameState('activeHotbarSlot', slot);
    }
  },
  
  setCursorItem: (item: InventorySlot) => {
    setGameState('cursorItem', item);
  },
  
  placeMachine: (index: number, machine: Machine) => {
    setGameState('factoryGrid', index, machine);
  },
  
  removeMachine: (index: number) => {
    setGameState('factoryGrid', index, null);
  },
  
  updateMachine: (index: number, updater: (machine: Machine) => Machine) => {
    const machine = gameState.factoryGrid[index];
    if (machine) {
      setGameState('factoryGrid', index, updater(machine));
    }
  },
  
  move: (dx: number, dy: number) => {
    setGameState('world', 'playerX', (x) => x + dx);
    setGameState('world', 'playerY', (y) => y + dy);
    setGameState('selectedGridIndex', null);
  },
  
  getChunk: (chunkX: number, chunkY: number): Chunk => {
    const key = `${chunkX},${chunkY}`;
    if (!gameState.world.chunks[key]) {
      const chunk = generateChunk(chunkX, chunkY, gameState.world.seed);
      setGameState('world', 'chunks', key, chunk);
    }
    return gameState.world.chunks[key];
  },
  
  updateWorldTile: (chunkX: number, chunkY: number, tileIndex: number, tile: WorldTile | null) => {
    const key = `${chunkX},${chunkY}`;
    setGameState('world', 'chunks', key, 'tiles', tileIndex, tile);
  },
  
  updateToolDurability: (tool: string, durability: number | null) => {
    setGameState('toolDurability', tool, durability);
  },
  
  craft: (recipeId: string): boolean => {
    const recipe = recipes[recipeId];
    if (!recipe) return false;
    
    const ingredients: Record<string, number> = {};
    recipe.shape.filter(i => i).forEach(item => { 
      if (item) {
        ingredients[item] = (ingredients[item] || 0) + 1; 
      }
    });
    
    // Count available items
    const available: Record<string, number> = {};
    for (const slot of gameState.inventory.hotbar) {
      if (slot) {
        available[slot.item] = (available[slot.item] || 0) + slot.count;
      }
    }
    for (const slot of gameState.inventory.main) {
      if (slot) {
        available[slot.item] = (available[slot.item] || 0) + slot.count;
      }
    }
    
    // Check if we have all ingredients
    for (const item in ingredients) {
      if ((available[item] || 0) < ingredients[item]) {
        return false;
      }
    }
    
    // Remove ingredients
    for (const item in ingredients) { 
      gameActions.removeFromInventory(item, ingredients[item]); 
    }
    
    // Add output
    gameActions.addToInventory(recipe.output, recipe.amount);
    
    // Initialize tool durability
    const itemInfo = itemData[recipe.output];
    if (itemInfo.isTool && itemInfo.maxDurability && gameState.toolDurability[recipe.output] === null) {
      gameActions.updateToolDurability(recipe.output, itemInfo.maxDurability);
    }
    
    return true;
  }
};

// Helper functions
function generateChunk(chunkX: number, chunkY: number, seed: number): Chunk {
  const chunk: Chunk = {
    tiles: Array(100).fill(null),
    biome: getBiome(chunkX, chunkY, seed)
  };
  
  const biomeInfo = biomes[chunk.biome];
  
  for (let i = 0; i < 100; i++) {
    for (const resource in biomeInfo.resources) {
      const spawnChance = biomeInfo.resources[resource];
      if (Math.random() < spawnChance) {
        chunk.tiles[i] = { 
          type: resource, 
          hp: worldResourceData[resource].hp 
        };
        break;
      }
    }
  }
  
  return chunk;
}

function getBiome(x: number, y: number, seed: number): string {
  // Simple noise function for biome generation
  const noise = (x: number, y: number) => {
    const n = Math.sin(x * 0.1 + seed) * Math.cos(y * 0.1 + seed);
    return (n + 1) / 2; // Normalize to 0-1
  };
  
  const noiseValue = noise(x, y);
  if (noiseValue < 0.2) return 'desert';
  if (noiseValue < 0.4) return 'swamp';
  if (noiseValue < 0.6) return 'forest';
  if (noiseValue < 0.8) return 'rocky_hills';
  return 'plains';
}

export { gameState, setGameState };