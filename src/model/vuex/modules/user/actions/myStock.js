import {
  ADD_MY_STOCK,
  REMOVE_MY_STOCK,
  UPDATE_MY_STOCK,
  GET_MY_STOCK,
  GET_STOCK_NEWS,
  REORDER_MY_STOCK,
} from './actionType';

import {
  MY_STOCK_UPDATE,
  MY_STOCK_INIT,
  STOCK_NEWS_UPDATE,
  MY_STOCK_REORDER,
} from '../mutations/mutationType';
import http from '../../../../../plugins/http/http';
import {
  ycjUtil,
  baseUtil,
  logger,
} from '../../../../../util';

const apiList = http.apiList;
/**
 * 创建MyStock元素格式
 * @param name
 * @param info
 * @param code
 * @param stockIndex
 * @param isDel
 * @returns {{info: string, foxxcode: *, stock_index: string, stock_name: string, is_del: string}}
 */
const createMyStockItem = ({ name = '----', info = '', code, stockIndex = '0', isDel = '0' }) => {
  const item = {
    info,
    foxxcode: code,
    stock_index: stockIndex,
    stock_name: name,
    is_del: isDel,
  };
  return item;
};
/**
 * 发送添加或者删除请求
 * @param state
 * @param item
 * @param success - 成功后的回调函数
 */
const synRequest = (state, item, success) => {
  const token = state.token;
  const uid = state.uid;

  http.api[apiList.EDIT_MY_STOCK]({
    param: {
      token,
      uid,
      group_id: 0,
      data_list: [item],
    },
    success,
  });
};
/**
 * 判断股票是否在自选列表中
 * @param  {[type]} stockList - 自选股票列表
 * @param  {[type]} foxxcode  - 股票代码
 * @return {[type]} - 如不在则返回false，如存在则返回列表中对应项。
 */
const isInMyStock = (stockList, foxxcode) => {
  let isExist = false;
  baseUtil.each(stockList, (item) => {
    if (foxxcode === item.foxxcode) {
      isExist = baseUtil.copy(item);
    }
  });
  return isExist;
};

export default {
  /**
   * 获取股票列表
   * @param state
   * @param dispatch
   * @param commit
   */
  [GET_MY_STOCK]({ state, dispatch, commit }) {
    const token = state.token;
    const uid = state.uid;
    http.api[apiList.GET_MY_STOCK]({
      param: {
        token,
        uid,
      },
      success(data) {
        commit(MY_STOCK_INIT, data.data_list);
        dispatch(GET_STOCK_NEWS);
        baseUtil.each(data.data_list, (item) => {
          const listItem = item;
          listItem.is_del = '0';
        });
      },
    });
  },
  /**
   * 添加自选股
   * @param state
   * @param commit
   * @param payload - 股票信息
   */
  [ADD_MY_STOCK]({ state, commit }, payload) {
    let startIndex;
    const code = payload.code;
    const isExist = isInMyStock(state.myStock, code);
    if (state.myStock.length > 0) {
      startIndex = parseInt(state.myStock[0].stock_index, 10) + 1;
    } else {
      startIndex = 100;
    }
    const item = createMyStockItem({
      ...payload,
      stockIndex: startIndex,
    });
    if (isExist) {
      return;
    }
    const param = {
      type: 'add',
      item,
    };
    synRequest(state, item, () => commit(MY_STOCK_UPDATE, param));
  },
  /**
   * 删除自选股
   * @param state
   * @param commit
   * @param code - 股票代码
   */
  [REMOVE_MY_STOCK]({ state, commit }, code) {
    if (!ycjUtil.checkCode(code)) {
      logger.error('code need corrected,in action - myStock');
      return;
    }
    const myStockList = state.myStock;
    const item = isInMyStock(myStockList, code);
    item.is_del = '1';
    if (item) {
      synRequest(state, item, () => commit(MY_STOCK_UPDATE, {
        type: 'remove',
        item,
      }));
    }
  },
  /**
   * 自选股列表重排序
   * @param state
   * @param commit
   * @param reorderInfo{ dragStart, dragEnd }
   *      - 重排序信息，是一个对象，dragStart为拖拽开始项，dragEnd 为拖拽结束位置
   */
  [REORDER_MY_STOCK]({ state, commit }, reorderInfo) {
    const dragStart = reorderInfo.dragStart; //简化之后的调用
    const dragEnd = reorderInfo.dragEnd;
    const vm = state;
    const newStockList = baseUtil.copy(vm.myStock); // 赋值myStock，进行重排序操作时处理的数组
    const endElementCode = vm.myStock[dragEnd].foxxcode; // 想要放置的位置此时元素的foxxcode
    const temp = newStockList.splice(dragStart, 1); // 从列表中删除拖拽项,将数据保存在temp中
    let endIndex = -1; // 拖拽后数据的新位置，即拖拽数据想要插入的位置
    /**
     * 遍历列表找到要放置位置的Index:因为删除拖拽项会造成列表index重排
     * 所以根据endElementCode找到真正的放置位置，再插入
     * 目前进行的操作是插入到选定数据之前，其实并不是完整的拖拽操作，之后会进行优化
     */
    baseUtil.each(newStockList, (item, index) => {
      if (endElementCode === item.foxxcode) {
        endIndex = index;
      }
    });
    newStockList.splice(endIndex, 0, temp[0]); // 将拖拽数据插入
    /**
     * ---下面获取重排序影响部分----------------
     * 这部分是与后台的交互，按照后台的逻辑对数据进行了处理
     * 后台希望获得重排序变化部分（与前端排序相反），和排序标志：变化部分中值最小的stock_index；
     * 因为前端在重排序后只向后端传输了重排序部分，并没有重新获取后台mystock数据，
     * 所以为了保证之后的操作依然正确进行，需要在前端对数据进行同步处理。
     * 后台获取数据后进行的处理是：将重排序部分所有item的stock_index根据start进行修改；
     * 按前端显示顺序来说是将变化部分从数组后部往前，依次设为start,start+1...
     * 注意1：如果后端改变处理方法，前端处理也要相应改变，以保住数据同步
     * 注意2：现在本地和后台数据处理时异步的，不是等待后台处理完成再本地写入的，如果问题请注意
     * */
    let postStartItem = 0; // 传给后台start所依据的item的Index
    let indexStart = -1; // 重排序部分开始index
    let indexEnd = -1; // 重排序部分结束index
    if (dragStart < dragEnd) {
      indexStart = dragStart;
      indexEnd = endIndex;
      postStartItem = endIndex - 1;
    } else {
      indexStart = endIndex;
      indexEnd = dragStart;
      postStartItem = endIndex;
    }
    const start = newStockList[postStartItem].stock_index; // 传给后台的start
    let postList = []; // 传给后台的u_list
    let length = -1; // 变化部分的长度
    let i = -1; // 循环使用的
    for(i = indexStart,length = indexEnd - indexStart; i <= indexEnd,length >= 0; i++,length-- ) {
      postList.unshift(newStockList[i].foxxcode);
      newStockList[i].stock_index = (parseInt(start) + length).toString();
    }
    // 重排序之后因为不是直接从后台拉数据，所以要让本地的处理逻辑和后台同步
    const token = state.token;
    const uid = state.uid;
    commit(MY_STOCK_REORDER, newStockList); // 提交改写myStock的mutation
    // 现在本地和后台数据处理时异步的，不是等待后台处理完成再本地写入的
    http.api[apiList.RECORD_SORT]({
      param: {
        uid,
        token,
        "type": "mystock",
        "u_list": postList,   //记录唯一标识序列,
        "start": start,  //排序标识；最小的stock_index值
      },
    });
  },
  /**
   * 更新股票列表
   * @param state
   * @param commit
   * @param payload
   */
  [UPDATE_MY_STOCK]({ state, commit }, payload) {
    const code = payload.code;
    const param = baseUtil.copy(payload);
    delete param.code;
    if (!ycjUtil.checkCode(code)) {
      logger.error('code need corrected,in action - myStock');
      return;
    }
    const myStockList = state.myStock;
    const item = isInMyStock(myStockList, code);
    baseUtil.merge(item, param, true);

    if (item) {
      synRequest(state, item, () => commit(MY_STOCK_UPDATE, {
        type: 'update',
        item,
      }));
    }
  },
  /**
   * 获取股票新闻
   * @param state
   * @param commit
   */
  [GET_STOCK_NEWS]({ state, commit }) {
    const stockList = [];
    baseUtil.each(state.myStock, (stock) => {
      stockList.push(stock.foxxcode);
    });
    http.api[apiList.GET_MY_STOCK_NEWS]({
      param: {
        foxxcode_list: stockList,
      },
      success(data) {
        let payload;
        baseUtil.each(data, (news, code) => {
          payload = {
            code,
            news,
          };
          commit(STOCK_NEWS_UPDATE, payload);
        });
      },
    });
  },
};
