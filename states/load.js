/* eslint-env browser */

'use strict';

module.exports = {
  preload() {

  },

  create() {
    // Preload map
    this.load.tilemap('map', 'assets/tilemaps/example.csv', null, Phaser.Tilemap.CSV);
    this.load.image('tiles', 'assets/tilemaps/tiles/example.png');
    // lever
    this.load.image('lever', 'assets/lever.png')

    // Preload character
    this.load.spritesheet('dude', 'assets/dude.png', 32, 48);

    // Preload character
    this.load.spritesheet('switch', 'assets/lever.png', 32, 32);

    this.load.image('obstacle', 'assets/obstacle.png');

    this.loadLevel('level1');

    this.load.onLoadComplete.add(function startMain() {
      this.state.start('main');
    }, this);

    this.load.start();
  },

  loadLevel(level) {
    this.load.json(level, `assets/levels/${level}.json`);
  }
};