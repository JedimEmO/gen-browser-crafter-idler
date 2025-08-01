import { For, Show, onMount, onCleanup, createSignal } from 'solid-js';
import type { Component } from 'solid-js';
import { gameState, gameActions, setGameState } from '../stores/gameStore';
import { itemData } from '../data/items';
import { iconLibrary } from '../data/icons';
import type { InventorySlot, Chest } from '../types';

interface SlotProps {
  slot: InventorySlot;
  index: number;
  type: 'hotbar' | 'main';
  isActive?: boolean;
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
      <Show when={props.slot}>
        {(slot) => (
          <>
            {iconLibrary[slot().item] ? 
              iconLibrary[slot().item]() : 
              <span class="text-xs font-medium">{itemData[slot().item]?.name.charAt(0).toUpperCase()}</span>
            }
            <Show when={slot().count > 1}>
              <div class="item-count">{slot().count}</div>
            </Show>
          </>
        )}
      </Show>
    </div>
  );
};

export const MinecraftInventory: Component = () => {
  const [hoveredSlot, setHoveredSlot] = createSignal<{type: 'hotbar' | 'main', index: number, item: string} | null>(null);
  const [mousePos, setMousePos] = createSignal({ x: 0, y: 0 });
  
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
  
  const handleSlotMouseEnter = (e: MouseEvent, type: 'hotbar' | 'main', index: number) => {
    const slot = type === 'hotbar' ? gameState.inventory.hotbar[index] : gameState.inventory.main[index];
    if (slot) {
      setHoveredSlot({ type, index, item: slot.item });
      setMousePos({ x: e.pageX, y: e.pageY });
    }
  };
  
  const handleSlotMouseMove = (e: MouseEvent) => {
    setMousePos({ x: e.pageX, y: e.pageY });
  };
  
  const handleSlotMouseLeave = () => {
    setHoveredSlot(null);
  };
  
  const handleSlotMouseDown = (e: MouseEvent, type: 'hotbar' | 'main', index: number) => {
    const slot = type === 'hotbar' ? gameState.inventory.hotbar[index] : gameState.inventory.main[index];
    
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
            setGameState('inventory', type, index, null);
          } else {
            setGameState('inventory', type, index, 'count', (c) => c - transferred);
          }
        }
      } else {
        // Normal inventory transfer (hotbar <-> main)
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
        // Place cursor item in slot
        if (!slot) {
          // Empty slot - place all
          if (type === 'hotbar') {
            setGameState('inventory', 'hotbar', index, gameState.cursorItem);
          } else {
            setGameState('inventory', 'main', index, gameState.cursorItem);
          }
          gameActions.setCursorItem(null);
        } else if (slot.item === gameState.cursorItem.item) {
          // Same item - stack
          const spaceAvailable = 64 - slot.count;
          const toAdd = Math.min(spaceAvailable, gameState.cursorItem.count);
          if (toAdd > 0) {
            if (type === 'hotbar') {
              setGameState('inventory', 'hotbar', index, 'count', (c) => c + toAdd);
            } else {
              setGameState('inventory', 'main', index, 'count', (c) => c + toAdd);
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
          } else {
            setGameState('inventory', 'main', index, gameState.cursorItem);
          }
          gameActions.setCursorItem(temp);
        }
      } else if (slot) {
        // Pick up item
        gameActions.setCursorItem(slot);
        if (type === 'hotbar') {
          setGameState('inventory', 'hotbar', index, null);
        } else {
          setGameState('inventory', 'main', index, null);
        }
      }
    } else if (e.button === 2) { // Right click
      if (gameState.cursorItem) {
        // Place one item
        if (!slot || slot.item === gameState.cursorItem.item) {
          const canPlace = !slot ? 1 : Math.min(1, 64 - slot.count);
          if (canPlace > 0 && gameState.cursorItem.count >= canPlace) {
            if (!slot) {
              if (type === 'hotbar') {
                setGameState('inventory', 'hotbar', index, { item: gameState.cursorItem.item, count: 1 });
              } else {
                setGameState('inventory', 'main', index, { item: gameState.cursorItem.item, count: 1 });
              }
            } else {
              if (type === 'hotbar') {
                setGameState('inventory', 'hotbar', index, 'count', (c) => c + 1);
              } else {
                setGameState('inventory', 'main', index, 'count', (c) => c + 1);
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
          } else {
            setGameState('inventory', 'main', index, null);
          }
        } else {
          if (type === 'hotbar') {
            setGameState('inventory', 'hotbar', index, 'count', remainingCount);
          } else {
            setGameState('inventory', 'main', index, 'count', remainingCount);
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

  onMount(() => {
    window.addEventListener('keydown', handleKeyPress);
    window.addEventListener('contextmenu', (e) => e.preventDefault());
  });

  onCleanup(() => {
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
            {(slot, index) => (
              <InventorySlotComponent
                slot={slot}
                index={index()}
                type="main"
                onMouseDown={(e) => handleSlotMouseDown(e, 'main', index())}
                onMouseEnter={(e) => handleSlotMouseEnter(e, 'main', index())}
                onMouseMove={handleSlotMouseMove}
                onMouseLeave={handleSlotMouseLeave}
              />
            )}
          </For>
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