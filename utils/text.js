/* eslint-env browser */

'use strict';

module.exports = {
  addFixedText(game, x, y, message, fontSize) {
    const style = {
      font:     'Raleway',
      fontSize: fontSize || 16,

      fill: '#fff',

      stroke:          '#000',
      strokeThickness: 3,
    };

    const text = game.add.text(x, y, message, style);

    text.fixedToCamera = true;

    return text;
  },
};
