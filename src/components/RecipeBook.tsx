import { For, createSignal, Show, createMemo } from 'solid-js';
import type { Component } from 'solid-js';
import { recipes } from '../data/recipes';
import { itemData } from '../data/items';
import { gameState, gameActions, setGameState } from '../stores/gameStore';
import { messageActions } from '../stores/messageStore';
import { iconLibrary } from '../data/icons';
import type { CraftingBench } from '../types';

export const RecipeBook: Component = () => {
  const [hoveredRecipe, setHoveredRecipe] = createSignal<string | null>(null);
  const [mousePos, setMousePos] = createSignal({ x: 0, y: 0 });
  
  
  const handleFillGrid = (recipeId: string) => {
    const recipe = recipes[recipeId];
    
    // Check if we're in a crafting bench
    const isBenchOpen = gameState.selectedGridIndex !== null && 
                       gameState.factoryGrid[gameState.selectedGridIndex]?.type === 'crafting_bench';
    
    // Fill button only works with crafting bench
    if (!isBenchOpen) {
      messageActions.logMessage('Fill button requires a crafting bench!', 'error');
      return;
    }

    // Check if the grid already matches this recipe - prevent resource waste
    const bench = gameState.factoryGrid[gameState.selectedGridIndex!] as CraftingBench;
    let gridAlreadyFilled = true;
    for (let i = 0; i < 9; i++) {
      const expectedItem = recipe.shape[i];
      const actualSlot = bench.craftingGrid[i];
      if (expectedItem) {
        if (!actualSlot || actualSlot.type !== expectedItem || actualSlot.count !== 1) {
          gridAlreadyFilled = false;
          break;
        }
      } else {
        if (actualSlot !== null) {
          gridAlreadyFilled = false;
          break;
        }
      }
    }
    
    if (gridAlreadyFilled) {
      messageActions.logMessage('Grid already contains this recipe!', 'info');
      return;
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
    
    // Clear the 3x3 crafting bench grid first
    gameActions.updateMachine(gameState.selectedGridIndex!, (machine) => {
      const bench = machine as CraftingBench;
      return { ...bench, craftingGrid: Array(9).fill(null) };
    });
    
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
    
    
    // Fill button only works with crafting bench
    if (!isBenchOpen) {
      return false;
    }

    // Check if the grid already matches this recipe
    const bench = gameState.factoryGrid[gameState.selectedGridIndex!] as CraftingBench;
    let gridAlreadyFilled = true;
    for (let i = 0; i < 9; i++) {
      const expectedItem = recipe.shape[i];
      const actualSlot = bench.craftingGrid[i];
      if (expectedItem) {
        if (!actualSlot || actualSlot.type !== expectedItem || actualSlot.count !== 1) {
          gridAlreadyFilled = false;
          break;
        }
      } else {
        if (actualSlot !== null) {
          gridAlreadyFilled = false;
          break;
        }
      }
    }
    if (gridAlreadyFilled) {
      return false; // Grid already has this recipe
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
  
  const handleRecipeClick = (recipeId: string, e: MouseEvent) => {
    // Shift-click to fill the recipe
    if (e.shiftKey) {
      handleFillGrid(recipeId);
    }
  };

  return (
    <div class="panel h-full flex flex-col">
      <h2 class="panel-header">Recipe Book</h2>
      <div class="text-xs text-gray-400 mb-3 px-1">
        Shift-click to fill recipe
      </div>
      <div class="flex-1 overflow-y-auto min-h-0">
        <div class="grid grid-cols-6 gap-1 p-2">
          <For each={sortedRecipes()}>
            {([recipeId, recipe]) => {
              const fillable = createMemo(() => canFillGrid(recipeId));
              
              return (
                <div 
                  class="relative w-10 h-10 border rounded flex items-center justify-center cursor-pointer transition-colors"
                  classList={{ 
                    'opacity-40 border-gray-600 bg-gray-800': !fillable(),
                    'border-cyan-400 bg-gray-700 hover:bg-gray-600': fillable(),
                    'border-gray-500 bg-gray-750': !fillable()
                  }}
                  style={{ 
                    "min-width": "40px",
                    "min-height": "40px"
                  }}
                  onMouseEnter={(e) => handleMouseEnter(e, recipeId)}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  onClick={(e) => handleRecipeClick(recipeId, e)}
                  title={`${itemData[recipe.output].name} (×${recipe.amount})${recipe.requiresBench ? ' - Requires Bench' : ''}`}
                >
                  <Show 
                    when={iconLibrary[recipe.output]}
                    fallback={
                      <div class="w-full h-full flex items-center justify-center text-white text-xs font-bold bg-red-500 rounded">
                        NO ICON
                      </div>
                    }
                  >
                    <div class="w-full h-full p-0.5">
                      {iconLibrary[recipe.output]()}
                    </div>
                  </Show>
                  <Show when={recipe.amount > 1}>
                    <div class="absolute bottom-0 right-0 bg-gray-900 text-white text-[10px] px-1 rounded-tl leading-3 min-w-[12px] text-center">
                      {recipe.amount}
                    </div>
                  </Show>
                  <Show when={recipe.requiresBench}>
                    <div class="absolute top-0 right-0 text-yellow-400 text-[10px] leading-3">
                      ⚒
                    </div>
                  </Show>
                </div>
              );
            }}
          </For>
        </div>
      </div>
      
      <Show when={hoveredRecipe()}>
        <div 
          class="tooltip show"
          style={{
            left: `${Math.min(mousePos().x + 15, window.innerWidth - 320)}px`,
            top: `${Math.min(mousePos().y + 15, window.innerHeight - 200)}px`,
            'z-index': '1000'
          }}
        >
          <div class="font-semibold mb-2 text-cyan-400">
            {itemData[recipes[hoveredRecipe()!].output].name}
            <span class="text-gray-400 ml-1">×{recipes[hoveredRecipe()!].amount}</span>
          </div>
          <Show when={recipes[hoveredRecipe()!].requiresBench}>
            <p class="text-xs text-yellow-400 mb-2">⚒ Requires Crafting Bench</p>
          </Show>
          <p class="font-medium mb-1 text-white text-sm">Materials Needed:</p>
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
                <div class="flex items-center gap-2 text-sm mb-1">
                  <div class="w-4 h-4 flex items-center justify-center">
                    {iconLibrary[item] ? iconLibrary[item]() : '?'}
                  </div>
                  <span class={hasEnough ? 'text-green-400' : 'text-red-400'}>
                    {itemData[item].name}: {available}/{count}
                  </span>
                </div>
              );
            }}
          </For>
          <Show when={canFillGrid(hoveredRecipe()!)}>
            <div class="text-xs text-cyan-300 mt-2 border-t border-gray-600 pt-2">
              Shift-click to fill crafting grid
            </div>
          </Show>
        </div>
      </Show>
    </div>
  );
};