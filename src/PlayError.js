/**
 * SDK 错误类
 */
export default class PlayError extends Error {
  constructor(code, messgae) {
    super(messgae);
    this._code = code;
  }

  get code() {
    return this._code;
  }
}
