/* eslint-env browser */

'use strict';

module.exports = {
  preload() {
    this.load.spritesheet('dude', 'assets/dude.png', 32, 48);
  },

  create() {
    this.state.start('main');
  },
};
