import 'phaser';

import { AssetConfig } from '../../types';
import { MainScene } from '../../scenes/MainScene';
import { DemoScene } from '../../scenes/DemoScene';
import { LoadingScene } from '../../scenes/LoadingScene';
import { useGameState, GameState } from '../../state';
import { StoreApi } from 'zustand';
import CrtPipelinePlugin from 'phaser3-rex-plugins/plugins/crtpipeline-plugin.js';

const DEFAULT_CONFIG = {
  type: Phaser.AUTO,
  backgroundColor: '#ffffff',
  render: {
    pixelArt: true,
  },
  scale: {
    parent: 'game',
    mode: Phaser.Scale.FIT,
    width: window.innerWidth * window.devicePixelRatio,
    height: window.innerHeight * window.devicePixelRatio,
  },
  plugins: {
    global: [
      {
        key: 'rexCrtPipeline',
        plugin: CrtPipelinePlugin,
        start: true,
      },
    ],
  },
  scene: [LoadingScene, MainScene, DemoScene],
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
    },
  },
};

export interface CustomGameProps {
  config?: Phaser.Types.Core.GameConfig;
  assets: AssetConfig[];
  state: StoreApi<GameState>;
}

export class CustomGame extends Phaser.Game {
  state: StoreApi<GameState>;
  assets: AssetConfig[] = [];
  constructor(config: Phaser.Types.Core.GameConfig, assets: AssetConfig[]) {
    super(config);
    this.state = useGameState;
    this.assets = assets;
  }
}

export const createGame = ({
  config = DEFAULT_CONFIG,
  assets,
}: CustomGameProps) => {
  return new CustomGame(config, assets);
};
