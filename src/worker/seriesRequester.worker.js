import {
  baseUtil,
  format,
} from '../util';
import chartHandler from '../plugins/dataHandler/chart';
import http from '../plugins/http/http';

const apiList = http.apiList;
let throttle = {}; // 节流数组
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
  tick: {}, // 分时图数据
  index: {}, // 分时指标
  fiveDaysTick: {},
  tenDaysTick: {}, // 十日分时数据
  tenDaysIndex: {}, // 十日分时指标
};
const codeInLoop = {
  fiveDaysTick: {},
};

/**
 * k 线请求方法
 */
const kLine = (foxxcode) => {
  const param = {
    foxxcode,
  };
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
  baseUtil.merge(param, kLineParam(), true);
  http.api[apiList.GET_K_LINE]({
    param,
    success(data) {
      let k = chartHandler
        .add(data)
        .handler((item, keys) => {
          const point = {};
          const accumAdjfactor = item[keys.accumadjfactor] ? item[keys.accumadjfactor] : 1;
          const close = item[keys.close];
          const high = item[keys.high];
          const low = item[keys.low];
          const open = item[keys.open];
          point.close = close * accumAdjfactor;
          point.high = high * accumAdjfactor;
          point.low = low * accumAdjfactor;
          point.open = open * accumAdjfactor;
          point.ratio = item[keys.ratio];
          point.date = item[keys.date];
          return point;
        }, 'high', 'low', 'open', 'close', 'date', 'ratio', 'accumadjfactor');

      let vol = chartHandler.string('vol');
      const EMA12 = [];
      const EMA26 = [];
      const DIF = [];
      const DEA = [];
      const marker = [];
      let markerStatus = 0;
      const kLength = k.length;

      let ma5 = [];
      let ma10 = [];
      let ma20 = [];
      let ma60 = [];
      baseUtil.each(k, (item, index) => {
        ma5.push(calcMa(k, 5, index));
        ma10.push(calcMa(k, 10, index));
        ma20.push(calcMa(k, 20, index));
        ma60.push(calcMa(k, 60, index));
      });

      if (kLength < 120) {
        k = k.concat(baseUtil.createArray(120 - kLength, null));
        vol = vol.concat(baseUtil.createArray(120 - kLength, null));
        ma5 = ma5.concat(baseUtil.createArray(120 - kLength, null));
        ma10 = ma10.concat(baseUtil.createArray(120 - kLength, null));
        ma20 = ma20.concat(baseUtil.createArray(120 - kLength, null));
        ma60 = ma60.concat(baseUtil.createArray(120 - kLength, null));
      }


      /**
       * MEA12 MEA26
       * DIFF和 DEA
       */
      baseUtil.each(k, (item, index) => {
        if (index === 0) {
          EMA12.push(item.close);
          EMA26.push(item.close);

          DIF.push(0);
          DEA.push(0);
          return;
        }
        if (item === null) {
          return;
        }
        const close = item.close;

        const preIndex = index - 1;
        const preMEA12 = EMA12[preIndex];
        const preMEA26 = EMA26[preIndex];
        const preDEA = DEA[preIndex];

        const newMEA12 = (preMEA12 * 11 + close * 2) / 13;
        const newMEA26 = (preMEA26 * 25 + close * 2) / 27;
        const newDIF = newMEA12 - newMEA26;
        const newDEA = (preDEA * 8 + newDIF * 2) / 10;
        let mStatus;
        EMA12.push(newMEA12);
        EMA26.push(newMEA26);

        DIF.push(newDIF);
        DEA.push(newDEA);

        if (newDEA - newDIF > 0) {
          mStatus = 1;
        } else {
          mStatus = -1;
        }


        if (!markerStatus) {
          markerStatus = mStatus;
        }

        if (markerStatus > 0 && mStatus < 0) {
          marker.push({
            status: 1, // 买
            date: item.date,
            y: item.low,
            x: index,
          });
          markerStatus = mStatus;
        } else if (markerStatus < 0 && mStatus > 0) {
          marker.push({
            status: 0, // 卖
            date: item.date,
            y: item.high,
            x: index,
          });
          markerStatus = mStatus;
        } else {
          marker.push(null);
        }
      });
      baseUtil.merge(throttle, {
        [foxxcode]: {
          k: {
            line: k,
            vol,
            ma5,
            ma10,
            ma20,
            ma60,
            marker,
          }
        },
      });
    },
  });
};

/**
 * k线指标
 */
const kIndexLine = (foxxcode, type) => {
  const code = foxxcode;
  // const type = {
  //   大单净量: 'ddjl',
  //   全局委托: 'qjwt',
  //   大单攻防: 'ddgf',
  //   大单动向: 'dddx',
  //   成交统计: 'cjtj',
  //   主力多空: 'zldk',
  //   撤单统计: 'cdtj',
  //   阻力线: 'zlx',
  //   大单流入: 'ddjl_min',
  // };
  const method = apiList.GET_K_INDEX_LINE;
  const param = {
    type,
    foxxcode: code,
  };
  baseUtil.merge(param, kLineParam(), true);

  http.api[method]({
    param,
    success(data) {
      const originData = chartHandler.add(data);
      const indexCache = originData.handler((item, keys) => {
        const point = {};
        baseUtil.each(keys, (index, key) => {
          if (key !== 'date') {
            point[key] = item.length < 1 ? null : item[index];
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

      baseUtil.each(indexData, (item, k) => {
        if (item.length < 120) {
          indexData[k] = item.concat(baseUtil.createArray(120 - item.length, null))
        }
      });
      baseUtil.merge(throttle, {
        [code]: {
          k: {
            [type]: indexData,
          },
        },
      });
    },
  });
};

/**
 * 分时请求方法 （强制实时）
 */
const tickLine = (foxxcode) => {
  let prevClose;
  const httpConfig = {
    param: {
      foxxcode,
    },
    success(data) {
      // 保存原始数据
      const originData = chartHandler.add(data);
      let preVol = null; // 前一时刻成交量
      let moneyCache = 0;
      // 分时图数据Tick，每个点数据结构为point,包含close,ratio,time,date,preclose
      const tick = originData.handler((item, keys) => {
        if (item.length < 1) {
          return null;
        }
        const point = {};
        let close = item[keys.close];
        const ratio = item[keys.ratio];
        const time = item[keys.time];
        const date = item[keys.date].toString();
        const preclose = item[keys.preclose];

        if (close === 0) {
          close = preclose;
        }
        if (!prevClose) {
          prevClose = preclose;
        }
        point.close = close;
        point.ratio = ratio;
        point.date = `${date.substr(0,4)}-${date.substr(4,2)}-${date.substr(6,2)} ${time.substr(0, 5)}`;
        return point;
      }, 'close', 'preclose', 'ratio', 'time', 'date');
      // 成交量数据vol，241长度的数组
      const vol = originData.handler((item, keys, index) => {
        let point = null; // 保存成交量数据每个点的信息
        const tickVol = item[keys.vol]; // 当前成交量
        if ((preVol !== null && typeof preVol !== 'undefined') && tickVol) {
          point = tickVol - preVol;
          preVol = tickVol;
        } else if (index === 0) {
          point = tickVol;
          preVol = tickVol;
        }
        return point;
      }, 'vol');
      // 均线数据ma,241长度数组
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
      // 放入节流数组
      baseUtil.merge(throttle, {
        [foxxcode]: {
          tick: {
            line: tick,
            vol,
            ma,
            preClose: prevClose,
          },
        },
      });
    },
  };
  if (realtime.tick[foxxcode] && typeof realtime.tick[foxxcode] === 'number') {
    realtime.tick[foxxcode] += 1;
    return;
  }
  realtime.tick[foxxcode] = 1;
  codeInLoop[foxxcode] = http.loop(apiList.GET_TICK_LINE, httpConfig);
};

/**
 * 分时指标
 */
const tickIndexLine = (foxxcode, type) => {
  const code = foxxcode;
  const flag = `${code}_${type}`;
  const param = {
    type,
    foxxcode: code,
    date: format.date(new Date(), 'yyyyMMdd'),
  };
  if (
    realtime.index[code] &&
    typeof realtime.index[code][type] === 'number') {
    realtime.index[code][type] += 1;
    return;
  }
  if (!realtime.index[code]) {
    realtime.index[code] = {};
  }
  realtime.index[code][type] = 1;
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
      baseUtil.merge(throttle, {
        [code]: {
          tick: {
            [type]: indexData,
          },
        },
      });
    },
  });
};

/**
 * 分时指标
 * 合并两个数据指标
 */
const tickIndexMergeTwoType = (foxxcode, targetType, type1, type2) => {
  const code = foxxcode;
  const flag = `${code}_${targetType}`;
  let type = type1;
  let param = {
    type,
    foxxcode: code,
    date: format.date(new Date(), 'yyyyMMdd'),
  };
  if (
    realtime.index[code] &&
    typeof realtime.index[code][type] === 'number') {
    realtime.index[code][type] += 1;
    return;
  }
  if (!realtime.index[code]) {
    realtime.index[code] = {};
  }
  realtime.index[code][type] = 1;
  codeInLoop[flag] = http.loop(apiList.GET_TICK_INDEX_LINE, {
    param,
    success(data) {
      type = type2;
      param = {
        type,
        foxxcode: code,
        date: format.date(new Date(), 'yyyyMMdd'),
      };
      http.api[apiList.GET_TICK_INDEX_LINE]({
        param,
        success(msg) {
          const type1Data = getIndexData(data);
          const type2Data = getIndexData(msg);
          baseUtil.merge(throttle, {
            [code]: {
              tick: {
                [targetType]: baseUtil.merge(type1Data, type2Data),
              },
            },
          });
        }
      })
      const getIndexData = (targetData) => {
        const originData = chartHandler.add(targetData);
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
        return indexData;
      }
    },
  });
};

/**
 * 5日分时请求方法 （强制实时）
 * 请求返回的是前4日的数据
 */
const fiveDaysTickLine = (foxxcode) => {
  const httpConfig = {
    param: {
      foxxcode,
    },
    success(data) { // data 是前4天的点
      // 保存原始数据
      const originData = chartHandler.add(data);
      const tick = originData.handler((item, keys) => {
        const point = {};
        let close = item[keys.y];
        const date = item[keys.date];
        if (item.length < 1) {
          return null;
        }
        point.close = close;
        point.date = date;
        return point;
      }, "y", "date");

      baseUtil.merge(throttle, {
        [foxxcode]: {
          tick: {
            fiveDaysTick: tick,
          },
        },
      });
    },
  };
  http.api[apiList.GET_FIVE_DAYS_TICK_LINE](httpConfig);
};

/**
 * 10日分时请求方法 （强制实时）
 */
const tenDaysTickLine = (foxxcode) => {
  // let prevClose; // 收盘价
  const httpConfig = {
    param: {
      foxxcode,
    },
    success(data) {
      // 保存原始数据0-2409
      // 信号点信息 接受时结构为['timeData', 'tradetypeData'],处理时要转化为 { data, head }结构
      let tradePoint; //  保存信号点信息
      if (data.buy_sell_point) { // 如果有信号点数据，则添加到tradePoint
        const tradePointOriginData = {
          data: data.buy_sell_point,
          head: ['time', 'tradeType'],
        };
        const tradeData = chartHandler.add(tradePointOriginData); // 保存chartHandler
        tradePoint = tradeData.handler((item, keys) => {
          if (item.length < 1) {
            return null;
          }
          const point = {};
          const time = item[keys.time].substr(0, 16); // 去掉秒
          const tradeType = item[keys.tradeType];
          point.time = time;
          point.tradeType = tradeType.toString();
          return point;
        }, 'time', 'tradeType');
      } else { // 如无则tradePoint为空数组
        tradePoint = [];
      }
      const originData = chartHandler.add(data);
      let moneyCache = 0;
      // 分时图数据Tick，每个点数据结构为point,包含close,ratio,time,date,preclose
      const tenDaysTick = originData.handler((item, keys) => {
        if (item.length < 1) {
          return null;
        }
        const point = {};
        let close = item[keys.close];
        const ratio = item[keys.ratio];
        const time = item[keys.time];
        const date = item[keys.date].toString();
        // const preclose = item[keys.preclose]; // 10天前收盘价

        // if (close === 0) {
        //   close = preclose;
        // }
        // if (!prevClose) {
        //   prevClose = preclose;
        // }
        point.close = close;
        point.ratio = ratio;
        point.date = `${date.substr(0,4)}-${date.substr(4,2)}-${date.substr(6,2)} ${time.substr(0, 5)}`;
        return point;
      }, 'close', 'preclose', 'ratio', 'time', 'date');
      baseUtil.merge(throttle, {
        [foxxcode]: {
          tenDaysTick: {
            line: tenDaysTick, // 分时数据点集
            // preClose: prevClose, // 前十日收盘价
            tradePoint, // 信号点
          },
        },
      });
    },
  };
  if (realtime.tenDaysTick[foxxcode] && typeof realtime.tenDaysTick[foxxcode] === 'number') {
    realtime.tenDaysTick[foxxcode] += 1;
    return;
  }
  realtime.tenDaysTick[foxxcode] = 1;
  codeInLoop[foxxcode] = http.loop(apiList.GET_TEN_DAYS_TICK_LINE, httpConfig);
};
/**
 * 10日分时指标
 */
const tenDaysTickIndex = (foxxcode, type) => {
  const code = foxxcode;
  const flag = `${code}_${type}`;
  const param = {
    days: 10,
    foxxcode: code,
  };
  if (
    realtime.tenDaysIndex[code] &&
    typeof realtime.tenDaysIndex[code][type] === 'number') {
    realtime.tenDaysIndex[code][type] += 1;
    return;
  }
  if (!realtime.tenDaysIndex[code]) {
    realtime.tenDaysIndex[code] = {};
  }
  realtime.tenDaysIndex[code][type] = 1;
  codeInLoop[flag] = http.loop(apiList.GET_TEN_DAYS_TICK_INDEX, {
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
      baseUtil.merge(throttle, {
        [code]: {
          tenDaysTick: {
            [type]: indexData,
          },
        },
      });
    },
  });
};
/**
 * 取消实时
 */
const cancelRequest = (foxxcode, type, name) => {
  const code = foxxcode;
  let realtimeForType;
  let flag;
  if (type === 'tick') {
    if (type === 'fiveDaysTick') {} else if (name && name !== 'vol') {
      flag = `${code}_${name}`;
      realtimeForType = realtime.index[code][name] -= 1;
    } else if (!name) {
      flag = code;
      realtimeForType = realtime.tick[code] -= 1;
    }
    if (realtimeForType < 1 && codeInLoop[flag]) {
      http.loop.remove(...codeInLoop[flag]);
      delete codeInLoop[flag];
    }
  } else if (type === 'tenDaystick') {
    if (name && name !== 'profit') {
      flag = `${code}_${name}`;
      realtimeForType = realtime.index[code][name] -= 1;
    } else if (!name) {
      flag = code;
      realtimeForType = realtime.tick[code] -= 1;
    }
    if (realtimeForType < 1 && codeInLoop[flag]) {
      http.loop.remove(...codeInLoop[flag]);
      delete codeInLoop[flag];
    }
  }
};

/**
 * 接手主线程 的消息：
 * 在model/memory/serisMemory中SeriesStorage的构造函数中调用
 *
 */
self.addEventListener('message', (e) => {
  const data = e.data;
  const cancel = data.cancel;
  const code = data.code;
  const type = data.type;
  const name = data.name;
  if (cancel) {
    cancelRequest(code, type, name);
    return;
  }
  switch (type) {
    case 'k':
      if (name && name !== 'vol') {
        kIndexLine(code, name);
      } else if (!name) {
        kLine(code);
      }
      break;
    case 'tick':
      if (name === 'fiveDaysTick') {
        fiveDaysTickLine(code);
      } else if (name && name == 'qjwt') {
        tickIndexMergeTwoType(code, name, 'wtb', 'wts');
        return;
      } else if (name && name !== 'vol') {
        tickIndexLine(code, name);
      } else if (!name) {
        tickLine(code);
      }
      break;
    case 'tenDaysTick':
      if (name && name !== 'marker' && name !== 'profit') {
        tenDaysTickIndex(code, name);
      } else if (!name) {
        tenDaysTickLine(code);
      }
      break;
    case 'http':
      http.setCommonParam(data.param);
      break;
    default:
      break;
  }
});

setInterval(() => {
  if (!baseUtil.isEmptyObject(throttle)) {
    self.postMessage(throttle);
    throttle = {};
  }
}, 100);
