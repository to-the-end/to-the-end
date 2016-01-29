/* eslint-env browser */

'use strict';

module.exports = {
  preload() {
    // Preload map
    this.load.tilemap('map', 'assets/tilemaps/example.csv', null, Phaser.Tilemap.CSV);
    this.load.image('tiles', 'assets/tilemaps/tiles/example.png');
    // Preload character
	this.load.spritesheet('dude', 'assets/dude.png', 32, 48);
    this.load.spritesheet('player', 'assets/character/spaceman.png', 16, 16);
  },

  create() {
    this.state.start('main');
  },
};
