import EventEmitter from 'eventemitter3';
import request from 'superagent';
import WebSocket from 'isomorphic-ws';

import { debug, warn, error } from '../Logger';
import Event from '../Event';
import PlayError from '../PlayError';

import {
  PlayVersion,
  NorthCNServerURL,
  EastCNServerURL,
  USServerURL,
} from './Config';

const ResponseError = { request };

export default class LobbyConnection extends EventEmitter {
  constructor() {
    super();
    this._primaryServer = null;
    this._secondaryServer = null;
    this._ttl = 0;

    this._httpReq = null;
    this._ws = null;
    this._requests = {};
    this._requestId = 0;
  }

  async connect() {
    this.a = 0;
    try {
      // 获取 Lobby 服务器信息
      const body = await this.getLobbyServer();
      this._primaryServer = body.server;
      this._secondaryServer = body.secondary;
      this._ttl = body.ttl;
      // 建立 Socket 连接
      const socket = await this.openSocket(this._primaryServer);
      // 打开 Session
      const session = await this.openSession();
    } catch (e) {
      if (e instanceof ResponseError) {
        return Promise.reject(e);
      }
      return Promise.reject(new PlayError(e.message));
    }
  }

  /**
   * 获取大厅服务器
   */
  getLobbyServer() {
    this._httpReq = request
      .get('')
      .query()
      .end((err, res) => {
        if (err) {
          return Promise.reject(res.error);
        }
        const body = JSON.parse(res.text);
        debug(res.text);
        return Promise.resolve(body);
      });
  }

  /**
   * 打开 socket 连接
   */
  openSocket(host) {
    this._ws = new WebSocket(host);
    this._ws.onopen = () => {
      debug('Lobby socket opend');
      return new Promise(resolve => {
        resolve();
      });
    };
    this._ws.onmessage = this.handleMessage.bind(this);
    this._ws.onclose = err => {
      debug('Lobby socket closed');
      return new Promise((resolve, reject) => {
        reject(err);
      });
    };
  }

  async openSession() {
    const msg = {
      cmd: 'session',
      op: 'open',
      i: this._getMsgId(),
      appId: this._appId,
      peerId: this.userId,
      sdkVersion: PlayVersion,
      gameVersion: this._gameVersion,
    };
    const openSession = await this.send(msg);
  }

  /**
   * 发送消息
   * @param {Object} msg
   */
  send(msg) {
    // 缓存请求
    const req = {
      resolve: null,
      reject: null,
    };
    const reqId = this._getReqestId();
    this._requests[reqId] = req;
    // 发送消息
    this._ws.send(JSON.stringify(msg));
  }

  handleMessage(message) {
    const msg = JSON.parse(message);
    const { i } = msg;
    const req = this._requests[i];
    this.handleSessionOpen(msg);
  }

  handleSessionOpen(msg) {
    const { i } = msg;
    const req = this._requestId[i];
    if (req === null) {
      throw Error(`no session open request for ${i}`);
    }
    if (msg.reasonCode) {
      const { reject } = req;
      reject();
    } else {
      const { resolve } = req;
      resolve();
    }
  }

  /**
   * 获取请求 Id
   */
  _getReqestId() {
    this._requestId += 1;
    return this._requestId;
  }
}
