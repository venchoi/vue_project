import * as mutationType from '../mutations/mutationType';
import {
  UPDATE_BASE_INFO,
  INIT_ALL_BASE_INFO,
  GET_STOCK_DATA,
  REALTIME_STOCK_DATA,
  CANCEL_STOCK_DATA,
} from './actionType';
import interceptor from '../../../plugins/interactionLimit';
import http from '../../../../../plugins/http/http';
import {
  codes,
} from '../../../../storage';
import {
  baseUtil,
  ycjUtil,
  logger,
} from '../../../../../util';

const apiList = http.apiList;
const codeLoop = {};
const listenList = {};
const channel = http.loop.channel;

export default {
  /**
   * 股票基本信息更新
   * @param state
   * @param payload
   */
  [UPDATE_BASE_INFO]({ state }, payload) {
    baseUtil.each(payload, (item, code) => {
      if (!ycjUtil.checkCode(code)) {
        logger.error('code need corrected,in action - baseInfo');
      }
    });
    interceptor.check(mutationType.BASE_INFO_UPDATE, payload);
  },
  /**
   * 初始化股票基本信息
   * 初始化时，只有股票代码及股票名称的数据，其余信息的值都为0
   * 股票代码及股票名称的数据来自localStorage的codes（每天只请求一次该数据，并保存在本地）
   * @param commit
   */
  [INIT_ALL_BASE_INFO]({ commit }) {
    const codesData = codes.read();
    baseUtil.each(codesData, (code) => {
      commit(mutationType.BASE_INFO_INIT, {
        code: code[0],
        name: code[1],
      });
    });
  },
  /**
   * 获取股票基本信息
   * @param state
   * @param code
   */
  [GET_STOCK_DATA]({ state }, code) {
    const type = '1'; // 指标类型，1：换手率、量比、总市值等数据；2：相关概念；3：上证指数的收盘价区间等；4：市场全局涨跌；5：板块概念
    const param = {
      type,
      foxxcode: code,
    };
    /**
     * 如果监听列表中已经有该股票（即该股票已经正在监听），将监听列表中该股票的键值加1
     * 这里使用增1减1，而不是置0或1，目的是提高命中率。
     * 在大量数据情况下，如果使用置0置1来判断是否监听的话，监听和取消监听的操作会非常频繁
     */
    if (listenList[code]) {
      listenList[code] += 1;
      return;
    }
    listenList[code] = 1;
    http.api[apiList.GET_STOCK_DATA]({
      param,
      success(data) {
        /**
         * 返回的data数据结构为：
         * "data":{
         *  "hsl":"0.44",  // 换手率
         *  "lb":"0.40", // 量比
         *  "zsz":"921080.72亿", // 总市值
         *  "ltsz":"920886.45亿", // 流通市值
         *  "ttm":"53.40", // 市盈率
         *  "sjl": "2.51", // 市净率
         *  "wb": "0.0611", // 场内资金
         *  "zjqd": "0.2723", // 场外资金
         * }
         * @type {{}}
         */
        const handlerData = {
          [code]: data,
        };
        interceptor.check(mutationType.BASE_INFO_UPDATE, handlerData);
      },
    });
  },
  /**
   * 实时获取股票基本信息，跟上面的GET_STOCK_DATA相比，多了轮询，每隔一分钟请求一次
   * @param state
   * @param code
   */
  [REALTIME_STOCK_DATA]({ state }, code) {
    const type = '1';
    const param = {
      type,
      foxxcode: code,
    };
    if (listenList[code]) {
      listenList[code] += 1;
      return;
    }
    listenList[code] = 1;
    codeLoop[code] = http.loop(apiList.GET_STOCK_DATA, {
      param,
      success(data) {
        const handlerData = {
          [code]: data,
        };
        interceptor.check(mutationType.BASE_INFO_UPDATE, handlerData);
      },
    }, channel.ONE_MINUTE);
  },
  /**
   * 取消监听股票基本信息
   * @param state
   * @param code
   */
  [CANCEL_STOCK_DATA](state, code) {
    if (!ycjUtil.checkCode(code)) {
      logger.error('code need corrected,in action - baseInfo');
      return;
    }
    // 检查该股票代码是否在监听列表中，如果不在，直接return
    if (!listenList[code]) {
      return;
    }
    // 如果该股票在监听列表中，令监听列表中该股票的键值减1
    if (listenList[code]) {
      listenList[code] -= 1;
    }
    /**
     * 当监听列表中该股票的键值为0时，才真正从股票监听列表中移出
     * 首先从http.loop中移除该股票的轮询队列
     * 然后从监听列表中删除该股票
     * 再删除该股票的轮询队列
     */
    if (listenList[code] < 1 && codeLoop[code]) {
      http.loop.remove(...codeLoop[code]);
      delete listenList[code];
      delete codeLoop[code];
    }
  },
};
