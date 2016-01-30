'use strict';

class Switch extends Phaser.Sprite {

  constructor(game, x, y) {
    super(game, x, y, 'switch');
    this.frame = 11;
    this.game.physics.arcade.enable(this);
    this.body.collideWorldBounds = true;
    this.body.setSize(32, 32, 0, 0);
    this.body.immovable = true;
    this.animations.add('on', [11, 23, 35], 10, false);
    this.animations.add('off', [35, 23, 11], 10, false);
    this.isOn = false;
    game.add.existing(this);  // adds object to the game world
  }

  on() {
    this.isOn = true;
    this.animations.play('on');
  }

  off() {
    this.isOn = false;
    this.animations.play('off');
  }

  flick() {
    if (this.isOn) {
      this.off();
    } else {
      this.on();
    }
  }
}

module.exports = Switch;