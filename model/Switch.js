'use strict';

class Switch extends Phaser.Sprite {

  constructor(game, x, y) {
    super(game, x, y, 'dude');
    this.game.physics.arcade.enable(this);
    this.body.collideWorldBounds = true;
    this.body.setSize(32, 48, 0, 0);
    this.animations.add('up', [0, 1, 2, 3], 10, true);
    this.animations.add('down', [5, 6, 7, 8], 10, true);
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
}

module.exports = Player;
