import { For, Show } from 'solid-js';
import type { Component } from 'solid-js';
import { gameState } from '../stores/gameStore';


const biomeColors: Record<string, string> = {
  plains: '#90EE90',      // Light green
  forest: '#228B22',      // Forest green
  desert: '#F4A460',      // Sandy brown
  rocky_hills: '#696969', // Dim gray
  swamp: '#2F4F4F',      // Dark slate gray
};

export const Minimap: Component = () => {
  const mapSize = 7; // 7x7 grid of chunks
  const center = Math.floor(mapSize / 2);
  
  const getChunkBiome = (offsetX: number, offsetY: number) => {
    const chunkX = gameState.world.playerX + offsetX;
    const chunkY = gameState.world.playerY + offsetY;
    const key = `${chunkX},${chunkY}`;
    
    // If chunk exists, use its biome
    if (gameState.world.chunks[key]) {
      return gameState.world.chunks[key].biome;
    }
    
    // Otherwise return null (unexplored)
    return null;
  };
  
  const chunks = () => {
    const result = [];
    for (let y = -center; y <= center; y++) {
      for (let x = -center; x <= center; x++) {
        result.push({ x, y });
      }
    }
    return result;
  };
  
  return (
    <div class="panel mt-4">
      <h3 class="text-sm font-semibold mb-2 text-gray-400">World Map</h3>
      <div class="relative">
        <div 
          class="grid gap-0.5 mx-auto"
          style={{
            "grid-template-columns": `repeat(${mapSize}, 1fr)`,
            "width": "140px",
            "height": "140px"
          }}
        >
          <For each={chunks()}>
            {(chunk) => {
              const biome = () => getChunkBiome(chunk.x, chunk.y);
              const isCurrentChunk = () => chunk.x === 0 && chunk.y === 0;
              
              return (
                <div 
                  class="minimap-chunk"
                  classList={{
                    'current-chunk': isCurrentChunk(),
                    'unexplored': !biome()
                  }}
                  style={{
                    "background-color": biome() ? biomeColors[biome()!] : '#1a1a1a',
                    "position": "relative"
                  }}
                  title={biome() ? `${biome()} (${gameState.world.playerX + chunk.x}, ${gameState.world.playerY + chunk.y})` : 'Unexplored'}
                >
                  <Show when={isCurrentChunk()}>
                    <div 
                      class="absolute inset-0 flex items-center justify-center"
                      style={{ "z-index": "10" }}
                    >
                      <div class="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    </div>
                  </Show>
                </div>
              );
            }}
          </For>
        </div>
        
        {/* Compass */}
        <div class="text-center mt-2 text-xs text-gray-500">
          <div>N</div>
          <div class="flex justify-between px-1">
            <span>W</span>
            <span>({gameState.world.playerX}, {gameState.world.playerY})</span>
            <span>E</span>
          </div>
          <div>S</div>
        </div>
      </div>
    </div>
  );
};