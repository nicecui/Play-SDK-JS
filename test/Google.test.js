import Event from '../src/Event';
import { newPlay } from './Utils';

const { expect } = require('chai');
const debug = require('debug')('Test:Google');

describe('test google', () => {
  it('test left and disconnect', done => {
    for (let i = 0; i < 10; i += 1) {
      const play = newPlay(`id_${i}`);
      play.on(Event.CONNECTED, () => {
        expect(play._sessionToken).to.be.not.equal(null);
        expect(play._masterServer).to.be.not.equal(null);
        play.createRoom();
      });
      play.on(Event.ROOM_JOINED, () => {
        debug(play.room.name);
        setTimeout(() => {
          play.leaveRoom();
        }, 30000);
      });
      play.on(Event.ROOM_LEFT, () => {
        debug('left room');
        play.disconnect();
      });
      play.on(Event.DISCONNECTED, () => {
        debug('disconnected');
        setTimeout(() => {
          done();
        }, 30000);
      });
      play.connect();
    }
  });
});
