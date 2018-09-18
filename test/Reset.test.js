import Event from '../src/Event';
import { newPlay } from './Utils';
import ReceiverGroup from '../src/ReceiverGroup';

const debug = require('debug')('Test:Reset');

describe('test reset', () => {
  // it('test reset', done => {
  //   const play = newPlay('tr0_1');
  //   let flag = false;
  //   play.on(Event.CONNECTED, () => {
  //     play.createRoom();
  //   });
  //   play.on(Event.ROOM_JOINED, () => {
  //     if (flag) {
  //       play.disconnect();
  //       done();
  //       return;
  //     }
  //     play.reset();
  //     play.connect();
  //     flag = true;
  //   });
  //   play.connect();
  // });

  it('test reset room message', done => {
    const p1 = newPlay('tr1_1');
    const p2 = newPlay('tr1_2');
    const roomName = 'tr1_room1';
    const roomName2 = 'tr1_room2';
    let flag = false;

    p1.on(Event.CONNECTED, () => {
      p1.createRoom({ roomName });
    });
    p1.on(Event.ROOM_JOINED, () => {
      setInterval(() => {
        const options = {
          receiverGroup: ReceiverGroup.All,
        };
        p1.sendEvent('tr1_room1_msg', {}, options);
      }, 1000);
      p2.connect();
    });

    p2.on(Event.CONNECTED, () => {
      if (!flag) {
        p2.joinRoom(roomName);
      } else {
        p2.createRoom({ roomName: roomName2 });
      }
    });
    p2.on(Event.ROOM_JOINED, () => {
      debug(`p2 joined room: ${p2.room.name}`);
    });
    p2.on(Event.CUSTOM_EVENT, evt => {
      const { eventId } = evt;
      debug(`p2 receive eventId: ${eventId}`);
      if (!flag) {
        flag = true;
        p2.reset();
        p2.connect();
      }
    });
    p1.connect();
  });
});
