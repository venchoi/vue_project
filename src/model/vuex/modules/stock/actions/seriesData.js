import {
  GET_K_LINE,
  GET_TICK_LINE,
  UPDATE_K_LINE,
  UPDATE_TICK_LINE,
  REALTIME_TICK_LINE,
  CANCEL_REALTIME_TICK_LINE,
  GET_INDEX_LINE,
  UPDATE_INDEX_LINE,
  REALTIME_INDEX_LINE,
  CANCEL_REALTIME_INDEX_LINE,
} from './actionType';
import {
  SERIES_UPDATE,
  SERIES_INIT,
} from '../mutations/mutationType';
import http from '../../../../../plugins/http/http';
import {
  format,
  baseUtil,
  ycjUtil,
} from '../../../../../util';
import interactionLimit from '../../../plugins/interactionLimit';
import chartHandler from '../../../../../plugins/dataHandler/chart';

const apiList = http.apiList;
const kLineParam = () => {
  const gap = 3 * 356 * 24 * 60 * 60 * 1000;
  const today = format.date(new Date(), 'yyyyMMdd');
  const pass = format.date(new Date(Date.now() - gap), 'yyyyMMdd');
  return {
    begin_date: pass,
    end_date: today,
  };
};
const realtime = {
  tick: {},
  index: {},
};
const codeInLoop = {};

export default {
  [GET_K_LINE]({ state, dispatch, commit }, code) {
    const seriesData = state.seriesData[code];
    if (seriesData && seriesData.k && seriesData.k.length > 0) {
      return;
    }
    commit(SERIES_INIT, code);
    dispatch(UPDATE_K_LINE, code);
  },
  [UPDATE_K_LINE]({ commit }, code) {
    const foxxcode = ycjUtil.formatCode(code);
    const calcMa = (data, num, index) => {
      let i = 0;
      let cache = 0;
      let point = null;
      if (index + 1 >= num) {
        for (i; i < num; i += 1) {
          const item = data[index - i];
          if (item) {
            cache += parseFloat(item.close);
            point = cache / num;
          }
        }
      }
      return point;
    };
    http.api[apiList.GET_K_LINE]({
      param: {
        foxxcode,
        ...kLineParam(),
      },
      success(data) {
        const k = chartHandler
          .add(data)
          .object('high', 'low', 'open', 'close', 'date', 'ratio');
        const vol = chartHandler.string('vol');

        const ma5 = [];
        const ma10 = [];
        const ma20 = [];
        const ma60 = [];
        const seriesArry = [];
        const maList = {
          ma5,
          ma10,
          ma20,
          ma60,
        };
        baseUtil.each(k, (item, index) => {
          ma5.push(calcMa(k, 5, index));
          ma10.push(calcMa(k, 10, index));
          ma20.push(calcMa(k, 20, index));
          ma60.push(calcMa(k, 60, index));
        });
        baseUtil.each(maList, (item, name) => {
          seriesArry.push({
            type: 'index',
            name,
            dataType: 'k',
            data: item,
          });
        });
        seriesArry.push({
          type: 'k',
          data: k,
        });
        seriesArry.push({
          type: 'kVol',
          data: vol,
        });
        commit(SERIES_UPDATE, {
          [code]: seriesArry,
        });
      },
    });
  },
  [GET_TICK_LINE]({ state, dispatch, commit }, code) {
    const seriesData = state.seriesData[code];
    if (seriesData && seriesData.tick && seriesData.tick.length > 0) {
      return;
    }
    commit(SERIES_INIT, code);
    dispatch(UPDATE_TICK_LINE, code);
  },
  [REALTIME_TICK_LINE]({ state, commit }, payload) {
    const code = payload.code;
    const id = payload.id;
    const seriesData = state.seriesData[code];
    if (!seriesData) {
      commit(SERIES_INIT, code);
    }
    if (realtime.tick[code] && realtime.tick[code].length > 0) {
      if (realtime.tick[code].indexOf(id) < 0) {
        realtime.tick[code].push(id);
      }
      return;
    }
    realtime.tick[code] = [id];
    codeInLoop[code] = http.loop(apiList.GET_TICK_LINE, {
      param: {
        foxxcode: code,
      },
      success(data) {
        // 保存原始数据
        const originData = chartHandler.add(data);
        let preVol = null;
        let moneyCache = 0;
        const tick = originData.handler((item, keys) => {
          const point = {};
          let close = item[keys.close];
          const ratio = item[keys.ratio];
          const time = item[keys.time];
          const preclose = item[keys.preclose];
          if (item.length < 1) {
            return null;
          }
          if (close === 0) {
            close = preclose;
          }
          point.close = close;
          point.ratio = ratio;
          point.date = time;
          return point;
        }, 'close', 'preclose', 'ratio', 'time');
        const vol = originData.handler((item, keys, index) => {
          let point = null;
          const tickVol = item[keys.vol];
          if ((preVol !== null && typeof preVol !== 'undefined') && tickVol) {
            point = tickVol - preVol;
            preVol = tickVol;
          } else if (index === 0) {
            point = tickVol;
            preVol = tickVol;
          }
          return point;
        }, 'vol');
        const ma = originData.handler((item, keys, index) => {
          let point = null;
          const tickVol = vol[index]; // 时刻交易量
          const close = item[keys.close]; // 时刻价格
          const totalVol = item[keys.vol]; // 总交易量
          if (tickVol !== null && close !== null) {
            moneyCache += close * tickVol; // 时刻总交易额
          }
          if (totalVol) {
            point = (moneyCache / totalVol).toFixed(2);
          }
          return point;
        }, 'close', 'vol');
        interactionLimit.check(SERIES_UPDATE, {
          [code]: {
            type: 'tick',
            data: tick,
          },
        }, false);
        interactionLimit.check(SERIES_UPDATE, {
          [code]: {
            type: 'tickVol',
            data: vol,
          },
        }, false);
        interactionLimit.check(SERIES_UPDATE, {
          [code]: {
            type: 'index',
            name: 'ma',
            dataType: 't',
            data: ma,
          },
        }, false);
      },
    });
  },
  [CANCEL_REALTIME_TICK_LINE](store, payload) {
    const code = payload.code;
    const id = payload.id;
    const idIndex = realtime.tick[code].indexOf(id);
    if (idIndex > -1) {
      realtime.tick[code].splice(idIndex, 1);
    }
    if (realtime.tick[code].length === 0) { // store 没有用的
      http.loop.remove(...codeInLoop[code]);
      delete codeInLoop[code];
    }
  },
  [UPDATE_TICK_LINE]({ commit }, code) {
    const foxxcode = ycjUtil.formatCode(code);
    http.api[apiList.GET_TICK_LINE]({
      param: {
        foxxcode,
      },
      success(data) {
        // 保存原始数据
        const originData = chartHandler.add(data);
        let preVol = null;
        const tick = originData.handler((item, keys) => {
          const point = {};
          let close = item[keys.close];
          const preclose = item[keys.preclose];
          if (close === 0) {
            close = preclose;
          }
          point.close = close;
          point.ratio = (((close - preclose) * 100) / preclose).toFixed(2);
          return point;
        }, 'close', 'preclose');
        const vol = originData.handler((item, keys) => {
          let point = null;
          const tickVol = item[keys.vol];
          if (preVol) {
            point = tickVol - preVol;
          } else {
            point = tickVol;
          }
          preVol = tickVol;
          return point;
        }, 'vol');
        commit(SERIES_UPDATE, {
          code,
          type: 'tick',
          data: tick,
        });
        commit(SERIES_UPDATE, {
          code,
          type: 'tickVol',
          data: vol,
        });
      },
    });
  },
  [GET_INDEX_LINE]({ state, dispatch }, payload) {
    const code = payload.code;
    const name = payload.name;
    const indexType = payload.type;
    const seriesData = state.seriesData[code];
    const indexData = seriesData.index[indexType][name];
    if (seriesData && indexData && indexData.length > 0) {
      return;
    }
    dispatch(UPDATE_INDEX_LINE, payload);
  },
  [UPDATE_INDEX_LINE]({ commit }, payload) {
    const code = payload.code;
    const name = payload.name;
    const indexType = payload.type; // t / k
    const type = {
      大单净量: 'ddjl',
      全局委托: 'qjwt',
      大单攻防: 'ddgf',
      大单动向: 'dddx',
      成交统计: 'cjtj',
      主力多空: 'zldk',
      撤单统计: 'cdtj',
      阻力线: 'zlx',
      大单流入: 'ddjl_min',
      委托买入: 'wtb',
      委托卖出: 'wts',
      资金流入: 'zjlr',
    };
    let method;
    let param;
    if (!type[name]) {
      return;
    }
    if (indexType === 'k') {
      method = apiList.GET_K_INDEX_LINE;
      param = {
        type: type[name],
        foxxcode: code,
        ...kLineParam(),
      };
    } else {
      method = apiList.GET_TICK_INDEX_LINE;
      param = {
        type: type[name],
        foxxcode: code,
        date: format.date(new Date(), 'yyyyMMdd'),
      };
    }
    http.api[method]({
      param,
      success(data) {
        const originData = chartHandler.add(data);
        const indexCache = originData.handler((item, keys) => {
          const point = {};
          baseUtil.each(keys, (index, key) => {
            if (key !== 'date') {
              if (item.length < 1) {
                point[key] = null;
              } else {
                point[key] = item[index];
              }
            }
          });
          return point;
        }, 'all');
        const indexData = {};
        baseUtil.each(indexCache, (item) => {
          baseUtil.each(item, (v, k) => {
            if (k !== 'x') {
              if (!indexData[k]) {
                indexData[k] = [];
              }
              indexData[k].push(v);
            }
          });
        });
        interactionLimit.check(SERIES_UPDATE, {
          [code]: {
            type: 'index',
            name: type[name],
            dataType: indexType,
            data: indexData,
          },
        }, false);
      },
    });
  },
  [REALTIME_INDEX_LINE]({ commit }, payload) {
    const code = payload.code;
    const name = payload.name;
    const flag = `${code}_${name}`;
    const id = payload.id;
    const type = {
      大单净量: 'ddjl',
      全局委托: 'qjwt',
      大单攻防: 'ddgf',
      大单动向: 'dddx',
      成交统计: 'cjtj',
      主力多空: 'zldk',
      撤单统计: 'cdtj',
      阻力线: 'zlx',
      大单流入: 'ddjlmin',
      委托买入: 'wtb',
      委托卖出: 'wts',
      资金流入: 'zjlr',
    };
    if (name === '成交量') {
      return;
    }
    const param = {
      type: type[name],
      foxxcode: code,
      date: format.date(new Date(), 'yyyyMMdd'),
    };
    if (
      realtime.index[code] &&
      realtime.index[code][name] &&
      realtime.index[code][name].length > 0) {
      if (realtime.index[code][name].indexOf(id) < 0) {
        realtime.index[code][name].push(id);
      }
      return;
    }
    if (!realtime.index[code]) {
      realtime.index[code] = {};
    }
    realtime.index[code][name] = [id];
    codeInLoop[flag] = http.loop(apiList.GET_TICK_INDEX_LINE, {
      param,
      success(data) {
        const originData = chartHandler.add(data);
        const indexCache = originData.handler((item, keys) => {
          const point = {};
          baseUtil.each(keys, (index, key) => {
            if (key !== 'date' && key !== 'time') {
              if (item.length < 1) {
                point[key] = null;
              } else {
                point[key] = item[index];
              }
            }
          });
          return point;
        }, 'all');
        const indexData = {};
        baseUtil.each(indexCache, (item) => {
          baseUtil.each(item, (v, k) => {
            if (k !== 'x') {
              if (!indexData[k]) {
                indexData[k] = [];
              }
              indexData[k].push(v);
            }
          });
        });
        interactionLimit.check(SERIES_UPDATE, {
          [code]: {
            type: 'index',
            name: type[name],
            dataType: 't',
            data: indexData,
          },
        }, false);
      },
    });
  },
  [CANCEL_REALTIME_INDEX_LINE](store, payload) {
    const code = payload.code;
    const id = payload.id;
    const indexRealtime = realtime.index[code];
    let idIndex;
    let flag;
    baseUtil.each(indexRealtime, (ids, name) => {
      idIndex = indexRealtime[name].indexOf(id);
      flag = `${code}_${name}`;
      if (idIndex > -1) {
        indexRealtime[name].splice(idIndex, 1);
      }
      if (indexRealtime[name].length === 0) {
        http.loop.remove(...codeInLoop[flag]);
        delete codeInLoop[flag];
      }
    });
  },
};
