'use strict';

const PhysicsSprite = require('./physics-sprite');

class Character extends PhysicsSprite {
  constructor(game, x, y) {
    super(game, x, y, 'character', 130);

    this.anchor.set(0.5);

    this.body.collideWorldBounds = true;

    this.animations.add('stop', [ 130 ], 10, false);
    this.animations.add('cast', [ 0, 1, 2, 3, 4, 5, 6 ], 5, false);
    this.animations.add(
      'up', [ 105, 106, 107, 108, 109, 110, 111, 112 ], 10, true
    );
    this.animations.add(
      'left', [ 118, 119, 120, 121, 122, 123, 124, 125 ], 10, true
    );
    this.animations.add(
      'down', [ 131, 132, 133, 134, 135, 136, 137, 138 ], 10, true
    );
    this.animations.add(
      'right', [ 144, 145, 146, 147, 148, 149, 150, 151 ], 10, true
    );

    this.leftFootstepSound  = game.add.audio('left-footstep-sfx');
    this.rightFootstepSound = game.add.audio('right-footstep-sfx');

    this.walkingSoundIsPlaying = false;
  }

  playWalkingSound() {
    this.isWalking = true;

    if (!this.walkingSoundIsPlaying) {
      // TODO: Set the volume based on distance from the camera.
      this.leftFootstepSound.play();
      this.walkingSoundIsPlaying = true;

      this.leftFootstepSound.onStop.addOnce(function playRight() {
        this.walkingSoundIsPlaying = false;

        if (this.isWalking) {
          this.rightFootstepSound.play();
          this.walkingSoundIsPlaying = true;

          this.rightFootstepSound.onStop.addOnce(function restart() {
            this.walkingSoundIsPlaying = false;

            if (this.isWalking) {
              this.playWalkingSound();
            }
          }, this);
        }
      }, this);
    }
  }

  stopSound() {
    this.isWalking = false;

    this.leftFootstepSound.stop();
    this.rightFootstepSound.stop();
  }

  resetVelocity() {
    this.body.velocity.x = 0;
    this.body.velocity.y = 0;
  }

  move(direction) {
    if (direction.isZero()) {
      this.stop();

      return;
    }

    this.body.velocity.x = direction.x;
    this.body.velocity.y = direction.y;

    this.body.velocity.normalize().multiply(250, 250);

    if (this.isCasting) {
      return;
    }

    if (direction.x < 0) {
      this.animations.play('left');
    } else if (direction.x > 0) {
      this.animations.play('right');
    } else if (direction.y < 0) {
      this.animations.play('up');
    } else if (direction.y > 0) {
      this.animations.play('down');
    }

    this.playWalkingSound();
  }

  stop() {
    this.resetVelocity();
    this.stopSound();

    if (!this.isCasting) {
      this.animations.play('stop');
    }
  }

  animateCast() {
    this.isCasting = true;

    this.animations.play('cast')
      .onComplete.add(function reenableAnimations() {
        this.isCasting = false;
      }, this);
  }
}

module.exports = Character;
