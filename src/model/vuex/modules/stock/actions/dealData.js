import {
  DEAL_DATA_INIT,
  DEAL_DATA_UPDATE,
  DEAL_DATA_ADD,
} from '../mutations/mutationType';
import {
  UPDATE_DEAL_DATA,
  CLEAR_DEAL_DATA,
  GET_DEAL_DATA,
  CANCEL_DEAL_DATA,
} from './actionType';
import interceptor from '../../../plugins/interactionLimit';
import {
  baseUtil,
  logger,
  ycjUtil,
} from '../../../../../util';
import defaultValue from '../defaultState';
import http from '../../../../../plugins/http/http';

const codeLoop = {};
const apiList = http.apiList;
const listenList = {};
const channel = http.loop.channel;

export default {
  [GET_DEAL_DATA]({ state, commit }, code) {
    if (!ycjUtil.checkCode(code)) {
      logger.error('code need corrected, in action - dealData');
      return;
    }
    if (listenList[code]) {
      listenList[code].count += 1;
      return;
    }
    listenList[code] = {
      count: 1,
    };
    commit(DEAL_DATA_INIT, code);
    const opts = {
      param: {
        time: state.dealData[code].pre_time, // 这里始终是第一次请求时的值
        foxxcode: code,
      },
      success(data) {
        const deal = data.data;
        const preTime = data.pre_time;
        const result = {
          pre_time: preTime,
          data: deal,
        };
        const payload = {
          [code]: result,
        };
        commit(DEAL_DATA_UPDATE, payload);
      },
    };
    http.api[apiList.GET_DEAL_INFO](opts);
    const timer = setInterval(() => {
      if (ycjUtil.isOpening()) {
        http.api[apiList.GET_DEAL_INFO]({
          param: {
            time: state.dealData[code].pre_time,
            foxxcode: code,
          },
          success(data) {
            const deal = data.data;
            const preTime = data.pre_time;
            const result = {
              pre_time: preTime,
              data: deal,
            };
            const payload = {
              [code]: result,
            };
            commit(DEAL_DATA_UPDATE, payload);
          },
        });
      }
    }, channel.ONE_MINUTE);
    codeLoop[code] = [timer, channel.ONE_MINUTE];
  },
  /**
   * 更新资金交易数据
   * @param state
   * @param payload
   */
  [UPDATE_DEAL_DATA]({ state }, payload) {
    baseUtil.each(payload, (item, code) => {
      if (!ycjUtil.checkCode(code)) {
        logger.error('code need corrected,in action - baseInfo');
      }
    });
    interceptor.check(DEAL_DATA_UPDATE, payload, false);
  },
  [CANCEL_DEAL_DATA]({ commit }, code) {
    if (!ycjUtil.checkCode(code)) {
      logger.error('code need corrected, in action - relativeNews');
      return;
    }
    // 检查该股票代码是否在监听列表中，如果不在，直接return
    if (!listenList[code]) {
      return;
    }
    // 如果该股票在监听列表中，令监听列表中该股票的键值减1
    if (listenList[code]) {
      listenList[code].count -= 1;
    }
    // 当监听列表中该股票的键值为0时，才真正从股票新闻轮询列表中移出
    if (listenList[code].count < 1) {
      http.loop.remove(...codeLoop[code]);
      clearInterval(codeLoop[code][0]);
      delete listenList[code];
      delete codeLoop[code];
    }
  },
  [CLEAR_DEAL_DATA]({ commit }, code) {
    commit(DEAL_DATA_ADD, {
      code,
      data: defaultValue.dealData(),
    });
  },
};
