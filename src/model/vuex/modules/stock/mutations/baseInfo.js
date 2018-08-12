import Vue from 'vue';

import baseUtil from '../../../../../util/baseUtil';
import defaultValue from '../defaultState';

import {
  BASE_INFO_ADD,
  BASE_INFO_UPDATE,
  BASE_INFO_INIT,
} from './mutationType';

export default {
  [BASE_INFO_INIT](state, payload) {
    if (baseUtil.isObject(payload)) {
      const code = payload.code;
      const name = payload.name;
      if (!state.baseInfo[code]) {
        Vue.set(state.baseInfo, code, defaultValue.baseInfo(name));
        Vue.set(state.baseInfo[code], 'foxxcode', code);
      }
    } else {
      const code = payload;
      if (!state.baseInfo[code]) {
        Vue.set(state.baseInfo, code, defaultValue.baseInfo('------'));
        Vue.set(state.baseInfo[code], 'foxxcode', code);
      }
    }
  },
  [BASE_INFO_ADD](state, data) {
    Vue.set(state.baseInfo, data.code, data.data);
  },
  [BASE_INFO_UPDATE](state, data) {
    const baseInfo = state.baseInfo;
    baseUtil.each(data, (d, code) => {
      if (baseInfo[code]) {
        baseUtil.merge(baseInfo[code], d, true);
      } else {
        Vue.set(baseInfo, code, d);
      }
      const close = baseInfo[code].close;
      const preClose = baseInfo[code].preClose;
      if (close && preClose) {
        baseInfo[code].ratio = (((close - preClose) * 100) / preClose).toFixed(2);
      }
    });
  },
};
