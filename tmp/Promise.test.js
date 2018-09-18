import d from 'debug';

import { newPlay } from './Utils';

const debug = d('Test:Promise');
const { expect } = require('chai');

describe('test promise', () => {
  // it('test simple promise', (done) => {
  //     function resolveAfter2Seconds() {
  //         return new Promise(resolve => {
  //             setTimeout(() => {
  //                 resolve('resolved');
  //             }, 2000);
  //         });
  //     }

  //     async function asyncCall() {
  //         debug('calling');
  //         const result = await resolveAfter2Seconds();
  //         debug(result);
  //         done();
  //     }

  //     asyncCall();
  // });

  // it('test promise', (done) => {
  //     function resolveAfter2Seconds() {
  //         debug('starting slow promise');
  //         return new Promise(resolve => {
  //             setTimeout(() => {
  //                 resolve(20);
  //                 debug('slow promise is done');
  //             }, 2000);
  //         });
  //     };

  //    function resolveAfter1Seconds() {
  //         debug('starting fast promise');
  //         return new Promise(resolve => {
  //             setTimeout(() => {
  //                 resolve(10);
  //                 debug('fast promise is done');
  //             }, 1000);
  //         });
  //     };

  //     async function sequentialStart() {
  //         debug('-- SEQUENTIAL START --');
  //         const slow = await resolveAfter2Seconds();
  //         const fast = await resolveAfter1Seconds();
  //         debug(slow);
  //         debug(fast);
  //     }

  //     async function concurrentStart() {
  //         debug('-- CONCURRENT START --');
  //         const slow = resolveAfter2Seconds();
  //         const fast = resolveAfter1Seconds();
  //         debug(await slow);
  //         debug(await fast);
  //     }

  //     function stillSerial() {
  //         debug('-- CONCURRENT START with Promise.all --');
  //         Promise.all([resolveAfter2Seconds(), resolveAfter1Seconds()])
  //             .then(([slow, fast]) => {
  //                 debug(slow);
  //                 debug(fast);
  //             });
  //     }

  //     function parallel() {
  //         debug('-- PARALLEL with Promise.then --');
  //         resolveAfter2Seconds()
  //             .then((message) => debug(message));
  //         resolveAfter1Seconds()
  //             .then((message) => debug(message));
  //     }

  //     sequentialStart();
  //     setTimeout(concurrentStart, 4000);
  //     setTimeout(stillSerial, 7000);
  //     setTimeout(parallel, 10000);
  //     setTimeout(done, 15000);
  // });

  // it('test custom promise', (done) => {
  //     function requestHttp() {
  //         return new Promise((resolve) => {
  //             setTimeout(resolve, 1000);
  //         });
  //     }

  //     function openSocket() {
  //         return new Promise((resolve) => {
  //             setTimeout(resolve, 2000);
  //         });
  //     }

  //     function openSession() {
  //         return new Promise((resolve) => {
  //             setTimeout(resolve, 1000);
  //         });
  //     }

  //     async function connect() {
  //         try {
  //             debug('start connection');
  //             await requestHttp();
  //             debug('http connected');
  //             await openSocket();
  //             debug('socket opened');
  //             await openSession();
  //             debug('session opened');
  //             // TODO emit CONNECTED

  //             return Promise.resolve(200);
  //         } catch (e) {
  //             // TODO emit CONNECT_FAILED

  //             return Promise.reject(new Error(400));
  //         }
  //     }

  //     debug('connect start');
  //     connect()
  //         .then((code) => {
  //             debug(`connect code: ${code}`);
  //             done();
  //         })
  //         .catch((e) => {
  //             debug(e);
  //         });
  //     debug('connect end');
  // });

  // it('test no call then', (done) => {
  //     function asyncFunc() {
  //         return new Promise((resolve) => {
  //             setTimeout(() => {
  //                 debug('async start');
  //                 resolve();
  //             }, 1000);
  //         });
  //     }
  //     debug('test start');
  //     asyncFunc()
  //         .then(() => {
  //             debug('async end');
  //             done();
  //         });
  //     debug('test end');
  // });

  // it('test promise chain', (done) => {
  //     function wait3Second() {
  //         debug('wait3second');
  //         return new Promise((resolve) => {
  //             setTimeout(() => {
  //                 resolve(789);
  //             }, 3000);
  //         })
  //     }

  //     function wait2Second() {
  //         debug('wait2second');
  //         return new Promise((resolve) => {
  //             setTimeout(() => {
  //                 resolve(456);
  //             }, 2000);
  //         });
  //     }

  //     function wait1Second() {
  //         debug('wait1second');
  //         return new Promise((resolve) => {
  //             setTimeout(() => {
  //                 resolve(123);
  //             }, 1000);
  //         })
  //     }

  //     debug('start');
  //     wait3Second()
  //         .then(wait2Second)
  //         .then(wait1Second)
  //         .then(() => {
  //             debug('done');
  //             done();
  //         })
  // });

  // it('test multi catch', (done) => {
  //     function throw1() {
  //         debug('start throw1');
  //         throw new Error('123');
  //     }

  //     function throw2() {
  //         debug('start throw2');
  //         throw new Error('234');
  //     }

  //     Promise.resolve()
  //         .then(throw1)
  //         .catch((err) => {
  //             debug(err);
  //         })
  //         .then(throw2)
  //         .catch((err) => {
  //             debug(err);
  //             done();
  //         });
  // });

  // it('test mocha', (done) => {
  //     Promise.resolve()
  //         .then(() => {
  //             expect(true).to.be.equal(true);
  //         })
  //         .then(done)
  //         .catch(done);
  // });

  // it('test mocha promise', () => {
  //     return Promise.resolve(1)
  //         .then((val) => {
  //             expect(val).to.be.equal(2);
  //         });
  // });

  it('test new sdk', done => {
    const play = newPlay('aa');
    play
      .connect()
      .then(() => {
        // TODO 根据返回事件，确定加入成功与否
      })
      .catch(e => {});
  });
});
