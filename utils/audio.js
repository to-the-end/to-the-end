'use strict';

module.exports = {
  buildSfxCollection(game, componentName, clipCount) {
    // FIXME: Make this a class.
    const sounds = [];

    for (let i = 0; i < clipCount; i++) {
      sounds.push(this.addSfx(game, componentName, i));
    }

    return sounds;
  },

  addSfx(game, componentName, clipId) {
    return game.add.audio(`${componentName}-${clipId}-sfx`);
  },
};
