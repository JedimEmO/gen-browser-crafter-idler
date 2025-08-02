import { gameState, gameActions } from '../stores/gameStore';
import { messageActions } from '../stores/messageStore';
import { itemData } from '../data/items';
import { worldResourceData } from '../data/biomes';
import { smeltingRecipes, cokeOvenRecipes } from '../data/recipes';
import type { Furnace, CokeOven, Chest, Machine, CraftingBench } from '../types';

export function handleFactoryGridClick(index: number) {
  const currentTile = gameState.factoryGrid[index];
  
  // If clicking the same selected machine, deselect it
  if (gameState.selectedGridIndex === index) {
    gameActions.selectGridIndex(null);
    return;
  }
  
  // Select the clicked index
  gameActions.selectGridIndex(index);
  
  // Get selected item from active hotbar slot
  const activeSlot = gameState.inventory.hotbar[gameState.activeHotbarSlot];
  const selectedItem = activeSlot?.item || null;
  
  if (selectedItem) {
    const itemType = itemData[selectedItem];
    
    // Placing a machine
    if (itemType.isMachine && !currentTile) {
      if (gameActions.removeFromInventory(selectedItem, 1)) {
        const type = selectedItem;
        let newMachine: Machine;
        
        if (type === 'chest') {
          newMachine = { type: 'chest', inventory: Array(16).fill(null), capacity: 16 } as Chest;
        } else if (type === 'furnace') {
          newMachine = {
            type: 'furnace',
            inputSide: 'bottom',
            outputSide: 'top',
            fuel: 0,
            fuelBuffer: 0,
            maxFuelBuffer: 100,
            progress: 0,
            isSmelting: false,
            inventory: { input: null, output: null }
          } as Furnace;
        } else if (type === 'coke_oven') {
          newMachine = {
            type: 'coke_oven',
            inputSide: 'bottom',
            outputSide: 'top',
            progress: 0,
            isProcessing: false,
            inventory: { input: null, output: null }
          } as CokeOven;
        } else if (type === 'crafting_bench') {
          newMachine = {
            type: 'crafting_bench',
            craftingGrid: Array(9).fill(null),
            outputSlot: null
          } as CraftingBench;
        } else {
          return;
        }
        
        gameActions.placeMachine(index, newMachine);
      }
    }
    // Inserting item into machine
    else if (currentTile && (currentTile.type === 'furnace' || currentTile.type === 'coke_oven')) {
      const item = selectedItem;
      const machine = currentTile;
      
      if (machine.type === 'furnace') {
        const furnace = machine as Furnace;
        if (itemData[item].fuel && furnace.fuelBuffer < furnace.maxFuelBuffer) {
          if (gameActions.removeFromInventory(item, 1)) {
            gameActions.updateMachine(index, (m) => {
              const f = m as Furnace;
              f.fuelBuffer = Math.min(f.fuelBuffer + (itemData[item].fuel || 0), f.maxFuelBuffer);
              return f;
            });
          }
        } else if (smeltingRecipes[item] && (!furnace.inventory.input || furnace.inventory.input.type === item)) {
          if (gameActions.removeFromInventory(item, 1)) {
            gameActions.updateMachine(index, (m) => {
              const f = m as Furnace;
              if (!f.inventory.input) {
                f.inventory.input = { type: item, count: 1 };
              } else {
                f.inventory.input.count++;
              }
              return f;
            });
          }
        }
      }
      
      if (machine.type === 'coke_oven') {
        const cokeOven = machine as CokeOven;
        if (cokeOvenRecipes[item] && (!cokeOven.inventory.input || cokeOven.inventory.input.type === item)) {
          if (gameActions.removeFromInventory(item, 1)) {
            gameActions.updateMachine(index, (m) => {
              const c = m as CokeOven;
              if (!c.inventory.input) {
                c.inventory.input = { type: item, count: 1 };
              } else {
                c.inventory.input.count++;
              }
              return c;
            });
          }
        }
      }
    }
  }
}

export function handleWorldGridClick(index: number) {
  // Block all world interactions during combat
  if (gameState.combat.active) {
    return;
  }
  
  const chunk = gameActions.getChunk(gameState.world.playerX, gameState.world.playerY);
  const tile = chunk.tiles[index];
  
  // Calculate clicked position
  const clickedX = index % 10;
  const clickedY = Math.floor(index / 10);
  
  // Check if clicked tile is adjacent to player (including diagonals)
  const dx = Math.abs(clickedX - gameState.world.playerLocalX);
  const dy = Math.abs(clickedY - gameState.world.playerLocalY);
  
  if (dx > 1 || dy > 1) {
    messageActions.logMessage('Too far away!', 'error');
    return;
  }
  
  if (!tile) {
    gameActions.selectGridIndex(null);
    return;
  }
  
  gameActions.selectGridIndex(index);
  
  const resourceInfo = worldResourceData[tile.type];
  let usedTool: string | null = null;
  
  if (resourceInfo.tool) {
    // Check for pickaxe in inventory
    let hasIronPickaxe = false;
    let hasPickaxe = false;
    
    for (const slot of gameState.inventory.hotbar) {
      if (slot?.item === 'iron_pickaxe') hasIronPickaxe = true;
      if (slot?.item === 'pickaxe') hasPickaxe = true;
    }
    for (const slot of gameState.inventory.main) {
      if (slot?.item === 'iron_pickaxe') hasIronPickaxe = true;
      if (slot?.item === 'pickaxe') hasPickaxe = true;
    }
    
    if (hasIronPickaxe) {
      usedTool = 'iron_pickaxe';
    } else if (hasPickaxe) {
      usedTool = 'pickaxe';
    } else {
      messageActions.logMessage(`You need a pickaxe to harvest ${resourceInfo.name}!`, 'error');
      return;
    }
  }
  
  gameActions.addToInventory(resourceInfo.drops, 1);
  
  // Update tile HP
  const newHp = tile.hp - 1;
  if (newHp <= 0) {
    gameActions.updateWorldTile(gameState.world.playerX, gameState.world.playerY, index, null);
    gameActions.selectGridIndex(null);
  } else {
    gameActions.updateWorldTile(gameState.world.playerX, gameState.world.playerY, index, {
      ...tile,
      hp: newHp
    });
  }
  
  messageActions.logMessage(`Harvested 1 ${itemData[resourceInfo.drops].name}.`, 'success');
  
  // Handle tool durability
  if (usedTool) {
    const currentDurability = gameState.toolDurability[usedTool] || 0;
    const newDurability = currentDurability - 1;
    
    if (newDurability <= 0) {
      gameActions.removeFromInventory(usedTool, 1);
      messageActions.logMessage(`Your ${itemData[usedTool].name} broke!`, 'error');
      
      // Check if we have more of this tool
      let hasMore = false;
      for (const slot of gameState.inventory.hotbar) {
        if (slot?.item === usedTool) { hasMore = true; break; }
      }
      if (!hasMore) {
        for (const slot of gameState.inventory.main) {
          if (slot?.item === usedTool) { hasMore = true; break; }
        }
      }
      
      if (hasMore) {
        gameActions.updateToolDurability(usedTool, itemData[usedTool].maxDurability!);
      } else {
        gameActions.updateToolDurability(usedTool, null);
      }
    } else {
      gameActions.updateToolDurability(usedTool, newDurability);
    }
  }
}