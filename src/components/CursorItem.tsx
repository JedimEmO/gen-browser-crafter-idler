import { Show, createSignal, onMount, onCleanup } from 'solid-js';
import type { Component } from 'solid-js';
import { gameState } from '../stores/gameStore';
import { itemData } from '../data/items';
import { iconLibrary } from '../data/icons';

export const CursorItem: Component = () => {
  const [mousePos, setMousePos] = createSignal({ x: 0, y: 0 });

  const handleMouseMove = (e: MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  onMount(() => {
    window.addEventListener('mousemove', handleMouseMove);
  });

  onCleanup(() => {
    window.removeEventListener('mousemove', handleMouseMove);
  });

  return (
    <Show when={gameState.cursorItem}>
      <div 
        class="fixed pointer-events-none z-[9999]" 
        style={{
          left: `${mousePos().x + 10}px`,
          top: `${mousePos().y + 10}px`,
        }}
      >
        <div class="slot bg-gray-800 border-2 border-gray-700">
          {iconLibrary[gameState.cursorItem!.item] ? 
            iconLibrary[gameState.cursorItem!.item]() : 
            <span class="text-xs font-medium">{itemData[gameState.cursorItem!.item]?.name.charAt(0).toUpperCase()}</span>
          }
          <Show when={gameState.cursorItem!.count > 1}>
            <div class="item-count">{gameState.cursorItem!.count}</div>
          </Show>
        </div>
      </div>
    </Show>
  );
};