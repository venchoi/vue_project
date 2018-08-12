import {
  INIT_SERVICE_INDEX,
  INIT_SERVICE_DETAILS,
  UPDATE_SERVICE_DETAILS,
} from './actionType';

import {
  SERVICE_INFO_UPDATE,
  SERVICE_INDEX_UPDATE,
  NEW_ITEMS_UPDATE,
} from '../mutations/mutationType';

import http from '../../../../../plugins/http/http';
import chartHandler from '../../../../../plugins/dataHandler/chart';
import BaseUtil from '../../../../../util/baseUtil';
import YCJUtil from '../../../../../util/ycjUtil';

const apiList = http.apiList;

const getHistoryList = (pageData) => {
  const dataObj = {};
  const head = pageData.head;
  const data = pageData.history;
  dataObj.head = head;
  dataObj.data = data;
  const list = chartHandler
    .add(dataObj)
    .object('name', 'close', 'push_time', 'profit', 'date', 'grade', 'code', 'review', 'reaper_profit');
  BaseUtil.each(list, (item) => {
    const obj = item;
    obj.code = YCJUtil.formatCode(obj.code);
    obj.push_date = obj.push_time;
    // 产品要求后端传入'--'前端就显示'--'
    // obj.profit = obj.profit === '--' ? 0 : obj.profit;
    if (obj.grade === '普通') {
      obj.grade = 0;
    } else if (obj.grade === '优选') {
      obj.grade = 1;
    } else if (obj.grade === '极优') {
      obj.grade = 2;
    }
    if (!obj.close || obj.close === '') {
      obj.close = '--';
    }
  });
  return list;
};
const getTodayList = (pageData) => {
  const dataObj = {};
  const head = pageData.head;
  const data = pageData.today;
  dataObj.head = head;
  dataObj.data = data;
  const list = chartHandler
    .add(dataObj)
    .object('name', 'close', 'push_time', 'profit', 'date', 'grade', 'code', 'review', 'reaper_profit');
  BaseUtil.each(list, (item) => {
    const i = item;
    i.code = YCJUtil.formatCode(i.code);
    if (i.grade === '普通') {
      i.grade = 0;
    } else if (i.grade === '优选') {
      i.grade = 1;
    } else if (i.grade === '极优') {
      i.grade = 2;
    }
    if (!i.close || i.close === '') {
      i.close = '--';
    }
  });
  return list;
};
const getTopContent = (pageData) => {
  const result = {};
  const data = pageData;
  result.topImg = data.top.img;
  result.topName = data.top.name;
  result.topExplain = data.top.explain;
  result.topValidity = data.top.validity;
  result.topQrcode = data.top.qr_code;
  result.lowrisk_statistics = data.lowrisk_statistics;
  result.statistics_data = data.statistics_data;
  return result;
};
const getNewItem = (a, b) => {
  const obj = {};
  let content = '';
  BaseUtil.each(a, (i) => {
    const code = i.code.split('.')[0];
    obj[code] = 1;
  });
  BaseUtil.each(b, (j) => {
    const code = j.code.split('.')[0];
    if (!obj[code] && Number(j.grade) !== 0) {
      obj[code] = 1;
      content += `${j.name}、`;
    }
  });
  return content;
};
/**
 * 冒泡排序
 * @param arr[Array] - 需要进行排序的数组
 * @param type[String] - 不传默认升序，传'des'为降序
 * @param where[String] - 需要进行排序的字段，该字段必须为数字或者可以转成数字的字符串
 * @returns {Array}
 */
const maopaopaixu = (arr, type, where) => {
  const a = arr;
  // 降序排序，最小的在最前面
  if (type === 'des') {
    for (let i = 0; i < a.length - 1; i += 1) {
      for (let j = 0; j < a.length - 1 - i; j += 1) {
        if (Number(a[j][where]) > Number(a[j + 1][where])) {
          const tmp = a[j];
          a[j] = a[j + 1];
          a[j + 1] = tmp;
        }
      }
    }
  } else {
    // 升序排序，最大的在最前面
    for (let i = 0; i < a.length - 1; i += 1) {
      for (let j = 0; j < a.length - 1 - i; j += 1) {
        if (Number(a[j][where]) < Number(a[j + 1][where])) {
          const tmp = a[j];
          a[j] = a[j + 1];
          a[j + 1] = tmp;
        }
      }
    }
  }
  return a;
};
/**
 * 业务方法
 * @param arr[Array] - todayList或者historyList
 * @param where[String] - 第一个优先级的排序，这里指定是评级grade
 * @returns {Array}
 */
const dataRang = (arr, where) => {
  const list = arr;
  let topArr = [];
  let centerArr = [];
  let bottomArr = [];
  if (!where) {
    return arr;
  }
  BaseUtil.each(list, (item) => {
    if (item[where] === 0) {
      topArr.push(item);
    } else if (item[where] === 1) {
      centerArr.push(item);
    } else if (item[where] === 2) {
      bottomArr.push(item);
    }
  });
  topArr = maopaopaixu(topArr, 'add', 'push_time');
  centerArr = maopaopaixu(centerArr, 'add', 'push_time');
  bottomArr = maopaopaixu(bottomArr, 'add', 'push_time');
  const resultArr = [...topArr, ...centerArr, ...bottomArr];
  if (!resultArr || resultArr.length === 0) {
    return list;
  }
  return resultArr;
};


export default {
  /**
   * 初始化首页数据
   */
  [INIT_SERVICE_INDEX]({ commit, dispatch }, payload) {
    const complete = payload.complete;
    http.api[apiList.GET_STOCK_SERVICE_INDEX]({
      param: {},
      success(data) {
        commit(SERVICE_INDEX_UPDATE, data);
        if (typeof complete === 'function') {
          complete();
        }
      },
    });
  },
  /**
   * 刷新内页数据
   * @param {string} payload.systemCode - 内页的systemCode
   * @param {Function} payload.complete - 回调函数
   */
  [INIT_SERVICE_DETAILS]({ commit }, payload) {
    const systemCode = payload.systemCode;
    const complete = payload.complete;
    http.api[apiList.GET_STOCK_SERVICE_LIST]({
      param: {
        type: systemCode,
        is_push: 0,
      },
      success(data) {
        // todo 洗数据
        const pageData = data;
        const historyList = dataRang(getHistoryList(pageData), 'grade');
        const todayList = dataRang(getTodayList(pageData), 'grade');
        const top = getTopContent(pageData);
        const listData = {};
        listData.historyList = historyList;
        listData.todayList = todayList;
        listData.top = top;
        listData.date = pageData.date;
        commit(SERVICE_INFO_UPDATE, {
          systemCode,
          data: listData,
        });
      },
      complete() {
        if (typeof complete === 'function') {
          complete();
        }
      },
    });
  },
  /**
   * 收到服务更新的推送后，主动更新服务数据模型，这里请求添加is_push字段，正常拿数据是0，推送拿数据是1
   */
  [UPDATE_SERVICE_DETAILS]({ commit, state }, systemCode) {
    /**
     * 用于对比的myState格式
     * {
     *    systemCode0:{
     *      historyList: [],
     *      todayList: []
     *    },
     *    systemCode1:{
     *      historyList: [],
     *      todayList: []
     *    },
     *    ...
     * }
     */
    const myState = state.serviceInfo[systemCode];
    if (!myState) {
      return;
    }
    http.api[apiList.GET_STOCK_SERVICE_LIST]({
      param: {
        type: systemCode,
        is_push: 1,
      },
      success(response) {
        // todo compare with the old data
        const pageData = response;
        const name = response.top.name;
        const historyList = getHistoryList(pageData);
        const todayList = getTodayList(pageData);
        const top = getTopContent(pageData);
        const listData = {};
        listData.historyList = historyList;
        listData.todayList = todayList;
        listData.top = top;
        listData.date = pageData.date;
        // listData接口新数据，myState--->vuex旧数据
        const content = getNewItem(myState.todayList, listData.todayList);
        // and do commit update the newItems
        if (content !== '') {
          const newObj = {};
          newObj.name = name;
          newObj.content = content;
          newObj.systemCode = systemCode;
          commit(NEW_ITEMS_UPDATE, {
            systemCode,
            data: newObj,
          });
        }
        // and do commit update serviceInfo
        commit(SERVICE_INFO_UPDATE, {
          systemCode,
          data: listData,
        });
      },
    });
  },
};
