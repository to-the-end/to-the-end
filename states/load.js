/* eslint-env browser */

'use strict';

module.exports = {
  preload() {

  },

  create() {
    const style = {
      font:     'monospace',
      fontSize: 36,

      fill:   '#fff',
      stroke: '#000',

      strokeThickness: 3,
    };

    const progressDisplay = this.add.text(0, 0, '', style);

    // Preload map
    this.load.tilemap('map', 'assets/tilemaps/example.csv', null, Phaser.Tilemap.CSV);
    this.load.image('tiles', 'assets/tilemaps/tiles/example.png');

    // Preload character
    this.load.spritesheet('dude', 'assets/dude.png', 32, 48);

    this.load.image('obstacle', 'assets/obstacle.png');

    this.load.onFileComplete.add(function handleProgress(progress) {
      progressDisplay.setText(`${progress}%`);
    }, this);

    this.load.onLoadComplete.add(function startMain() {
      this.state.start('main');
    }, this);

    this.load.start();
  },
};
