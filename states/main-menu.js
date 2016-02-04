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
      font:            'Raleway',
      fontSize:        88,
      fill:            '#fff',
      stroke:          '#000',
      strokeThickness: 3,
    };
    const defaultStyle = {
      font:            'Raleway',
      fontSize:        48,
      fill:            '#fff',
      stroke:          '#000',
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

    this.creditsText = this.add.text(
      this.instructionsText.x, this.instructionsText.y + 80,
      'Credits', defaultStyle
    );
    this.creditsText.anchor.set(0.5);
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

    this.creditsText.inputEnabled = true;
    this.creditsText.events.onInputUp.add(() => {
      this.showCredits();
    });
  },

  showInstructions() {
    this.playText.kill();
    this.instructionsText.kill();
    this.creditsText.kill();

    const instructionsStyle = {
      font:            'Raleway',
      fontSize:        48,
      fill:            '#fff',
      stroke:          '#000',
      strokeThickness: 3,
    };
    const commandsStyle = {
      font:            'Raleway',
      fontSize:        30,
      fill:            '#fff',
      stroke:          '#000',
      strokeThickness: 3,
    };

    const saviour = this.add.text(
      this.camera.view.width * 2 / 10, this.camera.view.height * 3 / 10, 'Saviour', instructionsStyle
    );

    saviour.anchor.set(0.5);

    const protector = this.add.text(
      this.camera.view.width - saviour.x, saviour.y, 'Protector', instructionsStyle
    );

    protector.anchor.set(0.5);

    const saviourCommands1 = this.add.text(
      saviour.x, saviour.y + 100, 'Arrow keys', commandsStyle
    );

    saviourCommands1.anchor.set(0.5);

    const saviourCommands2 = this.add.text(
      saviourCommands1.x, saviourCommands1.y + 80, 'Spacebar', commandsStyle
    );

    saviourCommands2.anchor.set(0.5);

    const protectorCommands1 = this.add.text(
      protector.x, protector.y + 100, 'Mouse', commandsStyle
    );

    protectorCommands1.anchor.set(0.5);

    this.input.onDown.add(function returnToMain() {
      saviour.destroy();
      protector.destroy();
      saviourCommands1.destroy();
      saviourCommands2.destroy();
      protectorCommands1.destroy();
      this.playText.revive();
      this.instructionsText.revive();
      this.creditsText.revive();
      this.input.onDown.removeAll();
    }, this);
  },

  showCredits() {
    this.playText.kill();
    this.instructionsText.kill();
    this.creditsText.kill();

    const style = {
      font:            'Raleway',
      fontSize:        28,
      fill:            '#fff',
      stroke:          '#000',
      strokeThickness: 3,
      align:           'center',
    };

    const thanksStyle = {
      font:            'Raleway',
      fontSize:        24,
      fill:            '#fff',
      stroke:          '#000',
      strokeThickness: 3,
      align:           'center',
    };

    const ggj = this.add.text(
      this.camera.view.centerX, 200, 'Made for Global Game Jam 2016', style
    );

    ggj.anchor.set(0.5, 0);

    const antonio = this.add.text(
      this.camera.view.centerX, ggj.y + 100,
      'Antonio La Barbera - Art', style
    );

    antonio.anchor.set(0.5, 0);

    const endrit = this.add.text(
      this.camera.view.centerX, antonio.y + 38,
      'Endrit Bajo - Code', style
    );

    endrit.anchor.set(0.5, 0);

    const felix = this.add.text(
      this.camera.view.centerX, endrit.y + 38,
      'Felix Laurie von Massenbach - Code', style
    );

    felix.anchor.set(0.5, 0);

    const michael = this.add.text(
      this.camera.view.centerX, felix.y + 38,
      'Michael Le - Code', style
    );

    michael.anchor.set(0.5, 0);

    const archil = this.add.text(
      this.camera.view.centerX, michael.y + 38,
      'Archil Tsiskaridze - Code', style
    );

    archil.anchor.set(0.5, 0);

    const sam = this.add.text(
      this.camera.view.centerX, archil.y + 38,
      'Zhaoqian Yu - Code', style
    );

    sam.anchor.set(0.5, 0);

    const duncan = this.add.text(
      this.camera.view.centerX, sam.y + 38,
      'Duncan McKenna - Narrative', style
    );

    duncan.anchor.set(0.5, 0);

    const dave = this.add.text(
      this.camera.view.centerX, duncan.y + 38,
      'Dave Allen - Sound', style
    );

    dave.anchor.set(0.5, 0);

    const thanks = this.add.text(
      this.camera.view.centerX, dave.y + 100,
      'Source images from:\n\nChristophe Verdier\nMarLeah Cole\nPepe Free Hair',
      thanksStyle
    );

    thanks.anchor.set(0.5, 0);

    this.input.onDown.add(function returnToMain() {
      ggj.destroy();
      antonio.destroy();
      endrit.destroy();
      felix.destroy();
      michael.destroy();
      archil.destroy();
      sam.destroy();
      duncan.destroy();
      dave.destroy();
      thanks.destroy();

      this.playText.revive();
      this.instructionsText.revive();
      this.creditsText.revive();

      this.input.onDown.removeAll();
    }, this);
  },
};
