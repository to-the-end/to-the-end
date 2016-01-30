'use strict';

class Switch extends Phaser.Sprite {

  constructor(game, x, y, id) {
    super(game, x, y, 'switch');
    this.Id = id;
    this.frame = 11;
    this.game.physics.arcade.enable(this);
    this.body.collideWorldBounds = true;
    this.body.setSize(32, 32, 0, 0);
    this.body.immovable = true;
    this.animations.add('on', [11, 23, 35], 10, false);
    this.animations.add('off', [35, 23, 11], 10, false);
    this.isOn = false;
    this.soundEffect = game.add.audio('switch');
    game.add.existing(this);  // adds object to the game world
  }

  getId() {
    return this.Id;
  }

  on() {
    this.isOn = true;
    this.animations.play('on');
    this.soundEffect.play();
    return this.getId();
  }

  off() {
    this.isOn = false;
    this.animations.play('off');
    this.soundEffect.play();
    return this.getId();
  }

  flick() {
    return this.isOn ? this.off() : this.on();
  }
}

module.exports = Switch;