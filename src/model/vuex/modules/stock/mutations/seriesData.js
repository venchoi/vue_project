import vue from 'vue';

import {
  SERIES_INIT,
  SERIES_UPDATE,
} from './mutationType';
import defaultState from '../defaultState';
import {
  baseUtil,
} from '../../../../../util';


export default {
  [SERIES_INIT](state, code) {
    if (!state.seriesData[code]) {
      vue.set(state.seriesData, code, defaultState.seriesData());
    }
  },
  [SERIES_UPDATE](state, payload) {
    baseUtil.each(payload, (items, code) => {
      baseUtil.each(items, (item) => {
        const type = item.type; // 数据类型
        const name = item.name; // 数据存入名字
        const seriesType = item.dataType || 't'; // k线形状 分时形状
        const data = item.data;
        const seriesState = state.seriesData[code];
        switch (type) {
          case 'index':
            if (!seriesState[type][seriesType]) {
              vue.set(seriesState.type, seriesType, {});
            }
            vue.set(seriesState[type][seriesType], name, data);
            break;
          default:
            vue.set(seriesState, type, data);
            break;
        }
      });
    });
  },
};
