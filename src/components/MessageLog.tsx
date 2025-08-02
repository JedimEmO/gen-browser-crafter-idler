import { For, createEffect } from 'solid-js';
import type { Component } from 'solid-js';
import { messageState, messageActions } from '../stores/messageStore';
import { saveGame, loadGame, resetGame } from '../stores/gameStore';

export const MessageLog: Component = () => {
  let containerRef: HTMLDivElement | undefined;
  
  createEffect(() => {
    // Auto-scroll to newest message
    if (messageState.messages.length > 0 && containerRef) {
      containerRef.scrollTop = 0;
    }
  });
  
  return (
    <div class="panel flex-1 flex flex-col">
      <h2 class="panel-header">System Log</h2>
      <div ref={containerRef} class="space-y-2 overflow-y-auto flex-1 pr-2">
        <For each={messageState.messages}>
          {(message) => (
            <div class={`message ${message.type} relative pl-4`}>
              <span class="text-xs text-gray-500 mr-2">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
              <span class="text-sm">{message.text}</span>
            </div>
          )}
        </For>
      </div>
      <div class="flex gap-2 mt-2 pt-2 border-t border-gray-700">
        <button 
          class="flex-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
          onClick={() => {
            if (saveGame()) {
              messageActions.logMessage('Game saved successfully!');
            } else {
              messageActions.logMessage('Failed to save game.');
            }
          }}
        >
          Save
        </button>
        <button 
          class="flex-1 px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition-colors"
          onClick={() => {
            if (loadGame()) {
              messageActions.logMessage('Game loaded successfully!');
            } else {
              messageActions.logMessage('No save game found.');
            }
          }}
        >
          Load
        </button>
        <button 
          class="flex-1 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors"
          onClick={() => {
            if (confirm('Are you sure you want to reset all progress? This cannot be undone!')) {
              resetGame();
              messageActions.logMessage('Game reset to initial state.');
            }
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
};