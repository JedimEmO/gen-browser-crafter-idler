import { For } from 'solid-js';
import type { Component } from 'solid-js';
import { gameState, gameActions } from '../stores/gameStore';
import { Slot } from './Slot';
import { messageActions } from '../stores/messageStore';
import { itemData } from '../data/items';

export const Inventory: Component = () => {
  const handleItemClick = (item: string) => {
    gameActions.selectGridIndex(null);
    
    if (gameState.selectedItem === item) {
      // Deselect if clicking the same item
      gameActions.selectItem(null);
      document.body.style.cursor = 'auto';
    } else {
      gameActions.selectItem(item);
      messageActions.logMessage(`Selected ${itemData[item].name}.`);
      
      const itemType = itemData[item];
      if (itemType.isMachine) {
        document.body.style.cursor = 'copy';
      } else if (itemType.isTool) {
        document.body.style.cursor = 'crosshair';
      } else {
        document.body.style.cursor = 'auto';
      }
    }
  };
  
  const inventoryItems = () => {
    return Object.entries(gameState.inventory)
      .filter(([_, count]) => count > 0)
      .map(([item, count]) => ({ item, count }));
  };
  
  return (
    <div class="panel flex-shrink-0">
      <h2 class="panel-header">Inventory</h2>
      <div class="grid grid-cols-4 gap-2">
        <For each={inventoryItems()}>
          {({ item, count }) => (
            <Slot 
              item={item} 
              count={count} 
              onClick={() => handleItemClick(item)}
              class={gameState.selectedItem === item ? 'selected' : ''}
            />
          )}
        </For>
      </div>
    </div>
  );
};