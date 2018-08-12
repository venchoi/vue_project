import { baseUtil } from '../../../util/index';
import store from '../index';
import {
  timerWorker,
} from '../../../worker/index';

/**
 * vue 交互-数据刷新限制
 */
let time = 0;
class Interceptor {
  constructor() {
    /**
     * 节流任务集合
     * @property taskSet[type] - commit type
     * @property {object} taskSet[type][code] - code 为foxxcode 内容为 数据内容
     */
    this.taskSet = {};

    /**
     * 节流任务集合
     * @property taskSet[type] - commit type
     * @property {Array} taskSet[type][code] - 数据为 [ {数据} ]
     */
    this.taskArray = {};

    this.isInteracting = false;

    this.init();
  }
  init() {
    const self = this;
    timerWorker.addEventListener(timerWorker.chanel.ZERO_THREE, () => {
      if (!self.isInteracting) {
        baseUtil.each(this.taskSet, (payload, type) => {
          store.commit(type, payload);
        });
        baseUtil.each(this.taskArray, (payload, type) => {
          store.commit(type, payload);
        });
        this.taskSet = {};
        this.taskArray = {};
      }
    });
    timerWorker.addEventListener(timerWorker.chanel.FRAME, () => {
      if (time > 300 && this.isInteracting) {
        this.isInteracting = false;
      } else {
        time += 17;
      }
    });
  }

  /**
   * 检测函数
   * @param {string} type
   * @param {*} payload
   * @param {Boolean} ifMerge - 是否合并
   */
  check(type, payload, ifMerge = true) {
    if (ifMerge) {
      if (this.taskSet[type]) {
        baseUtil.merge(this.taskSet[type], payload, true);
      } else {
        this.taskSet[type] = payload;
      }
    } else {
      if (!this.taskArray[type]) {
        this.taskArray[type] = {};
      }
      baseUtil.each(payload, (item, code) => {
        if (!this.taskArray[type][code]) {
          this.taskArray[type][code] = [];
        }
        if (baseUtil.isArray(item)) {
          this.taskArray[type][code] = this.taskArray[type][code].concat(item);
        } else {
          this.taskArray[type][code].push(item);
        }
      });
    }
    return this;
  }

  /**
   * 是否在交互
   */
  set isInteracting(state) {
    if (typeof state !== 'boolean') {
      return false;
    }
    if (state === true) {
      time = 0;
    } else {
      time = 310;
    }
    this._isInteracting = state;
    return null;
  }

  get isInteracting() {
    return this._isInteracting;
  }
}

export default new Interceptor();
