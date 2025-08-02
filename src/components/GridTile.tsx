import { Show } from 'solid-js';
import type { Component } from 'solid-js';
import { iconLibrary } from '../data/icons';
import type { Furnace, CokeOven, Machine, BlastFurnace } from '../types';
import { dragActions } from '../stores/dragStore';
import { smeltingRecipes, cokeOvenRecipes, blastFurnaceRecipes } from '../data/recipes';

interface GridTileProps {
  tile: Machine | null;
  index: number;
  backgroundColor: string;
  onClick: () => void;
  isSelected?: boolean;
}

interface IOIndicatorProps {
  type: 'input' | 'output';
  side: string;
}

const IOIndicator: Component<IOIndicatorProps> = (props) => {
  return (
    <div class={`io-indicator io-${props.type} io-${props.side}`} />
  );
};

export const GridTile: Component<GridTileProps> = (props) => {
  const getIcon = () => {
    if (!props.tile) return null;
    const icon = iconLibrary[props.tile.type];
    return icon ? icon() : null;
  };
  
  const getProgressPercent = () => {
    if (!props.tile) return 0;
    
    if (props.tile.type === 'furnace' && props.tile.isSmelting && props.tile.smeltingItem) {
      const recipe = smeltingRecipes[props.tile.smeltingItem];
      return (props.tile.progress / recipe.time) * 100;
    }
    
    if (props.tile.type === 'coke_oven' && props.tile.isProcessing && props.tile.processingItem) {
      const recipe = cokeOvenRecipes[props.tile.processingItem];
      return (props.tile.progress / recipe.time) * 100;
    }
    
    if (props.tile.type === 'blast_furnace' && props.tile.isProcessing && props.tile.processingItem) {
      const recipe = blastFurnaceRecipes[props.tile.processingItem];
      return (props.tile.progress / recipe.time) * 100;
    }
    
    return 0;
  };
  
  const isProcessing = () => {
    if (!props.tile) return false;
    if (props.tile.type === 'furnace') return props.tile.isSmelting;
    if (props.tile.type === 'coke_oven') return props.tile.isProcessing;
    if (props.tile.type === 'blast_furnace') return props.tile.isProcessing;
    return false;
  };
  
  return (
    <div 
      class="grid-tile"
      classList={{ 'selected': props.isSelected }}
      style={{ "background-color": props.backgroundColor }}
      data-index={props.index}
      onClick={props.onClick}
      onPointerEnter={() => dragActions.hoverTarget({ type: 'factoryCell', index: props.index })}
      onPointerLeave={() => dragActions.hoverTarget(null)}
      onPointerUp={() => {/* handled in MainGrid */}}
    >
      <Show when={props.tile} fallback={<span innerHTML="&nbsp;" />}>
        {getIcon()}
        <Show when={isProcessing()}>
          <div class="progress-bar" style={{ width: `${getProgressPercent()}%` }} />
        </Show>
        <Show when={props.tile!.type === 'furnace' || props.tile!.type === 'coke_oven' || props.tile!.type === 'blast_furnace'}>
          <>
            <Show when={(props.tile as Furnace | CokeOven | BlastFurnace).inputSide}>
              <IOIndicator type="input" side={(props.tile as Furnace | CokeOven | BlastFurnace).inputSide} />
            </Show>
            <Show when={(props.tile as Furnace | CokeOven | BlastFurnace).outputSide}>
              <IOIndicator type="output" side={(props.tile as Furnace | CokeOven | BlastFurnace).outputSide} />
            </Show>
          </>
        </Show>
      </Show>
    </div>
  );
};