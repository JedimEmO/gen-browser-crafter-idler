import { createStore } from 'solid-js/store';

export interface Message {
  id: string;
  text: string;
  type: 'info' | 'error' | 'success';
  timestamp: Date;
}

interface MessageState {
  messages: Message[];
}

const [messageState, setMessageState] = createStore<MessageState>({
  messages: []
});

export const messageActions = {
  logMessage: (text: string, type: Message['type'] = 'info') => {
    const message: Message = {
      id: Date.now().toString(),
      text,
      type,
      timestamp: new Date()
    };
    
    setMessageState('messages', (messages) => [message, ...messages].slice(0, 10));
  },
  
  clearMessages: () => {
    setMessageState('messages', []);
  }
};

export { messageState };