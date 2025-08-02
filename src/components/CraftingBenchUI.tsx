import { For, Show, createSignal, createEffect, createMemo, onMount, onCleanup } from 'solid-js';
import type { Component } from 'solid-js';
import { gameState, gameActions } from '../stores/gameStore';
import { iconLibrary } from '../data/icons';
import { recipes } from '../data/recipes';
import type { MachineInventorySlot, CraftingBench } from '../types';
import { RecipeBook } from './RecipeBook';

type Props = {
  gridIndex: number;
  onClose: () => void;
};

export const CraftingBenchUI: Component<Props> = (props) => {
  const [outputItem, setOutputItem] = createSignal<{ item: string; amount: number } | null>(null);
  const [distDrag, setDistDrag] = createSignal<{ active: boolean; button: 0|2; hovered: number[]; startIndex: number | null }>({ active: false, button: 0, hovered: [], startIndex: null });

  const machine = () => {
    const m = gameState.factoryGrid[props.gridIndex];
    return m?.type === 'crafting_bench' ? m as CraftingBench : null;
  };

  const findMatchingRecipe = (grid: (MachineInventorySlot | null)[]) => {
    for (const [, recipe] of Object.entries(recipes)) {
      let matches = true;
      for (let i = 0; i < 9; i++) {
        const gridItem = grid[i]?.type || null;
        const recipeItem = recipe.shape[i];
        if (gridItem !== recipeItem) {
          matches = false;
          break;
        }
      }
      if (matches) {
        return { item: recipe.output, amount: recipe.amount };
      }
    }
    return null;
  };

  createEffect(() => {
    const m = machine();
    if (m) {
      const recipe = findMatchingRecipe(m.craftingGrid);
      setOutputItem(recipe);
      
      if (recipe && !m.outputSlot) {
        gameActions.updateMachine(props.gridIndex, (machine) => ({
          ...machine,
          outputSlot: { type: recipe.item, count: 0 }
        }) as any);
      } else if (!recipe && m.outputSlot) {
        gameActions.updateMachine(props.gridIndex, (machine) => ({
          ...machine,
          outputSlot: null
        }) as any);
      }
    }
  });

  const handleSlotMouseDown = (e: MouseEvent, index: number) => {
    e.preventDefault();
    const m = machine();
    if (!m) return;

    const cursorItem = gameState.cursorItem;
    const slot = m.craftingGrid[index];

    // Shift-click for quick transfer
    if (e.shiftKey && e.button === 0 && slot) {
      // Transfer to player inventory using the centralized addToInventory function
      const transferred = gameActions.addToInventory(slot.type, slot.count);
      
      // Update crafting grid
      if (transferred > 0) {
        gameActions.updateMachine(props.gridIndex, (machine) => {
          const m = machine as CraftingBench;
          const newGrid = [...m.craftingGrid];
          if (transferred === slot.count) {
            newGrid[index] = null;
          } else {
            newGrid[index] = { ...slot, count: slot.count - transferred };
          }
          return { ...m, craftingGrid: newGrid };
        });
      }
      return;
    }

    if (e.button === 0) { // Left click
      if (cursorItem) {
        // Start drag to distribute
        setDistDrag({ active: true, button: 0, hovered: [index], startIndex: index });
        return; // Don't place immediately, wait for drag or mouseup
      } else if (slot) {
        gameActions.setCursorItem({ item: slot.type, count: slot.count });
        gameActions.updateMachine(props.gridIndex, (machine) => {
          const m = machine as CraftingBench;
          const newGrid = [...m.craftingGrid];
          newGrid[index] = null;
          return { ...m, craftingGrid: newGrid };
        });
      }
    } else if (e.button === 2) { // Right click
      if (cursorItem) {
        // Start drag to distribute with right click (place one each)
        setDistDrag({ active: true, button: 2, hovered: [index], startIndex: index });
        
        if (!slot || (slot.type === cursorItem.item && slot.count < 64)) {
          gameActions.updateMachine(props.gridIndex, (machine) => {
            const m = machine as CraftingBench;
            const newGrid = [...m.craftingGrid];
            newGrid[index] = {
              type: cursorItem.item,
              count: (slot?.count || 0) + 1
            };
            return { ...m, craftingGrid: newGrid };
          });

          if (cursorItem.count === 1) {
            gameActions.setCursorItem(null);
          } else {
            gameActions.setCursorItem({
              item: cursorItem.item,
              count: cursorItem.count - 1
            });
          }
        }
      } else if (slot && slot.count > 1) {
        const halfCount = Math.floor(slot.count / 2);
        gameActions.setCursorItem({ item: slot.type, count: halfCount });
        gameActions.updateMachine(props.gridIndex, (machine) => {
          const m = machine as CraftingBench;
          const newGrid = [...m.craftingGrid];
          newGrid[index] = {
            type: slot.type,
            count: slot.count - halfCount
          };
          return { ...m, craftingGrid: newGrid };
        });
      }
    }
  };

  const handleSlotMouseEnter = (index: number) => {
    if (distDrag().active) {
      const exists = distDrag().hovered.includes(index);
      if (!exists) {
        setDistDrag(s => ({ ...s, hovered: [...s.hovered, index] }));
      }
    }
  };


  const handleOutputClick = (e: MouseEvent) => {
    e.preventDefault();
    const output = outputItem();
    if (!output) return;
    
    const m = machine();
    if (!m) return;

    // Shift-click to transfer to inventory (craft as many as possible)
    if (e.shiftKey && e.button === 0) {
      const originalRecipe = output.item; // Track the original recipe output
      let canContinue = true;
      
      while (canContinue) {
        // Check if we can still craft (have materials and inventory space)
        const currentOutput = outputItem();
        if (!currentOutput) break;
        
        // Stop if the recipe changed
        if (currentOutput.item !== originalRecipe) break;
        
        const transferred = gameActions.addToInventory(currentOutput.item, currentOutput.amount);
        if (transferred < currentOutput.amount) break; // No more inventory space
        
        // Consume items from crafting grid
        gameActions.updateMachine(props.gridIndex, (machine) => {
          const m = machine as CraftingBench;
          const newGrid = m.craftingGrid.map((slot: MachineInventorySlot | null) => {
            if (!slot) return null;
            if (slot.count === 1) return null;
            return { ...slot, count: slot.count - 1 };
          });
          return { ...m, craftingGrid: newGrid };
        });
        
        // Check if we still have materials for another craft
        const updatedMachine = machine();
        if (!updatedMachine) break;
        
        // Let the effect recalculate the output
        // Then check if the recipe is still the same
        const newOutput = outputItem();
        if (!newOutput || newOutput.item !== originalRecipe) {
          canContinue = false;
        }
      }
    }
    // Left-click to pick up
    else if (e.button === 0) {
      const cursor = gameState.cursorItem;
      
      // Can pick up if cursor is empty or holding the same item type
      if (!cursor || (cursor.item === output.item && cursor.count + output.amount <= 64)) {
        const newCount = cursor ? cursor.count + output.amount : output.amount;
        
        // Pick up or add to cursor
        gameActions.setCursorItem({ item: output.item, count: newCount });
        
        // Consume items from crafting grid
        gameActions.updateMachine(props.gridIndex, (machine) => {
          const m = machine as CraftingBench;
          const newGrid = m.craftingGrid.map((slot: MachineInventorySlot | null) => {
            if (!slot) return null;
            if (slot.count === 1) return null;
            return { ...slot, count: slot.count - 1 };
          });
          return { ...m, craftingGrid: newGrid };
        });
      }
    }
  };

  // Calculate preview distribution
  const getPreviewDistribution = createMemo(() => {
    const s = distDrag();
    if (!s.active || !gameState.cursorItem) return {};
    
    const distribution: Record<number, number> = {};
    const cursor = gameState.cursorItem;
    const targets = s.hovered;
    
    if (s.button === 2) {
      // Right click - one per slot
      targets.forEach(i => {
        distribution[i] = 1;
      });
    } else {
      // Left click - distribute evenly
      const perSlot = Math.floor(cursor.count / targets.length);
      let extra = cursor.count % targets.length;
      
      targets.forEach(i => {
        distribution[i] = perSlot + (extra > 0 ? 1 : 0);
        if (extra > 0) extra--;
      });
    }
    
    return distribution;
  });

  onMount(() => {
    const onMouseUp = () => {
      const s = distDrag();
      if (!s.active) return;
      
      const cursor = gameState.cursorItem;
      if (!cursor || s.hovered.length === 0) {
        setDistDrag({ active: false, button: 0, hovered: [], startIndex: null });
        return;
      }

      const m = machine();
      if (!m) {
        setDistDrag({ active: false, button: 0, hovered: [], startIndex: null });
        return;
      }
      
      // Check if this is a single click
      const isSingleClick = s.hovered.length === 1 && s.hovered[0] === s.startIndex;
      
      // Handle single left-click - place all items
      if (isSingleClick && s.button === 0) {
        const index = s.hovered[0];
        const slot = m.craftingGrid[index];
        
        if (!slot) {
          // Empty slot - place all
          gameActions.updateMachine(props.gridIndex, (machine) => {
            const m = machine as CraftingBench;
            const newGrid = [...m.craftingGrid];
            newGrid[index] = { type: cursor.item, count: cursor.count };
            return { ...m, craftingGrid: newGrid };
          });
          gameActions.setCursorItem(null);
        } else if (slot.type === cursor.item) {
          // Same item - stack
          const spaceAvailable = 64 - slot.count;
          const toAdd = Math.min(spaceAvailable, cursor.count);
          if (toAdd > 0) {
            gameActions.updateMachine(props.gridIndex, (machine) => {
              const m = machine as CraftingBench;
              const newGrid = [...m.craftingGrid];
              newGrid[index] = { ...newGrid[index]!, count: newGrid[index]!.count + toAdd };
              return { ...m, craftingGrid: newGrid };
            });
            if (toAdd === cursor.count) {
              gameActions.setCursorItem(null);
            } else {
              gameActions.setCursorItem({ item: cursor.item, count: cursor.count - toAdd });
            }
          }
        } else {
          // Different item - swap
          gameActions.updateMachine(props.gridIndex, (machine) => {
            const m = machine as CraftingBench;
            const newGrid = [...m.craftingGrid];
            newGrid[index] = { type: cursor.item, count: cursor.count };
            return { ...m, craftingGrid: newGrid };
          });
          gameActions.setCursorItem({ item: slot.type, count: slot.count });
        }
        setDistDrag({ active: false, button: 0, hovered: [], startIndex: null });
        return;
      }

      if (s.button === 2) {
        // Right click - place one item per slot
        let placed = 0;
        const updates: number[] = [];
        
        for (const i of s.hovered) {
          if (placed >= cursor.count) break;
          const slot = m.craftingGrid[i];
          
          if (!slot || (slot.type === cursor.item && slot.count < 64)) {
            updates.push(i);
            placed++;
          }
        }
        
        if (updates.length > 0) {
          gameActions.updateMachine(props.gridIndex, (machine) => {
            const m = machine as CraftingBench;
            const newGrid = [...m.craftingGrid];
            
            for (const i of updates) {
              if (!newGrid[i]) {
                newGrid[i] = { type: cursor.item, count: 1 };
              } else if (newGrid[i]!.type === cursor.item && newGrid[i]!.count < 64) {
                newGrid[i] = { ...newGrid[i]!, count: newGrid[i]!.count + 1 };
              }
            }
            
            return { ...m, craftingGrid: newGrid };
          });
          
          if (placed === cursor.count) {
            gameActions.setCursorItem(null);
          } else {
            gameActions.setCursorItem({ item: cursor.item, count: cursor.count - placed });
          }
        }
      } else {
        // Left click - distribute evenly
        let remaining = cursor.count;
        const validSlots: Array<{i: number, cap: number}> = [];
        const emptySlots: number[] = [];
        
        for (const i of s.hovered) {
          const slot = m.craftingGrid[i];
          if (slot && slot.type === cursor.item && slot.count < 64) {
            validSlots.push({ i, cap: 64 - slot.count });
          } else if (!slot) {
            emptySlots.push(i);
          }
        }
        
        // Calculate distribution
        const allSlots = [...validSlots.map(s => s.i), ...emptySlots];
        const perSlot = Math.floor(cursor.count / allSlots.length);
        let extra = cursor.count % allSlots.length;
        
        gameActions.updateMachine(props.gridIndex, (machine) => {
          const m = machine as CraftingBench;
          const newGrid = [...m.craftingGrid];
          
          // First handle existing stacks
          for (const slot of validSlots) {
            const currentCount = newGrid[slot.i]!.count;
            const toAdd = Math.min(perSlot + (extra > 0 ? 1 : 0), slot.cap);
            if (toAdd > 0) {
              newGrid[slot.i] = { ...newGrid[slot.i]!, count: currentCount + toAdd };
              remaining -= toAdd;
              if (extra > 0 && toAdd > perSlot) extra--;
            }
          }
          
          // Then handle empty slots
          for (const i of emptySlots) {
            const toAdd = Math.min(perSlot + (extra > 0 ? 1 : 0), 64);
            if (toAdd > 0) {
              newGrid[i] = { type: cursor.item, count: toAdd };
              remaining -= toAdd;
              if (extra > 0 && toAdd > perSlot) extra--;
            }
          }
          
          return { ...m, craftingGrid: newGrid };
        });
        
        if (remaining === 0) {
          gameActions.setCursorItem(null);
        } else if (remaining < cursor.count) {
          gameActions.setCursorItem({ item: cursor.item, count: remaining });
        }
      }
      
      setDistDrag({ active: false, button: 0, hovered: [], startIndex: null });
    };

    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('contextmenu', (e) => e.preventDefault());

    onCleanup(() => {
      window.removeEventListener('mouseup', onMouseUp);
    });
  });

  return (
    <div class="fixed inset-0 z-[100]" style="background-color: var(--bg-primary); display: grid; grid-template-columns: 1fr 360px; gap: 16px; padding: 24px;">
        <div class="panel p-0 flex flex-col h-full">
          <div class="flex items-center justify-between px-6 py-4 border-b border-[var(--border-primary)]">
            <div class="panel-header">Crafting Bench</div>
            <button onClick={props.onClose} class="text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xl">×</button>
          </div>

        <div class="flex gap-10 px-6 py-5 items-start border-b border-[var(--border-primary)]">
          <div>
            <div class="text-xs uppercase tracking-wide text-[var(--text-secondary)] mb-3">Crafting Grid</div>
            <div class="grid grid-cols-3 gap-3 bg-[var(--bg-tertiary)]/50 p-4 rounded-lg border border-[var(--border-primary)]">
              <For each={Array(9).fill(null)}>
                {(_, index) => {
                  const slot = () => (machine()?.craftingGrid[index()] as MachineInventorySlot | null)
                  
                  const preview = createMemo(() => {
                    const dist = getPreviewDistribution();
                    const s = distDrag();
                    if (s.active && dist[index()] && !slot()) {
                      return { type: gameState.cursorItem!.item, count: dist[index()] };
                    }
                    return null;
                  });
                  
                  return (
                    <div
                      class="slot"
                      onMouseDown={(e) => handleSlotMouseDown(e, index())}
                      onMouseEnter={() => handleSlotMouseEnter(index())}
                      onContextMenu={(e) => e.preventDefault()}
                    >
                      <Show when={slot() || preview()}>
                        {(() => {
                          const item = slot()?.type || preview()?.type;
                          const count = slot()?.count || preview()?.count || 0;
                          const isPreview = !slot() && preview();
                          
                          return (
                            <>
                              <div class={`w-12 h-12 flex items-center justify-center ${isPreview ? 'opacity-50' : ''}`}>
                                {item && iconLibrary[item] && iconLibrary[item]()}
                              </div>
                              <Show when={count > 1}>
                                <span class={`item-count ${isPreview ? 'opacity-50' : ''}`}>{count}</span>
                              </Show>
                            </>
                          );
                        })()}
                      </Show>
                    </div>
                  );
                }}
              </For>
            </div>
          </div>

          <div class="flex items-center h-full px-2">
            <div class="text-[var(--text-secondary)] text-2xl">→</div>
          </div>
           <div class="min-w-[160px]">
             <div class="text-xs uppercase tracking-wide text-[var(--text-secondary)] mb-3">Output</div>
             <div 
               class="slot w-16 h-16"
               classList={{ 'cursor-pointer': Boolean(outputItem()) }}
               onMouseDown={handleOutputClick}
               onContextMenu={(e) => e.preventDefault()}
             >
               <Show when={outputItem()}>
                 <div class="w-10 h-10 flex items-center justify-center">
                   {iconLibrary[outputItem()!.item] && iconLibrary[outputItem()!.item]()}
                 </div>
                 <Show when={outputItem()!.amount > 1}>
                   <span class="item-count">{outputItem()!.amount}</span>
                 </Show>
               </Show>
             </div>
           </div>
        </div>
        
      </div>
      
      <div class="panel p-0 h-full overflow-hidden">
        <div class="px-4 py-3 border-b border-[var(--border-primary)]">
          <div class="panel-header">Recipe Book</div>
        </div>
        <div class="p-4 h-[calc(100%-48px)] overflow-auto">
          <RecipeBook />
        </div>
      </div>
    </div>
  );
};