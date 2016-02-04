'use strict';

module.exports = {
  buildSfxCollection(game, componentName, clipCount) {
    // FIXME: Make this a class.
    const sounds = [];

    for (let i = 0; i < clipCount; i++) {
      sounds.push(game.add.audio(`${componentName}-${i}-sfx`));
    }

    return sounds;
  },
};
