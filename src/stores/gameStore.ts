import { createStore } from 'solid-js/store';
import type { GameState, Machine, WorldTile, Chunk, View, InventorySlot, Enemy } from '../types';
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
    playerLocalX: 5,
    playerLocalY: 5,
  },
  combat: {
    active: false,
    enemy: null,
    playerHp: 100,
    playerMaxHp: 100,
    turn: 'player',
    log: [],
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
  
  movePlayer: (dx: number, dy: number) => {
    const newLocalX = gameState.world.playerLocalX + dx;
    const newLocalY = gameState.world.playerLocalY + dy;
    
    // Check for chunk boundary crossing
    if (newLocalX < 0) {
      setGameState('world', 'playerX', (x) => x - 1);
      setGameState('world', 'playerLocalX', 9);
    } else if (newLocalX > 9) {
      setGameState('world', 'playerX', (x) => x + 1);
      setGameState('world', 'playerLocalX', 0);
    } else {
      setGameState('world', 'playerLocalX', newLocalX);
    }
    
    if (newLocalY < 0) {
      setGameState('world', 'playerY', (y) => y - 1);
      setGameState('world', 'playerLocalY', 9);
    } else if (newLocalY > 9) {
      setGameState('world', 'playerY', (y) => y + 1);
      setGameState('world', 'playerLocalY', 0);
    } else {
      setGameState('world', 'playerLocalY', newLocalY);
    }
    
    // Check for enemy collision immediately after moving
    const chunkKey = `${gameState.world.playerX},${gameState.world.playerY}`;
    const chunk = gameState.world.chunks[chunkKey];
    if (chunk && chunk.enemies) {
      const collidingEnemy = chunk.enemies.find(enemy => 
        enemy.localX === gameState.world.playerLocalX && 
        enemy.localY === gameState.world.playerLocalY
      );
      if (collidingEnemy && !gameState.combat.active) {
        gameActions.startCombat(collidingEnemy);
      }
    }
  },
  
  movePlayerToChunk: (chunkX: number, chunkY: number) => {
    setGameState('world', 'playerX', chunkX);
    setGameState('world', 'playerY', chunkY);
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
  },
  
  // Combat actions
  startCombat: (enemy: Enemy) => {
    setGameState('combat', 'active', true);
    setGameState('combat', 'enemy', enemy);
    setGameState('combat', 'turn', 'player');
    setGameState('combat', 'log', ['A wild ' + enemy.type + ' appears!']);
  },
  
  endCombat: () => {
    setGameState('combat', 'active', false);
    setGameState('combat', 'enemy', null);
    setGameState('combat', 'log', []);
  },
  
  addCombatLog: (message: string) => {
    setGameState('combat', 'log', (log) => [...log, message]);
  },
  
  setTurn: (turn: 'player' | 'enemy') => {
    setGameState('combat', 'turn', turn);
  },
  
  damagePlayer: (damage: number) => {
    setGameState('combat', 'playerHp', (hp) => Math.max(0, hp - damage));
  },
  
  damageEnemy: (damage: number) => {
    setGameState('combat', 'enemy', 'hp', (hp) => Math.max(0, hp - damage));
  },
  
  removeEnemy: (chunkKey: string, enemyId: string) => {
    const chunk = gameState.world.chunks[chunkKey];
    if (chunk) {
      setGameState('world', 'chunks', chunkKey, 'enemies', (enemies) => 
        enemies.filter(e => e.id !== enemyId)
      );
    }
  },
  
  updateChunkEnemy: (chunkKey: string, enemyIndex: number, updates: Partial<Enemy>) => {
    setGameState('world', 'chunks', chunkKey, 'enemies', enemyIndex, (enemy) => ({
      ...enemy,
      ...updates
    }));
  }
};

// Helper functions
const enemyStats = {
  slime: { hp: 20, damage: 5 },
  goblin: { hp: 30, damage: 8 },
  wolf: { hp: 40, damage: 12 }
};

function generateChunk(chunkX: number, chunkY: number, seed: number): Chunk {
  const chunk: Chunk = {
    tiles: Array(100).fill(null),
    biome: getBiome(chunkX, chunkY, seed),
    enemies: []
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
  
  // Generate enemies (spawn 1-3 per chunk)
  const enemyCount = Math.floor(Math.random() * 3) + 1;
  const enemyTypes: Array<'slime' | 'goblin' | 'wolf'> = ['slime', 'goblin', 'wolf'];
  
  for (let i = 0; i < enemyCount; i++) {
    const enemyType = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
    const localX = Math.floor(Math.random() * 10);
    const localY = Math.floor(Math.random() * 10);
    
    // Don't spawn enemy on a resource tile or at player spawn
    if (!chunk.tiles[localY * 10 + localX] && !(localX === 5 && localY === 5)) {
      chunk.enemies.push({
        id: `${chunkX},${chunkY}-${Date.now()}-${i}`,
        type: enemyType,
        localX,
        localY,
        hp: enemyStats[enemyType].hp,
        maxHp: enemyStats[enemyType].hp,
        damage: enemyStats[enemyType].damage,
        moveCooldown: 0
      });
    }
  }
  
  return chunk;
}

function getBiome(x: number, y: number, seed: number): string {
  // Simple noise function for biome generation
  const noise = (x: number, y: number) => {
    const n = Math.sin(x * 0.3 + seed) * Math.cos(y * 0.3 + seed);
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