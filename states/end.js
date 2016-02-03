/* eslint-env browser */

'use strict';

const textUtil = require('../utils/text');

module.exports = {
  create() {
    const sprite = this.add.sprite(
      this.camera.view.width / 2, this.camera.view.height / 2, 'end-back'
    );

    sprite.anchor.set(0.5);

    const scale = Math.max(
      this.camera.view.width / sprite.width,
      this.camera.view.height / sprite.height
    );

    sprite.scale.set(scale);

    const text = textUtil.addFixedText(
      this.game,
      this.camera.view.centerX, this.camera.view.centerY,
      'To be continued...',
      { fontSize: 48 }
    );

    text.anchor.set(0.5);

    this.input.onDown.add(function restart() {
      this.state.start('main-menu', true, false, 0);
    }, this);
  },
};
