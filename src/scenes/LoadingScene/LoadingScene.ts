import 'phaser';

import { CustomGame } from '../../helpers/Game/Game';
import { AssetConfig } from '../../types';
export class LoadingScene extends Phaser.Scene {
  constructor() {
    super('loading');
  }

  preload() {
    const g = this.game as CustomGame;
    this.load.atlas('cube', 'assets/cube.png', 'assets/cube.json');
    g.assets.forEach((assetConfig: AssetConfig) => {
      this.load.spritesheet(assetConfig.name, assetConfig.filepath, {
        frameWidth: assetConfig.frameWidth,
        frameHeight: assetConfig.frameHeight,
      });
    });
    this.load.image('tileset', 'assets/gridtiles.png');
    this.load.tilemapTiledJSON('map', 'assets/map.json');
    this.load.image('phaserguy', 'assets/phaserguy.png');
  }

  create() {
    this.scene.start('main');
  }
}
