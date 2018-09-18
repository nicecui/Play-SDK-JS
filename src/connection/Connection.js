/**
 * 连接基类
 */
export class Connection {}

let _requestId = 0;

export function getRequestId() {
  _requestId += 1;
  return _requestId;
}
