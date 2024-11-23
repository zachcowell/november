import 'phaser'

import { MainScene } from '../../scenes/MainScene';
import { DemoScene } from '../../scenes/DemoScene';
import { LoadingScene } from '../../scenes/LoadingScene';
import { useGameState, GameState } from '../../state';
import { StoreApi } from 'zustand';
const DEFAULT_CONFIG = {
  type: Phaser.AUTO,
  backgroundColor: '#ffffff',
  scale: {
    parent: 'game',
    mode: Phaser.Scale.FIT,
    width:  window.innerWidth * window.devicePixelRatio,
    height: window.innerHeight * window.devicePixelRatio
  },
  scene: [LoadingScene, MainScene, DemoScene],
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: { y: 200 }
    }
  }
}

export interface GameProps {
  config?: Phaser.Types.Core.GameConfig;
  state: StoreApi<GameState>;
}

export class CustomGame extends Phaser.Game {
  state: StoreApi<GameState>;
  constructor(config: Phaser.Types.Core.GameConfig) {
    super(config);
    this.state = useGameState;
  }
}

export const createGame = ({ config=DEFAULT_CONFIG }: GameProps) => {
  return new CustomGame(config)
}
