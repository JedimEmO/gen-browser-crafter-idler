import { createSignal, onMount, Show } from 'solid-js';
import type { Component } from 'solid-js';
import { MessageLog } from './components/MessageLog';
import { MinecraftInventory } from './components/MinecraftInventory';
import { MainGrid } from './components/MainGrid';
import { RecipeBook } from './components/RecipeBook';
import { MachineDetails } from './components/MachineDetails';
import { CombatModal } from './components/CombatModal';
import { startGameLoop } from './systems/gameLoop';
import { messageActions } from './stores/messageStore';
import { gameState } from './stores/gameStore';
import DevMenu from './components/DevMenu';
import DragGhost from './components/DragGhost';
import { CursorItem } from './components/CursorItem';

const App: Component = () => {
  onMount(() => {
    startGameLoop();
    messageActions.logMessage('Welcome to IdleCrafter Singularity. Use the Wrench to configure machines.');
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') setDevOpen(false);
    });
  });
  
  const [devOpen, setDevOpen] = createSignal(true);
  return (
    <div class="h-screen bg-gradient-to-br from-gray-950 to-gray-900 flex flex-col">
      <div class="tooltip" id="tooltip"></div>
      <DragGhost />
      <CursorItem />
      <CombatModal />
      
      {/* Header */}
      <header class="border-b border-gray-800 bg-black/50 backdrop-blur-sm">
        <div class="container mx-auto px-4 py-3">
          <h1 class="text-xl font-light tracking-wider">
            <span class="text-cyan-400">IDLE</span>
            <span class="text-gray-400">CRAFTER</span>
            <span class="text-gray-600 text-sm ml-2">SINGULARITY</span>
          </h1>
        </div>
      </header>
      
      {/* Main Content */}
      <main class="flex-1 container mx-auto px-4 py-4">
        <div class="grid grid-cols-12 gap-4 h-full">
          {/* Left Sidebar - Fixed width */}
          <div class="col-span-3 flex flex-col gap-4 h-full min-h-0">
            <MinecraftInventory />
            <MachineDetails />
          </div>
          
          {/* Center - Main Game View */}
          <div class="col-span-6 flex min-h-0 flex-col">
            <div class="flex-1 min-h-0">
              <MainGrid />
            </div>
            <MessageLog />
          </div>
          
          {/* Right Sidebar - Recipe Book */}
          <div class="col-span-3 min-h-0 flex flex-col">
            <RecipeBook />
          </div>
        </div>
      </main>

      <button aria-label="dev-hotspot" class="fixed bottom-2 right-2 z-[10100] h-6 px-2 rounded bg-cyan-500 text-black text-xs font-semibold shadow hover:brightness-110 pointer-events-auto" onClick={() => { console.log('DEV clicked'); setDevOpen(v => !v); }}>DEV</button>
      {devOpen() && <DevMenu setOpen={setDevOpen} /> }
    </div>
  );
};

export default App;