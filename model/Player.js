'use strict';

class Player extends Phaser.Sprite {

  constructor(game, x, y) {
    super(game, x, y, 'dude');
    this.game.physics.arcade.enable(this);
    this.body.collideWorldBounds = true;
    this.body.setSize(32, 48, 0, 0);
    this.animations.add('left', [0, 1, 2, 3], 10, true);
    this.animations.add('right', [5, 6, 7, 8], 10, true);
    game.add.existing(this);
  }

  resetVelocity() {
    this.body.velocity.x = 0;
    this.body.velocity.y = 0;
  }

  walkLeft() {
    this.body.velocity.x = -150;
    this.animations.play('left');
  }

  walkRight() {
    this.body.velocity.x = 150;
    this.animations.play('right');
  }

  walkUp() {
    this.body.velocity.y = -150;
  }

  walkDown() {
    this.body.velocity.y = 150;
  }

  stop() {
    this.resetVelocity();
    this.frame = 4;
  }
}

module.exports = Player;
