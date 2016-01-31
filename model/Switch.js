'use strict';

class Switch extends Phaser.Sprite {

  constructor(game, x, y, id, switchSound) {
    super(game, x, y, 'switch');
    this.id = id;
    this.frame = 0;
    this.anchor.set(0.5);
    this.game.physics.arcade.enable(this);
    this.body.immovable = true;
    this.animations.add('on', [1, 2], 10, true);
    this.animations.add('off', [2, 1, 0], 10, false);
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
