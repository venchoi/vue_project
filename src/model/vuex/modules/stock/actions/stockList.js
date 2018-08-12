import {
  STOCK_ADD_IN_LIST,
  BASE_INFO_INIT,
  STOCK_REMOVE_IN_LIST,
  THEME_DATA_INIT,
  RELATIVE_NEWS_INIT,
  SERIES_INIT,
} from '../mutations/mutationType';
import {
  ADD_STOCK_LIST,
  REMOVE_STOCK_LIST,
} from './actionType';

import {
  ycjUtil,
  logger,
} from '../../../../../util';

const listenList = {};
export default {
  /**
   * 添加股票进监听列表
   * @param commit
   * @param code
   */
  [ADD_STOCK_LIST]({ commit }, code) {
    // 检查是否是合法代码，如果不是，直接return，否则提交mutation：添加股票进监听列表并且刷新baseInfo的数据
    if (!ycjUtil.checkCode(code)) {
      logger.error('code need corrected,in action - stockList');
      return;
    }
    commit(STOCK_ADD_IN_LIST, code);
    commit(BASE_INFO_INIT, code);
    /**
     * 如果监听列表中已经有该股票（即该股票已经正在监听），将监听列表中该股票的键值加1
     * 这里使用增1减1，而不是置0或1，目的是提高命中率。
     * 在大量数据情况下，如果使用置0置1来判断是否监听的话，监听和取消监听的操作会非常频繁
     */
    if (listenList[code]) {
      listenList[code] += 1;
    } else {
      listenList[code] = 1;
    }
    // 检查是否是指股，不是的话，提交mutation：更新相关概念数据，更新图表数据，更新相关新闻数据
    if (ycjUtil.isIndex(code)) {
      // todo index
    } else {
      commit(THEME_DATA_INIT, code);
      commit(SERIES_INIT, code);
      commit(RELATIVE_NEWS_INIT, code);
    }
  },
  /**
   * 将股票从监听列表移出
   * @param commit
   * @param code
   */
  [REMOVE_STOCK_LIST]({ commit }, code) {
    // 检查是否是合法代码，如果不是，直接return
    if (!ycjUtil.checkCode(code)) {
      logger.error('code need corrected,in action - stockList');
      return;
    }
    // 检查该股票代码是否在监听列表中，如果不在，直接return
    if (!listenList[code]) {
      return;
    }
    // 如果该股票在监听列表中，令监听列表中该股票的键值减1
    if (listenList[code]) {
      listenList[code] -= 1;
    }
    // 当监听列表中该股票的键值为0时，才真正从股票监听列表中移出
    if (listenList[code] < 1) {
      commit(STOCK_REMOVE_IN_LIST, code);
      delete listenList[code];
    }
  },
};
