import Vue from 'vue';

import baseUtil from '../../../../../util/baseUtil';
import {
  THEME_DATA_INIT,
  THEME_DATA_UPDATE,
  THEME_DATA_ADD,
} from './mutationType';
import defaultValue from '../defaultState';

export default {
  [THEME_DATA_INIT](state, code) {
    if (!state.themeData[code]) {
      Vue.set(state.themeData, code, defaultValue.themeData());
    }
  },
  [THEME_DATA_ADD](state, data) {
    // todo ajax get theme data
    Vue.set(state.themeData, data.code, data.data);
  },
  [THEME_DATA_UPDATE](state, data) {
    const code = data.code;
    const themeData = state.themeData[code];
    baseUtil.merge(themeData, data.data, true);
  },
};
