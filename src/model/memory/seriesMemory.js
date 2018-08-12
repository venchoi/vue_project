import MyEvent from '../../plugins/Event';
import {
  seriesWorker,
} from '../../worker/index';
import {
  baseUtil,
  ycjUtil,
} from '../../util/index';

/**
 * 图表数据缓存 - 独立不放vuex,图表组件不在vue 扩展中， 销毁组件时无法销毁 vuex getter（watcher）的引用，
 * 导致内存泄露
 */
class SeriesStorage extends MyEvent {
  constructor() {
    super();
    this.storage = {};
    // {
    //   k: {
    //     line: [],
    //       vol: [],
    //       ddgf: [],
    //       ddjl: [],
    //       dddx: [],
    //       zldk: [],
    //       cdtj: [],
    //       zlx: [],
    //   },
    //   tick: {
    //     line: [],
    //       vol: [],
    //       ddjl: [],
    //       cjtj: [],
    //       qjwt: [],
    //       cdtj: [],
    //   },
    // }
    /**
     * 监听数据，tick数据、K数据、十日分时数据
     */
    seriesWorker.addEventListener('message', (e) => {
      const data = e.data;
      const triggerType = {};
      baseUtil.merge(this.storage, data, true);
      baseUtil.each(data, (d, code) => {
        baseUtil.each(d, (item, type) => {
          const flag = `${type}_${code}`;
          if (!triggerType[flag]) {
            triggerType[flag] = baseUtil.copy(this.storage[code][type]);
          }
          baseUtil.each(item, (i, name) => {
            const seriesFlag = `${type}_${name}_${code}`;
            if (!triggerType[seriesFlag]) {
              triggerType[seriesFlag] = {
                [name]: baseUtil.copy(this.storage[code][type][name]),
              };
            }
          });
        });
      });
      baseUtil.each(triggerType, (flagData, event) => {
        this.trigger(event, new MessageEvent(event, {
          data: flagData,
        }));
      });
    });
  }
  /**
   * 刷新图表
   * @param {Object} payload
   * @property payload.code - 股票代码
   * @property payload.type - 线段类型 tick / k
   * @property payload.name - 指数名字 ddjlmin/line/qjwt..
   */
  pullData(payload) {
    const code = payload.code;
    const type = payload.type;
    const name = payload.name;
    let targetResult;
    let parentResult;
    let targetEvent;
    let parentEvent;
    this.trigger('pull', new MessageEvent('pull', {
      data: payload,
    }));
    try {
      if (name) {
        targetEvent = `${type}_${name}_${code}`;
        targetResult = this.storage[code][type][name] ? {
          [name]: this.storage[code][type][name],
        } : false;

        parentEvent = `${type}_${code}`;
        parentResult = this.storage[code][type];
      } else {
        targetEvent = `${type}_${code}`;
        targetResult = this.storage[code][type];
      }
    } catch (e) {
      targetEvent = false;
    }
    if (targetResult) {
      this.trigger(targetEvent, new MessageEvent(targetEvent, {
        data: baseUtil.copy(targetResult),
      }));
      if (parentResult) {
        this.trigger(parentEvent, new MessageEvent(parentEvent, {
          data: baseUtil.copy(parentResult),
        }));
      }
      if (type === 'tick' && ycjUtil.isOpening()) {
        seriesWorker.postMessage(payload);
      }
    } else {
      seriesWorker.postMessage(payload);
    }
  }

  /**
   * 停止刷新图表
   * @param payload
   */
  stopPullData(payload) {
    const param = payload;
    param.cancel = true;
    seriesWorker.postMessage(param);
    this.trigger('stopPull', new MessageEvent('pull', {
      data: payload,
    }));
  }

  /**
   * 获取数据
   * @param code - 股票代码
   * @returns {{}}
   */
  getData(code) {
    return this.storage[code] ? baseUtil.copy(this.storage[code]) : {};
  }
  /**
   * 监听
   * @param {string} type - 请求类型
   * @param {string} code - 股票代码
   * @param {string | function} name - 如果是函数 则为handler
   * @param {function} [handler] - handler
   */
  listen(type, code, name, handler) {
    if (typeof name === 'function') {
      this.on(`${type}_${code}`, name);
    } else {
      this.on(`${type}_${name}_${code}`, handler);
    }
  }

  /**
   * 停止监听
   * @param type - 请求类型
   * @param code - 股票代码
   * @param name -
   * @param handler
   */
  unlisten(type, code, name, handler) {
    if (typeof name === 'function') {
      this.off(`${type}_${code}`, name);
    } else {
      this.off(`${type}_${name}_${code}`, handler);
    }
  }
}

export default new SeriesStorage();
