import mutations from './mutations/index';
import getters from './getters/index';
import actions from './actions/index';

const state = {

  serviceIndex: {},

  serviceInfo: {
      // [systemcode]: {
      //   today: [],
      //   history: [],
      // },
  },

  newItems: {
    // [systemcode]: [{},{},{}],
  },

};

export default {
  state,
  mutations,
  getters,
  actions,
};
