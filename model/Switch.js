'use strict';

class Switch extends Phaser.Sprite {

  constructor(game, x, y) {
    super(game, x, y, 'switch');
    this.game.physics.arcade.enable(this);
    this.body.collideWorldBounds = true;
    this.body.setSize(32, 32, 0, 0);
    this.animations.add('up', [0, 1, 2, 3], 10, false);
    this.animations.add('down', [5, 6, 7, 8], 10, false);
    this.on = false;
  }

  up() {
    this.on = true;
    this.animations.play('up');
  }

  down() {
    this.on = false;
    this.animations.play('down');
  }

  flick() {
    this.on = !this.on;

    if (this.on) {
      this.animations.play('up');
    } else {
      this.animations.play('down');
    }
  }
}

module.exports = Switch;