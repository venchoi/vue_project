import {
  STOCK_ADD_IN_LIST,
  STOCK_REMOVE_IN_LIST,
  STOCK_INIT_IN_LIST,
} from './mutationType';


export default {
  [STOCK_INIT_IN_LIST](state, code) {
    state.stockList.concat(code);
  },
  [STOCK_REMOVE_IN_LIST](state, code) {
    const index = state.stockList.indexOf(code);
    state.stockList.splice(index, 1);
  },
  [STOCK_ADD_IN_LIST](state, code) {
    state.stockList.push(code);
  },
};
