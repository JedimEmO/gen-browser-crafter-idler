import { For, Show, onCleanup, onMount } from 'solid-js';
import type { Component } from 'solid-js';
import { gameState, gameActions } from '../stores/gameStore';
import { GridTile } from './GridTile';
import { biomes } from '../data/biomes';
import { iconLibrary } from '../data/icons';
import { handleFactoryGridClick, handleWorldGridClick } from '../systems/gridHandlers';

const FactoryGrid: Component = () => {
  return (
    <For each={gameState.factoryGrid}>
      {(tile, index) => (
        <GridTile
          tile={tile}
          index={index()}
          backgroundColor="var(--bg-tertiary)"
          onClick={() => handleFactoryGridClick(index())}
          isSelected={gameState.selectedGridIndex === index()}
        />
      )}
    </For>
  );
};

const WorldGrid: Component = () => {
  const chunk = () => gameActions.getChunk(gameState.world.playerX, gameState.world.playerY);
  const tileBg = 'var(--bg-tertiary)';
  
  return (
    <For each={chunk().tiles}>
      {(tile, index) => (
        <div 
          class="grid-tile"
          style={{ "background-color": tile ? tileBg : 'var(--bg-tertiary)' }}
          data-index={index()}
          onClick={() => handleWorldGridClick(index())}
        >
          <Show when={tile} fallback={<span class="text-gray-700 text-xs">·</span>}>
            <div class="w-full h-full p-1">
              {iconLibrary[tile!.type] ? iconLibrary[tile!.type]() : '?'}
            </div>
          </Show>
        </div>
      )}
    </For>
  );
};

import { dragState, dragActions } from '../stores/dragStore';
import type { Chest, Furnace, CokeOven, Machine } from '../types';

export const MainGrid: Component = () => {
  const handleNavigation = (dx: number, dy: number) => {
    gameActions.move(dx, dy);
  };

  onMount(() => {
    const onMove = (e: PointerEvent) => dragActions.move(e.clientX, e.clientY);
    const onUp = () => {
      if (dragState.active && dragState.kind === 'machine' && dragState.itemId && dragState.target && dragState.target.type === 'factoryCell') {
        const idx = dragState.target.index;
        const current = gameState.factoryGrid[idx];
        if (!current) {
          if (gameActions.removeFromInventory(dragState.itemId, 1)) {
            const type = dragState.itemId;
            let newMachine: Machine | null = null;
            if (type === 'chest') newMachine = { type: 'chest', inventory: Array(16).fill(null), capacity: 16 } as Chest;
            if (type === 'furnace') newMachine = { type: 'furnace', inputSide: 'bottom', outputSide: 'top', fuel: 0, fuelBuffer: 0, maxFuelBuffer: 80, progress: 0, isSmelting: false, inventory: { input: null, output: null } } as Furnace;
            if (type === 'coke_oven') newMachine = { type: 'coke_oven', inputSide: 'bottom', outputSide: 'top', progress: 0, isProcessing: false, inventory: { input: null, output: null } } as CokeOven;
            if (newMachine) gameActions.placeMachine(idx, newMachine);
          }
        }
      }
      dragActions.end();
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    onCleanup(() => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    });
  });
  
  return (
    <div class="panel flex-1 flex flex-col">
      <div class="flex items-center justify-between mb-4">
        <h2 class="panel-header mb-0">
          {gameState.currentView === 'factory' ? 'Factory Floor' : 'World Explorer'}
        </h2>
        <div class="flex gap-2">
          <button 
            class={`view-toggle ${gameState.currentView === 'factory' ? 'active' : ''}`}
            onClick={() => gameActions.setView('factory')}
          >
            Factory
          </button>
          <button 
            class={`view-toggle ${gameState.currentView === 'explore' ? 'active' : ''}`}
            onClick={() => gameActions.setView('explore')}
          >
            Explore
          </button>
        </div>
      </div>
      
      <div class="flex-1 flex items-center justify-center">
        <div class="flex flex-col items-center gap-2">
          <Show when={gameState.currentView === 'explore'}>
            <div class="flex flex-col items-center gap-2">
              <button class="btn btn-sm" onClick={() => handleNavigation(0, -1)}>↑</button>
              <div class="flex items-center gap-2">
                <button class="btn btn-sm" onClick={() => handleNavigation(-1, 0)}>←</button>
                <div class="relative">
                  <div class="grid grid-cols-10 grid-rows-10 gap-1 bg-black/30 p-2 rounded-lg" style="width: 440px; height: 440px;">
                    <WorldGrid />
                  </div>
                </div>
                <button class="btn btn-sm" onClick={() => handleNavigation(1, 0)}>→</button>
              </div>
              <button class="btn btn-sm" onClick={() => handleNavigation(0, 1)}>↓</button>
            </div>
          </Show>

          <Show when={gameState.currentView === 'factory'}>
            <div class="relative">
              <div class="grid grid-cols-10 grid-rows-10 gap-1 bg-black/30 p-2 rounded-lg" style="width: 440px; height: 440px;">
                <FactoryGrid />
              </div>
            </div>
          </Show>
        </div>
      </div>
      
      <Show when={gameState.currentView === 'explore'}>
        <div class="text-center mt-4 text-sm">
          <p class="text-gray-500">
            <span class="text-cyan-400">{gameState.world.playerX}, {gameState.world.playerY}</span>
            <span class="mx-2">·</span>
            <span class="text-purple-400">{biomes[gameActions.getChunk(gameState.world.playerX, gameState.world.playerY).biome].name}</span>
          </p>
        </div>
      </Show>
    </div>
  );
};