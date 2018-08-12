import {
  RELATIVE_NEWS_ADD,
  RELATIVE_NEWS_INIT,
} from '../mutations/mutationType';
import http from '../../../../../plugins/http/http';
import {
  GET_RELATIVE_NEWS,
  CANCEL_REALTIME_NEWS,
} from './actionType';
import {
  logger,
  ycjUtil,
} from '../../../../../util/index';

const apiList = http.apiList;
const newsType = { // 新闻类型
  LATEST: '1', // 最新消息
  PARTICULAR: '2', // 特别提示
  NOTICE: '3', // 公司公告
  REPORT: '4', // 机构研报
  REALTIME: '5', // 实时报盘（股指）
  GOODBAD: '6', // 利好利空（无需foxxcode_list和page参数）
};
const codeLoop = {};
const listenList = {};
const channel = http.loop.channel;
export default {
  /**
   * 获取股票相关新闻 - 每隔一分钟请求一次
   * @param commit
   * @param code
   */
  [GET_RELATIVE_NEWS]({ commit }, code) {
    if (!ycjUtil.checkCode(code)) {
      logger.error('code need corrected, in action - relativeNews');
      return;
    }
    if (listenList[code]) {
      listenList[code] += 1;
      return;
    }
    listenList[code] = 1;
    commit(RELATIVE_NEWS_INIT, code);
    let type = [];
    // 如果是股指， 请求 实时盯盘，利好利空 类型的新闻，如果是其他个股，请求 最新新闻，特别提醒 类型的新闻
    if (ycjUtil.isIndex(code)) {
      type = [newsType.REALTIME, newsType.GOODBAD];
    } else {
      type = [newsType.LATEST, newsType.PARTICULAR];
    }
    /**
     * 轮询的方式请求新闻
     * @param {String} - url 请求地址
     * @param {Object} - param 请求参数
     * @param {Boolean} - isBreak 是否中断，，如果为true，则在收盘后不会再请求，如果是false，则在收盘后还会继续请求
     * @param {Number} - channel 请求频率，这里是每分钟一次
     */
    codeLoop[code] = http.loop(apiList.GET_STOCK_NEWS, {
      param: {
        type, // 数组形式，可一次请求多种新闻类型
        page: 1, // 请求第几页
        limit: 15, // 一页多少数据
        foxxcode_list: [code], // 股票列表
      },
      success(data) {
        let payload = {};
        const newIconStatus = { // 新闻类型状态， 在stockNews.vue中有用到这个属性
          first: false,
          second: false,
        };
        if (ycjUtil.isIndex(code)) {
          /**
           * 如果是股指，返回的数据格式以新闻类型为键，新闻列表为键值
           * e.g.
           * {
           *  5: [{id,title,...},{},...],
           *  6: [{id,title,...},{},...],
           * }
           */
          const good = data[newsType.GOODBAD]; // 利好利空新闻
          const realtime = data[newsType.REALTIME]; // 实时盯盘新闻
          payload = {
            code,
            data: {
              good,
              realtime,
              newIconStatus,
            },
          };
        } else {
          // 如果是其他个股，返回的数据格式两层对象数据，第一层是以新闻类型为键，股票列表为键值
          /**
           * 如果是其他个股，返回的数据格式两层对象数据
           * 第一层是以新闻类型为键，股票列表为键值
           * 第二层是以股票代码为键，股票新闻为键值
           * e.g.
           * {
           *  1: {code:{id,content,...},...},
           *  2: {code:{id,content,...},...},
           * }
           */
          const latest = data[newsType.LATEST][code];
          const particular = data[newsType.PARTICULAR][code];
          payload = {
            code,
            data: {
              normal: latest,
              particular,
              newIconStatus,
            },
          };
        }
        // 提交mutation： 新增相关新闻
        commit(RELATIVE_NEWS_ADD, payload);
      },
    }, false, channel.ONE_MINUTE);
  },
  // 取消实时更新新闻
  [CANCEL_REALTIME_NEWS]({ commit }, code) {
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
      listenList[code] -= 1;
    }
    // 当监听列表中该股票的键值为0时，才真正从股票新闻轮询列表中移出
    if (listenList[code] < 1) {
      http.loop.remove(...codeLoop[code]);
      delete listenList[code];
      delete codeLoop[code];
    }
  },
};
