'use strict';

const Dialogue = require('../utils/dialogue');
const textUtil = require('../utils/text');
const SceneAudioHelper = require('../utils/scene-audio-helper');

module.exports = {
  init(sceneId) {
    this.loadScene(sceneId);
  },

  create() {
    this.keys = {
      enter: this.input.keyboard.addKey(Phaser.Keyboard.ENTER),
    };

    this.setupAudio();
    this.setupDialogue();
    this.sceneAudioHelper = new SceneAudioHelper(this.game);
    this.startScene();
  },

  loadScene(id) {
    this.sceneId   = id;
    this.sceneData = this.cache.getJSON(`scene-${id}`);
  },

  setupAudio() {
    this.music = this.add.audio('scene-soundtrack');
  }

  setupDialogue() {
    this.dialogueGroup = this.add.group();
  },

  startScene() {
    this.enableInput();
    this.startDialogue();
  },

  endScene() {
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
