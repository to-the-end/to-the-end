'use strict';

class PhysicsSprite extends Phaser.Sprite {
  constructor(game, x, y, key, frame, immovable) {
    super(game, x, y, key, frame);

    this.game.physics.arcade.enable(this);

    if (immovable) {
      this.body.immovable = true;
    }
  }
}

module.exports = PhysicsSprite;
