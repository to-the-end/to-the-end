/* eslint-env browser */
'use strict';

let Player = require('../model/Player');

let cursors;
let player;

module.exports = {
  init() {

  },

  preload() {
    cursors = this.input.keyboard.createCursorKeys();
  },

  create() {
    player = new Player(this, 0, 0);
  },

  update() {
    player.resetVelocity();

    if (cursors.left.isDown)
    {
        player.walkLeft();
    }
    else if (cursors.right.isDown)
    {
        player.walkRight();
    }
    else if (cursors.up.isDown)
    {
        player.walkUp();
    }
    else if (cursors.down.isDown)
    {
        player.walkDown();
    } else {
        player.stop();
    }
  },

  render() {

  },
};
