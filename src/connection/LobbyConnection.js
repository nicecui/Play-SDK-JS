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

  connect(routerUrl, appId, sdkVersion) {
    return new Promise(async (resolve, reject) => {
      try {
        const query = { appId, sdkVersion };
        // 获取 Lobby 服务器信息
        this._httpRes = await request.get(routerUrl).query(query);
        const body = JSON.parse(this._httpRes.body);
        this._primaryServer = body.server;
        this._secondaryServer = body.secondary;
        this._ttl = body.ttl;
        // 建立 Socket 连接
        const { WebSocket } = adapters;
        this._ws = new WebSocket(this._primaryServer);
        this._ws.onopen = async () => {
          debug('Lobby socket opened');
          // 登录
          await this.openSession();
          // TODO 发送连接成功的事件
          resolve();
        };
        this._ws.onmessage = this.handleMessage.bind(this);
        this._ws.onclose = e => {
          // 连接失败
          error(e);
          reject(new PlayError(-2, 'websocket error'));
        };
      } catch (e) {
        debug(e);
        // TODO 区分错误
        // TODO 发送连接错误的事件
        reject();
      }
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
