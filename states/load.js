/* eslint-env browser */

'use strict';

module.exports = {
  preload() {
    // Preload map
    this.game.load.tilemap('map', 'assets/tilemaps/example.csv', null, Phaser.Tilemap.CSV);
    this.game.load.image('tiles', 'assets/tilemaps/tiles/example.png');
    // Preload character
    this.game.load.spritesheet('player', 'assets/character/spaceman.png', 16, 16);
  },

  create() {
    this.state.start('main');
  },
};
