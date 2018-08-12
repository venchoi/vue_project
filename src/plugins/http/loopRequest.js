import baseUtil from '../../util/baseUtil';

export const CHANNEL = {
  HALF_MINUTE: 30 * 1000,
  ONE_MINUTE: 60 * 1000,
  TWO_MINUTE: 2 * 60 * 1000,
  ONE_HOUR: 60 * 60 * 1000,
};
const requestList = {
  30000: [],
  60000: [],
  120000: [],
  3600000: [],
};
const timer = {};
class LoopRequest {
  constructor() {
    this.loop();
    this.length = 0;
  }
  add(fn, channel = CHANNEL.HALF_MINUTE) {
    if (typeof fn === 'function') {
      fn();
      requestList[channel].push(fn);
    }
    this.length += 1;
    return fn;
  }
  remove(item, channel = CHANNEL.HALF_MINUTE) {
    const index = requestList[channel].indexOf(item);
    if (index > -1) {
      requestList[channel].splice(index, 1);
      this.length -= 1;
    }
    return this;
  }
  clear(channel) {
    requestList[channel].splice(0, requestList[channel].length);
    return this;
  }
  loop() {
    baseUtil.each(CHANNEL, (channel) => {
      timer[channel] = setInterval(() => {
        baseUtil.each(requestList[channel], (fn) => {
          fn();
        });
        return this;
      }, channel);
    });
  }
  get channel() {
    this.length += 0;
    return CHANNEL;
  }
}

export default new LoopRequest();
