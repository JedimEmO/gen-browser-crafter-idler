import type { ItemData } from '../types';

export const itemData: Record<string, ItemData> = {
  furnace: { name: 'Furnace', isMachine: true, configurable: true, inventory: { input: null, fuel: null, output: null } },
  coke_oven: { name: 'Coke Oven', isMachine: true, configurable: true, inventory: { input: null, output: null } },
  chest: { name: 'Chest', isMachine: true, inventory: {}, capacity: 16 },
  pickaxe: { name: 'Wooden Pickaxe', isTool: true, maxDurability: 59 }, 
  iron_pickaxe: { name: 'Iron Pickaxe', isTool: true, maxDurability: 250 },
  wrench: { name: 'Wrench', isTool: true },
  wood: { name: 'Wood' }, 
  stone: { name: 'Stone' }, 
  stick: { name: 'Stick' },
  coal: { name: 'Coal', fuel: 8 }, 
  iron_ore: { name: 'Iron Ore' },
  iron_ingot: { name: 'Iron Ingot' }, 
  gear: { name: 'Gear' },
  sand: { name: 'Sand' }, 
  clay: { name: 'Clay' },
  brick_mixture: { name: 'Brick Mixture' }, 
  brick: { name: 'Brick' },
  coal_coke: { name: 'Coal Coke', fuel: 16 },
};