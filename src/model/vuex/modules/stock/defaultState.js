import {
  baseUtil,
} from '../../../../util';

export default {
  baseInfo(name) {
    return {
      name, // 股票名称
      code: '000000', // 股票代码
      close: 0, // 现价（收盘价）
      preClose: 0, // 昨日收盘价
      lb: '0', //  量比
      sjl: '0', //  市净率
      high: '0', // 最高
      low: '0', // 最低
      open: '0', // 今日开盘价
      vol: '0', // 成交量
      money: '0', // 成交额
      ratio: '0', // 涨跌幅
      hsl: '0', // 换手率
      ttm: '0', // 市盈率
      ltsz: '0', // 流通市值
      zsz: '0', // 总市值
      wb: '0', // 场内资金
      zjqd: '0', // 场外资金
    };
  },

  /**
   * 股票图表数据
   */
  seriesData() {
    return {
      k: [],
      kVol: [],
      tick: [],
      tickVol: [],
      index: {
        t: {
          ddjl: [], // 大单净量
          cjtj: [], // 成交统计
          qjwt: [], // 全局委托
          cdtj: [], // 撤单统计
          wtb: [], // 委托买入
          wts: [], // 委托卖出
          zjlr: [], // 资金流入
        },
        k: {
          ddgf: [], // 大单攻防
          ddjl: [], // 大单净量
          dddx: [], // 大单动向
          zldk: [], // 主力多空
          cdtj: [], // 撤单统计
          zlx: [], // 阻力线
        },
      },
    };
  },

  /**
   * 交易数据（资金数据）
   */
  // dealData() {
  //   // todo time 不要key，time写在value中，再排序
  //   return {
  //     baseList: [],
  //     buyer: [],
  //     seller: [],
  //   };
  // },
  dealData() {
    return {
      pre_time: '',
      data: [],
    };
  },

  /**
   * 股票相关概念
   */
  themeData() {
    return {
      stockTheme: {
        titleMain: '------',
        titleSub: '--------',
        des: '',
      },
      relativeThemes: [
        {
          name: '----',
          relation: 0,
        },
      ],
    };
  },

  /**
   * 盘口数据
   * 买卖队列现在是5档，ws.js中保存买卖队列的数据时，也要注意只是保存5档数据
   */
  handicap() {
    return {
      sellStage: baseUtil.createArray(5, {
        price: 0,
        vol: 0,
      }),
      sellFri: {
        entrust: 0,
        vol: 0,
        queue: [],
      },
      buyStage: baseUtil.createArray(5, {
        price: 0,
        vol: 0,
      }),
      buyFri: {
        entrust: 0,
        vol: 0,
        queue: [],
      },
    };
  },
  relativeNews() {
    return {
      normal: [],
      particular: [],
      good: [],
      realtime: [],
      newIconStatus: {
        first: false,
        second: false,
      },
    };
  },
};
