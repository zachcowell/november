import 'phaser';
import { createGame } from './helpers/Game';
import { useGameState } from './state';
window.addEventListener('load', () => {
  createGame({state: useGameState})
})