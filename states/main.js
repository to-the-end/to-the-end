/* eslint-env browser */

'use strict';

let cursors;
let player;

module.exports = {
  init() {

  },

  preload() {
    cursors = this.input.keyboard.createCursorKeys();
  },

  create() {
    player = this.add.sprite(0, 0, 'dude');
    this.physics.arcade.enable(player);
  },

  update() {
    player.body.velocity.x = 0;
    player.body.velocity.y = 0;

    if (cursors.left.isDown)
    {
        player.body.velocity.x = -150;
    }
    else if (cursors.right.isDown)
    {
        player.body.velocity.x = 150;
    }
    else if (cursors.up.isDown)
    {
        player.body.velocity.y = -150;
    }
    else if (cursors.down.isDown)
    {
        player.body.velocity.y = 150;
    }
  },

  render() {

  },
};
