'use strict';

module.exports = {
  addFixedText(game, x, y, message, extraStyles) {
    const text = this.addText(game, x, y, message, extraStyles);

    text.fixedToCamera = true;

    return text;
  },

  addText(game, x, y, message, extraStyles) {
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

    return text;
  },

  typeOutText(game, textObj, textString, callback) {
    let i = 0;

    // TODO: Pause on punctuation.
    game.time.events.repeat(
      60,
      textString.length,
      function updateText() {
        i++;

        textObj.setText(textString.substring(0, i));

        if (i >= textString.length) {
          callback();
        }
      }
    );
  },
};
