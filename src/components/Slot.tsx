import { Show } from 'solid-js';
import type { Component } from 'solid-js';
import { iconLibrary } from '../data/icons';
import { itemData } from '../data/items';
import { gameState } from '../stores/gameStore';
import { dragActions } from '../stores/dragStore';

interface SlotProps {
  item: string;
  count?: number;
  onClick?: () => void;
  class?: string;
}

export const Slot: Component<SlotProps> = (props) => {
  const Icon = () => {
    const icon = iconLibrary[props.item];
    return icon ? icon() : <span class="text-xs font-medium">{itemData[props.item]?.name.charAt(0).toUpperCase()}</span>;
  };
  
  const getDurabilityPercent = () => {
    const item = itemData[props.item];
    if (!item.isTool || !item.maxDurability) return null;
    
    const durability = gameState.toolDurability[props.item];
    if (durability === null) return null;
    
    return (durability / item.maxDurability) * 100;
  };
  
  const getDurabilityClass = () => {
    const percent = getDurabilityPercent();
    if (percent === null) return '';
    if (percent <= 20) return 'critical';
    if (percent <= 50) return 'low';
    return '';
  };
  
  const onPointerDown = () => {
    if (!props.item) return;
    dragActions.startItemDrag(props.item, props.count || 1, { type: 'player' }, itemData[props.item]?.isMachine ? 'machine' : 'item');
  };

  return (
    <div class={`slot ${props.class || ''}`} onClick={props.onClick} onPointerDown={onPointerDown}>
      <Icon />
      <Show when={props.count && props.count > 1}>
        <div class="item-count">{props.count}</div>
      </Show>
      <Show when={getDurabilityPercent() !== null}>
        <div class={`durability-bar ${getDurabilityClass()}`} style={{ width: `${getDurabilityPercent()}%` }} />
      </Show>
    </div>
  );
};