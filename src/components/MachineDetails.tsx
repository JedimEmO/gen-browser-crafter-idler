import { Show, For } from 'solid-js';
import type { Component } from 'solid-js';
import { gameState, gameActions, setGameState } from '../stores/gameStore';
import { itemData } from '../data/items';
import { worldResourceData } from '../data/biomes';
import { smeltingRecipes, cokeOvenRecipes } from '../data/recipes';
import { messageActions } from '../stores/messageStore';
import type { Furnace, CokeOven, Chest, Direction } from '../types';
import { iconLibrary } from '../data/icons';

export const MachineDetails: Component = () => {
  const selectedMachine = () => {
    if (gameState.selectedGridIndex === null) return null;
    if (gameState.currentView === 'factory') {
      return gameState.factoryGrid[gameState.selectedGridIndex];
    } else {
      const chunk = gameActions.getChunk(gameState.world.playerX, gameState.world.playerY);
      return chunk.tiles[gameState.selectedGridIndex];
    }
  };
  
  const handleConfigClick = (configType: 'input' | 'output', side: Direction) => {
    if (gameState.selectedGridIndex === null || gameState.currentView !== 'factory') return;
    
    const machine = gameState.factoryGrid[gameState.selectedGridIndex];
    if (!machine || (machine.type !== 'furnace' && machine.type !== 'coke_oven')) return;
    
    gameActions.updateMachine(gameState.selectedGridIndex, (m) => {
      const updated = { ...m } as Furnace | CokeOven;
      if (configType === 'input') {
        updated.inputSide = side;
      } else {
        updated.outputSide = side;
      }
      return updated;
    });
  };
  
  const handlePickupMachine = () => {
    if (gameState.selectedGridIndex === null || gameState.currentView !== 'factory') return;
    
    const machine = gameState.factoryGrid[gameState.selectedGridIndex];
    if (!machine) return;
    
    // Add machine back to inventory
    gameActions.addToInventory(machine.type, 1);
    
    // Add contents back to inventory
    if (machine.type === 'chest') {
      machine.inventory.forEach(slot => {
        if (slot) {
          gameActions.addToInventory(slot.type, slot.count);
        }
      });
    } else if (machine.type === 'furnace' || machine.type === 'coke_oven') {
      Object.values(machine.inventory).filter(s => s).forEach(s => {
        gameActions.addToInventory(s!.type, s!.count);
      });
    }
    
    messageActions.logMessage(`Picked up ${itemData[machine.type].name}.`, 'success');
    gameActions.removeMachine(gameState.selectedGridIndex);
    gameActions.selectGridIndex(null);
    gameActions.selectItem(null);
  };
  
  const handleFuelSlotClick = (e: MouseEvent) => {
    e.preventDefault();
    if (gameState.selectedGridIndex === null) return;
    
    const machine = gameState.factoryGrid[gameState.selectedGridIndex];
    if (!machine || machine.type !== 'furnace') return;
    
    const furnace = machine as Furnace;
    
    // Migrate old furnaces that don't have fuel buffer
    if (furnace.fuelBuffer === undefined || furnace.maxFuelBuffer === undefined) {
      gameActions.updateMachine(gameState.selectedGridIndex, (m) => {
        const updated = { ...m } as Furnace;
        updated.fuelBuffer = updated.fuelBuffer ?? 0;
        updated.maxFuelBuffer = updated.maxFuelBuffer ?? 80;
        return updated;
      });
      return; // Exit and let user click again
    }
    
    if (e.button === 0 && gameState.cursorItem) { // Left click with item
      const fuelValue = itemData[gameState.cursorItem.item]?.fuel;
      if (fuelValue && furnace.fuelBuffer < furnace.maxFuelBuffer) {
        // Calculate how many items we can consume
        const spaceAvailable = furnace.maxFuelBuffer - furnace.fuelBuffer;
        const itemsNeeded = Math.ceil(spaceAvailable / fuelValue);
        const itemsToConsume = Math.min(itemsNeeded, gameState.cursorItem.count);
        
        if (itemsToConsume > 0) {
          const fuelToAdd = itemsToConsume * fuelValue;
          
          gameActions.updateMachine(gameState.selectedGridIndex, (m) => {
            const updated = { ...m } as Furnace;
            updated.fuelBuffer = Math.min(updated.fuelBuffer + fuelToAdd, updated.maxFuelBuffer);
            return updated;
          });
          
          // Remove consumed items from cursor
          if (itemsToConsume === gameState.cursorItem.count) {
            gameActions.setCursorItem(null);
          } else {
            gameActions.setCursorItem({ ...gameState.cursorItem, count: gameState.cursorItem.count - itemsToConsume });
          }
          
          messageActions.logMessage(`Added ${itemsToConsume}x ${itemData[gameState.cursorItem.item].name} (${fuelToAdd} fuel)`, 'success');
        }
      }
    }
  };


  const handleMachineSlotClick = (e: MouseEvent, machineType: 'furnace' | 'coke_oven', slotType: 'input' | 'output') => {
    e.preventDefault();
    if (gameState.selectedGridIndex === null) return;
    
    const machine = gameState.factoryGrid[gameState.selectedGridIndex];
    if (!machine || machine.type !== machineType) return;

    const slot = machine.inventory[slotType as keyof typeof machine.inventory];
    const slotItem = (slot && typeof slot !== 'number') ? slot : null;

    // Shift-click for quick transfer
    if (e.shiftKey && e.button === 0 && slotItem) {
      const added = gameActions.addToInventory(slotItem.type, slotItem.count);
      if (added > 0) {
        gameActions.updateMachine(gameState.selectedGridIndex, (m) => {
          const updated = { ...m, inventory: { ...m.inventory } };
          const currentSlot = updated.inventory[slotType as keyof typeof updated.inventory];
          if (currentSlot && typeof currentSlot !== 'number') {
            const remainingCount = currentSlot.count - added;
            if (remainingCount <= 0) {
              (updated.inventory as any)[slotType] = null;
            } else {
              (updated.inventory as any)[slotType] = { ...currentSlot, count: remainingCount };
            }
          }
          return updated;
        });
      }
      return;
    }

    if (e.button === 0) { // Left click
      if (gameState.cursorItem) {
        // Place cursor item
        const canPlace = (
          (slotType === 'input' && (
            (machineType === 'furnace' && smeltingRecipes[gameState.cursorItem.item]) ||
            (machineType === 'coke_oven' && cokeOvenRecipes[gameState.cursorItem.item])
          ))
        );

        if (canPlace && slotType !== 'output') {
          if (!slotItem || slotItem.type === gameState.cursorItem.item) {
            const currentCount = slotItem ? slotItem.count : 0;
            const spaceAvailable = 64 - currentCount;
            const toAdd = Math.min(spaceAvailable, gameState.cursorItem.count);
            
            if (toAdd > 0) {
              gameActions.updateMachine(gameState.selectedGridIndex, (m) => {
                const updated = { ...m, inventory: { ...m.inventory } };
                if (!slotItem) {
                  (updated.inventory as any)[slotType] = { type: gameState.cursorItem!.item, count: toAdd };
                } else {
                  const currentSlot = updated.inventory[slotType as keyof typeof updated.inventory] as any;
                  (updated.inventory as any)[slotType] = { ...currentSlot, count: currentSlot.count + toAdd };
                }
                return updated;
              });
              
              if (toAdd === gameState.cursorItem.count) {
                gameActions.setCursorItem(null);
              } else {
                gameActions.setCursorItem({ ...gameState.cursorItem, count: gameState.cursorItem.count - toAdd });
              }
            }
          }
        }
      } else if (slotItem) {
        // Pick up item
        gameActions.setCursorItem({ item: slotItem.type, count: slotItem.count });
        gameActions.updateMachine(gameState.selectedGridIndex, (m) => {
          const updated = { ...m, inventory: { ...m.inventory } };
          (updated.inventory as any)[slotType] = null;
          return updated;
        });
      }
    } else if (e.button === 2) { // Right click
      if (gameState.cursorItem) {
        // Place one item
        const canPlace = (
          (slotType === 'input' && (
            (machineType === 'furnace' && smeltingRecipes[gameState.cursorItem.item]) ||
            (machineType === 'coke_oven' && cokeOvenRecipes[gameState.cursorItem.item])
          ))
        );

        if (canPlace && slotType !== 'output' && (!slotItem || slotItem.type === gameState.cursorItem.item)) {
          const currentCount = slotItem ? slotItem.count : 0;
          if (currentCount < 64) {
            gameActions.updateMachine(gameState.selectedGridIndex, (m) => {
              const updated = { ...m, inventory: { ...m.inventory } };
              if (!slotItem) {
                (updated.inventory as any)[slotType] = { type: gameState.cursorItem!.item, count: 1 };
              } else {
                const currentSlot = updated.inventory[slotType as keyof typeof updated.inventory] as any;
                (updated.inventory as any)[slotType] = { ...currentSlot, count: currentSlot.count + 1 };
              }
              return updated;
            });
            
            if (gameState.cursorItem.count === 1) {
              gameActions.setCursorItem(null);
            } else {
              gameActions.setCursorItem({ ...gameState.cursorItem, count: gameState.cursorItem.count - 1 });
            }
          }
        }
      } else if (slotItem) {
        // Pick up half
        const halfCount = Math.ceil(slotItem.count / 2);
        const remainingCount = slotItem.count - halfCount;
        
        gameActions.setCursorItem({ item: slotItem.type, count: halfCount });
        
        if (remainingCount === 0) {
          gameActions.updateMachine(gameState.selectedGridIndex, (m) => {
            const updated = { ...m, inventory: { ...m.inventory } };
            (updated.inventory as any)[slotType] = null;
            return updated;
          });
        } else {
          gameActions.updateMachine(gameState.selectedGridIndex, (m) => {
            const updated = { ...m, inventory: { ...m.inventory } };
            const currentSlot = updated.inventory[slotType as keyof typeof updated.inventory] as any;
            (updated.inventory as any)[slotType] = { ...currentSlot, count: remainingCount };
            return updated;
          });
        }
      }
    }
  };

  const handleChestSlotClick = (e: MouseEvent, slotIndex: number) => {
    e.preventDefault();
    if (gameState.selectedGridIndex === null) return;
    
    const chest = gameState.factoryGrid[gameState.selectedGridIndex] as Chest;
    if (!chest || chest.type !== 'chest') return;

    const slot = chest.inventory[slotIndex];

    // Shift-click for quick transfer
    if (e.shiftKey && e.button === 0 && slot) {
      const added = gameActions.addToInventory(slot.type, slot.count);
      if (added > 0) {
        gameActions.updateMachine(gameState.selectedGridIndex, (m) => {
          const updatedChest = { ...m } as Chest;
          const newInventory = [...m.inventory];
          const currentSlot = newInventory[slotIndex];
          if (currentSlot) {
            const remainingCount = currentSlot.count - added;
            if (remainingCount <= 0) {
              newInventory[slotIndex] = null;
            } else {
              newInventory[slotIndex] = { ...currentSlot, count: remainingCount };
            }
          }
          updatedChest.inventory = newInventory;
          return updatedChest;
        });
      }
      return;
    }

    if (e.button === 0) { // Left click
      if (gameState.cursorItem) {
        // Place cursor item in chest slot
        if (!slot || slot.type === gameState.cursorItem.item) {
          const currentCount = slot ? slot.count : 0;
          const spaceAvailable = 64 - currentCount;
          const toAdd = Math.min(spaceAvailable, gameState.cursorItem.count);
          
          if (toAdd > 0) {
            gameActions.updateMachine(gameState.selectedGridIndex, (m) => {
              const updatedChest = { ...m } as Chest;
              const newInventory = [...m.inventory];
              if (!newInventory[slotIndex]) {
                newInventory[slotIndex] = { type: gameState.cursorItem!.item, count: toAdd };
              } else {
                newInventory[slotIndex] = { ...newInventory[slotIndex]!, count: newInventory[slotIndex]!.count + toAdd };
              }
              updatedChest.inventory = newInventory;
              return updatedChest;
            });
            
            if (toAdd === gameState.cursorItem.count) {
              gameActions.setCursorItem(null);
            } else {
              gameActions.setCursorItem({ ...gameState.cursorItem, count: gameState.cursorItem.count - toAdd });
            }
          }
        } else {
          // Swap items
          gameActions.updateMachine(gameState.selectedGridIndex, (m) => {
            const updatedChest = { ...m } as Chest;
            const newInventory = [...m.inventory];
            newInventory[slotIndex] = { type: gameState.cursorItem!.item, count: gameState.cursorItem!.count };
            updatedChest.inventory = newInventory;
            return updatedChest;
          });
          gameActions.setCursorItem({ item: slot.type, count: slot.count });
        }
      } else if (slot) {
        // Pick up item from chest
        gameActions.setCursorItem({ item: slot.type, count: slot.count });
        gameActions.updateMachine(gameState.selectedGridIndex, (m) => {
          const updatedChest = { ...m } as Chest;
          const newInventory = [...m.inventory];
          newInventory[slotIndex] = null;
          updatedChest.inventory = newInventory;
          return updatedChest;
        });
      }
    } else if (e.button === 2) { // Right click
      if (gameState.cursorItem) {
        // Place one item
        if (!slot || (slot.type === gameState.cursorItem.item && slot.count < 64)) {
          gameActions.updateMachine(gameState.selectedGridIndex, (m) => {
            const updatedChest = { ...m } as Chest;
            const newInventory = [...m.inventory];
            if (!newInventory[slotIndex]) {
              newInventory[slotIndex] = { type: gameState.cursorItem!.item, count: 1 };
            } else {
              newInventory[slotIndex] = { ...newInventory[slotIndex]!, count: newInventory[slotIndex]!.count + 1 };
            }
            updatedChest.inventory = newInventory;
            return updatedChest;
          });
          
          if (gameState.cursorItem.count === 1) {
            gameActions.setCursorItem(null);
          } else {
            gameActions.setCursorItem({ ...gameState.cursorItem, count: gameState.cursorItem.count - 1 });
          }
        }
      } else if (slot) {
        // Pick up half
        const halfCount = Math.ceil(slot.count / 2);
        const remainingCount = slot.count - halfCount;
        
        gameActions.setCursorItem({ item: slot.type, count: halfCount });
        
        if (remainingCount === 0) {
          gameActions.updateMachine(gameState.selectedGridIndex, (m) => {
            const updatedChest = { ...m } as Chest;
            const newInventory = [...m.inventory];
            newInventory[slotIndex] = null;
            updatedChest.inventory = newInventory;
            return updatedChest;
          });
        } else {
          gameActions.updateMachine(gameState.selectedGridIndex, (m) => {
            const updatedChest = { ...m } as Chest;
            const newInventory = [...m.inventory];
            newInventory[slotIndex] = { ...newInventory[slotIndex]!, count: remainingCount };
            updatedChest.inventory = newInventory;
            return updatedChest;
          });
        }
      }
    }
  };
  
  return (
    <div class="panel flex-1 flex flex-col">
      <h2 class="panel-header">Details</h2>
      <div class="flex-1 overflow-y-auto">
        <Show 
          when={gameState.selectedGridIndex !== null} 
          fallback={<p class="text-sm text-gray-500">Select an object for details.</p>}
        >
              <Show when={selectedMachine()}>
                {() => {
                  const machine = selectedMachine()!;
                  
                  if (gameState.currentView === 'factory') {
                    const factoryMachine = machine as Furnace | CokeOven | Chest;
                    
                    return (
                      <div class="space-y-4">
                        <div>
                          <h3 class="text-lg font-medium text-cyan-400 mb-2">{itemData[factoryMachine.type].name}</h3>
                        </div>
                        
                        <Show when={gameState.inventory.hotbar[gameState.activeHotbarSlot]?.item === 'wrench' && itemData[factoryMachine.type].configurable}>
                          <div class="space-y-4 border-t border-gray-800 pt-4">
                            <div>
                              <p class="text-xs text-gray-500 mb-2">INPUT SIDE</p>
                              <div class="grid grid-cols-4 gap-1">
                                <For each={(['top', 'left', 'bottom', 'right'] as Direction[])}>
                                  {(side) => (
                                    <button 
                                      class={`btn btn-sm ${(factoryMachine as any).inputSide === side ? 'btn-primary' : ''}`}
                                      onClick={() => handleConfigClick('input', side)}
                                    >
                                      {side.charAt(0).toUpperCase()}
                                    </button>
                                  )}
                                </For>
                              </div>
                            </div>
                            
                            <div>
                              <p class="text-xs text-gray-500 mb-2">OUTPUT SIDE</p>
                              <div class="grid grid-cols-4 gap-1">
                                <For each={(['top', 'left', 'bottom', 'right'] as Direction[])}>
                                  {(side) => (
                                    <button 
                                      class={`btn btn-sm ${(factoryMachine as any).outputSide === side ? 'btn-primary' : ''}`}
                                      onClick={() => handleConfigClick('output', side)}
                                    >
                                      {side.charAt(0).toUpperCase()}
                                    </button>
                                  )}
                                </For>
                              </div>
                            </div>
                            
                            <button 
                              class="btn btn-danger w-full"
                              onClick={handlePickupMachine}
                            >
                              Pick Up Machine
                            </button>
                          </div>
                        </Show>
                        
                        <Show when={factoryMachine.type === 'furnace'}>
                          {() => {
                            const furnace = factoryMachine as Furnace;
                            return (
                              <div class="space-y-3">
                                <div class="space-y-2">
                                  <p class="text-sm">
                                    <span class="text-gray-500">Fuel Buffer:</span>
                                    <span class="ml-2 text-cyan-400">{furnace.fuelBuffer ?? 0}/{furnace.maxFuelBuffer ?? 80}</span>
                                  </p>
                                  <div class="w-full bg-gray-700 rounded-full h-2">
                                    <div class="bg-orange-500 h-2 rounded-full" style={{width: `${((furnace.fuelBuffer ?? 0) / (furnace.maxFuelBuffer ?? 80)) * 100}%`}}></div>
                                  </div>
                                </div>
                                <div class="grid grid-cols-3 gap-2">
                                  <div class="text-center">
                                    <p class="text-xs text-gray-500 mb-1">Input</p>
                                    <div 
                                      class="slot"
                                      classList={{ 'opacity-50': !furnace.inventory.input }}
                                      onMouseDown={(e) => handleMachineSlotClick(e, 'furnace', 'input')}
                                    >
                                      {furnace.inventory.input && (
                                        <>
                                          {iconLibrary[furnace.inventory.input.type] ? 
                                            iconLibrary[furnace.inventory.input.type]() : 
                                            <span class="text-xs font-medium">{itemData[furnace.inventory.input.type]?.name.charAt(0).toUpperCase()}</span>
                                          }
                                          {furnace.inventory.input.count > 1 && <div class="item-count">{furnace.inventory.input.count}</div>}
                                        </>
                                      )}
                                    </div>
                                  </div>
                                  <div class="text-center">
                                    <p class="text-xs text-gray-500 mb-1">Output</p>
                                    <div 
                                      class="slot"
                                      classList={{ 'opacity-50': !furnace.inventory.output }}
                                      onMouseDown={(e) => handleMachineSlotClick(e, 'furnace', 'output')}
                                    >
                                      {furnace.inventory.output && (
                                        <>
                                          {iconLibrary[furnace.inventory.output.type] ? 
                                            iconLibrary[furnace.inventory.output.type]() : 
                                            <span class="text-xs font-medium">{itemData[furnace.inventory.output.type]?.name.charAt(0).toUpperCase()}</span>
                                          }
                                          {furnace.inventory.output.count > 1 && <div class="item-count">{furnace.inventory.output.count}</div>}
                                        </>
                                      )}
                                    </div>
                                  </div>
                                  <div class="text-center">
                                    <p class="text-xs text-gray-500 mb-1">Fuel</p>
                                    <div 
                                      class="slot"
                                      classList={{ 'opacity-50': furnace.fuelBuffer >= furnace.maxFuelBuffer }}
                                      onMouseDown={handleFuelSlotClick}
                                    >
                                      <span class="text-xs text-orange-400">+</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          }}
                        </Show>
                        
                        <Show when={factoryMachine.type === 'coke_oven'}>
                          {() => {
                            const cokeOven = factoryMachine as CokeOven;
                            return (
                              <div class="grid grid-cols-2 gap-2">
                                <div class="text-center">
                                  <p class="text-xs text-gray-500 mb-1">Input</p>
                                  <div 
                                    class="slot"
                                    classList={{ 'opacity-50': !cokeOven.inventory.input }}
                                    onMouseDown={(e) => handleMachineSlotClick(e, 'coke_oven', 'input')}
                                  >
                                    {cokeOven.inventory.input && (
                                      <>
                                        {iconLibrary[cokeOven.inventory.input.type] ? 
                                          iconLibrary[cokeOven.inventory.input.type]() : 
                                          <span class="text-xs font-medium">{itemData[cokeOven.inventory.input.type]?.name.charAt(0).toUpperCase()}</span>
                                        }
                                        {cokeOven.inventory.input.count > 1 && <div class="item-count">{cokeOven.inventory.input.count}</div>}
                                      </>
                                    )}
                                  </div>
                                </div>
                                <div class="text-center">
                                  <p class="text-xs text-gray-500 mb-1">Output</p>
                                  <div 
                                    class="slot"
                                    classList={{ 'opacity-50': !cokeOven.inventory.output }}
                                    onMouseDown={(e) => handleMachineSlotClick(e, 'coke_oven', 'output')}
                                  >
                                    {cokeOven.inventory.output && (
                                      <>
                                        {iconLibrary[cokeOven.inventory.output.type] ? 
                                          iconLibrary[cokeOven.inventory.output.type]() : 
                                          <span class="text-xs font-medium">{itemData[cokeOven.inventory.output.type]?.name.charAt(0).toUpperCase()}</span>
                                        }
                                        {cokeOven.inventory.output.count > 1 && <div class="item-count">{cokeOven.inventory.output.count}</div>}
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          }}
                        </Show>
                        
                        <Show when={factoryMachine.type === 'chest'}>
                          {() => {
                            const chest = factoryMachine as Chest;
                            const totalItems = chest.inventory.reduce((sum, slot) => sum + (slot ? 1 : 0), 0);
                            
                            return (
                              <div class="space-y-3">
                                <p class="text-sm">
                                  <span class="text-gray-500">Items:</span>
                                  <span class="ml-2">{totalItems} / {chest.capacity}</span>
                                </p>
                                <div class="grid grid-cols-4 gap-2">
                                  <For each={chest.inventory}>
                                    {(slot, slotIndex) => (
                                      <div 
                                        class="slot"
                                        classList={{ 'opacity-50': !slot }}
                                        onMouseDown={(e) => handleChestSlotClick(e, slotIndex())}
                                      >
                                        {slot && (
                                          <>
                                            {iconLibrary[slot.type] ? 
                                              iconLibrary[slot.type]() : 
                                              <span class="text-xs font-medium">{itemData[slot.type]?.name.charAt(0).toUpperCase()}</span>
                                            }
                                            {slot.count > 1 && <div class="item-count">{slot.count}</div>}
                                          </>
                                        )}
                                      </div>
                                    )}
                                  </For>
                                </div>
                                <button 
                                  class="btn btn-danger w-full mt-3"
                                  onClick={handlePickupMachine}
                                >
                                  Pick Up Chest
                                </button>
                              </div>
                            );
                          }}
                        </Show>
                      </div>
                    );
                  } else {
                    // Explore view - showing world resource
                    const worldTile = machine as any;
                    const resourceInfo = worldResourceData[worldTile.type];
                    
                    return (
                      <div class="space-y-3">
                        <h3 class="text-lg font-medium text-purple-400">{resourceInfo.name}</h3>
                        <div class="space-y-2">
                          <p class="text-sm">
                            <span class="text-gray-500">Durability:</span>
                            <span class="ml-2">{worldTile.hp} / {resourceInfo.hp}</span>
                          </p>
                          <Show when={resourceInfo.tool}>
                            <p class="text-sm">
                              <span class="text-gray-500">Requires:</span>
                              <span class="ml-2 text-yellow-400">Pickaxe</span>
                            </p>
                          </Show>
                        </div>
                      </div>
                    );
                  }
                }}
              </Show>
        </Show>
      </div>
    </div>
  );
};