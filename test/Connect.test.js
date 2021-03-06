import Event from '../src/Event';
import { newPlay, newWechatPlay } from './Utils';

const { expect } = require('chai');
const debug = require('debug')('Test:Connect');

describe('test connection', () => {
  it('test connect', done => {
    const play = newPlay('tc0');
    play.on(Event.CONNECTED, () => {
      debug('OnConnected');
      play.disconnect();
      done();
    });
    play.on(Event.CONNECT_FAILED, error => {
      debug(`OnConnectFailed: ${error}`);
    });
    play.connect();
  });

  it('test connect with same id', done => {
    const play1 = newPlay('tc11');
    const play2 = newPlay('tc11');
    let f1 = false;
    let f2 = false;
    play1.on(Event.CONNECTED, () => {
      play2.connect();
    });
    play1.on(Event.ERROR, err => {
      const { code, detail } = err;
      debug(`${code}, ${detail}`);
      if (code === 4102) {
        f1 = true;
        if (f1 && f2) {
          play2.disconnect();
          done();
        }
      }
    });
    play2.on(Event.CONNECTED, () => {
      debug('play2 connected');
      f2 = true;
      if (f1 && f2) {
        play2.disconnect();
        done();
      }
    });
    play1.connect();
  });

  it('test disconnect from master', done => {
    const play = newPlay('tc2');
    let reconnectFlag = false;
    play.on(Event.CONNECTED, () => {
      debug('play connected');
      expect(play._sessionToken).to.be.not.equal(null);
      expect(play._masterServer).to.be.not.equal(null);
      play.disconnect();
    });
    play.on(Event.DISCONNECTED, () => {
      debug('play disconnected');
      if (reconnectFlag) {
        done();
      } else {
        play.reconnect();
        reconnectFlag = true;
      }
    });
    play.connect();
  });

  it('test disconnect from game', done => {
    const play = newPlay('tc3');
    const roomName = 'roomname';
    play.on(Event.CONNECTED, () => {
      expect(play._sessionToken).to.be.not.equal(null);
      expect(play._masterServer).to.be.not.equal(null);
      play.createRoom({ roomName });
    });
    play.on(Event.ROOM_CREATED, () => {
      expect(play._room.name).to.be.equal(roomName);
      play.disconnect();
    });
    play.on(Event.DISCONNECTED, () => {
      done();
    });
    play.connect();
  });

  it('test connect failed', done => {
    let connectCount = 0;
    const play = newPlay('tc4');
    play.on(Event.CONNECTED, () => {
      play.disconnect();
      done();
    });
    play.on(Event.CONNECT_FAILED, () => {
      connectCount += 1;
      if (connectCount >= 5) {
        play.disconnect();
        done();
      } else {
        play.connect();
      }
    });
    play.connect();
  });

  it('test keep alive', done => {
    const roomName = 'tc5_room';
    const play = newPlay('tc5');
    play.on(Event.CONNECTED, () => {
      play.createRoom(roomName);
    });
    play.on(Event.ROOM_JOINED, () => {
      debug('joined');
    });

    setTimeout(() => {
      debug('keep alive timeout');
      play.disconnect();
      done();
    }, 30000);

    play.connect();
  });

  it('test wechat', done => {
    const play = newWechatPlay('ct6');
    play.on(Event.CONNECTED, () => {
      debug('OnConnected');
      play.disconnect();
      done();
    });
    play.on(Event.CONNECT_FAILED, error => {
      debug(`OnConnectFailed: ${error}`);
    });
    play.connect();
  });
});
