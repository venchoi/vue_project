import baseUtil from './baseUtil';
import logger from './logger';
import {
  timerWorker,
} from '../worker';


const throttleCache = {};

const READY = 0;
const WAIT = 1;

/**
 * 函数节流
 */
const throttle = (fn) => {
  if (typeof fn !== 'function') {
    return;
  }
  const fnStr = fn.toString();
  if (throttleCache[fnStr]) {
    throttleCache[fnStr].status = WAIT;
  } else {
    throttleCache[fnStr] = {
      fn,
      status: WAIT,
    };
  }
};

timerWorker.addEventListener(timerWorker.chanel.ZERO_TWO, () => {
  const removeList = [];
  baseUtil.each(throttleCache, (item, fnString) => {
    const $item = item;
    const status = item.status;
    const fnStr = item.fn.toString();
    if (status === READY) {
      logger.tryCatch(() => {
        item.fn();
        removeList.push(fnStr);
      }, () => {
        logger.error(`throttle error: funtion: ${fnString}`, false);
        removeList.push(fnStr);
      });
    } else {
      $item.status = READY;
    }
  });
  baseUtil.each(removeList, (key) => {
    delete throttleCache[key];
  });
});


export default throttle;
