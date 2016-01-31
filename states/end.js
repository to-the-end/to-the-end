/* eslint-env browser */

'use strict';

module.exports = {
  create() {
    const style = {
      font:     'monospace',
      fontSize: 48,

      fill: '#fff',

      stroke:          '#000',
      strokeThickness: 3,
    };

    const text = this.add.text(
      this.camera.view.centerX, this.camera.view.centerY,
      'Thanks for playing!', style
    );

    text.anchor.set(0.5);
  },
};
