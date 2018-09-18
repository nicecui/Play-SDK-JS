import d from 'debug';

const debug = d('Test:ES6');

describe('test es6', () => {
  it('test simple promise', done => {
    function resolveAfter2Seconds() {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve('resolved');
        }, 2000);
      });
    }

    async function asyncCall() {
      debug('calling');
      const result = await resolveAfter2Seconds();
      debug(result);
      done();
    }

    asyncCall();
  });
});
