import mutations from './mutations/index';
import getters from './getters/index';
import actions from './actions/index';

const state = {

  token: null,

  uid: null,

  userInfo: {
  },

  myStock: [],

  /**
   * 自选股最新新闻
   */
  stockLatestNews: {},

};


export default {
  state,
  mutations,
  getters,
  actions,
};
