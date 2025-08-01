import { For, createSignal, Show, createMemo } from 'solid-js';
import type { Component } from 'solid-js';
import { recipes } from '../data/recipes';
import { itemData } from '../data/items';
import { gameState, gameActions } from '../stores/gameStore';
import { messageActions } from '../stores/messageStore';

export const RecipeBook: Component = () => {
  const [hoveredRecipe, setHoveredRecipe] = createSignal<string | null>(null);
  const [mousePos, setMousePos] = createSignal({ x: 0, y: 0 });
  
  const handleCraft = (recipeId: string) => {
    if (gameActions.craft(recipeId)) {
      const recipe = recipes[recipeId];
      messageActions.logMessage(`Crafted ${recipe.amount}x ${itemData[recipe.output].name}.`, 'success');
    } else {
      messageActions.logMessage(`Not enough materials!`, 'error');
    }
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
  
  const canCraft = (recipeId: string) => {
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
      // Sort by craftability first, then by name
      const canCraftA = canCraft(a[0]);
      const canCraftB = canCraft(b[0]);
      if (canCraftA !== canCraftB) return canCraftB ? 1 : -1;
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
            const craftable = createMemo(() => canCraft(recipeId));
            
            return (
              <div 
                class={`recipe-entry ${craftable() ? '' : 'opacity-50'}`}
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
                    <p class="text-xs text-gray-500">×{recipe.amount}</p>
                  </div>
                </div>
                <button 
                  class={`btn btn-sm ${craftable() ? 'btn-primary' : ''}`}
                  onClick={() => handleCraft(recipeId)}
                  disabled={!craftable()}
                >
                  Craft
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