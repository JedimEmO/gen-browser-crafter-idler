import { For, Show, createSignal, onMount, onCleanup } from 'solid-js';
import type { Component } from 'solid-js';
import { gameState, gameActions, setGameState } from '../stores/gameStore';
import { itemData } from '../data/items';
import { iconLibrary } from '../data/icons';
import type { InventorySlot } from '../types';

interface SlotProps {
  slot: InventorySlot;
  index: number;
  isActive?: boolean;
  onMouseDown?: (e: MouseEvent) => void;
  onMouseUp?: (e: MouseEvent) => void;
  onMouseEnter?: (e: MouseEvent) => void;
  onMouseMove?: (e: MouseEvent) => void;
  onMouseLeave?: () => void;
}

const HotbarSlot: Component<SlotProps> = (props) => {
  const handleMouseDown = (e: MouseEvent) => {
    e.preventDefault();
    if (gameState.combat.active) return; // Block dragging during combat
    props.onMouseDown?.(e);
  };

  const getDurabilityPercent = () => {
    if (!props.slot?.item) return null;
    const itemInfo = itemData[props.slot.item];
    if (!itemInfo?.isTool || !itemInfo.maxDurability) return null;
    
    const durability = gameState.toolDurability[props.slot.item] ?? itemInfo.maxDurability;
    return (durability / itemInfo.maxDurability) * 100;
  };
  
  const getDurabilityClass = () => {
    const percent = getDurabilityPercent();
    if (percent === null) return '';
    if (percent <= 20) return 'critical';
    if (percent <= 50) return 'low';
    return '';
  };

  return (
    <div 
      class={`slot ${props.isActive ? 'active-hotbar' : ''}`}
      onMouseDown={handleMouseDown}
      onMouseUp={props.onMouseUp}
      onMouseEnter={props.onMouseEnter}
      onMouseMove={props.onMouseMove}
      onMouseLeave={props.onMouseLeave}
      data-slot-type="hotbar"
      data-slot-index={props.index}
    >
      <Show when={props.slot}>
        <div>
          {props.slot!.item && iconLibrary[props.slot!.item] ? 
            iconLibrary[props.slot!.item]() : 
            <span class="text-xs font-medium">{props.slot!.item && itemData[props.slot!.item]?.name.charAt(0).toUpperCase()}</span>
          }
        </div>
        <Show when={props.slot!.count > 1}>
          <div class="item-count">{props.slot!.count}</div>
        </Show>
        <Show when={getDurabilityPercent() !== null}>
          <div class={`durability-bar ${getDurabilityClass()}`} style={{ width: `${getDurabilityPercent()}%` }} />
        </Show>
      </Show>
    </div>
  );
};

export const Hotbar: Component = () => {
  const [hoveredSlot, setHoveredSlot] = createSignal<{index: number, item: string} | null>(null);
  const [mousePos, setMousePos] = createSignal({ x: 0, y: 0 });
  const [lastClickTime, setLastClickTime] = createSignal<{time: number, index: number} | null>(null);

  const handleSlotMouseEnter = (e: MouseEvent, index: number) => {
    const slot = gameState.inventory.hotbar[index];
    if (slot && itemData[slot.item]) {
      setHoveredSlot({ index, item: slot.item });
      setMousePos({ x: e.clientX, y: e.clientY });
    }
  };

  const handleSlotMouseMove = (e: MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleSlotMouseLeave = () => {
    setHoveredSlot(null);
  };

  const handleSlotMouseDown = (e: MouseEvent, index: number) => {
    const slot = gameState.inventory.hotbar[index];
    
    // Check for double-click on empty slot while holding an item
    const now = Date.now();
    const lastClick = lastClickTime();
    if (lastClick && lastClick.index === index && now - lastClick.time < 500 && e.button === 0) {
      // Double-click detected on same slot
      if (gameState.cursorItem && !slot) {
        // Clicking empty slot while holding items - collect all of same type from hotbar
        const itemType = gameState.cursorItem.item;
        let collected = 0;
        const maxStack = 64;
        const spaceAvailable = maxStack - gameState.cursorItem.count;
        
        for (let i = 0; i < gameState.inventory.hotbar.length; i++) {
          const s = gameState.inventory.hotbar[i];
          if (s && s.item === itemType && collected < spaceAvailable) {
            const toTake = Math.min(s.count, spaceAvailable - collected);
            collected += toTake;
            
            if (toTake === s.count) {
              setGameState('inventory', 'hotbar', i, null);
            } else {
              setGameState('inventory', 'hotbar', i, 'count', (c) => c - toTake);
            }
          }
        }
        
        if (collected > 0) {
          gameActions.setCursorItem({ 
            item: gameState.cursorItem.item, 
            count: gameState.cursorItem.count + collected 
          });
        }
        
        setLastClickTime(null); // Reset to prevent triple-click
        return;
      }
    }
    
    setLastClickTime({ time: now, index });
    
    if (e.button === 0) { // Left click
      if (gameState.cursorItem) {
        // Holding an item
        if (!slot) {
          // Place in empty slot
          setGameState('inventory', 'hotbar', index, gameState.cursorItem);
          gameActions.setCursorItem(null);
        } else if (slot.item === gameState.cursorItem.item) {
          // Stack items
          const maxStack = 64;
          const spaceLeft = maxStack - slot.count;
          const toAdd = Math.min(spaceLeft, gameState.cursorItem.count);
          
          if (toAdd > 0) {
            setGameState('inventory', 'hotbar', index, 'count', (c) => c + toAdd);
            if (gameState.cursorItem.count === toAdd) {
              gameActions.setCursorItem(null);
            } else {
              gameActions.setCursorItem({ ...gameState.cursorItem, count: gameState.cursorItem.count - toAdd });
            }
          }
        } else {
          // Swap items - create a copy to avoid reference issues
          const temp = { item: slot.item, count: slot.count };
          setGameState('inventory', 'hotbar', index, gameState.cursorItem);
          gameActions.setCursorItem(temp);
        }
      } else if (slot) {
        // Pick up item
        gameActions.setCursorItem(slot);
        setGameState('inventory', 'hotbar', index, null);
      }
    } else if (e.button === 2 && !gameState.cursorItem && slot) { // Right click to pick up half
      const halfCount = Math.ceil(slot.count / 2);
      const remainingCount = slot.count - halfCount;
      
      gameActions.setCursorItem({ item: slot.item, count: halfCount });
      
      if (remainingCount === 0) {
        setGameState('inventory', 'hotbar', index, null);
      } else {
        setGameState('inventory', 'hotbar', index, 'count', remainingCount);
      }
    }
  };

  // Handle number key presses for hotbar selection
  onMount(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = parseInt(e.key);
      if (key >= 1 && key <= 9) {
        gameActions.setActiveHotbarSlot(key - 1);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    onCleanup(() => window.removeEventListener('keydown', handleKeyDown));
  });

  return (
    <div class="mt-2">
      <p class="text-xs text-gray-500 mb-1">HOTBAR (1-9)</p>
      <div class="grid grid-cols-9 gap-1 bg-gray-900 p-2 rounded">
        <For each={gameState.inventory.hotbar}>
          {(slot, index) => (
            <HotbarSlot
              slot={slot}
              index={index()}
              isActive={gameState.activeHotbarSlot === index()}
              onMouseDown={(e) => handleSlotMouseDown(e, index())}
              onMouseEnter={(e) => handleSlotMouseEnter(e, index())}
              onMouseMove={handleSlotMouseMove}
              onMouseLeave={handleSlotMouseLeave}
            />
          )}
        </For>
      </div>
      
      {/* Tooltip */}
      <Show when={hoveredSlot() && gameState.inventory.hotbar[hoveredSlot()!.index]}>
        <div
          class="tooltip"
          style={{
            position: 'fixed',
            left: `${mousePos().x + 12}px`,
            top: `${mousePos().y + 12}px`,
            display: 'block'
          }}
        >
          <p class="font-medium">{itemData[hoveredSlot()!.item]?.name}</p>
        </div>
      </Show>
    </div>
  );
};