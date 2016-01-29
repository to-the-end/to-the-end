/* eslint-env browser */

'use strict';

module.exports = {
  preload() {
    this.load.spritesheet('dude', 'assets/dude.png', 32, 48);
  },

  init() {
    this.state.start('main');
  },
};
