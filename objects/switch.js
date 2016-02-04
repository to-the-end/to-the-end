'use strict';

class Switch extends Phaser.Sprite {

  constructor(game, x, y, id, switchSound) {
    super(game, x, y, 'switch', 0);

    this.id = id;

    this.anchor.set(0.5);

    this.game.physics.arcade.enable(this);
    this.body.setSize(21, 60, 0, 28);
    this.body.immovable = true;

    this.animations.add('on', [1, 2], 10, true);
    this.animations.add('off', [2, 1, 0], 10, false);

    this.switchSound = switchSound;
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
