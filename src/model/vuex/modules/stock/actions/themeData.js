import {
  THEME_DATA_INIT,
  THEME_DATA_UPDATE,
} from '../mutations/mutationType';
import http from '../../../../../plugins/http/http';
import {
  UPDATE_THEME_DATA,
  GET_THEME_DATA,
} from './actionType';

import {
  ycjUtil,
  baseUtil,
  logger,
} from '../../../../../util/index';

const apiList = http.apiList;


export default {
  /**
   * 获取股票相关概念
   * @param state
   * @param dispatch
   * @param commit
   * @param code
   */
  [GET_THEME_DATA]({ state, dispatch, commit }, code) {
    if (!ycjUtil.checkCode(code)) {
      logger.error('code need corrected, action - themeData');
      return;
    }
    // 如果当前相关概念列表中，没有该股票的相关概念，则提交mutation：在相关概念列表中初始化该股票的相关概念
    if (!state.themeData[code]) {
      commit(THEME_DATA_INIT, code);
    }
    // 派发action：更新该股票的相关概念数据
    dispatch(UPDATE_THEME_DATA, code);
  },
  // 更新股票的相关概念数据
  [UPDATE_THEME_DATA]({ commit }, code) {
    // GET_STOCK_DATA-个股（包括指数）其他数据接口
    http.api[apiList.GET_STOCK_DATA]({
      param: {
        type: 2, // 2-表示相关概念的数据
        foxxcode: ycjUtil.formatCode(code),
        limit: 18, // limit-每页多少数据
      },
      success(data) {
        const payload = {
          code,
          data: {
            relativeThemes: [], // 相关概念列表
          },
        };
        const theme = payload.data.relativeThemes;
        baseUtil.each(data, (d) => {
          theme.push({
            name: d.thmname, // 概念名称
            relation: d.persent, // 概念相关性
          });
        });
        /**
         * 提交mutation：更新概念相关数据
         * @param {Object} - payload
         * payload为{code,data} - data包括relativeThemes[](相关概念数据)，stockTheme{}(这里没有更新这部分的数据)
         */
        commit(THEME_DATA_UPDATE, payload);
      },
    });
  },
};
