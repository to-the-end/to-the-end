'use strict';

const textUtil = require('../utils/text');

class SpeechBubble extends Phaser.Sprite {
  constructor(game, x, y, message) {
    super(game, x, y);

    this.onDisplayComplete = new Phaser.Signal();

    const tileWidth = 32;

    const extraStyles = {
      fontSize: 18,

      fill: '#000',

      strokeThickness: 0,

      wordWrap:      true,
      wordWrapWidth: 400,  // FIXME: Don't hardcode this!
    };

    this.text = textUtil.makeText(
      game, tileWidth, tileWidth, message, extraStyles
    );

    const bounds = this.text.getLocalBounds();
    const width  = bounds.width + 2 * tileWidth;
    const height = bounds.height + 2 * tileWidth;

    const bubbleBorder = [
      game.make.image(0, 0, 'speech-bubble', 0),
      game.make.tileSprite(
        tileWidth, 0,
        width - 2 * tileWidth, tileWidth,
        'speech-bubble', 1
      ),
      game.make.image(width - tileWidth, 0, 'speech-bubble', 2),
      game.make.tileSprite(
        width - tileWidth, tileWidth,
        tileWidth, height - 2 * tileWidth,
        'speech-bubble', 5
      ),
      game.make.image(
        width - tileWidth, height - tileWidth, 'speech-bubble', 8
      ),
      game.make.tileSprite(
        tileWidth, height - tileWidth,
        width - 2 * tileWidth, tileWidth,
        'speech-bubble', 7
      ),
      game.make.image(0, height - tileWidth, 'speech-bubble', 6),
      game.make.tileSprite(
        0, tileWidth,
        tileWidth, height - 2 * tileWidth,
        'speech-bubble', 3
      ),
    ];

    bubbleBorder.forEach(function addEdge(edge) {
      this.addChild(edge);
    }, this);

    const bubbleCenter = game.make.tileSprite(
      tileWidth, tileWidth,
      width - 2 * tileWidth, height - 2 * tileWidth,
      'speech-bubble', 4
    );

    this.addChild(bubbleCenter);

    this.text.setText('');

    this.addChild(this.text);

    textUtil.typeOutText(game, this.text, message, function dispatchEvent() {
      this.onDisplayComplete.dispatch();
    }.bind(this));
  }
}

module.exports = SpeechBubble;
