import Vue from 'vue';

import {
  HANDICAP_UPDATE,
  HANDICAP_INIT,
} from './mutationType';
import baseUtil from '../../../../../util/baseUtil';
import defaultValue from '../defaultState';

export default {
  [HANDICAP_INIT](state, code) {
    if (!state.handicap[code]) {
      Vue.set(state.handicap, code, defaultValue.handicap());
    }
  },

  /**
   * 更新盘口数据
   * @param {object} data - 处理的数据包
   * @param {object} data.data.buy_stage - 基础列表数据
   * @param {array} data.data.sell_stage - 买方单
   * @param {array} data.data.sell_fri - 买方单
   * @param {array} data.data.buy_fri - 委托队列
   *
   */
  [HANDICAP_UPDATE](state, data) {
    const handicap = state.handicap;
    baseUtil.each(data, (d, code) => {
      baseUtil.merge(handicap[code], d, true);
    });
    // baseUtil.merge(handicap, dataPacket, true);
  },
};
