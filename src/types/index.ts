export type ItemData = {
  name: string;
  isMachine?: boolean;
  isTool?: boolean;
  configurable?: boolean;
  maxDurability?: number;
  fuel?: number;
  inventory?: Record<string, any>;
  capacity?: number;
}

export type Recipe = {
  shape: (string | null)[];
  output: string;
  amount: number;
  requiresBench?: boolean;
}

export type SmeltingRecipe = {
  output: string;
  time: number;
}

export type CokeOvenRecipe = {
  output: string;
  time: number;
}

export type MachineInventorySlot = {
  type: string;
  count: number;
}

export type Furnace = {
  type: 'furnace';
  inputSide: Direction;
  outputSide: Direction;
  fuel: number;
  fuelBuffer: number; // Total fuel stored
  maxFuelBuffer: number; // Maximum fuel capacity
  progress: number;
  isSmelting: boolean;
  smeltingItem?: string;
  inventory: {
    input: MachineInventorySlot | null;
    output: MachineInventorySlot | null;
  };
}

export type CokeOven = {
  type: 'coke_oven';
  inputSide: Direction;
  outputSide: Direction;
  progress: number;
  isProcessing: boolean;
  processingItem?: string;
  inventory: {
    input: MachineInventorySlot | null;
    output: MachineInventorySlot | null;
  };
}

export type Chest = {
  type: 'chest';
  inventory: (MachineInventorySlot | null)[];
  capacity: number;
}

export type CraftingBench = {
  type: 'crafting_bench';
  craftingGrid: (MachineInventorySlot | null)[];
  outputSlot: MachineInventorySlot | null;
}

export type BlastFurnaceRecipe = {
  output: string;
  time: number;
}

export type BlastFurnace = {
  type: 'blast_furnace';
  inputSide: Direction;
  outputSide: Direction;
  fuelBuffer: number; // Total fuel stored (from coal coke)
  maxFuelBuffer: number; // Maximum fuel capacity
  progress: number;
  isProcessing: boolean;
  processingItem?: string;
  inventory: {
    material: MachineInventorySlot | null; // For iron ingots
    output: MachineInventorySlot | null; // For steel ingots
  };
}

export type Machine = Furnace | CokeOven | Chest | CraftingBench | BlastFurnace;

export type Direction = 'top' | 'bottom' | 'left' | 'right';

export type WorldTile = {
  type: string;
  hp: number;
}

export type Enemy = {
  id: string;
  type: 'slime' | 'goblin' | 'wolf';
  localX: number;
  localY: number;
  hp: number;
  maxHp: number;
  damage: number;
  moveCooldown: number;
}

export type CombatState = {
  active: boolean;
  enemy: Enemy | null;
  playerHp: number;
  playerMaxHp: number;
  turn: 'player' | 'enemy';
  log: string[];
}

export type Chunk = {
  tiles: (WorldTile | null)[];
  biome: string;
  enemies: Enemy[];
}

export type BiomeData = {
  name: string;
  color: string;
  resources: Record<string, number>;
}

export type WorldResourceData = {
  name: string;
  drops: string;
  tool: string | null;
  hp: number;
}

export type View = 'factory' | 'explore';

export type InventorySlot = {
  item: string;
  count: number;
} | null;

export type GameState = {
  inventory: {
    hotbar: InventorySlot[]; // 9 slots (0-8)
    main: InventorySlot[]; // 27 slots (9-35)
    craftingGrid: InventorySlot[]; // 4 slots (2x2)
    craftingOutput: InventorySlot; // Output slot for 2x2 crafting
  };
  activeHotbarSlot: number; // 0-8
  cursorItem: InventorySlot; // Item being dragged
  toolDurability: Record<string, number | null>;
  factoryGrid: (Machine | null)[];
  currentView: View;
  selectedGridIndex: number | null;
  factoryPlayerX: number; // Player position in factory mode (0-9)
  factoryPlayerY: number; // Player position in factory mode (0-9)
  playerLevel: number; // Current player level
  experience: number; // Total experience earned
  experienceToNext: number; // XP needed for next level
  experienceProgress: number; // Progress towards current level (reset on death)
  world: {
    seed: number;
    chunks: Record<string, Chunk>;
    playerX: number;
    playerY: number;
    playerLocalX: number; // Position within chunk (0-9)
    playerLocalY: number; // Position within chunk (0-9)
  };
  combat: CombatState;
}