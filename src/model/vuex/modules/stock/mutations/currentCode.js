import Vue from 'vue';

import {
  CURRENT_CODE_UPDATE,
  CURRENT_CODE_CANCEL,
} from './mutationType';

export default {
  [CURRENT_CODE_UPDATE](state, code) {
    Vue.set(state, 'currentCode', code);
  },
  [CURRENT_CODE_CANCEL]() {},
};
