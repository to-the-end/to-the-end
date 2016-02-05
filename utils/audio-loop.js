'use strict';

class AudioLoop {
  constructor(game, soundKey) {
    this.game = game;
    this.baseLoop = this.game.add.audio(soundKey);
    this.baseLoop.loop = true;
    this.playingSounds = [];
  }

  start() {
    this.playingSounds.push(this.initialSound);
    this.baseLoop.play();
  }

  // Adds an additional layer of sound at the point of the original sound's loop
  addLayer(soundKey) {
    const newSound = this.game.add.audio(soundKey);

    this.baseLoop.onLoop.addOnce(() => {
      newSound.play();
    });
  }

  newBaseSound(soundKey) {
    const newBaseSound = this.game.add.audio(soundKey);

    newBaseSound.loop = true;
    this.baseLoop.onLoop.addOnce(baseLoop => {
      baseLoop.stop();
      newBaseSound.play();
      this.baseLoop = newBaseSound;
    });
  }

  stopAll() {
    this.playingSounds.forEach(sound => {
      if (sound.isPlaying) {
        sound.stop();
      }
    });
  }

  fadeOutAll(fadeOutTime) {
    this.playingSounds.forEach(sound => {
      if (sound.isPlaying) {
        sound.fadeOut(fadeOutTime);
      }
    });
  }
}

module.exports = AudioLoop;
