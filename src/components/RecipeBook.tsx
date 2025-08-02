import { For, createSignal, Show, createMemo } from 'solid-js';
import type { Component } from 'solid-js';
import { recipes } from '../data/recipes';
import { itemData } from '../data/items';
import { gameState, gameActions, setGameState } from '../stores/gameStore';
import { messageActions } from '../stores/messageStore';
import type { CraftingBench } from '../types';

export const RecipeBook: Component = () => {
  const [hoveredRecipe, setHoveredRecipe] = createSignal<string | null>(null);
  const [mousePos, setMousePos] = createSignal({ x: 0, y: 0 });
  
  const handleFillGrid = (recipeId: string) => {
    const recipe = recipes[recipeId];
    
    // Check if we're in a crafting bench
    const isBenchOpen = gameState.selectedGridIndex !== null && 
                       gameState.factoryGrid[gameState.selectedGridIndex]?.type === 'crafting_bench';
    
    // Check if recipe requires bench but we're not in one
    if (recipe.requiresBench && !isBenchOpen) {
      messageActions.logMessage('This recipe requires a crafting bench!', 'error');
      return;
    }
    
    // Check if recipe fits in 2x2 grid when not in bench
    if (!isBenchOpen) {
      let fits2x2 = true;
      for (let i = 0; i < 9; i++) {
        const row = Math.floor(i / 3);
        const col = i % 3;
        if ((row >= 2 || col >= 2) && recipe.shape[i] !== null) {
          fits2x2 = false;
          break;
        }
      }
      if (!fits2x2) {
        messageActions.logMessage('This recipe requires a crafting bench!', 'error');
        return;
      }
    }
    
    // Collect required items
    const requiredItems: Record<string, number> = {};
    recipe.shape.forEach(item => {
      if (item) {
        requiredItems[item] = (requiredItems[item] || 0) + 1;
      }
    });
    
    // Check if player has enough items
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
    
    for (const item in requiredItems) {
      if ((available[item] || 0) < requiredItems[item]) {
        messageActions.logMessage('Not enough materials!', 'error');
        return;
      }
    }
    
    // Clear the appropriate grid first
    if (isBenchOpen) {
      // Clear 3x3 crafting bench grid
      gameActions.updateMachine(gameState.selectedGridIndex!, (machine) => {
        const bench = machine as CraftingBench;
        return { ...bench, craftingGrid: Array(9).fill(null) };
      });
    } else {
      // Clear 2x2 inventory crafting grid
      for (let i = 0; i < 4; i++) {
        setGameState('inventory', 'craftingGrid', i, null);
      }
    }
    
    // Remove items from inventory and place in grid
    const itemsToRemove: Record<string, number> = { ...requiredItems };
    
    // Remove from inventory
    for (let i = 0; i < 9; i++) {
      const slot = gameState.inventory.hotbar[i];
      if (slot && itemsToRemove[slot.item] > 0) {
        const toRemove = Math.min(slot.count, itemsToRemove[slot.item]);
        itemsToRemove[slot.item] -= toRemove;
        if (toRemove === slot.count) {
          setGameState('inventory', 'hotbar', i, null);
        } else {
          setGameState('inventory', 'hotbar', i, 'count', (c) => c - toRemove);
        }
      }
    }
    
    for (let i = 0; i < 27; i++) {
      const slot = gameState.inventory.main[i];
      if (slot && itemsToRemove[slot.item] > 0) {
        const toRemove = Math.min(slot.count, itemsToRemove[slot.item]);
        itemsToRemove[slot.item] -= toRemove;
        if (toRemove === slot.count) {
          setGameState('inventory', 'main', i, null);
        } else {
          setGameState('inventory', 'main', i, 'count', (c) => c - toRemove);
        }
      }
    }
    
    // Place items in the appropriate grid
    if (isBenchOpen) {
      // Fill 3x3 crafting bench grid
      gameActions.updateMachine(gameState.selectedGridIndex!, (machine) => {
        const bench = machine as CraftingBench;
        const newGrid = [...bench.craftingGrid];
        recipe.shape.forEach((item, index) => {
          if (item) {
            newGrid[index] = { type: item, count: 1 };
          }
        });
        return { ...bench, craftingGrid: newGrid };
      });
    } else {
      // Fill 2x2 inventory crafting grid
      const mapped2x2 = [
        recipe.shape[0], recipe.shape[1],
        recipe.shape[3], recipe.shape[4]
      ];
      mapped2x2.forEach((item, index) => {
        if (item) {
          setGameState('inventory', 'craftingGrid', index, { item, count: 1 });
        }
      });
    }
    
    messageActions.logMessage(`Filled crafting grid with ${itemData[recipe.output].name} recipe.`, 'success');
  };
  
  const getIngredients = (recipeId: string) => {
    const recipe = recipes[recipeId];
    const ingredients: Record<string, number> = {};
    recipe.shape.filter(i => i).forEach(item => {
      if (item) {
        ingredients[item] = (ingredients[item] || 0) + 1;
      }
    });
    return ingredients;
  };
  
  const canFillGrid = (recipeId: string) => {
    const recipe = recipes[recipeId];
    
    // Check if we're in a crafting bench
    const isBenchOpen = gameState.selectedGridIndex !== null && 
                       gameState.factoryGrid[gameState.selectedGridIndex]?.type === 'crafting_bench';
    
    // Can't fill bench recipes without a bench
    if (recipe.requiresBench && !isBenchOpen) {
      return false;
    }
    
    // Check if recipe fits in 2x2 grid when not in bench
    if (!isBenchOpen) {
      for (let i = 0; i < 9; i++) {
        const row = Math.floor(i / 3);
        const col = i % 3;
        if ((row >= 2 || col >= 2) && recipe.shape[i] !== null) {
          return false; // Recipe too big for 2x2 grid
        }
      }
    }
    
    const ingredients = getIngredients(recipeId);
    
    // Count available items in inventory
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
    return true;
  };
  
  const sortedRecipes = createMemo(() => {
    return Object.entries(recipes).sort((a, b) => {
      // Sort by fillability first, then by name
      const canFillA = canFillGrid(a[0]);
      const canFillB = canFillGrid(b[0]);
      if (canFillA !== canFillB) return canFillB ? 1 : -1;
      return itemData[a[1].output].name.localeCompare(itemData[b[1].output].name);
    });
  });
  
  const handleMouseEnter = (e: MouseEvent, recipeId: string) => {
    setHoveredRecipe(recipeId);
    setMousePos({ x: e.pageX, y: e.pageY });
  };
  
  const handleMouseMove = (e: MouseEvent) => {
    setMousePos({ x: e.pageX, y: e.pageY });
  };
  
  const handleMouseLeave = () => {
    setHoveredRecipe(null);
  };
  
  return (
    <div class="panel h-full flex flex-col">
      <h2 class="panel-header">Recipes</h2>
      <div class="space-y-2 overflow-y-auto flex-1 min-h-0 pr-2">
        <For each={sortedRecipes()}>
          {([recipeId, recipe]) => {
            const fillable = createMemo(() => canFillGrid(recipeId));
            
            return (
              <div 
                class={`recipe-entry ${fillable() ? '' : 'opacity-50'}`}
                onMouseEnter={(e) => handleMouseEnter(e, recipeId)}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 flex items-center justify-center">
                    <div class="scale-75 opacity-75">
                      {itemData[recipe.output] && '🔨'}
                    </div>
                  </div>
                  <div>
                    <p class="font-medium text-sm">{itemData[recipe.output].name}</p>
                    <p class="text-xs text-gray-500">
                      ×{recipe.amount}
                      <Show when={recipe.requiresBench}>
                        <span class="text-yellow-500 ml-1">(Bench)</span>
                      </Show>
                    </p>
                  </div>
                </div>
                <button 
                  class={`btn btn-sm ${fillable() ? 'btn-primary' : ''}`}
                  onClick={() => handleFillGrid(recipeId)}
                  disabled={!fillable()}
                >
                  Fill
                </button>
              </div>
            );
          }}
        </For>
      </div>
      
      <Show when={hoveredRecipe()}>
        <div 
          class="tooltip show"
          style={{
            left: `${Math.min(mousePos().x + 15, window.innerWidth - 320)}px`,
            top: `${Math.min(mousePos().y + 15, window.innerHeight - 200)}px`
          }}
        >
          <p class="font-semibold mb-2 text-cyan-400">Required Materials:</p>
          <For each={Object.entries(getIngredients(hoveredRecipe()!))}>
            {([item, count]) => {
              // Count available items
              let available = 0;
              for (const slot of gameState.inventory.hotbar) {
                if (slot && slot.item === item) {
                  available += slot.count;
                }
              }
              for (const slot of gameState.inventory.main) {
                if (slot && slot.item === item) {
                  available += slot.count;
                }
              }
              
              const hasEnough = available >= count;
              return (
                <p class={`text-sm ${hasEnough ? 'text-green-400' : 'text-red-400'}`}>
                  • {itemData[item].name}: {available}/{count}
                </p>
              );
            }}
          </For>
        </div>
      </Show>
    </div>
  );
};