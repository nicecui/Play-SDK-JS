const debug = require('debug')('Test:Master');

const p = require('../dist/play-node');

const { Event, ReceiverGroup, Region, Play } = p;

for (let i = 0; i < 1000; i += 1) {
  const play = new Play();
  play.init({
    appId: 'zPpPQwb09gfYvwy89rEFoYzE-gzGzoHsz',
    appKey: 'mOvH23zgB451ylHn0xdEf8PL',
    region: Region.NorthChina,
    feature: 'wechat',
  });
  play.userId = `id${i}`;
  play.on(Event.CONNECTED, () => {
    play.createRoom();
  });
  play.on(Event.ROOM_JOINED, () => {
    debug('joined room');
    // setInterval(() => {
    //     const options = {
    //         receiverGroup: ReceiverGroup.MasterClient,
    //     };
    //     play.sendEvent('hi', {}, options);
    // }, 1000);

    play.leaveRoom();
  });
  play.on(Event.ROOM_LEFT, () => {
    play.createRoom();
  });
  play.connect();
}

// setInterval(() => {
//     gc();
// }, 10000);
