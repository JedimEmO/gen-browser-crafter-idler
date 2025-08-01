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

export type Machine = Furnace | CokeOven | Chest;

export type Direction = 'top' | 'bottom' | 'left' | 'right';

export type WorldTile = {
  type: string;
  hp: number;
}

export type Chunk = {
  tiles: (WorldTile | null)[];
  biome: string;
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
  };
  activeHotbarSlot: number; // 0-8
  cursorItem: InventorySlot; // Item being dragged
  toolDurability: Record<string, number | null>;
  factoryGrid: (Machine | null)[];
  currentView: View;
  selectedGridIndex: number | null;
  world: {
    seed: number;
    chunks: Record<string, Chunk>;
    playerX: number;
    playerY: number;
    playerLocalX: number; // Position within chunk (0-9)
    playerLocalY: number; // Position within chunk (0-9)
  };
}