'use strict';

const noble = require('noble');
const SAMServiceUUID = '3b989460975f11e4a9fb0002a5d5c51b';
const SAMReadCharacteristicUUID = '4c592e60980c11e4959a0002a5d5c51b';
const SAMGroupIDCharacteristicUUID = '5baab0a0980c11e4b5e90002a5d5c51b';

let player1 = {
  peripheral: undefined,
  value: undefined,
  groupIdCharacteristic: undefined,
  readCharacteristic: undefined,
  buttonPressed: false
};

noble.on('discover', (peripheral) => {
  if (peripheral.advertisement.localName === 'SAM Joystick') {
    if (!player1.peripheral) {
      player1.peripheral = peripheral;
      connectPlayer1(peripheral);
    }
  }
});

function connectPlayer1() {
  player1.peripheral.connect(() => {
    console.log("Player 1 connected");

    player1.peripheral.discoverServices([SAMServiceUUID], (err, services) => {
      services.forEach((service) => {
        service.discoverCharacteristics([], (err, characteristics) => {
          characteristics.forEach((characteristic) => {

            if (SAMGroupIDCharacteristicUUID === characteristic.uuid) {
              player1.groupIdCharacteristic = characteristic;
            }

            if (SAMReadCharacteristicUUID === characteristic.uuid) {
              player1.readCharacteristic = characteristic;
            }

          });

          if (player1.groupIdCharacteristic) {
            writeGroupId(player1.groupIdCharacteristic, () => {
              if (player1.readCharacteristic) {
                player1.readCharacteristic.on('read', onPlayer1DataRead);
                player1.readCharacteristic.notify(true);
              }
            });
          }
        });
      });
    });

  });
}

function writeGroupId(characteristic, callback) {
  console.log('writing group id');

  var buf;
  var cmd;

  cmd = [0, 255, 0];
  buf = new Buffer(cmd);

  try {
    characteristic.write(buf, false);
    callback();

  } catch (err) {
    console.log(err);
  }
}

function onPlayer1DataRead(data) {
  player1.previousValue = player1.value || data;
  player1.value = data;

  if (!player1.previousValue[2] && player1.value[2]) {
    player1.buttonPressed = true;
  } else {
    player1.buttonPressed = false;
  }
}

// Listen for state changes
noble.on('stateChange', (state) => {
  if (state === 'poweredOn') {
    console.log("start scanning");
    noble.startScanning();
  } else {
    console.log("stop scanning");
    noble.stopScanning();
  }
});

module.exports = player1;