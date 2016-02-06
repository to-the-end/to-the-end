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
    const fullStopCount = (textString.match(/\./g) || []).length;
    const fullStopDuration = 20;

    const commaCount = (textString.match(/,/g) || []).length;
    const commaDuration = 5;

    const repetitions = textString.length +
      fullStopCount * fullStopDuration +
      commaCount * commaDuration;

    let i = 0;
    let skipCount = 0;

    game.time.events.repeat(
      60,
      repetitions,
      function updateText() {
        if (textString[i - 1] === '.') {
          skipCount++;
          skipCount %= fullStopDuration + 1;
        } else if (textString[i - 1] === ',') {
          skipCount++;
          skipCount %= commaDuration + 1;
        }

        if (skipCount) {
          return;
        }

        i++;

        textObj.setText(textString.substring(0, i));

        if (i >= textString.length) {
          callback();
        }
      }
    );
  },
};
