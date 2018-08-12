import vue from 'vue';

import {
  MY_STOCK_UPDATE,
  MY_STOCK_INIT,
  STOCK_NEWS_UPDATE,
  MY_STOCK_REORDER,
} from './mutationType';
import {
  baseUtil,
} from '../../../../../util';

const checkItem = (item) => {
  let isPass = true;
  const props = ['info', 'foxxcode', 'stock_index', 'stock_name', 'is_del'];
  baseUtil.each(item, (value, prop) => {
    const isExist = props.indexOf(prop) > -1;
    isPass = isPass && isExist;
  });
  return isPass;
};

export default {
  /**
   * 自选股初始化
   * @param state
   * @param payload
   */
  [MY_STOCK_INIT](state, payload) {
    vue.set(state, 'myStock', payload);
  },
  /**
   * 自选股数据更新
   * @param state
   * @param payload
   */
  [MY_STOCK_UPDATE](state, payload) {
    const type = payload.type; // 操作类型[add,remove,update]
    const item = payload.item;
    const myStockList = state.myStock;
    const myStockCopy = baseUtil.copy(myStockList);

    if (!checkItem(item)) {
      return;
    }

    switch (type) {
      case 'add': {
        let pass = true;
        baseUtil.each(myStockCopy, (stock) => {
          if (stock.foxxcode === item.foxxcode) {
            pass = false;
          }
        });
        if (!pass) {
          return;
        }
        myStockList.unshift(item);
        break;
      }
      case 'remove': {
        const removeCode = item.foxxcode;
        let removeIndex;
        baseUtil.each(myStockList, (stock, index) => {
          const foxxCode = stock.foxxcode;
          if (foxxCode === removeCode) {
            removeIndex = index;
          }
        });
        myStockList.splice(removeIndex, 1);
        break;
      }
      case 'update': {
        baseUtil.each(myStockList, (stock) => {
          const foxxCode = stock.foxxcode;
          if (foxxCode === item.foxxcode) {
            baseUtil.merge(stock, item, true);
          }
        });
        break;
      }
      default:
        break;
    }
  },
  /**
   * 自选股顺序改变
   * @param state
   * @param payload
   */
  [MY_STOCK_REORDER](state, payload) {
    const myStockList = state.myStock;
    myStockList.splice(0, myStockList.length);
    baseUtil.each(payload, (item) => {
      myStockList.push(item);
    });
  },
  /**
   * 自选股新闻更新
   * @param state
   * @param payload
   */
  [STOCK_NEWS_UPDATE](state, payload) {
    const code = payload.code;
    const news = payload.news;
    vue.set(state.stockLatestNews, code, news);
  },
};
