import Vue from 'vue';

import {
  MENU_CONFIG_SET,
  APP_CONFIG_SET,
} from '../mutations/mutationType';

export default {
  [MENU_CONFIG_SET](state, data) {
    Vue.set(state, 'menuConfig', data);
  },
  [APP_CONFIG_SET](state, data) {
    Vue.set(state, 'appConfig', data);
  },
};
