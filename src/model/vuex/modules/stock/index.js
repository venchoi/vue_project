import mutations from './mutations/index';
import getters from './getters/index';
import actions from './actions/index';

const state = {

  /**
   * 需要监听快照的股票列表
   */
  stockList: [],

  /**
   * 需要接受推送的股票
   */
  currentCode: null,


  /**
   * 股票基础信息
   * @param [string] baseInfo.code - 股票代码
   * @param [string | number] baseInfo.code.name - 股票名字
   * @param [string | number] baseInfo.code.code - 股票代码
   * @param [string | number] baseInfo.code.close - 收
   * @param [string | number] baseInfo.code.high - 高
   * @param [string | number] baseInfo.code.low - 低
   * @param [string | number] baseInfo.code.preClose - 昨收
   * @param [string | number] baseInfo.code.vol - 成交量
   * @param [string | number] baseInfo.code.money - 成交额
   * @param [string | number] baseInfo.code.hsl - 换手率
   */
  baseInfo: {
  },

  /**
   * 股票图表数据
   */
  seriesData: {},

  /**
   * 交易数据（资金数据）
   */
  dealData: {},

  /**
   * 股票相关概念
   */
  themeData: {},

  /**
   * 盘口数据
   */
  handicap: {},

  /**
   * 股票相关资讯
   */
  relativeNews: {},

  indexData: {
    ycjRange: {
      interval: {
        '000001.SH': {
          date: '-',
          lower: 0,
          point: 0,
          time: '-',
          upper: 0,
          viewpoint: '-',
        },
        '399006.SZ': {
          date: '-',
          lower: 0,
          point: 0,
          time: '-',
          upper: 0,
          viewpoint: '-',
        },
      },
      strategy: {
        '000001.SH': {
          date: '-',
          lower: 0,
          point: 0,
          time: '-',
          upper: 0,
          viewpoint: '-',
        },
        '399006.SZ': {
          date: '-',
          lower: 0,
          point: 0,
          time: '-',
          upper: 0,
          viewpoint: '-',
        },
      },
    },
    change: {
      up: [],
      down: [],
    },
    changeTotal: {
      up: 0,
      down: 0,
    },
    fund: {
      '000001.SH': {
        bigBuy: 0,
        bigSell: 0,
        foundNet: 0,
        smallBuy: 0,
        smallSell: 0,
      },
      '399006.SZ': {
        bigBuy: 0,
        bigSell: 0,
        foundNet: 0,
        smallBuy: 0,
        smallSell: 0,
      },
    },
  },

  /**
   * 大势五日分时图中买卖点
   */
  tradePoint: {},

};


export default {
  state,
  mutations,
  getters,
  actions,
};
