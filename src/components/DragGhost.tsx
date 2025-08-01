import type { Component } from 'solid-js';
import { Show } from 'solid-js';
import { dragState } from '../stores/dragStore';
import { itemData } from '../data/items';

const DragGhost: Component = () => {
  return (
    <Show when={dragState.active && dragState.itemId}>
      <div class="fixed z-[20000] pointer-events-none" style={{ left: `${dragState.pos.x}px`, top: `${dragState.pos.y}px` }}>
        <div class="px-2 py-1 rounded bg-black/70 text-white text-xs border border-cyan-400">
          {itemData[dragState.itemId!]?.name || dragState.itemId}
        </div>
      </div>
    </Show>
  );
};

export default DragGhost;
