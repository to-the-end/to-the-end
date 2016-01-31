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
  }

  walkDown() {
    this.body.velocity.y = 1;
  }

  normalizeVelocity() {
    this.body.velocity.normalize().multiply(250, 250);
  }

  stop() {
    this.resetVelocity();
    this.frame = 4;
    this.stopWalkingSound();
  }
}

module.exports = Player;
