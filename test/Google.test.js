import Event from '../src/Event';
import { newPlay, newGooglePlay } from './Utils';

const { expect } = require('chai');
const debug = require('debug')('Test:Google');

describe('test google', () => {
  // it('test left and disconnect', done => {
  //   for (let i = 0; i < 10; i += 1) {
  //     const play = newPlay(`id_${i}`);
  //     play.on(Event.CONNECTED, () => {
  //       expect(play._sessionToken).to.be.not.equal(null);
  //       expect(play._masterServer).to.be.not.equal(null);
  //       play.createRoom();
  //     });
  //     play.on(Event.ROOM_JOINED, () => {
  //       debug(play.room.name);
  //       setTimeout(() => {
  //         play.leaveRoom();
  //       }, 30000);
  //     });
  //     play.on(Event.ROOM_LEFT, () => {
  //       debug('left room');
  //       play.disconnect();
  //     });
  //     play.on(Event.DISCONNECTED, () => {
  //       debug('disconnected');
  //       setTimeout(() => {
  //         done();
  //       }, 30000);
  //     });
  //     play.connect();
  //   }
  // });

  it('test 10000', done => {
    let created = 0;
    let failed = 0;
    for (let i = 0; i < 10000; i += 1) {
      const play = newGooglePlay(`id_${i}`);
      play.on(Event.CONNECTED, () => {
        play.createRoom(play.userId);
      });
      play.on(Event.ROOM_CREATED, () => {
        debug('room created');
        created += 1;
        debug(`created: ${created}`);
      });
      play.on(Event.ROOM_CREATE_FAILED, err => {
        const { code, detail } = err;
        debug(`${code}, ${detail}`);
        failed += 1;
        debug(`failed: ${failed}`);
      });
      play.connect();
    }
  });
});
