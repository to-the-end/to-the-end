'use strict';

class Player extends Phaser.Sprite {

  constructor(game, x, y) {
    super(game, x, y, 'character', 130);
    this.anchor.set(0.5);
    this.game.physics.arcade.enable(this);
    this.body.collideWorldBounds = true;
    this.animations.add('up', [105, 106, 107, 108, 109, 110, 111, 112], 10, true);
    this.animations.add('left', [118, 119, 120, 121, 122, 123, 124, 125], 10, true);
    this.animations.add('down', [131, 132, 133, 134, 135, 136, 137, 138], 10, true);
    this.animations.add('right', [144, 145, 146, 147, 148, 149, 150, 151], 10, true);
    game.add.existing(this);
    this.leftFootstepSound = game.add.audio('leftFootstep');
    this.rightFootstepSound = game.add.audio('rightFootstep');
  }

  enableInput(cursors) {
    // To determine whether to restart the sound or not.
    this.walkingSoundIsPlaying = false;

    Object.keys(cursors).forEach((key) => {
      cursors[key].onDown.add(() => {
        if (!this.walkingSoundIsPlaying) {
          this.isWalking = true;
          this.startWalkingSound();
        }
      });
    });
  }

  disableInput(cursors) {
    Object.keys(cursors).forEach((key) => {
      cursors[key].onDown.removeAll();
    });
  }

  startWalkingSound() {
    this.leftFootstepSound.play();
    this.walkingSoundIsPlaying = true;

    this.leftFootstepSound.onStop.addOnce(() => {
      this.walkingSoundIsPlaying = false;

      if (this.isWalking) {
        this.rightFootstepSound.play();
        this.walkingSoundIsPlaying = true;

        this.rightFootstepSound.onStop.addOnce(() => {
          this.walkingSoundIsPlaying = false;

          if (this.isWalking) {
            this.startWalkingSound();
          }
        });
      }
    });
  }

  stopWalkingSound() {
    this.isWalking = false;
  }

  resetVelocity() {
    this.body.velocity.x = 0;
    this.body.velocity.y = 0;
  }

  walkLeft() {
    this.body.velocity.x = -1;
    this.animations.play('left');
  }

  walkRight() {
    this.body.velocity.x = 1;
    this.animations.play('right');
  }

  walkUp() {
    this.body.velocity.y = -1;
    this.animations.play('up');
  }

  walkDown() {
    this.body.velocity.y = 1;
    this.animations.play('down');
  }

  normalizeVelocity() {
    this.body.velocity.normalize().multiply(250, 250);
  }

  stop() {
    this.resetVelocity();
    this.stopWalkingSound();
    this.frame = 130;
  }
}

module.exports = Player;
