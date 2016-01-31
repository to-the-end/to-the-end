'use strict';

class Switch extends Phaser.Sprite {

  constructor(game, x, y, id, switchSound) {
    super(game, x, y, 'switch');
    this.id = id;
    this.frame = 11;
    this.anchor.set(0.5);
    this.game.physics.arcade.enable(this);
    this.body.collideWorldBounds = true;
    this.body.setSize(32, 32, 0, 0);
    this.body.immovable = true;
    this.animations.add('on', [11, 23, 35], 10, false);
    this.animations.add('off', [35, 23, 11], 10, false);
    this.isOn = false;
    this.switchSound = switchSound;
    game.add.existing(this);  // adds object to the game world
  }

  getId() {
    return this.id;
  }

  on() {
    this.isOn = true;
    this.animations.play('on');
    return this.getId();
  }

  off() {
    this.isOn = false;
    this.animations.play('off');
    return this.getId();
  }

  playSound(){
    this.switchSound.play();
  }

  flick() {
    return this.isOn ? this.off() : this.on();
  }
}

module.exports = Switch;
