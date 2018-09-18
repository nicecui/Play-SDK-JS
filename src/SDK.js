import EventEmitter from 'eventemitter3';

import { debug, warn, error } from './Logger';

import {
  PlayVersion,
  NorthCNServerURL,
  EastCNServerURL,
  USServerURL,
} from './Config';
import Region from './Region';
import Event from './Event';

import LobbyConnection from './connection/LobbyConnection';
import GameConnection from './connection/GameConnection';

export default class SDK extends EventEmitter {
  constructor() {
    super();
    this._lobbyConn = new LobbyConnection();
    this._gameConn = new GameConnection();
  }

  async connect({ gameVersion = '0.0.1' } = {}) {
    try {
      let routerUrl = EastCNServerURL;
      if (this._region === Region.NorthChina) {
        routerUrl = NorthCNServerURL;
      } else if (this._region === Region.EastChina) {
        routerUrl = EastCNServerURL;
      } else if (this._region === Region.NorthAmerica) {
        routerUrl = USServerURL;
      }
      const res = await this._lobbyConn.connect(routerUrl);
      const { code, detail } = res;
      if (code === 0) {
        this.emit(Event.CONNECTED);
      } else {
        this.emit(Event.CONNECT_FAILED, detail);
      }
    } catch (e) {
      error(e);
    }
  }
}
