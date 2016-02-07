'use strict';

// Helper class to aid with playing audio in cutscenes.
class SceneAudioHelper {
  constructor(game, startingSoundKey) {
    this.game = game;
  }

  play(soundKey) {
    const newSound = this.game.add.audio(soundKey);
    newSound.play();

    // Fade out the previously playing sound (if playing), and set the new sound as the currently playing sound.
    if (this.currentSound && this.currentSound.isPlaying){
      this.currentSound.fadeOut(100);
      this.currentSound.onFadeComplete.addOnce(currentSound => {
        currentSound.stop();
        this.currentSound = newSound;
      });
    } else {
      this.currentSound = newSound;
    }
  }
}

module.exports = SceneAudioHelper;
