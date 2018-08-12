/**
 * APP初始化时的model数据
 * 包括 用户信息、指数代码集合、行情股票列表、推送开关状态
 */
import http from '../../plugins/http/http';
import {
  userActions,
  stockActions,
} from '../vuex/actionsType';
import method from './method';
import store from '../vuex';
import {
  format,
} from '../../util';

import {
  seriesWorker,
} from '../../worker';

const apiList = http.apiList;

function limit() {
  const updateDate = this.storageApi.read(`${this.name}_updateDate`);
  const today = format.date(new Date(), 'yyyy-MM-dd');
  if (updateDate === today) {
    return 0;
  }
  this.storageApi.application.save(`${this.name}_updateDate`, today);
  return 1;
}
/**
 * 用户信息存储结构
 */
class User extends method {
  constructor() {
    super();
    this.name = 'user';
    this.written = (data) => {
      store.dispatch(userActions.SET_BASE_USER_INDEX, data);
      seriesWorker.postMessage({
        type: 'http',
        param: data,
      });
    };
  }
  _init(cb) {
    const user = this.read();
    if (user) {
      store.dispatch(userActions.SET_BASE_USER_INDEX, user);
      seriesWorker.postMessage({
        type: 'http',
        param: user,
      });
    }
    if (typeof cb === 'function') {
      cb();
    }
  }
}
/**
 * 指数信息存储结构
 */
class IndexCode extends method {
  constructor() {
    super();
    this.name = 'indexs';
    this.api = apiList.GET_INDEX_CODE;
    this.limit = limit.bind(this);
    this.param = {
      type: 'idx',
    };
  }
  _init(cb) {
    const indexs = this.read();
    if (indexs) {
      if (typeof cb === 'function') {
        cb();
      }
    } else {
      this.request(() => {
        if (typeof cb === 'function') {
          cb();
        }
      });
    }
  }
}
/**
 * 个股信息存储结构
 */
class Codes extends method {
  constructor() {
    super();
    this.name = 'codes';
    this.api = apiList.GET_STOCK_LIST;
    this.param = {
      type: 'stk',
    };
    // this.limit = limit; // 原来股票列表数据是有节流限制的，一天只请求一次，现行情有排序功能，所以去掉节流限制，一天可请求多次
  }
  _init(cb) {
    const codes = this.read();
    const complete = () => {
      store.dispatch(stockActions.INIT_ALL_BASE_INFO);
      if (typeof cb === 'function') {
        cb();
      }
    };
    if (codes) {
      complete();
    } else {
      this.request(() => {
        complete();
      });
    }
  }
}
/**
 * 推送选择开关信息存储结构
 * 推送开关：控制推送时是否有声音提示，是否有桌面提示
 */
class SwitchGroup extends method {
  constructor() {
    super();
    this.name = 'switchGroup';
  }
  _init(cb) {
    const config = this.read();
    if (!config) {
      this.write({});
    }
    if (typeof cb === 'function') {
      cb();
    }
  }
}

export const user = new User();
export const indexs = new IndexCode();
export const codes = new Codes();
export const switchGroup = new SwitchGroup();
