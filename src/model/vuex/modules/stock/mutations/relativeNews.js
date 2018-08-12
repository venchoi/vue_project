import Vue from 'vue';

import { RELATIVE_NEWS_INIT, RELATIVE_NEWS_ADD, RELATIVE_NEWS_UPDATE } from './mutationType';
import baseUtil from '../../../../../util/baseUtil';
import defaultValue from '../defaultState';

export default {
  [RELATIVE_NEWS_INIT](state, code) {
    // todo  初始化赋值需要 vue。set
    if (!state.relativeNews[code]) {
      Vue.set(state.relativeNews, code, defaultValue.relativeNews());
    }
  },
  [RELATIVE_NEWS_ADD](state, data) {
    Vue.set(state.relativeNews, data.code, data.data);
  },
  [RELATIVE_NEWS_UPDATE](state, data) {
    const code = data.code;
    const relativeNews = state.relativeNews[code];
    baseUtil.merge(relativeNews, data.data, true);
  },
};
