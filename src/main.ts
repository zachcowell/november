import 'phaser';
import { createGame } from './helpers/Game';
import { useGameState } from './state';
import gameYaml from './game.yaml';
import { AssetConfig } from './types';

window.addEventListener('load', () => {
  createGame({ state: useGameState, assets: gameYaml.assets as AssetConfig[] });
});
