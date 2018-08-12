import {
  GET_INDEX_DATA,
  UPDATE_INDEX_DATA,
  CANCEL_UPDATE_INDEX_DATA,
  UPDATE_TRADE_DATA,
  INIT_TRADE_DATA,
} from './actionType';

import {
  INDEX_DATA_UPDATE,
  TRADE_POINT_UPDATE,
} from '../mutations/mutationType';

import http from '../../../../../plugins/http/http';
import {
  baseUtil,
} from '../../../../../util';

const apiList = http.apiList;
const codeLoop = [];
let listenCount = 0;
const dataType = {
  RANGE: 3,
  UP_DOWN: 4,
};

export default {
  [GET_INDEX_DATA]({ dispatch }) {
    dispatch(UPDATE_INDEX_DATA);
  },
  [UPDATE_INDEX_DATA]({ commit }) {
    const keyMaps = {
      viewpoint_name: 'viewpoint',
      upper_interval: 'upper',
      lower_interval: 'lower',
      show_time: 'time',
    };
    if (listenCount) {
      listenCount += 1;
      return;
    }
    listenCount += 1;
    const range = http.loop(apiList.GET_STOCK_DATA, {
      param: {
        type: dataType.RANGE,
      },
      success(data) {
        const result = {};
        const payload = {};
        baseUtil.each(data, (items, itemsKey) => {
          result[itemsKey] = {};
          baseUtil.each(items, (item, itemKey) => {
            result[itemsKey][itemKey] = {};
            baseUtil.each(item, (value, key) => {
              const itemResult = result[itemsKey][itemKey];
              if (keyMaps[key]) {
                itemResult[keyMaps[key]] = value;
              } else {
                itemResult[key] = value;
              }
            });
          });
        });
        payload.type = 'ycjRange';
        payload.data = result;
        commit(INDEX_DATA_UPDATE, payload);
      },
    });

    const upDown = http.loop(apiList.GET_STOCK_DATA, {
      param: {
        type: dataType.UP_DOWN,
      },
      success(data) {
        const down = [];
        const up = [];
        let totalUp = 0;
        let totalDown = 0;
        baseUtil.each(data.up, (item) => {
          up.push(item.number);
        });
        baseUtil.each(data.down, (item) => {
          down.push(item.number);
        });
        baseUtil.each(up, (u) => {
          totalUp += parseInt(u, 10);
        });
        baseUtil.each(down, (d) => {
          totalDown += parseInt(d, 10);
        });
        commit(INDEX_DATA_UPDATE, {
          type: 'change',
          data: {
            up: baseUtil.createArray(5, null).concat(up.reverse()),
            down: down.reverse().concat(baseUtil.createArray(5, null)),
          },
        });
        commit(INDEX_DATA_UPDATE, {
          type: 'changeTotal',
          data: {
            up: totalUp,
            down: totalDown,
          },
        });
      },
    });

    const fund = http.loop(apiList.GET_FUND, {
      success(data) {
        commit(INDEX_DATA_UPDATE, {
          type: 'fund',
          data,
        });
      },
    });

    codeLoop.push(range);
    codeLoop.push(upDown);
    codeLoop.push(fund);
  },
  [CANCEL_UPDATE_INDEX_DATA]() {
    listenCount -= 1;
    if (listenCount === 0) {
      baseUtil.each(codeLoop, (item) => {
        http.loop.remove(item);
      });
    }
  },
  /**
   * 初始化大势五日分时图交易点信息
   */
  [INIT_TRADE_DATA]({ dispatch }, payload) {
    const complete = payload.complete;
    http.api[apiList.GET_TRADE_POINT]({
      param: {},
      success(data) {
        dispatch(UPDATE_TRADE_DATA, data);
        if (typeof complete === 'function') {
          complete();
        }
      },
    });
  },
  /**
   * 更新大势五日分时图交易点信息
   */
  [UPDATE_TRADE_DATA]({ commit }, pointData) {
    commit(TRADE_POINT_UPDATE, pointData);
  },
};
