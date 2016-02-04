'use strict';

module.exports = {
  shake(game, camera, callback) {
    const target = camera.target;

    if (target) {
      camera.unfollow();
    }

    const shakeTimer = game.time.create(false);

    const shakeRange = 20;
    const shakeInterval = 60;

    let shakeCount = 10;

    shakeTimer.loop(
      shakeInterval,
      function doShake() {
        if (!shakeCount) {
          if (target) {
            camera.follow(target);
          }

          shakeTimer.stop();

          if (typeof callback === 'function') {
            callback();
          }

          return;
        }

        let shift = shakeRange / 2;

        if (shakeCount % 2) {
          shift *= -1;
        }

        camera.x += shift;

        shakeCount--;
      }
    );

    shakeTimer.start();
  },
};
