import {
  format,
  baseUtil,
  ycjUtil,
} from '../../../util/index';
import http from '../../../plugins/http/http';
import {
  STOCK_ADD_IN_LIST,
  STOCK_REMOVE_IN_LIST,
  CURRENT_CODE_UPDATE,
  CURRENT_CODE_CANCEL,
} from '../modules/stock/mutations/mutationType';

import {
  stockActions,
} from '../actionsType';

import {
  YCJWSWorker,
} from '../../../worker/index';

class VPusher {
  constructor() {
    /**
     * 注册回调函数
     */
    this.OnData = () => {
    };
    this.timer = {};
    this.requestType = [
      {
        name: 'GET_STOCK_INFO',
        time: 3000,
      },
      {
        name: 'GET_DEAL_INFO',
        time: 3000,
      },
      {
        name: 'GET_HANDICAP',
        time: 3000,
      },
    ];
  }

  watchStock(code) {
    if (!this.timer[code]) {
      this.timer[code] = [];
    }

    baseUtil.each(this.requestType, (type) => {
      this.timer[code].push(this.createLoop(type.name, {
        code,
      }, type.time));
    });
  }

  /**
   * @param {string} type - 请求的api 类型
   * @param {{code: *}} param - post的参数
   * @param {number} time - 循环的频率
   */
  createLoop(type, param, time) {
    if (!http.api[type]) {
      return false;
    }
    http.api[type]({
      param,
      success: this.OnData,
    });
    return setInterval(() => http.api[type]({
      param,
      success: this.OnData,
    }), time);
  }

  /**
   * 注册推送股票代码
   */
  Register(code) {
    this.watchStock(code);
  }

  /**
   * 去除注册代码
   */
  Unregister(code) {
    const timers = this.timer[code];
    baseUtil.each(timers, (time) => {
      window.clearInterval(time);
    });
  }
}

// 可以绑定
/**
 *  C++ TPC传输 代替 前端异步请求
 *  @namespace window.YunData
 * */
let pusher;

if (window.YunData) {
  pusher = window.YunData;
} else {
  pusher = new VPusher();
}

export default function marketDataGetter() {
  return (store) => {
    pusher.OnData = (data) => {
      /** @namespace data.data_type */
      const type = data.data_type;

      switch (type) {
        case 'base_info':
          store.dispatch(stockActions.UPDATE_BASE_INFO, data);
          break;
        case 'deal_data': {
          const resData = data;
          const baseList = data.data.base_list;
          const newBaseList = {};
          const dateKey = format.date(new Date(), 'hh:mm:ss');

          newBaseList[dateKey] = baseList['9:25:05'];
          resData.data.base_list = newBaseList;
          // store.dispatch(stockActions.UPDATE_DEAL_DATA, resData);
          break;
        }
        case 'handicap':
          store.dispatch(stockActions.UPDATE_HANDICAP_DATA, data);
          break;
        default:
          break;
      }
    };

    /**
     * data的结构
     * @example
     * {
     *  baseInfo: {
     *    [*code]: {...},
     *  },
     *  deal: {
     *    [*code]: [{...}, {...}, ...]
     *  },
     *  entrustQueue: {
     *    [*code]: {
     *      buyFri: {...},
     *      sellFri: {...},
     *    }
     *  },
     * }
     */
    YCJWSWorker.addEventListener('message', (e) => {
      const data = e.data;
      if (data.baseInfo) {
        store.dispatch(stockActions.UPDATE_BASE_INFO, data.baseInfo);
      }
      if (data.handicap) {
        store.dispatch(stockActions.UPDATE_HANDICAP_DATA, data.handicap);
      }
      if (data.deal) {
        store.dispatch(stockActions.UPDATE_DEAL_DATA, data.deal);
      }
      if (data.entrustQueue) {
        store.dispatch(stockActions.UPDATE_HANDICAP_DATA, data.entrustQueue);
      }
    });

    store.subscribe((mutation) => {
      const type = mutation.type;
      const code = mutation.payload;
      const isIndex = ycjUtil.isIndex(code);

      switch (type) {
        case STOCK_ADD_IN_LIST: {
          const cmdType = isIndex ? 'index' : 'base';
          YCJWSWorker.postMessage({
            method: 'subscribe',
            payload: [code, cmdType],
          });
          break;
        }
        case STOCK_REMOVE_IN_LIST: {
          const cmdType = isIndex ? 'index' : 'base';
          YCJWSWorker.postMessage({
            method: 'unSubscribe',
            payload: [code, cmdType],
          });
          break;
        }
        case CURRENT_CODE_UPDATE: {
          const cmdType = isIndex ? 'index' : 'deal';
          YCJWSWorker.postMessage({
            method: 'subscribe',
            payload: [code, cmdType],
          });
          break;
        }
        case CURRENT_CODE_CANCEL: {
          const cmdType = isIndex ? 'index' : 'deal';
          YCJWSWorker.postMessage({
            method: 'unSubscribe',
            payload: [code, cmdType],
          });
          break;
        }
        default:
          break;
      }
    });
  };
}
