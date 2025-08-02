import type { Recipe, SmeltingRecipe, CokeOvenRecipe, BlastFurnaceRecipe } from '../types';

export const recipes: Record<string, Recipe> = {
  stick: { shape: ['wood', null, null, 'wood', null, null, null, null, null], output: 'stick', amount: 4 },
  brick_mixture: { shape: ['sand', 'clay', null, 'clay', 'sand', null, null, null, null], output: 'brick_mixture', amount: 2 },
  pickaxe: { shape: ['wood', 'wood', 'wood', null, 'stick', null, null, 'stick', null], output: 'pickaxe', amount: 1, requiresBench: true },
  chest: { shape: ['wood', 'wood', 'wood', 'wood', null, 'wood', 'wood', 'wood', 'wood'], output: 'chest', amount: 1, requiresBench: true },
  furnace: { shape: ['stone', 'stone', 'stone', 'stone', null, 'stone', 'stone', 'stone', 'stone'], output: 'furnace', amount: 1, requiresBench: true },
  coke_oven: { shape: ['brick', 'brick', 'brick', 'brick', null, 'brick', 'brick', 'brick', 'brick'], output: 'coke_oven', amount: 1, requiresBench: true },
  wrench: { shape: [null, 'iron_ingot', null, 'iron_ingot', 'stick', 'iron_ingot', null, 'stick', null], output: 'wrench', amount: 1, requiresBench: true },
  gear: { shape: [null, 'stick', null, 'stick', 'iron_ingot', 'stick', null, 'stick', null], output: 'gear', amount: 1, requiresBench: true },
  iron_pickaxe: { shape: ['iron_ingot', 'iron_ingot', 'iron_ingot', null, 'stick', null, null, 'stick', null], output: 'iron_pickaxe', amount: 1, requiresBench: true },
  crafting_bench: { shape: ['wood', 'wood', null, 'wood', 'wood', null, null, null, null], output: 'crafting_bench', amount: 1 },
  hammer: { shape: ['stick', 'iron_ingot', null, null, null, null, null, null, null], output: 'hammer', amount: 1 },
  iron_plate: { shape: ['hammer', 'iron_ingot', 'iron_ingot', null, null, null, null, null, null], output: 'iron_plate', amount: 1, requiresBench: true },
  blast_furnace: { shape: ['iron_plate', 'brick', 'iron_plate', 'iron_plate', 'brick', 'iron_plate', 'iron_plate', 'brick', 'iron_plate'], output: 'blast_furnace', amount: 1, requiresBench: true },
};

export const smeltingRecipes: Record<string, SmeltingRecipe> = { 
  iron_ore: { output: 'iron_ingot', time: 100 }, // 5 seconds at 20 TPS
  brick_mixture: { output: 'brick', time: 60 }, // 3 seconds at 20 TPS
};

export const cokeOvenRecipes: Record<string, CokeOvenRecipe> = {
  wood: { output: 'coal_coke', time: 200 }, // 10 seconds at 20 TPS
};

export const blastFurnaceRecipes: Record<string, BlastFurnaceRecipe> = {
  iron_ingot: { output: 'steel_ingot', time: 150 }, // 7.5 seconds at 20 TPS
};