import mutations from './mutations/index';
import getters from './getters/index';
import actions from './actions/index';

const state = {
  baseNews: {},
  stkNews: {},
};

export default {
  state,
  mutations,
  getters,
  actions,
};
