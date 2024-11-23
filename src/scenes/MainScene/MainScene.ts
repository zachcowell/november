import 'phaser';

import { CustomGame } from '../../helpers/Game/Game';
import EasyStar from 'easystarjs';

export class MainScene extends Phaser.Scene {
  private finder = new EasyStar.js();
  private player?: Phaser.GameObjects.Image;
  private map?: Phaser.Tilemaps.Tilemap;
  private marker?: Phaser.GameObjects.Graphics;
  constructor() {
    super('main');
  }

  preload() {
    this.load.setBaseURL('https://labs.phaser.io');
    this.load.image('red', 'assets/particles/red.png');
  }

  create() {
    this.cameras.main.setBounds(0, 0, 20 * 32, 20 * 32);
    this.cameras.main.setBackgroundColor('#000000');

    this.createMap();
    this.player = this.createPlayer();
    this.createMarker();
    this.createPathfindingGrid();
    this.cameras.main.startFollow(this.player);
    this.input.on('pointerup', (pointer: Phaser.Input.Pointer) =>
      this.handleTileClick(pointer),
    );
  }

  update() {
    this.updateMarker(this.input.activePointer);
  }

  createPathfindingGrid() {
    // We create the 2D array representing all the tiles of our map
    const grid = [];
    for (var y = 0; y < this.map!.height; y++) {
      var col = [];
      for (var x = 0; x < this.map!.width; x++) {
        // In each cell we store the ID of the tile, which corresponds
        // to its index in the tileset of the map ("ID" field in Tiled)
        col.push(this.getTileID(x, y));
      }
      grid.push(col);
    }
    this.finder.setGrid(grid);

    const tileset = this.map!.tilesets[0];
    const tiles = tileset;
    const properties = tileset.tileProperties as unknown as Record<
      number,
      { collide: boolean; cost: number }
    >;
    const acceptableTiles = [];

    // We need to list all the tile IDs that can be walked on. Let's iterate over all of them
    // and see what properties have been entered in Tiled.
    for (var i = tileset.firstgid - 1; i < tiles.total; i++) {
      // firstgid and total are fields from Tiled that indicate the range of IDs that the tiles can take in that tileset
      if (!properties.hasOwnProperty(i)) {
        // If there is no property indicated at all, it means it's a walkable tile
        acceptableTiles.push(i + 1);
        continue;
      }
      if (!properties[i].collide) acceptableTiles.push(i + 1);
      if (properties[i].cost)
        this.finder.setTileCost(i + 1, properties[i].cost); // If there is a cost attached to the tile, let's register it
    }
    this.finder.setAcceptableTiles(acceptableTiles);
  }

  createPlayer() {
    const player = this.add.image(32, 32, 'phaserguy');
    player.setDepth(1);
    player.setOrigin(0, 0.5);
    return player;
  }
  createMarker() {
    // Marker that will follow the mouse
    this.marker = this.add.graphics();
    this.marker.lineStyle(3, 0xffffff, 1);
    this.marker.strokeRect(0, 0, this.map!.tileWidth, this.map!.tileHeight);
  }
  checkCollision(x: number, y: number) {
    const tile = this.map!.getTileAt(x, y);
    return tile.properties.collide == true;
  }

  getTileID(x: number, y: number) {
    const tile = this.map!.getTileAt(x, y);
    return tile.index;
  }

  createMap() {
    // Display map
    this.map = this.make.tilemap({ key: 'map' });
    // The first parameter is the name of the tileset in Tiled and the second parameter is the key
    // of the tileset image used when loading the file in preload.
    const tileset = this.map.addTilesetImage('tiles', 'tileset');
    this.map.createLayer(0, tileset, 0, 0);
  }

  updateMarker(pointer: Phaser.Input.Pointer) {
    const worldPoint = pointer.positionToCamera(
      this.cameras.main,
    ) as Phaser.Math.Vector2;

    // Rounds down to nearest tile
    const pointerTileX = this.map!.worldToTileX(worldPoint.x);
    const pointerTileY = this.map!.worldToTileY(worldPoint.y);
    this.marker!.x = this.map!.tileToWorldX(pointerTileX);
    this.marker!.y = this.map!.tileToWorldY(pointerTileY);
    this.marker!.setVisible(!this.checkCollision(pointerTileX, pointerTileY));
  }

  handleTileClick(pointer: Phaser.Input.Pointer) {
    const x = this.cameras.main.scrollX + pointer.x;
    const y = this.cameras.main.scrollY + pointer.y;
    const toX = Math.floor(x / 32);
    const toY = Math.floor(y / 32);
    const fromX = Math.floor(this.player!.x / 32);
    const fromY = Math.floor(this.player!.y / 32);
    console.log(
      'going from (' + fromX + ',' + fromY + ') to (' + toX + ',' + toY + ')',
    );

    this.finder.findPath(fromX, fromY, toX, toY, (path) => {
      if (path === null) {
        console.warn('Path was not found.');
      } else {
        console.log(path);
        this.moveCharacter(path);
      }
    });
    this.finder.calculate(); // don't forget, otherwise nothing happens
  }

  moveCharacter(path: any[]) {
    // Sets up a list of tweens, one for each tile to walk, that will be chained by the timeline
    var tweens = [];
    for (var i = 0; i < path.length - 1; i++) {
      var ex = path[i + 1].x;
      var ey = path[i + 1].y;
      tweens.push({
        targets: this.player,
        x: { value: ex * this.map!.tileWidth, duration: 200 },
        y: { value: ey * this.map!.tileHeight, duration: 200 },
      });
    }

    this.tweens.timeline({ tweens });
  }
}
