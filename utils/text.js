/* eslint-env browser */

'use strict';

module.exports = {
  addFixedText(game, x, y, message, extraStyles) {
    const style = Object.assign(
      {
        font:     'Raleway',
        fontSize: 16,

        fill: '#fff',

        stroke:          '#000',
        strokeThickness: 3,
      },
      extraStyles
    );

    const text = game.add.text(x, y, message, style);

    text.fixedToCamera = true;

    return text;
  },
};
