/* eslint-env browser */

'use strict';

module.exports = {
  create() {
    const style = {
      font:     'Raleway',
      fontSize: 48,

      fill: '#fff',

      stroke:          '#000',
      strokeThickness: 3,
    };

    const text = this.add.text(
      this.camera.view.centerX, this.camera.view.centerY,
      'To be continued...', style
    );

    text.anchor.set(0.5);

    this.input.onDown.add(function restart() {
      this.state.start('mainMenu', true, false, 0);
    }, this);
  },
};
