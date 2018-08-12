import {
  GET_SYSTEM_CONFIG,
  GET_BASE_CONFIG,
} from './actionType';
import {
  APP_CONFIG_SET,
  MENU_CONFIG_SET,
} from '../mutations/mutationType';

import http from '../../../plugins/http/http';
import {
  baseUtil,
} from '../../../util';

const apiList = http.apiList;

export default {
  [GET_SYSTEM_CONFIG]({ commit }, payload) {
    http.api[apiList.GET_SYSTEM_CONFIG]({
      success(data) {
        const commonConfig = {};
        const title = data.title;
        const titleEle = document.querySelector('title');
        const iconEle = document.querySelector('#favison');

        const column = data.column;

        titleEle.innerHTML = title;
        iconEle.href = data.icon;

        baseUtil.each(data, (value, key) => {
          if (key !== 'column') {
            commonConfig[key] = value;
          }
        });
        commit(APP_CONFIG_SET, commonConfig);
        if (column) {
          commit(MENU_CONFIG_SET, column);
        }
      },
      complete() {
        if (!payload) {
          return;
        }
        const complete = payload.complete;
        if (typeof complete === 'function') {
          complete();
        }
      },
    });
  },
  [GET_BASE_CONFIG]({ commit }, payload) {
    http.api[apiList.GET_CONFIG]({
      success(data) {
        const commonConfig = {};
        const title = data.title;
        const titleEle = document.querySelector('title');
        const iconEle = document.querySelector('#favison');

        titleEle.innerHTML = title;
        iconEle.href = data.icon;

        baseUtil.each(data, (value, key) => {
          if (key !== 'column') {
            commonConfig[key] = value;
          }
        });
        commit(APP_CONFIG_SET, commonConfig);
      },
      complete() {
        if (!payload) {
          return;
        }
        const complete = payload.complete;
        if (typeof complete === 'function') {
          complete();
        }
      },
    });
  },
};
