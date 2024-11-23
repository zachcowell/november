import 'phaser';

export class LoadingScene extends Phaser.Scene {
  constructor() {
    super('loading')
  }

  preload() {
    this.load.image('tileset', 'assets/gridtiles.png');
    this.load.tilemapTiledJSON('map', 'assets/map.json');
    this.load.image('phaserguy', 'assets/phaserguy.png');
  }

  create() {
    this.scene.start('main');
  }

}
