import { gameState, gameActions } from '../stores/gameStore';
import { itemData } from '../data/items';
import { smeltingRecipes, cokeOvenRecipes } from '../data/recipes';
import type { Furnace, CokeOven, Chest, Machine, Direction } from '../types';

function getTileIndexInDirection(index: number, direction: Direction): number {
  if (!direction) return -1;
  const x = index % 10;
  const y = Math.floor(index / 10);
  
  if (direction === 'left' && x > 0) return index - 1;
  if (direction === 'right' && x < 9) return index + 1;
  if (direction === 'top' && y > 0) return index - 10;
  if (direction === 'bottom' && y < 9) return index + 10;
  
  return -1;
}

function addToChestInventory(chestIndex: number, item: string, amount: number): boolean {
  const chest = gameState.factoryGrid[chestIndex] as Chest;
  if (!chest || chest.type !== 'chest') return false;
  
  // Try to add to existing stacks first
  for (let i = 0; i < chest.inventory.length; i++) {
    const slot = chest.inventory[i];
    if (slot && slot.type === item && slot.count < 64) {
      const canAdd = Math.min(amount, 64 - slot.count);
      gameActions.updateMachine(chestIndex, (m) => {
        const updatedChest = { ...m } as Chest;
        const newInventory = [...updatedChest.inventory];
        newInventory[i] = { ...newInventory[i]!, count: newInventory[i]!.count + canAdd };
        updatedChest.inventory = newInventory;
        return updatedChest;
      });
      return canAdd === amount;
    }
  }
  
  // Then try to add to empty slots
  for (let i = 0; i < chest.inventory.length; i++) {
    if (!chest.inventory[i]) {
      gameActions.updateMachine(chestIndex, (m) => {
        const updatedChest = { ...m } as Chest;
        const newInventory = [...updatedChest.inventory];
        newInventory[i] = { type: item, count: amount };
        updatedChest.inventory = newInventory;
        return updatedChest;
      });
      return true;
    }
  }
  
  return false;
}

function takeFromChestInventory(chestIndex: number, item: string, amount: number): boolean {
  const chest = gameState.factoryGrid[chestIndex] as Chest;
  if (!chest || chest.type !== 'chest') return false;
  
  for (let i = 0; i < chest.inventory.length; i++) {
    const slot = chest.inventory[i];
    if (slot && slot.type === item && slot.count >= amount) {
      gameActions.updateMachine(chestIndex, (m) => {
        const updatedChest = { ...m } as Chest;
        const newInventory = [...updatedChest.inventory];
        const remainingCount = newInventory[i]!.count - amount;
        if (remainingCount === 0) {
          newInventory[i] = null;
        } else {
          newInventory[i] = { ...newInventory[i]!, count: remainingCount };
        }
        updatedChest.inventory = newInventory;
        return updatedChest;
      });
      return true;
    }
  }
  
  return false;
}

function runFurnace(furnace: Furnace, index: number) {
  // Process output first
  if (furnace.inventory.output && furnace.inventory.output.count > 0) {
    const outputTileIndex = getTileIndexInDirection(index, furnace.outputSide);
    const outputTile = outputTileIndex >= 0 ? gameState.factoryGrid[outputTileIndex] : null;
    if (outputTile && outputTile.type === 'chest') {
      if (addToChestInventory(outputTileIndex, furnace.inventory.output.type, 1)) {
        gameActions.updateMachine(index, (m) => {
          const f = { ...m, inventory: { ...m.inventory } } as Furnace;
          if (f.inventory.output) {
            const newCount = f.inventory.output.count - 1;
            if (newCount <= 0) {
              f.inventory.output = null;
            } else {
              f.inventory.output = { ...f.inventory.output, count: newCount };
            }
          }
          return f;
        });
      }
    }
  }
  
  // Process smelting
  if (furnace.isSmelting && furnace.smeltingItem) {
    gameActions.updateMachine(index, (m) => {
      const f = JSON.parse(JSON.stringify(m)) as Furnace;
      f.progress++;
      f.fuelBuffer--; // Consume fuel while smelting
      const recipe = smeltingRecipes[f.smeltingItem!];
      if (f.progress >= recipe.time) {
        f.inventory.output = { type: recipe.output, count: 1 };
        f.isSmelting = false;
        f.smeltingItem = undefined;
        f.progress = 0;
      }
      // Stop smelting if out of fuel
      if (f.fuelBuffer <= 0) {
        f.isSmelting = false;
      }
      return f;
    });
  }
  // Start new smelting job if possible
  else if (furnace.inventory.input && furnace.fuelBuffer > 0 && !furnace.inventory.output) {
    const itemToSmelt = furnace.inventory.input.type;
    if (smeltingRecipes[itemToSmelt]) {
      gameActions.updateMachine(index, (m) => {
        const f = JSON.parse(JSON.stringify(m)) as Furnace;
        f.isSmelting = true;
        f.smeltingItem = itemToSmelt;
        f.fuelBuffer--; // Consume 1 fuel per tick while smelting
        if (f.inventory.input) {
          f.inventory.input.count--;
          if (f.inventory.input.count <= 0) {
            f.inventory.input = null;
          }
        }
        return f;
      });
    }
  }
  // Get new items if needed
  else {
    
    // Pull fuel from chest if buffer is low
    if (furnace.fuelBuffer < 100) { // Only refuel when buffer is low
      const inputTileIndex = getTileIndexInDirection(index, furnace.inputSide);
      const inputTile = inputTileIndex >= 0 ? gameState.factoryGrid[inputTileIndex] : null;
      if (inputTile && inputTile.type === 'chest') {
        // Try to pull coal from chest
        if (takeFromChestInventory(inputTileIndex, 'coal', 1)) {
          gameActions.updateMachine(index, (m) => {
            const f = { ...m } as Furnace;
            f.fuelBuffer = Math.min(f.fuelBuffer + (itemData.coal.fuel || 0), f.maxFuelBuffer);
            return f;
          });
        }
      }
    }
    
    if (!furnace.inventory.input) {
      const inputTileIndex = getTileIndexInDirection(index, furnace.inputSide);
      const inputTile = inputTileIndex >= 0 ? gameState.factoryGrid[inputTileIndex] : null;
      if (inputTile && inputTile.type === 'chest') {
        for (const smeltableItem in smeltingRecipes) {
          if (takeFromChestInventory(inputTileIndex, smeltableItem, 1)) {
            gameActions.updateMachine(index, (m) => {
              const f = { ...m, inventory: { ...m.inventory } } as Furnace;
              f.inventory.input = { type: smeltableItem, count: 1 };
              return f;
            });
            break;
          }
        }
      }
    }
  }
}

function runCokeOven(cokeOven: CokeOven, index: number) {
  // Process output first
  if (cokeOven.inventory.output && cokeOven.inventory.output.count > 0) {
    const outputTileIndex = getTileIndexInDirection(index, cokeOven.outputSide);
    const outputTile = outputTileIndex >= 0 ? gameState.factoryGrid[outputTileIndex] : null;
    if (outputTile && outputTile.type === 'chest') {
      if (addToChestInventory(outputTileIndex, cokeOven.inventory.output.type, 1)) {
        gameActions.updateMachine(index, (m) => {
          const c = { ...m, inventory: { ...m.inventory } } as CokeOven;
          if (c.inventory.output) {
            const newCount = c.inventory.output.count - 1;
            if (newCount <= 0) {
              c.inventory.output = null;
            } else {
              c.inventory.output = { ...c.inventory.output, count: newCount };
            }
          }
          return c;
        });
      }
    }
  }
  
  // Process coking
  if (cokeOven.isProcessing && cokeOven.processingItem) {
    gameActions.updateMachine(index, (m) => {
      const c = JSON.parse(JSON.stringify(m)) as CokeOven;
      c.progress++;
      const recipe = cokeOvenRecipes[c.processingItem!];
      if (c.progress >= recipe.time) {
        c.inventory.output = { type: recipe.output, count: 1 };
        c.isProcessing = false;
        c.processingItem = undefined;
        c.progress = 0;
      }
      return c;
    });
  }
  // Start new job if possible
  else if (cokeOven.inventory.input && !cokeOven.inventory.output) {
    const itemToProcess = cokeOven.inventory.input.type;
    if (cokeOvenRecipes[itemToProcess]) {
      gameActions.updateMachine(index, (m) => {
        const c = JSON.parse(JSON.stringify(m)) as CokeOven;
        c.isProcessing = true;
        c.processingItem = itemToProcess;
        if (c.inventory.input) {
          c.inventory.input.count--;
          if (c.inventory.input.count <= 0) {
            c.inventory.input = null;
          }
        }
        return c;
      });
    }
  }
  // Pull new items if needed
  else {
    if (!cokeOven.inventory.input) {
      const inputTileIndex = getTileIndexInDirection(index, cokeOven.inputSide);
      const inputTile = inputTileIndex >= 0 ? gameState.factoryGrid[inputTileIndex] : null;
      if (inputTile && inputTile.type === 'chest') {
        for (const processableItem in cokeOvenRecipes) {
          if (takeFromChestInventory(inputTileIndex, processableItem, 1)) {
            gameActions.updateMachine(index, (m) => {
              const c = { ...m, inventory: { ...m.inventory } } as CokeOven;
              c.inventory.input = { type: processableItem, count: 1 };
              return c;
            });
            break;
          }
        }
      }
    }
  }
}

export function startGameLoop() {
  setInterval(() => {
    // Process all machines in factory
    gameState.factoryGrid.forEach((tile, index) => {
      if (tile) {
        if (tile.type === 'furnace') {
          runFurnace(tile as Furnace, index);
        } else if (tile.type === 'coke_oven') {
          runCokeOven(tile as CokeOven, index);
        }
      }
    });
  }, 1000);
}