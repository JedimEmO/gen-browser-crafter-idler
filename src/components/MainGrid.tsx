import { For, Show, onCleanup, onMount, createSignal } from 'solid-js';
import type { Component } from 'solid-js';
import { gameState, gameActions } from '../stores/gameStore';
import { GridTile } from './GridTile';
import { biomes } from '../data/biomes';
import { iconLibrary, PlayerIcon } from '../data/icons';
import { handleFactoryGridClick, handleWorldGridClick } from '../systems/gridHandlers';
import { Minimap } from './Minimap';
import { CraftingBenchUI } from './CraftingBenchUI';
import { Hotbar } from './Hotbar';

const FactoryGrid: Component<{ onFactoryClick: (index: number) => void }> = (props) => {
  const getFactoryPlayerIndex = () => {
    return gameState.factoryPlayerY * 10 + gameState.factoryPlayerX;
  };
  
  const isWithinFactoryReach = (index: number) => {
    const isPlayerPosition = index === getFactoryPlayerIndex();
    if (isPlayerPosition) return false;
    
    const tileX = index % 10;
    const tileY = Math.floor(index / 10);
    
    const dx = Math.abs(tileX - gameState.factoryPlayerX);
    const dy = Math.abs(tileY - gameState.factoryPlayerY);
    
    // 5-tile interaction radius using Manhattan distance
    return (dx + dy) <= 5;
  };
  
  return (
    <For each={gameState.factoryGrid}>
      {(tile, index) => {
        const isPlayerPosition = () => index() === getFactoryPlayerIndex();
        
        return (
          <div 
            class="grid-tile"
            classList={{ 
              'within-reach': isWithinFactoryReach(index()),
              'selected': gameState.selectedGridIndex === index()
            }}
            style={{ 
              "background-color": "var(--bg-tertiary)",
              "position": "relative"
            }}
            onClick={() => props.onFactoryClick(index())}
          >
            <Show when={tile}>
              <GridTile
                tile={tile}
                index={index()}
                backgroundColor="transparent"
                onClick={() => {}}
                isSelected={false}
              />
            </Show>
            <Show when={isPlayerPosition()}>
              <div style={{
                "position": "absolute",
                "top": "0",
                "left": "0",
                "width": "100%",
                "height": "100%",
                "display": "flex",
                "align-items": "center",
                "justify-content": "center",
                "z-index": "10"
              }}>
                <PlayerIcon />
              </div>
            </Show>
          </div>
        );
      }}
    </For>
  );
};

const WorldGrid: Component = () => {
  const chunk = () => gameActions.getChunk(gameState.world.playerX, gameState.world.playerY);
  const tileBg = 'var(--bg-tertiary)';
  
  const getPlayerIndex = () => {
    return gameState.world.playerLocalY * 10 + gameState.world.playerLocalX;
  };
  
  const getEnemyAtPosition = (x: number, y: number) => {
    const currentChunk = chunk();
    return currentChunk.enemies.find(e => e.localX === x && e.localY === y);
  };
  
  return (
    <For each={chunk().tiles}>
      {(tile, index) => {
        const x = () => index() % 10;
        const y = () => Math.floor(index() / 10);
        const isPlayerPosition = () => index() === getPlayerIndex();
        const enemy = () => getEnemyAtPosition(x(), y());
        
        const isWithinReach = () => {
          if (isPlayerPosition()) return false;
          
          const playerX = gameState.world.playerLocalX;
          const playerY = gameState.world.playerLocalY;
          const tileX = x();
          const tileY = y();
          
          // Calculate actual distance without wrapping
          const dx = tileX - playerX;
          const dy = tileY - playerY;
          
          // Only highlight tiles that are exactly 1 tile away (including diagonals)
          // This creates a 3x3 grid with player in center
          return Math.abs(dx) <= 1 && Math.abs(dy) <= 1;
        };
        
        return (
          <div 
            class="grid-tile"
            classList={{ 'within-reach': isWithinReach() }}
            style={{ 
              "background-color": tile ? tileBg : 'var(--bg-tertiary)',
              "position": "relative"
            }}
            data-index={index()}
            title={`x:${x()} y:${y()} player:${gameState.world.playerLocalX},${gameState.world.playerLocalY} reach:${isWithinReach()}`}
            onClick={() => handleWorldGridClick(index())}
          >
            <Show when={enemy()}>
              <div class="w-full h-full p-1">
                {iconLibrary[enemy()!.type]()}
              </div>
            </Show>
            <Show when={!enemy() && tile}>
              <div class="w-full h-full p-1">
                {iconLibrary[tile!.type] ? iconLibrary[tile!.type]() : '?'}
              </div>
            </Show>
            <Show when={!enemy() && !tile}>
              <span class="text-gray-700 text-xs">·</span>
            </Show>
            <Show when={isPlayerPosition()}>
              <div style={{
                "position": "absolute",
                "top": "0",
                "left": "0",
                "width": "100%",
                "height": "100%",
                "display": "flex",
                "align-items": "center",
                "justify-content": "center",
                "z-index": "10"
              }}>
                <PlayerIcon />
              </div>
            </Show>
          </div>
        );
      }}
    </For>
  );
};

import { dragState, dragActions } from '../stores/dragStore';
import type { Chest, Furnace, CokeOven, Machine, CraftingBench } from '../types';

export const MainGrid: Component = () => {
  const [craftingBenchIndex, setCraftingBenchIndex] = createSignal<number | null>(null);

  const handleFactoryClick = (index: number) => {
    const machine = gameState.factoryGrid[index];
    if (machine?.type === 'crafting_bench') {
      setCraftingBenchIndex(index);
      gameActions.selectGridIndex(index); // Also select the crafting bench
    } else {
      handleFactoryGridClick(index);
    }
  };

  onMount(() => {
    // Handle keyboard movement for both factory and explore views
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState.currentView === 'explore') {
        if (gameState.combat.active) return; // Block movement during combat
        
        switch(e.key) {
          case 'ArrowUp':
          case 'w':
          case 'W':
            e.preventDefault();
            gameActions.movePlayer(0, -1);
            break;
          case 'ArrowDown':
          case 's':
          case 'S':
            e.preventDefault();
            gameActions.movePlayer(0, 1);
            break;
          case 'ArrowLeft':
          case 'a':
          case 'A':
            e.preventDefault();
            gameActions.movePlayer(-1, 0);
            break;
          case 'ArrowRight':
          case 'd':
          case 'D':
            e.preventDefault();
            gameActions.movePlayer(1, 0);
            break;
        }
      } else if (gameState.currentView === 'factory') {
        switch(e.key) {
          case 'ArrowUp':
          case 'w':
          case 'W':
            e.preventDefault();
            gameActions.moveFactoryPlayer(0, -1);
            break;
          case 'ArrowDown':
          case 's':
          case 'S':
            e.preventDefault();
            gameActions.moveFactoryPlayer(0, 1);
            break;
          case 'ArrowLeft':
          case 'a':
          case 'A':
            e.preventDefault();
            gameActions.moveFactoryPlayer(-1, 0);
            break;
          case 'ArrowRight':
          case 'd':
          case 'D':
            e.preventDefault();
            gameActions.moveFactoryPlayer(1, 0);
            break;
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
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
            if (type === 'crafting_bench') newMachine = { type: 'crafting_bench', craftingGrid: Array(9).fill(null), outputSlot: null } as CraftingBench;
            if (newMachine) gameActions.placeMachine(idx, newMachine);
          }
        }
      }
      dragActions.end();
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    onCleanup(() => {
      window.removeEventListener('keydown', handleKeyDown);
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
      
      <div class="flex-1 flex flex-col">
        <Show when={gameState.currentView === 'explore'}>
          <div class="flex gap-4 items-start justify-center w-full">
            <div class="relative">
              <div class="grid grid-cols-10 grid-rows-10 gap-1 bg-black/30 p-2 rounded-lg" style="width: 440px; height: 440px;">
                <WorldGrid />
              </div>
              <Hotbar />
            </div>
            <Minimap />
          </div>
        </Show>

        <Show when={gameState.currentView === 'factory'}>
          <div class="flex items-center justify-center w-full">
            <div class="relative">
              <div class="grid grid-cols-10 grid-rows-10 gap-1 bg-black/30 p-2 rounded-lg" style="width: 440px; height: 440px;">
                <FactoryGrid onFactoryClick={handleFactoryClick} />
              </div>
              <Hotbar />
            </div>
          </div>
        </Show>
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
      
      <Show when={craftingBenchIndex() !== null}>
        <CraftingBenchUI
          gridIndex={craftingBenchIndex()!}
          onClose={() => setCraftingBenchIndex(null)}
        />
      </Show>
    </div>
  );
};