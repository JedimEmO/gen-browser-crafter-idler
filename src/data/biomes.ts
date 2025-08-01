import type { BiomeData, WorldResourceData } from '../types';

export const biomes: Record<string, BiomeData> = {
  plains: { name: "Plains", color: "#6a8d4b", resources: { tree: 0.1, rock: 0.05, coal_deposit: 0.03, iron_deposit: 0.02, sand_deposit: 0.05, clay_deposit: 0.05 } },
  forest: { name: "Forest", color: "#228B22", resources: { tree: 0.3 } },
  rocky_hills: { name: "Rocky Hills", color: "#A9A9A9", resources: { rock: 0.2, coal_deposit: 0.1, iron_deposit: 0.08 } },
  desert: { name: "Desert", color: "#F0E68C", resources: { sand_deposit: 0.3 } },
  swamp: { name: "Swamp", color: "#5F6456", resources: { clay_deposit: 0.3, tree: 0.05 } },
};

export const worldResourceData: Record<string, WorldResourceData> = {
  tree: { name: 'Tree', drops: 'wood', tool: null, hp: 3 },
  rock: { name: 'Rock Vein', drops: 'stone', tool: 'pickaxe', hp: 5 },
  coal_deposit: { name: 'Coal Deposit', drops: 'coal', tool: 'pickaxe', hp: 4 },
  iron_deposit: { name: 'Iron Deposit', drops: 'iron_ore', tool: 'pickaxe', hp: 4 },
  sand_deposit: { name: 'Sand Deposit', drops: 'sand', tool: 'pickaxe', hp: 5 },
  clay_deposit: { name: 'Clay Deposit', drops: 'clay', tool: 'pickaxe', hp: 5 },
};