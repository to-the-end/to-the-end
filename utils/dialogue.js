'use strict';

const textUtil = require('./text');

const defaultEntry = {
  // A boolean flag to indicate whether to clear previous
  // dialogues before displaying this one.
  clear: false,

  // The text to display.
  text: null,

  // The asset key of an image to display filling the screen.
  image: null,

  // The two character position key e.g. "tl" for top-left.
  position: 'cc',

  // The time in ms to wait at the end of the entry.
  holdMs: 3000,
};

class Dialogue {
  constructor(game, entries, targets) {
    this.game    = game;
    this.entries = entries;
    this.targets = targets;

    this.onComplete = new Phaser.Signal();
  }

  start() {
    this.imageGroup = this.game.add.group();
    this.textGroup  = this.game.add.group();

    this.displayEntry(0);
  }

  displayEntry(id) {
    let entry = this.entries[id];

    if (!entry) {
      this.textGroup.destroy();
      this.imageGroup.destroy();

      this.onComplete.dispatch();

      return;
    }

    entry = Object.assign({}, defaultEntry, entry);

    if (entry.clear) {
      this.textGroup.removeAll(true);
      this.imageGroup.removeAll(true);
    }

    if (entry.image) {
      this.addImage(entry);
    }

    const delayNext = function delayNext() {
      this.game.time.events.add(entry.holdMs, function playNext() {
        this.displayEntry(id + 1);
      }, this);
    }.bind(this);

    if (entry.text) {
      this.addText(entry, delayNext);
    } else {
      delayNext();
    }
  }

  addImage(entry) {
    const image = this.game.add.sprite(
      this.game.camera.view.width / 2, this.game.camera.view.height / 2,
      entry.image
    );

    image.anchor.set(0.5);

    const scale = Math.max(
      this.game.camera.view.width / image.width,
      this.game.camera.view.height / image.height
    );

    image.scale.set(scale);

    this.imageGroup.add(image);

    return image;
  }

  addText(entry, callback) {
    const props = this.getPositionProperties(entry);

    const style = {
      fontSize:      24,
      boundsAlignH:  props.alignH,
      boundsAlignV:  props.alignV,
      wordWrap:      true,
      wordWrapWidth: this.game.camera.view.width * 0.6,
    };

    const text = textUtil.addFixedText(this.game, props.x, props.y, '', style);

    text.anchor.set(props.anchorX, props.anchorY);

    this.textGroup.add(text);

    textUtil.typeOutText(this.game, text, entry.text, callback);
  }

  getPositionProperties(entry) {
    const props = {};

    const margin = 60;

    switch (entry.position[0]) {
      case 't': {
        props.y       = margin;
        props.anchorY = 0;
        props.alignV  = 'top';

        break;
      }

      case 'b': {
        props.y       = this.game.camera.view.height - margin;
        props.anchorY = 1;
        props.alignV  = 'bottom';

        break;
      }

      case 'c': {
        props.y       = this.game.camera.view.height / 2;
        props.anchorY = 0.5;
        props.alignV  = 'center';

        break;
      }

      default: {
        break;
      }
    }

    switch (entry.position[1]) {
      case 'l': {
        props.x       = margin;
        props.anchorX = 0;
        props.alignH  = 'left';

        break;
      }

      case 'r': {
        props.x       = this.game.camera.view.width - margin;
        props.anchorX = 1;
        props.alignH  = 'right';

        break;
      }

      case 'c': {
        props.x       = this.game.camera.view.width / 2;
        props.anchorX = 0.5;
        props.alignH  = 'center';

        break;
      }

      default: {
        break;
      }
    }

    return props;
  }
}

module.exports = Dialogue;
