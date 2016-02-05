'use strict';

class Audio {
  constructor(game){
    this.game = game;
  }

  buildSfxCollection(componentName, clipCount) {
    const sounds = [];

    for (let i = 0; i < clipCount; i++) {
      sounds.push(this.addSfx(componentName, i));
    }

    return sounds;
  }

  addSfx(componentName, clipId) {
    return this.game.add.audio(`${componentName}-${clipId}-sfx`);
  }

  // Play sequence of non-looping sounds
  playSequence(soundKeys){
    var sounds = soundKeys.map((key) => {
      return this.game.add.audio(key);
    });

    playSoundsInOrder(sounds);
  }

  playSoundsInOrder(sounds){
    if (sounds.length > 0){
      sounds[0].play();
      sounds[0].onStop.addOnce(() => {
        playSoundsInOrder(sounds.slice(1));
      });
    }
  }

  playSequenceWithCrossfades(soundKeys, dividingFactor){
    if (!dividingFactor || dividingFactor < 1){
      dividingFactor = 10;
    }

    var sounds = soundKeys.map((key) => {
      return this.game.add.audio(key);
    });

    this.playSoundsInOrderWithCrossfades(sounds, dividingFactor);
  }

  playSoundsInOrderWithCrossfades(sounds, dividingFactor){
    if (sounds.length > 1){
      var sound1 = sounds[0];
      var sound2 = sounds[1];

      if (!sound1.isPlaying){
        sound1.play();
      }

      var duration = sound1.totalDuration * 1000;
      var fadeBoundary = duration / dividingFactor;
      var tween = this.game.add.tween(sound1);
      tween.to({ volume: 0 }, fadeBoundary, Phaser.Easing.Linear.None, false);

      setTimeout(() => {
        tween.start();
        sound2.fadeIn(fadeBoundary);
        this.playSoundsInOrderWithCrossfades(sounds.slice(1), dividingFactor);
      }, duration - fadeBoundary);
    } else if (sounds.length === 1){
      // do nothing?
    } else {
      // do nothing
    }
  }

  crossFade(sound1key, sound2key, dividingFactor){
    var sound1 = this.game.add.audio(sound1key);
    var sound2 = this.game.add.audio(sound2key);

    if (!dividingFactor || dividingFactor < 1){
      dividingFactor = 10;
    }

    sound1.play();

    // Need to get duration AFTER play - this is only set when audio has been decoded! 
    // Preload does not wait for audio to be decoded (grr) so no guarantee until play hit.
    // Need milliseconds for setTimeout
    var duration = sound1.totalDuration * 1000;
    var fadeBoundary = duration / dividingFactor;
    var tween = this.game.add.tween(sound1);
    tween.to({ volume: 0 }, fadeBoundary, Phaser.Easing.Linear.None, false);

    setTimeout(() => {
      tween.start();
      sound2.fadeIn(fadeBoundary);
    }, duration - fadeBoundary);
  }
}

module.exports = Audio;
