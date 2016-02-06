'use strict';

const cameraUtil = require('./camera');
const textUtil   = require('./text');

const defaultEntry = {
  // A flag to indicate whether to clear previous dialogues before
  // displaying this one.
  clear: false,

  // The text to display.
  text: null,

  // The asset key of an image to display filling the screen.
  image: null,

  // The key from the targets object to attach the text to.
  target: null,

  // The two character position key e.g. "tl" for top-left.
  position: 'cc',

  // The time in ms to wait at the end of the entry.
  holdMs: 3000,

  // TODO: Make this more general for "special effects".
  // A flag to indicate whether to shake the screen.
  shake: false,

  // An object with keys matching targets and values specifying a point delta
  // to move the target to.
  move: {},
};

const defaultMove = {
  x: 0,
  y: 0,

  delayMs: 0,
};

class Dialogue {
  constructor(game, entries, targets) {
    this.game    = game;
    this.entries = entries;
    this.targets = targets || {};

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

    let shouldShake = entry.shake;

    const delayNext = function delayNext() {
      // TODO: Allow leap frogging delays.
      //       Delay to remove, rather than hold time?
      this.game.time.events.add(entry.holdMs, function playNext() {
        // TODO: Stop shaking on end of text input instead?
        //       (i.e. the delayNext call)
        shouldShake = false;

        this.displayEntry(id + 1);
      }, this);
    }.bind(this);

    if (entry.text) {
      this.addText(entry, delayNext);
    } else {
      delayNext();
    }

    if (shouldShake) {
      const shakeCamera = function shakeCamera() {
        if (!shouldShake) {
          return;
        }

        // FIXME: This breaks the solition camera movement if the shake
        //        overruns the hold time.
        cameraUtil.shake(this.game, this.game.camera, shakeCamera.bind(this));
      }.bind(this);

      shakeCamera();
    }

    this.moveTargets(entry);
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
      wordWrapWidth: props.wordWrapWidth,
    };

    let text;

    if (entry.target) {
      text = textUtil.addText(this.game, props.x, props.y, '', style);

      const self = this;
      const _update = text.update;

      // TODO: It might be better to just add the text as a child of the target.
      text.update = function update() {
        const updatedProps = self.getPositionProperties(entry);

        this.x = updatedProps.x;
        this.y = updatedProps.y;

        _update();
      };
    } else {
      text = textUtil.addFixedText(this.game, props.x, props.y, '', style);
    }

    text.anchor.set(props.anchorX, props.anchorY);

    this.textGroup.add(text);

    textUtil.typeOutText(this.game, text, entry.text, callback);

    return text;
  }

  getPositionProperties(entry) {
    const props = {};

    if (entry.target) {
      const target = this.targets[entry.target];

      // FIXME: Offset to avoid falling off the edge of the camera.
      props.x = target.x + target.width;
      props.y = target.y;

      props.wordWrapWidth = this.game.camera.view.width * 0.4;

      // TODO: Set the other properties.

      return props;
    }

    props.wordWrapWidth = this.game.camera.view.width * 0.6;

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

      case 'c':
      default: {
        props.y       = this.game.camera.view.height / 2;
        props.anchorY = 0.5;
        props.alignV  = 'center';

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

      case 'c':
      default: {
        props.x       = this.game.camera.view.width / 2;
        props.anchorX = 0.5;
        props.alignH  = 'center';

        break;
      }
    }

    return props;
  }

  moveTargets(entry) {
    Object.keys(entry.move).forEach(function moveTarget(key) {
      // TODO: Allow chained movements, by using an array of
      //       move groups (like entry.move currently).
      const move = Object.assign({}, defaultMove, entry.move[key]);

      const delta  = new Phaser.Point(move.x, move.y);
      const target = this.targets[key];

      const finalPosition = new Phaser.Point();

      Phaser.Point.add(target.position, delta, finalPosition);

      // FIXME: Queue movements if the previous one isn't finished?
      this.game.time.events.add(move.delayMs, function setUpdate() {
        const _update = target.update;

        target.update = function update() {
          const direction = new Phaser.Point();

          if (!Phaser.Math.within(finalPosition.x, target.x, 1)) {
            if (finalPosition.x < target.x) {
              direction.x--;
            } else {
              direction.x++;
            }
          }

          if (!Phaser.Math.within(finalPosition.y, target.y, 1)) {
            if (finalPosition.y < target.y) {
              direction.y--;
            } else {
              direction.y++;
            }
          }

          this.move(direction);

          if (direction.isZero()) {
            this.update = _update;
          }

          _update(this);
        };
      }, this);
    }, this);
  }
}

module.exports = Dialogue;
