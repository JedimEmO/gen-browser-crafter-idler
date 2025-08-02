import { For, createEffect } from 'solid-js';
import type { Component } from 'solid-js';
import { messageState } from '../stores/messageStore';

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
    </div>
  );
};