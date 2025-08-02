import { For, Show, onMount, onCleanup, createSignal, createEffect, createMemo } from 'solid-js';
import type { Component } from 'solid-js';
import { gameState, gameActions, setGameState } from '../stores/gameStore';
import { itemData } from '../data/items';
import { iconLibrary } from '../data/icons';
import { recipes } from '../data/recipes';
import type { InventorySlot, Chest } from '../types';

interface SlotProps {
  slot: InventorySlot;
  index: number;
  type: 'hotbar' | 'main';
  isActive?: boolean;
  preview?: { item: string; count: number } | null;
  onMouseDown?: (e: MouseEvent) => void;
  onMouseUp?: (e: MouseEvent) => void;
  onMouseEnter?: (e: MouseEvent) => void;
  onMouseMove?: (e: MouseEvent) => void;
  onMouseLeave?: () => void;
}

const InventorySlotComponent: Component<SlotProps> = (props) => {
  const handleMouseDown = (e: MouseEvent) => {
    e.preventDefault();
    if (gameState.combat.active) return; // Block dragging during combat
    props.onMouseDown?.(e);
  };

  return (
    <div 
      class={`slot ${props.isActive ? 'active-hotbar' : ''}`}
      onMouseDown={handleMouseDown}
      onMouseUp={props.onMouseUp}
      onMouseEnter={props.onMouseEnter}
      onMouseMove={props.onMouseMove}
      onMouseLeave={props.onMouseLeave}
      data-slot-type={props.type}
      data-slot-index={props.index}
    >
      <Show when={props.slot || props.preview}>
        {(() => {
          const item = props.slot?.item || props.preview?.item;
          const count = props.slot?.count || props.preview?.count || 0;
          const isPreview = !props.slot && props.preview;
          
          return (
            <>
              <div class={isPreview ? 'opacity-50' : ''}>
                {item && iconLibrary[item] ? 
                  iconLibrary[item]() : 
                  <span class="text-xs font-medium">{item && itemData[item]?.name.charAt(0).toUpperCase()}</span>
                }
              </div>
              <Show when={count > 1}>
                <div class={`item-count ${isPreview ? 'opacity-50' : ''}`}>{count}</div>
              </Show>
            </>
          );
        })()}
      </Show>
    </div>
  );
};

export const MinecraftInventory: Component = () => {
  const [hoveredSlot, setHoveredSlot] = createSignal<{type: 'hotbar' | 'main', index: number, item: string} | null>(null);
  const [mousePos, setMousePos] = createSignal({ x: 0, y: 0 });
  const [distDrag, setDistDrag] = createSignal<{ active: boolean; button: 0|2; hovered: number[]; type: 'main' | 'crafting' | null; startIndex: number | null }>({ active: false, button: 0, hovered: [], type: null, startIndex: null });
  
  // Check for matching recipes in the 2x2 crafting grid
  createEffect(() => {
    const grid = gameState.inventory.craftingGrid;
    
    // Try to find a matching recipe
    for (const [, recipe] of Object.entries(recipes)) {
      // Skip recipes that require a bench
      if (recipe.requiresBench) continue;
      
      // Check if recipe fits in 2x2 grid
      let fits2x2 = true;
      for (let i = 0; i < 9; i++) {
        const row = Math.floor(i / 3);
        const col = i % 3;
        if (row >= 2 || col >= 2) {
          if (recipe.shape[i] !== null) {
            fits2x2 = false;
            break;
          }
        }
      }
      
      if (!fits2x2) continue;
      
      // Map 3x3 recipe to 2x2 grid
      const mapped2x2 = [
        recipe.shape[0], recipe.shape[1],
        recipe.shape[3], recipe.shape[4]
      ];
      
      // Check if grid matches recipe
      let matches = true;
      for (let i = 0; i < 4; i++) {
        const gridItem = grid[i]?.item || null;
        const recipeItem = mapped2x2[i];
        if (gridItem !== recipeItem) {
          matches = false;
          break;
        }
      }
      
      if (matches) {
        // Set crafting output
        setGameState('inventory', 'craftingOutput', { item: recipe.output, count: recipe.amount });
        return;
      }
    }
    
    // No matching recipe found
    setGameState('inventory', 'craftingOutput', null);
  });
  
  // Helper function to add items to a specific inventory section
  const addToInventorySection = (section: 'hotbar' | 'main', item: string, amount: number): number => {
    let remaining = amount;
    const slots = section === 'hotbar' ? 9 : 27;
    
    // First try to add to existing stacks
    for (let i = 0; i < slots; i++) {
      if (remaining <= 0) break;
      const slot = gameState.inventory[section][i];
      if (slot && slot.item === item && slot.count < 64) {
        const canAdd = Math.min(remaining, 64 - slot.count);
        setGameState('inventory', section, i, 'count', (c) => c + canAdd);
        remaining -= canAdd;
      }
    }
    
    // Then add to empty slots
    for (let i = 0; i < slots; i++) {
      if (remaining <= 0) break;
      if (!gameState.inventory[section][i]) {
        const canAdd = Math.min(remaining, 64);
        setGameState('inventory', section, i, { item, count: canAdd });
        remaining -= canAdd;
      }
    }
    
    return amount - remaining; // Return amount actually added
  };
  
  const handleSlotMouseEnter = (e: MouseEvent, type: 'hotbar' | 'main' | 'crafting' | 'craftingOutput', index: number) => {
    let slot: InventorySlot = null;
    if (type === 'hotbar') {
      slot = gameState.inventory.hotbar[index];
    } else if (type === 'main') {
      slot = gameState.inventory.main[index];
    } else if (type === 'crafting') {
      slot = gameState.inventory.craftingGrid[index];
    } else if (type === 'craftingOutput') {
      slot = gameState.inventory.craftingOutput;
    }
    
    if (slot) {
      setHoveredSlot({ type: type as any, index, item: slot.item });
      setMousePos({ x: e.pageX, y: e.pageY });
    }
    
    if (distDrag().active && (type === 'main' || type === 'crafting')) {
      const exists = distDrag().hovered.includes(index);
      if (!exists) {
        // If switching between grid types, reset the hovered list
        if (distDrag().type && distDrag().type !== type) {
          setDistDrag(s => ({ ...s, hovered: [index], type: type }));
        } else {
          setDistDrag(s => ({ ...s, hovered: [...s.hovered, index], type: type }));
        }
      }
    }
  };
  
  const handleSlotMouseMove = (e: MouseEvent) => {
    setMousePos({ x: e.pageX, y: e.pageY });
  };
  
  const handleSlotMouseLeave = () => {
    setHoveredSlot(null);
  };
  
  const handleSlotMouseDown = (e: MouseEvent, type: 'hotbar' | 'main' | 'crafting', index: number) => {
    let slot: InventorySlot = null;
    if (type === 'hotbar') {
      slot = gameState.inventory.hotbar[index];
    } else if (type === 'main') {
      slot = gameState.inventory.main[index];
    } else if (type === 'crafting') {
      slot = gameState.inventory.craftingGrid[index];
    }
    
    // Shift-click for quick transfer
    if (e.shiftKey && e.button === 0 && slot) {
      e.preventDefault();
      
      // Check if a chest is open
      const openChest = gameState.selectedGridIndex !== null && 
                       gameState.factoryGrid[gameState.selectedGridIndex]?.type === 'chest' ?
                       gameState.factoryGrid[gameState.selectedGridIndex] as Chest : null;
      
      if (openChest) {
        // Transfer to chest
        let remaining = slot.count;
        let transferred = 0;
        
        gameActions.updateMachine(gameState.selectedGridIndex!, (m) => {
          const chest = { ...m } as Chest;
          const newInventory = [...chest.inventory];
          
          // First try to add to existing stacks
          for (let i = 0; i < newInventory.length && remaining > 0; i++) {
            const chestSlot = newInventory[i];
            if (chestSlot && chestSlot.type === slot.item && chestSlot.count < 64) {
              const canAdd = Math.min(remaining, 64 - chestSlot.count);
              newInventory[i] = { ...chestSlot, count: chestSlot.count + canAdd };
              remaining -= canAdd;
              transferred += canAdd;
            }
          }
          
          // Then add to empty slots
          for (let i = 0; i < newInventory.length && remaining > 0; i++) {
            if (!newInventory[i]) {
              const canAdd = Math.min(remaining, 64);
              newInventory[i] = { type: slot.item, count: canAdd };
              remaining -= canAdd;
              transferred += canAdd;
            }
          }
          
          chest.inventory = newInventory;
          return chest;
        });
        
        // Update player inventory
        if (transferred > 0) {
          if (transferred === slot.count) {
            if (type === 'hotbar') {
              setGameState('inventory', 'hotbar', index, null);
            } else if (type === 'main') {
              setGameState('inventory', 'main', index, null);
            } else if (type === 'crafting') {
              setGameState('inventory', 'craftingGrid', index, null);
            }
          } else {
            if (type === 'hotbar') {
              setGameState('inventory', 'hotbar', index, 'count', (c) => c - transferred);
            } else if (type === 'main') {
              setGameState('inventory', 'main', index, 'count', (c) => c - transferred);
            } else if (type === 'crafting') {
              setGameState('inventory', 'craftingGrid', index, 'count', (c) => c - transferred);
            }
          }
        }
      } else {
        // Normal inventory transfer (hotbar <-> main <-> crafting)
        if (type === 'hotbar') {
          // Move from hotbar to main inventory
          const added = addToInventorySection('main', slot.item, slot.count);
          if (added > 0) {
            if (added === slot.count) {
              setGameState('inventory', 'hotbar', index, null);
            } else {
              setGameState('inventory', 'hotbar', index, 'count', (c) => c - added);
            }
          }
        } else if (type === 'crafting') {
          // Move from crafting grid to main inventory first, then hotbar
          let added = addToInventorySection('main', slot.item, slot.count);
          if (added < slot.count) {
            added += addToInventorySection('hotbar', slot.item, slot.count - added);
          }
          if (added > 0) {
            if (added === slot.count) {
              setGameState('inventory', 'craftingGrid', index, null);
            } else {
              setGameState('inventory', 'craftingGrid', index, 'count', (c) => c - added);
            }
          }
        } else {
          // Move from main to hotbar
          const added = addToInventorySection('hotbar', slot.item, slot.count);
          if (added > 0) {
            if (added === slot.count) {
              setGameState('inventory', 'main', index, null);
            } else {
              setGameState('inventory', 'main', index, 'count', (c) => c - added);
            }
          }
        }
      }
      return;
    }
    
    if (e.button === 0) { // Left click
      if (gameState.cursorItem) {
        // Start drag to distribute for crafting and main
        if (type === 'crafting' || type === 'main') {
          setDistDrag({ active: true, button: 0, hovered: [index], type: type, startIndex: index });
          return; // Don't place immediately, wait for drag or mouseup
        }
        
        // Normal click behavior for hotbar
        if (!slot) {
          // Empty slot - place all
          if (type === 'hotbar') {
            setGameState('inventory', 'hotbar', index, gameState.cursorItem);
          }
          gameActions.setCursorItem(null);
        } else if (slot.item === gameState.cursorItem.item) {
          // Same item - stack
          const spaceAvailable = 64 - slot.count;
          const toAdd = Math.min(spaceAvailable, gameState.cursorItem.count);
          if (toAdd > 0) {
            if (type === 'hotbar') {
              setGameState('inventory', 'hotbar', index, 'count', (c) => c + toAdd);
            }
            if (toAdd === gameState.cursorItem.count) {
              gameActions.setCursorItem(null);
            } else {
              gameActions.setCursorItem({ ...gameState.cursorItem, count: gameState.cursorItem.count - toAdd });
            }
          }
        } else {
          // Different item - swap
          const temp = slot;
          if (type === 'hotbar') {
            setGameState('inventory', 'hotbar', index, gameState.cursorItem);
          }
          gameActions.setCursorItem(temp);
        }
      } else if (slot) {
        // Pick up item
        gameActions.setCursorItem(slot);
        if (type === 'hotbar') {
          setGameState('inventory', 'hotbar', index, null);
        } else if (type === 'main') {
          setGameState('inventory', 'main', index, null);
        } else if (type === 'crafting') {
          setGameState('inventory', 'craftingGrid', index, null);
        }
      }
    } else if (e.button === 2) { // Right click
      if (gameState.cursorItem) {
        // Start drag to distribute for crafting and main
        if (type === 'crafting' || type === 'main') {
          setDistDrag({ active: true, button: 2, hovered: [index], type: type, startIndex: index });
        }
        
        // Place one item
        if (!slot || slot.item === gameState.cursorItem.item) {
          const canPlace = !slot ? 1 : Math.min(1, 64 - slot.count);
          if (canPlace > 0 && gameState.cursorItem.count >= canPlace) {
            if (!slot) {
              if (type === 'hotbar') {
                setGameState('inventory', 'hotbar', index, { item: gameState.cursorItem.item, count: 1 });
              } else if (type === 'main') {
                setGameState('inventory', 'main', index, { item: gameState.cursorItem.item, count: 1 });
              } else if (type === 'crafting') {
                setGameState('inventory', 'craftingGrid', index, { item: gameState.cursorItem.item, count: 1 });
              }
            } else {
              if (type === 'hotbar') {
                setGameState('inventory', 'hotbar', index, 'count', (c) => c + 1);
              } else if (type === 'main') {
                setGameState('inventory', 'main', index, 'count', (c) => c + 1);
              } else if (type === 'crafting') {
                setGameState('inventory', 'craftingGrid', index, 'count', (c) => c + 1);
              }
            }
            if (gameState.cursorItem.count === 1) {
              gameActions.setCursorItem(null);
            } else {
              gameActions.setCursorItem({ ...gameState.cursorItem, count: gameState.cursorItem.count - 1 });
            }
          }
        }
      } else if (slot) {
        // Pick up half
        const halfCount = Math.ceil(slot.count / 2);
        const remainingCount = slot.count - halfCount;
        
        gameActions.setCursorItem({ item: slot.item, count: halfCount });
        
        if (remainingCount === 0) {
          if (type === 'hotbar') {
            setGameState('inventory', 'hotbar', index, null);
          } else if (type === 'main') {
            setGameState('inventory', 'main', index, null);
          } else if (type === 'crafting') {
            setGameState('inventory', 'craftingGrid', index, null);
          }
        } else {
          if (type === 'hotbar') {
            setGameState('inventory', 'hotbar', index, 'count', remainingCount);
          } else if (type === 'main') {
            setGameState('inventory', 'main', index, 'count', remainingCount);
          } else if (type === 'crafting') {
            setGameState('inventory', 'craftingGrid', index, 'count', remainingCount);
          }
        }
      }
    }
  };

  const handleCraftingOutputClick = (e: MouseEvent) => {
    e.preventDefault();
    const output = gameState.inventory.craftingOutput;
    
    if (!output) return;
    
    // Shift-click to transfer to inventory (craft as many as possible)
    if (e.shiftKey && e.button === 0) {
      const originalRecipe = output.item; // Track the original recipe output
      let canContinue = true;
      
      while (canContinue) {
        // Check current output
        const currentOutput = gameState.inventory.craftingOutput;
        if (!currentOutput) break;
        
        // Stop if the recipe changed
        if (currentOutput.item !== originalRecipe) break;
        
        const transferred = gameActions.addToInventory(currentOutput.item, currentOutput.count);
        if (transferred < currentOutput.count) break; // No more inventory space
        
        // Consume items from crafting grid
        for (let i = 0; i < 4; i++) {
          const slot = gameState.inventory.craftingGrid[i];
          if (slot) {
            if (slot.count === 1) {
              setGameState('inventory', 'craftingGrid', i, null);
            } else {
              setGameState('inventory', 'craftingGrid', i, 'count', (c) => c - 1);
            }
          }
        }
        
        // Manually check if we can craft again by finding a matching recipe
        const grid = gameState.inventory.craftingGrid;
        let foundRecipe = false;
        let newRecipeOutput = null;
        
        for (const [, recipe] of Object.entries(recipes)) {
          if (recipe.requiresBench) continue;
          
          // Check if recipe fits in 2x2 grid
          let fits2x2 = true;
          for (let i = 0; i < 9; i++) {
            const row = Math.floor(i / 3);
            const col = i % 3;
            if (row >= 2 || col >= 2) {
              if (recipe.shape[i] !== null) {
                fits2x2 = false;
                break;
              }
            }
          }
          
          if (!fits2x2) continue;
          
          // Map 3x3 recipe to 2x2 grid
          const mapped2x2 = [
            recipe.shape[0], recipe.shape[1],
            recipe.shape[3], recipe.shape[4]
          ];
          
          // Check if grid matches recipe
          let matches = true;
          for (let i = 0; i < 4; i++) {
            const gridItem = grid[i]?.item || null;
            const recipeItem = mapped2x2[i];
            if (gridItem !== recipeItem) {
              matches = false;
              break;
            }
          }
          
          if (matches) {
            newRecipeOutput = recipe.output;
            setGameState('inventory', 'craftingOutput', { item: recipe.output, count: recipe.amount });
            foundRecipe = true;
            break;
          }
        }
        
        if (!foundRecipe) {
          setGameState('inventory', 'craftingOutput', null);
          canContinue = false;
        } else if (newRecipeOutput !== originalRecipe) {
          // Recipe changed, stop crafting
          canContinue = false;
        }
      }
    }
    // Left-click to pick up
    else if (e.button === 0) {
      const cursor = gameState.cursorItem;
      
      // Can pick up if cursor is empty or holding the same item type
      if (!cursor || (cursor.item === output.item && cursor.count + output.count <= 64)) {
        const newCount = cursor ? cursor.count + output.count : output.count;
        
        // Pick up or add to cursor
        gameActions.setCursorItem({ item: output.item, count: newCount });
        setGameState('inventory', 'craftingOutput', null);
        
        // Consume items from crafting grid
        for (let i = 0; i < 4; i++) {
          const slot = gameState.inventory.craftingGrid[i];
          if (slot) {
            if (slot.count === 1) {
              setGameState('inventory', 'craftingGrid', i, null);
            } else {
              setGameState('inventory', 'craftingGrid', i, 'count', (c) => c - 1);
            }
          }
        }
      }
    }
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key >= '1' && e.key <= '9') {
      const slot = parseInt(e.key) - 1;
      gameActions.setActiveHotbarSlot(slot);
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
     const onUp = () => {
       const s = distDrag();
       if (!s.active) return;
       const cursor = gameState.cursorItem;
       if (!cursor) { setDistDrag({ active: false, button: 0, hovered: [], type: null, startIndex: null }); return; }
       const targets = s.hovered;
       if (targets.length === 0) { setDistDrag({ active: false, button: 0, hovered: [], type: null, startIndex: null }); return; }
       
       // Use the tracked drag type
       const dragType = s.type || 'main';
       
       // Check if this is a single click (only one slot hovered and it's the start slot)
       const isSingleClick = targets.length === 1 && targets[0] === s.startIndex;
       
       // Handle single left-click - place all items
       if (isSingleClick && s.button === 0) {
         const index = targets[0];
         const slot = dragType === 'crafting' ? gameState.inventory.craftingGrid[index] : gameState.inventory.main[index];
         
         if (!slot) {
           // Empty slot - place all
           if (dragType === 'crafting') {
             setGameState('inventory', 'craftingGrid', index, cursor);
           } else {
             setGameState('inventory', 'main', index, cursor);
           }
           gameActions.setCursorItem(null);
         } else if (slot.item === cursor.item) {
           // Same item - stack
           const spaceAvailable = 64 - slot.count;
           const toAdd = Math.min(spaceAvailable, cursor.count);
           if (toAdd > 0) {
             if (dragType === 'crafting') {
               setGameState('inventory', 'craftingGrid', index, 'count', (c) => c + toAdd);
             } else {
               setGameState('inventory', 'main', index, 'count', (c) => c + toAdd);
             }
             if (toAdd === cursor.count) {
               gameActions.setCursorItem(null);
             } else {
               gameActions.setCursorItem({ item: cursor.item, count: cursor.count - toAdd });
             }
           }
         } else {
           // Different item - swap
           if (dragType === 'crafting') {
             setGameState('inventory', 'craftingGrid', index, cursor);
           } else {
             setGameState('inventory', 'main', index, cursor);
           }
           gameActions.setCursorItem(slot);
         }
         setDistDrag({ active: false, button: 0, hovered: [], type: null, startIndex: null });
         return;
       }
       
       if (s.button === 2) {
         let placed = 0;
         for (const i of targets) {
           if (placed >= cursor.count) break;
           const slot = dragType === 'crafting' ? gameState.inventory.craftingGrid[i] : gameState.inventory.main[i];
           if (!slot) {
             if (dragType === 'crafting') {
               setGameState('inventory', 'craftingGrid', i, { item: cursor.item, count: 1 });
             } else {
               setGameState('inventory', 'main', i, { item: cursor.item, count: 1 });
             }
           } else if (slot.item === cursor.item && slot.count < 64) {
             if (dragType === 'crafting') {
               setGameState('inventory', 'craftingGrid', i, 'count', (c)=>c+1);
             } else {
               setGameState('inventory', 'main', i, 'count', (c)=>c+1);
             }
           } else continue;
           placed++;
         }
         if (placed > 0) {
           if (placed === cursor.count) gameActions.setCursorItem(null);
           else gameActions.setCursorItem({ item: cursor.item, count: cursor.count - placed });
         }
         setDistDrag({ active: false, button: 0, hovered: [], type: null, startIndex: null });
         return;
       }
       let remaining = cursor.count;
       const same: Array<{i:number, cap:number}> = [];
       const empty: number[] = [];
       for (const i of targets) {
         const slot = dragType === 'crafting' ? gameState.inventory.craftingGrid[i] : gameState.inventory.main[i];
         if (slot && slot.item === cursor.item && slot.count < 64) same.push({ i, cap: 64-slot.count });
         else if (!slot) empty.push(i);
       }
       for (const s2 of same) {
         if (remaining<=0) break;
         const add = Math.min(remaining, s2.cap);
         if (dragType === 'crafting') {
           setGameState('inventory', 'craftingGrid', s2.i, 'count', (c)=>c+add);
         } else {
           setGameState('inventory', 'main', s2.i, 'count', (c)=>c+add);
         }
         remaining -= add;
       }
       if (remaining>0 && empty.length>0) {
         const n = empty.length;
         const per = Math.floor(remaining / n);
         let rem = remaining % n;
         empty.forEach(i => {
           const add = per + (rem>0?1:0);
           if (add>0) {
             if (dragType === 'crafting') {
               setGameState('inventory', 'craftingGrid', i, { item: cursor.item, count: Math.min(64, add) });
             } else {
               setGameState('inventory', 'main', i, { item: cursor.item, count: Math.min(64, add) });
             }
           }
           if (rem>0) rem--;
         });
         const used = per*n + (remaining % n);
         remaining = Math.max(0, remaining - used);
       }
       const placed = cursor.count - remaining;
       if (placed>0) {
         if (placed===cursor.count) gameActions.setCursorItem(null);
         else gameActions.setCursorItem({ item: cursor.item, count: cursor.count - placed });
       }
       setDistDrag({ active: false, button: 0, hovered: [], type: null, startIndex: null });
     };
     window.addEventListener('mouseup', onUp);
     window.addEventListener('keydown', handleKeyPress);
     window.addEventListener('contextmenu', (e) => e.preventDefault());
     (window as any).__inv_onup = onUp;
   });

   onCleanup(() => {
     window.removeEventListener('mouseup', (window as any).__inv_onup);
     window.removeEventListener('keydown', handleKeyPress);
   });

  // Get selected item from active hotbar slot
  const getSelectedItem = () => {
    const slot = gameState.inventory.hotbar[gameState.activeHotbarSlot];
    return slot?.item || null;
  };

  return (
    <div class="panel flex-shrink-0" style="width: 400px;">
      <h2 class="panel-header">Inventory</h2>
      
      {/* Main Inventory Grid */}
      <div class="mb-4">
        <div class="grid grid-cols-9 gap-1 bg-gray-900 p-2 rounded">
          <For each={gameState.inventory.main}>
            {(slot, index) => {
              const preview = createMemo(() => {
                const dist = getPreviewDistribution();
                const s = distDrag();
                if (s.active && s.type === 'main' && dist[index()] && !slot) {
                  return { item: gameState.cursorItem!.item, count: dist[index()] };
                }
                return null;
              });
              
              return (
                <InventorySlotComponent
                  slot={slot}
                  index={index()}
                  type="main"
                  preview={preview()}
                  onMouseDown={(e) => handleSlotMouseDown(e, 'main', index())}
                  onMouseEnter={(e) => handleSlotMouseEnter(e, 'main', index())}
                  onMouseMove={handleSlotMouseMove}
                  onMouseLeave={handleSlotMouseLeave}
                />
              );
            }}
          </For>
        </div>
      </div>
      
      {/* 2x2 Crafting Grid */}
      <div class="mb-4 border-t border-gray-700 pt-4">
        <p class="text-xs text-gray-500 mb-2">CRAFTING</p>
        <div class="flex gap-4">
          <div class="grid grid-cols-2 gap-1 bg-gray-900 p-2 rounded">
            <For each={gameState.inventory.craftingGrid}>
              {(slot, index) => {
                const preview = createMemo(() => {
                  const dist = getPreviewDistribution();
                  const s = distDrag();
                  if (s.active && s.type === 'crafting' && dist[index()] && !slot) {
                    return { item: gameState.cursorItem!.item, count: dist[index()] };
                  }
                  return null;
                });
                
                return (
                  <InventorySlotComponent
                    slot={slot}
                    index={index()}
                    type="main"
                    preview={preview()}
                    onMouseDown={(e) => handleSlotMouseDown(e, 'crafting', index())}
                    onMouseEnter={(e) => handleSlotMouseEnter(e, 'crafting', index())}
                    onMouseMove={handleSlotMouseMove}
                    onMouseLeave={handleSlotMouseLeave}
                  />
                );
              }}
            </For>
          </div>
          <div class="flex items-center">
            <span class="text-gray-500 text-xl">→</span>
          </div>
          <div class="bg-gray-900 p-2 rounded">
            <InventorySlotComponent
              slot={gameState.inventory.craftingOutput}
              index={0}
              type="main"
              onMouseDown={(e) => handleCraftingOutputClick(e)}
              onMouseEnter={(e) => handleSlotMouseEnter(e, 'craftingOutput', 0)}
              onMouseMove={handleSlotMouseMove}
              onMouseLeave={handleSlotMouseLeave}
            />
          </div>
        </div>
      </div>
      
      {/* Hotbar */}
      <div class="border-t border-gray-700 pt-4">
        <p class="text-xs text-gray-500 mb-2">HOTBAR (1-9)</p>
        <div class="grid grid-cols-9 gap-1 bg-gray-900 p-2 rounded">
          <For each={gameState.inventory.hotbar}>
            {(slot, index) => (
              <InventorySlotComponent
                slot={slot}
                index={index()}
                type="hotbar"
                isActive={gameState.activeHotbarSlot === index()}
                onMouseDown={(e) => handleSlotMouseDown(e, 'hotbar', index())}
                onMouseEnter={(e) => handleSlotMouseEnter(e, 'hotbar', index())}
                onMouseMove={handleSlotMouseMove}
                onMouseLeave={handleSlotMouseLeave}
              />
            )}
          </For>
        </div>
      </div>
      
      
      {/* Selected Item Display */}
      <Show when={getSelectedItem()}>
        <div class="mt-4 p-2 bg-gray-800 rounded">
          <p class="text-xs text-gray-500">SELECTED:</p>
          <div class="flex items-center gap-2 mt-1">
            <span class="text-sm">{itemData[getSelectedItem()!]?.name}</span>
          </div>
        </div>
      </Show>
      
      {/* Item Tooltip */}
      <Show when={hoveredSlot()}>
        <div 
          class="tooltip show"
          style={{
            left: `${Math.min(mousePos().x + 15, window.innerWidth - 320)}px`,
            top: `${Math.min(mousePos().y + 15, window.innerHeight - 200)}px`
          }}
        >
          <div class="mb-2">
            <p class="font-semibold text-cyan-400">{itemData[hoveredSlot()!.item]?.name}</p>
            <Show when={hoveredSlot()!.type === 'hotbar' ? gameState.inventory.hotbar[hoveredSlot()!.index] : gameState.inventory.main[hoveredSlot()!.index]}>
              {(slot) => (
                <p class="text-xs text-gray-400">Count: {slot().count}</p>
              )}
            </Show>
          </div>
          
          <Show when={itemData[hoveredSlot()!.item]?.isTool}>
            <div class="mb-2">
              <p class="text-xs text-yellow-400">Tool</p>
              <Show when={itemData[hoveredSlot()!.item]?.maxDurability}>
                <p class="text-xs text-gray-400">
                  Durability: {gameState.toolDurability[hoveredSlot()!.item] ?? itemData[hoveredSlot()!.item].maxDurability}/{itemData[hoveredSlot()!.item].maxDurability}
                </p>
              </Show>
            </div>
          </Show>
          
          <Show when={itemData[hoveredSlot()!.item]?.isMachine}>
            <p class="text-xs text-purple-400">Machine - Can be placed in factory</p>
          </Show>
          
          <Show when={itemData[hoveredSlot()!.item]?.fuel}>
            <p class="text-xs text-orange-400">Fuel value: {itemData[hoveredSlot()!.item].fuel}</p>
          </Show>
          
          <Show when={itemData[hoveredSlot()!.item]?.configurable}>
            <p class="text-xs text-blue-400">Configurable input/output sides</p>
          </Show>
        </div>
      </Show>
    </div>
  );
};