const request = require('superagent');
const debug = require('debug')('Test:Superagent');

async function httpReq() {
  try {
    const query = {
      appId: 'vwDice44bmatVulkQvErSg5C-gzGzoHsx',
      feature: 'wechat',
    };
    const res = await request
      .get('https://game-router-cn-n1.leancloud.cn/v1/router')
      .query(query);
    const { body } = res;
    debug(body);
  } catch (e) {
    debug(e.message);
  }
}

httpReq();
