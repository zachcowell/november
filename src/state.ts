import { createStore } from 'zustand/vanilla';

// Define the state interface
export interface GameState {
  count: number;
  increment: () => void;
  decrement: () => void;
}

export const useGameState = createStore<GameState>((set, get) => ({
  count: 0,
  increment: () => set({ count: get().count + 1 }),
  decrement: () => set({ count: get().count - 1 }),
}));