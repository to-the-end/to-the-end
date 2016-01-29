'use strict';

class Player {

  constructor(game, x, y) {
    this.game = game;
    this.sprite = game.add.sprite(0, 0, 'dude');
    this.game.physics.arcade.enable(this.sprite);
    this.sprite.body.collideWorldBounds = true;

    this.sprite.animations.add('left', [0, 1, 2, 3], 10, true);
    this.sprite.animations.add('right', [5, 6, 7, 8], 10, true);
  }

  resetVelocity() {
    this.sprite.body.velocity.x = 0;
    this.sprite.body.velocity.y = 0;
  }

  walkLeft() {
    this.sprite.body.velocity.x = -150;
    this.sprite.animations.play('left');
  }

  walkRight() {
    this.sprite.body.velocity.x = 150;
    this.sprite.animations.play('right');
  }

  walkUp() {
    this.sprite.body.velocity.y = -150;
  }

  walkDown() {
    this.sprite.body.velocity.y = 150;
  }

  stop() {
    this.resetVelocity();
    this.sprite.frame = 4;
  }
}

module.exports = Player;