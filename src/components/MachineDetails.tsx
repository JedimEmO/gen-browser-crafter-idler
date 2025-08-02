import { Show, For } from 'solid-js';
import type { Component } from 'solid-js';
import { gameState, gameActions } from '../stores/gameStore';
import { itemData } from '../data/items';
import { worldResourceData } from '../data/biomes';
import { smeltingRecipes, cokeOvenRecipes } from '../data/recipes';
import { messageActions } from '../stores/messageStore';
import type { Furnace, CokeOven, Chest, Direction, Machine } from '../types';
import { iconLibrary } from '../data/icons';

export const MachineDetails: Component = () => {
  const selectedFactoryMachine = (): Machine | null => {
    if (gameState.selectedGridIndex === null) return null;
    return gameState.factoryGrid[gameState.selectedGridIndex];
  };

  const handleConfigClick = (configType: 'input' | 'output', side: Direction) => {
    if (gameState.selectedGridIndex === null) return;
    const m = selectedFactoryMachine();
    if (!m || (m.type !== 'furnace' && m.type !== 'coke_oven')) return;
    gameActions.updateMachine(gameState.selectedGridIndex, (cur) => {
      if (cur.type === 'furnace' || cur.type === 'coke_oven') {
        const updated = { ...cur } as Furnace | CokeOven;
        if (configType === 'input') updated.inputSide = side; else updated.outputSide = side;
        return updated as Machine;
      }
      return cur;
    });
  };

  const handlePickupMachine = () => {
    if (gameState.selectedGridIndex === null) return;
    const m = selectedFactoryMachine();
    if (!m) return;
    gameActions.addToInventory(m.type, 1);
    if (m.type === 'chest') {
      (m as Chest).inventory.forEach(s => { if (s) gameActions.addToInventory(s.type, s.count); });
    } else if (m.type === 'furnace') {
      const inv = (m as Furnace).inventory; if (inv.input) gameActions.addToInventory(inv.input.type, inv.input.count); if (inv.output) gameActions.addToInventory(inv.output.type, inv.output.count);
    } else if (m.type === 'coke_oven') {
      const inv = (m as CokeOven).inventory; if (inv.input) gameActions.addToInventory(inv.input.type, inv.input.count); if (inv.output) gameActions.addToInventory(inv.output.type, inv.output.count);
    }
    messageActions.logMessage(`Picked up ${itemData[m.type].name}.`, 'success');
    gameActions.removeMachine(gameState.selectedGridIndex);
    gameActions.selectGridIndex(null);
  };

  const handleFuelSlotClick = (e: MouseEvent) => {
    e.preventDefault();
    if (gameState.selectedGridIndex === null) return;
    const m = selectedFactoryMachine();
    if (!m || m.type !== 'furnace') return;
    const furnace = m as Furnace;
    if (furnace.fuelBuffer === undefined || furnace.maxFuelBuffer === undefined) {
      gameActions.updateMachine(gameState.selectedGridIndex, (cur) => {
        if (cur.type !== 'furnace') return cur;
        const upd = { ...cur } as Furnace; upd.fuelBuffer = upd.fuelBuffer ?? 0; upd.maxFuelBuffer = upd.maxFuelBuffer ?? 80; return upd as Machine;
      });
      return;
    }
    if (e.button === 0 && gameState.cursorItem) {
      const fuelValue = itemData[gameState.cursorItem.item]?.fuel;
      if (fuelValue && furnace.fuelBuffer < furnace.maxFuelBuffer) {
        const space = furnace.maxFuelBuffer - furnace.fuelBuffer;
        const need = Math.ceil(space / fuelValue);
        const take = Math.min(need, gameState.cursorItem.count);
        if (take > 0) {
          const fuelToAdd = take * fuelValue;
          gameActions.updateMachine(gameState.selectedGridIndex, (cur) => {
            if (cur.type !== 'furnace') return cur;
            const upd = { ...cur } as Furnace; upd.fuelBuffer = Math.min((upd.fuelBuffer ?? 0) + fuelToAdd, upd.maxFuelBuffer ?? 80); return upd as Machine;
          });
          if (take === gameState.cursorItem.count) gameActions.setCursorItem(null); else gameActions.setCursorItem({ ...gameState.cursorItem, count: gameState.cursorItem.count - take });
          messageActions.logMessage(`Added ${take}x ${itemData[gameState.cursorItem.item].name} (${fuelToAdd} fuel)`, 'success');
        }
      }
    }
  };

  const handleMachineSlotClick = (e: MouseEvent, machineType: 'furnace' | 'coke_oven', slotType: 'input' | 'output') => {
    e.preventDefault();
    if (gameState.selectedGridIndex === null) return;
    const m = selectedFactoryMachine();
    if (!m || m.type !== machineType) return;
    const inv = machineType === 'furnace' ? (m as Furnace).inventory : (m as CokeOven).inventory;
    const slot = inv[slotType];
    const slotItem = slot ?? null;

    if (e.shiftKey && e.button === 0 && slotItem) {
      const added = gameActions.addToInventory(slotItem.type, slotItem.count);
      if (added > 0) {
        gameActions.updateMachine(gameState.selectedGridIndex, (cur) => {
          if (cur.type !== machineType) return cur;
          const upd = { ...cur } as Furnace | CokeOven;
          const curSlot = upd.inventory[slotType];
          if (curSlot) {
            const remaining = curSlot.count - added;
            upd.inventory = { ...upd.inventory, [slotType]: remaining <= 0 ? null : { ...curSlot, count: remaining } } as any;
          }
          return upd as Machine;
        });
      }
      return;
    }

    if (e.button === 0) {
      if (gameState.cursorItem) {
        const canPlace = slotType === 'input' && ((machineType === 'furnace' && smeltingRecipes[gameState.cursorItem.item]) || (machineType === 'coke_oven' && cokeOvenRecipes[gameState.cursorItem.item]));
        if (canPlace) {
          if (!slotItem || slotItem.type === gameState.cursorItem.item) {
            const current = slotItem ? slotItem.count : 0;
            const space = 64 - current;
            const toAdd = Math.min(space, gameState.cursorItem.count);
            if (toAdd > 0) {
              gameActions.updateMachine(gameState.selectedGridIndex, (cur) => {
                if (cur.type !== machineType) return cur;
                const upd = { ...cur } as Furnace | CokeOven;
                const curSlot = upd.inventory[slotType];
                if (!curSlot) {
                  upd.inventory = { ...upd.inventory, [slotType]: { type: gameState.cursorItem!.item, count: toAdd } } as any;
                } else {
                  upd.inventory = { ...upd.inventory, [slotType]: { ...curSlot, count: curSlot.count + toAdd } } as any;
                }
                return upd as Machine;
              });
              if (toAdd === gameState.cursorItem.count) gameActions.setCursorItem(null); else gameActions.setCursorItem({ ...gameState.cursorItem, count: gameState.cursorItem.count - toAdd });
            }
          }
        }
      } else if (slotItem) {
        gameActions.setCursorItem({ item: slotItem.type, count: slotItem.count });
        gameActions.updateMachine(gameState.selectedGridIndex, (cur) => {
          if (cur.type !== machineType) return cur;
          const upd = { ...cur } as Furnace | CokeOven;
          upd.inventory = { ...upd.inventory, [slotType]: null } as any;
          return upd as Machine;
        });
      }
    } else if (e.button === 2) {
      if (gameState.cursorItem) {
        const canPlace = slotType === 'input' && ((machineType === 'furnace' && smeltingRecipes[gameState.cursorItem.item]) || (machineType === 'coke_oven' && cokeOvenRecipes[gameState.cursorItem.item]));
        if (canPlace && (!slotItem || slotItem.type === gameState.cursorItem.item)) {
          const current = slotItem ? slotItem.count : 0;
          if (current < 64) {
            gameActions.updateMachine(gameState.selectedGridIndex, (cur) => {
              if (cur.type !== machineType) return cur;
              const upd = { ...cur } as Furnace | CokeOven;
              const curSlot = upd.inventory[slotType];
              if (!curSlot) {
                upd.inventory = { ...upd.inventory, [slotType]: { type: gameState.cursorItem!.item, count: 1 } } as any;
              } else {
                upd.inventory = { ...upd.inventory, [slotType]: { ...curSlot, count: curSlot.count + 1 } } as any;
              }
              return upd as Machine;
            });
            if (gameState.cursorItem.count === 1) gameActions.setCursorItem(null); else gameActions.setCursorItem({ ...gameState.cursorItem, count: gameState.cursorItem.count - 1 });
          }
        }
      } else if (slotItem) {
        const half = Math.ceil(slotItem.count / 2);
        const remaining = slotItem.count - half;
        gameActions.setCursorItem({ item: slotItem.type, count: half });
        gameActions.updateMachine(gameState.selectedGridIndex, (cur) => {
          if (cur.type !== machineType) return cur;
          const upd = { ...cur } as Furnace | CokeOven;
          if (remaining === 0) {
            upd.inventory = { ...upd.inventory, [slotType]: null } as any;
          } else {
            const curSlot = upd.inventory[slotType]!;
            upd.inventory = { ...upd.inventory, [slotType]: { ...curSlot, count: remaining } } as any;
          }
          return upd as Machine;
        });
      }
    }
  };

  const handleChestSlotClick = (e: MouseEvent, slotIndex: number) => {
    e.preventDefault();
    if (gameState.selectedGridIndex === null) return;
    const m = selectedFactoryMachine();
    if (!m || m.type !== 'chest') return;
    const chest = m as Chest;
    const slot = chest.inventory[slotIndex];

    if (e.shiftKey && e.button === 0 && slot) {
      const added = gameActions.addToInventory(slot.type, slot.count);
      if (added > 0) {
        gameActions.updateMachine(gameState.selectedGridIndex, (cur) => {
          if (cur.type !== 'chest') return cur;
          const upd = { ...cur } as Chest;
          const newInv = [...upd.inventory];
          const currentSlot = newInv[slotIndex];
          if (currentSlot) {
            const remain = currentSlot.count - added;
            newInv[slotIndex] = remain <= 0 ? null : { ...currentSlot, count: remain };
          }
          upd.inventory = newInv; return upd as Machine;
        });
      }
      return;
    }

    if (e.button === 0) {
      if (gameState.cursorItem) {
        if (!slot || slot.type === gameState.cursorItem.item) {
          const current = slot ? slot.count : 0;
          const space = 64 - current;
          const toAdd = Math.min(space, gameState.cursorItem.count);
          if (toAdd > 0) {
            gameActions.updateMachine(gameState.selectedGridIndex, (cur) => {
              if (cur.type !== 'chest') return cur;
              const upd = { ...cur } as Chest;
              const newInv = [...upd.inventory];
              if (!newInv[slotIndex]) newInv[slotIndex] = { type: gameState.cursorItem!.item, count: toAdd };
              else newInv[slotIndex] = { ...newInv[slotIndex]!, count: newInv[slotIndex]!.count + toAdd };
              upd.inventory = newInv; return upd as Machine;
            });
            if (toAdd === gameState.cursorItem.count) gameActions.setCursorItem(null); else gameActions.setCursorItem({ ...gameState.cursorItem, count: gameState.cursorItem.count - toAdd });
          }
        } else {
          gameActions.updateMachine(gameState.selectedGridIndex, (cur) => {
            if (cur.type !== 'chest') return cur;
            const upd = { ...cur } as Chest;
            const newInv = [...upd.inventory];
            newInv[slotIndex] = { type: gameState.cursorItem!.item, count: gameState.cursorItem!.count };
            upd.inventory = newInv; return upd as Machine;
          });
          gameActions.setCursorItem({ item: slot.type, count: slot.count });
        }
      } else if (slot) {
        gameActions.setCursorItem({ item: slot.type, count: slot.count });
        gameActions.updateMachine(gameState.selectedGridIndex, (cur) => {
          if (cur.type !== 'chest') return cur;
          const upd = { ...cur } as Chest;
          const newInv = [...upd.inventory];
          newInv[slotIndex] = null; upd.inventory = newInv; return upd as Machine;
        });
      }
    } else if (e.button === 2) {
      if (gameState.cursorItem) {
        if (!slot || (slot.type === gameState.cursorItem.item && slot.count < 64)) {
          gameActions.updateMachine(gameState.selectedGridIndex, (cur) => {
            if (cur.type !== 'chest') return cur;
            const upd = { ...cur } as Chest;
            const newInv = [...upd.inventory];
            if (!newInv[slotIndex]) newInv[slotIndex] = { type: gameState.cursorItem!.item, count: 1 };
            else newInv[slotIndex] = { ...newInv[slotIndex]!, count: newInv[slotIndex]!.count + 1 };
            upd.inventory = newInv; return upd as Machine;
          });
          if (gameState.cursorItem.count === 1) gameActions.setCursorItem(null); else gameActions.setCursorItem({ ...gameState.cursorItem, count: gameState.cursorItem.count - 1 });
        }
      } else if (slot) {
        const half = Math.ceil(slot.count / 2);
        const remain = slot.count - half;
        gameActions.setCursorItem({ item: slot.type, count: half });
        gameActions.updateMachine(gameState.selectedGridIndex, (cur) => {
          if (cur.type !== 'chest') return cur;
          const upd = { ...cur } as Chest;
          const newInv = [...upd.inventory];
          newInv[slotIndex] = remain === 0 ? null : { ...slot, count: remain };
          upd.inventory = newInv; return upd as Machine;
        });
      }
    }
  };

  return (
    <div class="panel flex-1 flex flex-col">
      <h2 class="panel-header">Details</h2>
      <div class="flex-1 overflow-y-auto">
        <Show when={gameState.selectedGridIndex !== null} fallback={<p class="text-sm text-gray-500">Select an object for details.</p>}>
          <Show when={gameState.currentView === 'factory'} fallback={(
            () => {
              const chunk = gameActions.getChunk(gameState.world.playerX, gameState.world.playerY);
              const tile = chunk.tiles[gameState.selectedGridIndex!];
              if (!tile) return <p class="text-sm text-gray-500">Empty tile.</p>;
              const info = worldResourceData[tile.type];
              return (
                <div class="space-y-3">
                  <h3 class="text-lg font-medium text-purple-400">{info.name}</h3>
                  <div class="space-y-2">
                    <p class="text-sm"><span class="text-gray-500">Durability:</span><span class="ml-2">{tile.hp} / {info.hp}</span></p>
                    <Show when={info.tool}><p class="text-sm"><span class="text-gray-500">Requires:</span><span class="ml-2 text-yellow-400">Pickaxe</span></p></Show>
                  </div>
                </div>
              );
            }
          )()}>
            {(() => {
              const m = selectedFactoryMachine();
              if (!m) return <p class="text-sm text-gray-500">Empty.</p>;
              return (
                <div class="space-y-4">
                  <div>
                    <h3 class="text-lg font-medium text-cyan-400 mb-2">{itemData[m.type].name}</h3>
                  </div>

                  <Show when={gameState.inventory.hotbar[gameState.activeHotbarSlot]?.item === 'wrench' && (m.type === 'furnace' || m.type === 'coke_oven') && itemData[m.type].configurable}>
                    <div class="space-y-4 border-t border-gray-800 pt-4">
                      <div>
                        <p class="text-xs text-gray-500 mb-2">INPUT SIDE</p>
                        <div class="grid grid-cols-4 gap-1">
                          <For each={(['top', 'left', 'bottom', 'right'] as Direction[])}>{(side) => (
                            <button class={`btn btn-sm ${(m as any).inputSide === side ? 'btn-primary' : ''}`} onClick={() => handleConfigClick('input', side)}>{side.charAt(0).toUpperCase()}</button>
                          )}</For>
                        </div>
                      </div>
                      <div>
                        <p class="text-xs text-gray-500 mb-2">OUTPUT SIDE</p>
                        <div class="grid grid-cols-4 gap-1">
                          <For each={(['top', 'left', 'bottom', 'right'] as Direction[])}>{(side) => (
                            <button class={`btn btn-sm ${(m as any).outputSide === side ? 'btn-primary' : ''}`} onClick={() => handleConfigClick('output', side)}>{side.charAt(0).toUpperCase()}</button>
                          )}</For>
                        </div>
                      </div>
                      <button class="btn btn-danger w-full" onClick={handlePickupMachine}>Pick Up Machine</button>
                    </div>
                  </Show>

                  <Show when={m.type === 'furnace'}>
                    {(() => {
                      const f = m as Furnace;
                      return (
                        <div class="space-y-3">
                          <div class="space-y-2">
                            <p class="text-sm"><span class="text-gray-500">Fuel Buffer:</span><span class="ml-2 text-cyan-400">{f.fuelBuffer ?? 0}/{f.maxFuelBuffer ?? 80}</span></p>
                            <div class="w-full bg-gray-700 rounded-full h-2"><div class="bg-orange-500 h-2 rounded-full" style={{ width: `${((f.fuelBuffer ?? 0) / (f.maxFuelBuffer ?? 80)) * 100}%` }} /></div>
                          </div>
                          <div class="grid grid-cols-3 gap-2">
                            <div class="text-center">
                              <p class="text-xs text-gray-500 mb-1">Input</p>
                              <div class="slot" classList={{ 'opacity-50': !f.inventory.input }} onMouseDown={(e) => handleMachineSlotClick(e, 'furnace', 'input')}>
                                {f.inventory.input && (<>
                                  {iconLibrary[f.inventory.input.type] ? iconLibrary[f.inventory.input.type]() : <span class="text-xs font-medium">{itemData[f.inventory.input.type]?.name.charAt(0).toUpperCase()}</span>}
                                  {f.inventory.input.count > 1 && <div class="item-count">{f.inventory.input.count}</div>}
                                </>)}
                              </div>
                            </div>
                            <div class="text-center">
                              <p class="text-xs text-gray-500 mb-1">Output</p>
                              <div class="slot" classList={{ 'opacity-50': !f.inventory.output }} onMouseDown={(e) => handleMachineSlotClick(e, 'furnace', 'output')}>
                                {f.inventory.output && (<>
                                  {iconLibrary[f.inventory.output.type] ? iconLibrary[f.inventory.output.type]() : <span class="text-xs font-medium">{itemData[f.inventory.output.type]?.name.charAt(0).toUpperCase()}</span>}
                                  {f.inventory.output.count > 1 && <div class="item-count">{f.inventory.output.count}</div>}
                                </>)}
                              </div>
                            </div>
                            <div class="text-center">
                              <p class="text-xs text-gray-500 mb-1">Fuel</p>
                              <div class="slot" classList={{ 'opacity-50': (f.fuelBuffer ?? 0) >= (f.maxFuelBuffer ?? 80) }} onMouseDown={handleFuelSlotClick}><span class="text-xs text-orange-400">+</span></div>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </Show>

                  <Show when={m.type === 'coke_oven'}>
                    {(() => {
                      const c = m as CokeOven;
                      return (
                        <div class="grid grid-cols-2 gap-2">
                          <div class="text-center">
                            <p class="text-xs text-gray-500 mb-1">Input</p>
                            <div class="slot" classList={{ 'opacity-50': !c.inventory.input }} onMouseDown={(e) => handleMachineSlotClick(e, 'coke_oven', 'input')}>
                              {c.inventory.input && (<>
                                {iconLibrary[c.inventory.input.type] ? iconLibrary[c.inventory.input.type]() : <span class="text-xs font-medium">{itemData[c.inventory.input.type]?.name.charAt(0).toUpperCase()}</span>}
                                {c.inventory.input.count > 1 && <div class="item-count">{c.inventory.input.count}</div>}
                              </>)}
                            </div>
                          </div>
                          <div class="text-center">
                            <p class="text-xs text-gray-500 mb-1">Output</p>
                            <div class="slot" classList={{ 'opacity-50': !c.inventory.output }} onMouseDown={(e) => handleMachineSlotClick(e, 'coke_oven', 'output')}>
                              {c.inventory.output && (<>
                                {iconLibrary[c.inventory.output.type] ? iconLibrary[c.inventory.output.type]() : <span class="text-xs font-medium">{itemData[c.inventory.output.type]?.name.charAt(0).toUpperCase()}</span>}
                                {c.inventory.output.count > 1 && <div class="item-count">{c.inventory.output.count}</div>}
                              </>)}
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </Show>

                  <Show when={m.type === 'chest'}>
                    {(() => {
                      const ch = m as Chest;
                      const total = ch.inventory.reduce((sum, s) => sum + (s ? 1 : 0), 0);
                      return (
                        <div class="space-y-3">
                          <p class="text-sm"><span class="text-gray-500">Items:</span><span class="ml-2">{total} / {ch.capacity}</span></p>
                          <div class="grid grid-cols-4 gap-2">
                            <For each={ch.inventory}>{(slot, idx) => (
                              <div class="slot" classList={{ 'opacity-50': !slot }} onMouseDown={(e) => handleChestSlotClick(e, idx())}>
                                {slot && (<>
                                  {iconLibrary[slot.type] ? iconLibrary[slot.type]() : <span class="text-xs font-medium">{itemData[slot.type]?.name.charAt(0).toUpperCase()}</span>}
                                  {slot.count > 1 && <div class="item-count">{slot.count}</div>}
                                </>)}
                              </div>
                            )}</For>
                          </div>
                          <button class="btn btn-danger w-full mt-3" onClick={handlePickupMachine}>Pick Up Chest</button>
                        </div>
                      );
                    })()}
                  </Show>
                </div>
              );
            })()}
          </Show>
        </Show>
      </div>
    </div>
  );
};
