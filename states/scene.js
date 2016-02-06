'use strict';

const Dialogue = require('../utils/dialogue');

module.exports = {
  init(sceneId) {
    this.loadScene(sceneId);
  },

  create() {
    this.keys = {
      enter: this.input.keyboard.addKey(Phaser.Keyboard.ENTER),
    };

    this.setupAudio();

    this.startScene();
  },

  loadScene(id) {
    this.sceneId   = id;
    this.sceneData = this.cache.getJSON(`scene-${id}`);
  },

  setupAudio() {
    this.music = this.add.audio('scene-soundtrack');
  },

  startScene() {
    this.music.play();

    this.enableInput();

    this.startDialogue();
  },

  endScene() {
    this.sound.destroy();

    this.state.start('level', true, false, this.sceneId);
  },

  enableInput() {
    // TODO: Add a hint for this binding for a short time at the beginning.
    this.keys.enter.onDown.add(this.endScene, this);
  },

  disableInput() {
    this.keys.enter.onDown.removeAll();
  },

  startDialogue() {
    const dialogue = new Dialogue(this.game, this.sceneData.dialogue);

    dialogue.onComplete.add(this.endScene, this);

    dialogue.start();
  },
};
