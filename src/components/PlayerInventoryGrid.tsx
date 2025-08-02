import { For, Show, createSignal, createMemo } from 'solid-js';
import type { Component } from 'solid-js';
import { gameState, gameActions, setGameState } from '../stores/gameStore';
import { itemData } from '../data/items';
import { iconLibrary } from '../data/icons';
import type { InventorySlot } from '../types';

interface SlotProps {
  slot: InventorySlot;
  index: number;
  onMouseDown?: (e: MouseEvent) => void;
  onMouseEnter?: (e: MouseEvent) => void;
  onMouseMove?: (e: MouseEvent) => void;
  onMouseLeave?: () => void;
  preview?: { item: string; count: number } | null;
}

const InventorySlotComponent: Component<SlotProps> = (props) => {
  const handleMouseDown = (e: MouseEvent) => {
    e.preventDefault();
    if (gameState.combat.active) return;
    props.onMouseDown?.(e);
  };

  return (
    <div 
      class="slot"
      onMouseDown={handleMouseDown}
      onMouseEnter={props.onMouseEnter}
      onMouseMove={props.onMouseMove}
      onMouseLeave={props.onMouseLeave}
      data-slot-type="main"
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

interface Props {
  onSlotInteraction?: (type: string, index: number) => void;
  distDrag?: { active: boolean; button: 0|2; hovered: number[]; type: 'main' | 'crafting' | null; startIndex: number | null };
  onMouseEnter?: (index: number) => void;
}

export const PlayerInventoryGrid: Component<Props> = (props) => {
  const [hoveredSlot, setHoveredSlot] = createSignal<{index: number, item: string} | null>(null);
  const [mousePos, setMousePos] = createSignal({ x: 0, y: 0 });
  const [lastClickTime, setLastClickTime] = createSignal<{time: number, index: number} | null>(null);

  const handleSlotMouseEnter = (e: MouseEvent, index: number) => {
    const slot = gameState.inventory.main[index];
    if (slot && itemData[slot.item]) {
      setHoveredSlot({ index, item: slot.item });
      setMousePos({ x: e.clientX, y: e.clientY });
    }
    props.onMouseEnter?.(index);
  };

  const handleSlotMouseMove = (e: MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleSlotMouseLeave = () => {
    setHoveredSlot(null);
  };

  const handleSlotMouseDown = (e: MouseEvent, index: number) => {
    const slot = gameState.inventory.main[index];
    
    // Check for double-click on empty slot while holding an item
    const now = Date.now();
    const lastClick = lastClickTime();
    if (lastClick && lastClick.index === index && now - lastClick.time < 500 && e.button === 0) {
      // Double-click detected on same slot
      if (gameState.cursorItem && !slot) {
        // Clicking empty slot while holding items - collect all of same type
        const itemType = gameState.cursorItem.item;
        let collected = 0;
        const maxStack = 64;
        const spaceAvailable = maxStack - gameState.cursorItem.count;
        
        for (let i = 0; i < gameState.inventory.main.length; i++) {
          const s = gameState.inventory.main[i];
          if (s && s.item === itemType && collected < spaceAvailable) {
            const toTake = Math.min(s.count, spaceAvailable - collected);
            collected += toTake;
            
            if (toTake === s.count) {
              setGameState('inventory', 'main', i, null);
            } else {
              setGameState('inventory', 'main', i, 'count', (c) => c - toTake);
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
    
    // Shift-click for quick transfer
    if (e.shiftKey && e.button === 0 && slot) {
      props.onSlotInteraction?.('shift-click', index);
      return;
    }
    
    if (e.button === 0) { // Left click
      if (gameState.cursorItem) {
        // Holding an item
        if (!slot) {
          // Place in empty slot
          setGameState('inventory', 'main', index, gameState.cursorItem);
          gameActions.setCursorItem(null);
        } else if (slot.item === gameState.cursorItem.item) {
          // Stack items
          const maxStack = 64;
          const spaceLeft = maxStack - slot.count;
          const toAdd = Math.min(spaceLeft, gameState.cursorItem.count);
          
          if (toAdd > 0) {
            setGameState('inventory', 'main', index, 'count', (c) => c + toAdd);
            if (gameState.cursorItem.count === toAdd) {
              gameActions.setCursorItem(null);
            } else {
              gameActions.setCursorItem({ ...gameState.cursorItem, count: gameState.cursorItem.count - toAdd });
            }
          }
        } else {
          // Swap items
          const temp = slot;
          setGameState('inventory', 'main', index, gameState.cursorItem);
          gameActions.setCursorItem(temp);
        }
      } else if (slot) {
        // Pick up item
        gameActions.setCursorItem(slot);
        setGameState('inventory', 'main', index, null);
      }
    } else if (e.button === 2 && !gameState.cursorItem && slot) { // Right click to pick up half
      const halfCount = Math.ceil(slot.count / 2);
      const remainingCount = slot.count - halfCount;
      
      gameActions.setCursorItem({ item: slot.item, count: halfCount });
      
      if (remainingCount === 0) {
        setGameState('inventory', 'main', index, null);
      } else {
        setGameState('inventory', 'main', index, 'count', remainingCount);
      }
    }
  };

  // Calculate preview distribution
  const getPreviewDistribution = createMemo(() => {
    const s = props.distDrag;
    if (!s || !s.active || s.type !== 'main' || !gameState.cursorItem) return {};
    
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

  return (
    <div>
      <div class="grid grid-cols-9 gap-1 bg-gray-900 p-2 rounded">
        <For each={gameState.inventory.main}>
          {(slot, index) => {
            const preview = createMemo(() => {
              const dist = getPreviewDistribution();
              const s = props.distDrag;
              if (s && s.active && s.type === 'main' && dist[index()] && !slot) {
                return { item: gameState.cursorItem!.item, count: dist[index()] };
              }
              return null;
            });
            
            return (
              <InventorySlotComponent
                slot={slot}
                index={index()}
                preview={preview()}
                onMouseDown={(e) => handleSlotMouseDown(e, index())}
                onMouseEnter={(e) => handleSlotMouseEnter(e, index())}
                onMouseMove={handleSlotMouseMove}
                onMouseLeave={handleSlotMouseLeave}
              />
            );
          }}
        </For>
      </div>
      
      {/* Tooltip */}
      <Show when={hoveredSlot() && gameState.inventory.main[hoveredSlot()!.index]}>
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