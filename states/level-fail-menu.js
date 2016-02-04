/* eslint-env browser */

'use strict';

const textUtil = require('../utils/text');

module.exports = {
  init(nextLevelId, cameraPosition) {
    this.nextLevelId    = nextLevelId;
    this.cameraPosition = cameraPosition;
  },

  create() {
    // TODO: Add an overlay to darken the game.

    this.camera.x = this.cameraPosition.x;
    this.camera.y = this.cameraPosition.y;

    const retryText = textUtil.addFixedText(
      this.game,
      this.camera.view.width / 2, this.camera.view.height / 2,
      'Try Again',
      { fontSize: 48 }
    );

    retryText.anchor.set(0.5);

    retryText.inputEnabled = true;
    retryText.events.onInputUp.add(function retry() {
      // TODO: Should this go straight to the main state again?
      this.state.start('scene', true, false, this.nextLevelId);
    }, this);

    const mainMenuText = textUtil.addFixedText(
      this.game,
      retryText.x, retryText.y + 80,
      'Go to Main Menu',
      { fontSize: 48 }
    );

    mainMenuText.anchor.set(0.5);

    mainMenuText.inputEnabled = true;
    mainMenuText.events.onInputUp.add(function mainMenu() {
      this.state.start('main-menu', true, false, this.nextLevelId);
    }, this);
  },
};