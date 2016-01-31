/* eslint-env browser */

'use strict';

module.exports = {
  init(sceneId) {
    this.sceneId = sceneId;
  },

  create() {
    this.addUIElements();
    this.enableInteraction();
  },

  addUIElements() {
    const sprite = this.add.sprite(
      this.camera.view.width / 2, this.camera.view.height / 2, 'menu-back'
    );

    sprite.anchor.set(0.5);

    const titleStyle = {
      font: 'Raleway',
      fontSize: 88,
      fill: '#fff',
      stroke: '#000',
      strokeThickness: 3
    };
    const defaultStyle = {
      font: 'Raleway',
      fontSize: 48,
      fill: '#fff',
      stroke: '#000',
      strokeThickness: 3,
    };

    this.title = this.add.text(
      this.camera.view.width / 2, titleStyle.fontSize, 'To The End', titleStyle
    );
    this.title.anchor.set(0.5);

    this.playText = this.add.text(
      this.camera.view.centerX, this.camera.view.centerY,
      'Play', defaultStyle
    );
    this.playText.anchor.set(0.5);

    this.instructionsText = this.add.text(
      this.playText.x, this.playText.y + 80,
      'Instructions', defaultStyle
    );
    this.instructionsText.anchor.set(0.5);
  },

  enableInteraction() {
    this.playText.inputEnabled = true;
    this.playText.events.onInputUp.add(() => {
      this.state.start('scene', true, false, this.sceneId);
    });

    this.instructionsText.inputEnabled = true;
    this.instructionsText.events.onInputUp.add(() => {
      this.showInstructions();
    });
  },

  showInstructions() {
    this.playText.kill();
    this.instructionsText.kill();
    const instructionsStyle = {
      font: 'Raleway',
      fontSize: 48,
      fill: '#fff',
      stroke: '#000',
      strokeThickness: 3,
    };
    const commandsStyle = {
      font: 'Raleway',
      fontSize: 30,
      fill: '#fff',
      stroke: '#000',
      strokeThickness: 3,
    };

    let saviour = this.add.text(
      this.camera.view.width * 2 / 10, this.camera.view.height * 3 / 10, 'Saviour', instructionsStyle
    );
    saviour.anchor.set(0.5);
    let protector = this.add.text(
      this.camera.view.width - saviour.x, saviour.y, 'Protector', instructionsStyle
    );
    protector.anchor.set(0.5);
    let saviourCommands1 = this.add.text(
      saviour.x, saviour.y + 100, 'Arrow keys', commandsStyle
    );
    saviourCommands1.anchor.set(0.5);
    let saviourCommands2 = this.add.text(
      saviourCommands1.x, saviourCommands1.y + 80, 'Spacebar', commandsStyle
    );
    saviourCommands2.anchor.set(0.5);
    let protectorCommands1 = this.add.text(
      protector.x, protector.y + 100, 'Mouse', commandsStyle
    );
    protectorCommands1.anchor.set(0.5);

    this.input.onDown.add(function () {
      saviour.destroy();
      protector.destroy();
      saviourCommands1.destroy();
      saviourCommands2.destroy();
      protectorCommands1.destroy();
      this.playText.revive();
      this.instructionsText.revive();
      this.input.onDown.removeAll();
    }, this);
  }
};

