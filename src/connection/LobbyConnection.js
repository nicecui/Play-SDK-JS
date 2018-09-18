import request from 'superagent';

import { debug, warn, error } from '../Logger';

import { Connection, getRequestId } from './Connection';
import { adapters } from '../PlayAdapter';
import PlayError from '../PlayError';

export default class LobbyConnection extends Connection {
  constructor() {
    super();
    this._primaryServer = null;
    this._secondaryServer = null;
    this._ttl = 0;

    this._httpReq = null;
    this._ws = null;
    this._requests = {};
  }

  async connect(routerUrl, appId, sdkVersion) {
    const query = { appId, sdkVersion };
    // 获取 Lobby 服务器信息
    this._httpReq = request
      .get(routerUrl)
      .query(query)
      .end((err, res) => {
        if (err) {
          return Promise.reject(new PlayError(-1, 'http error'));
        }
        debug(res.text);
        const body = JSON.parse(res.text);
        this._primaryServer = body.server;
        this._secondaryServer = body.secondary;
        this._ttl = body.ttl;
        // 建立 Socket 连接
        const { WebSocket } = adapters;
        this._ws = new WebSocket(this._primaryServer);
        this._ws.onopen = () => {
          debug('Lobby socket opened');
          return Promise.resolve();
        };
        this._ws.onmessage = msg => {};
        this._ws.onclose = err => {
          error(err);
          return Promise.reject(new PlayError(-2, 'websocket error'));
        };
        // 打开 Session
      });
  }

  async openSession() {
    const msg = {};
    try {
      await this.send(msg);
      return Promise.resolve();
    } catch (e) {
      return Promise.reject();
    }
  }

  send(msg) {
    const req = {
      resolve: null,
      reject: null,
    };
    const reqId = getRequestId();
    this._requests[reqId] = req;
    this._ws.send(JSON.stringify(msg));
  }

  handleMessage(msg) {
    const { i } = msg;
    const { cmd, op } = msg;
    switch (cmd) {
      case '':
        switch (op) {
          case '':
            this.handleSessionOpen(msg);
            break;
          default:
            break;
        }
        break;
      default:
        break;
    }
  }

  handleSessionOpen(msg) {
    const { i } = msg;
    const req = this._requests[i];
    if (msg.reasonCode) {
      const { reject } = req;
      reject();
    } else {
      const { resolve } = req;
      resolve();
    }
  }
}
