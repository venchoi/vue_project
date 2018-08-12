import Vue from 'vue';
import Vuex from 'vuex';
// import createLogger from 'vuex/dist/logger';
import state from './state/index';
import getters from './getters/index';
import mutations from './mutations/index';
import actions from './actions/index';
import modules from './modules/index';
import liveMarkData from './plugins/liveMarkData';
import serviceGetter from './plugins/servicePushHandler';
import livePusher from './plugins/livePushHandler';

Vue.use(Vuex);


const plugins = () => {
  const p = [liveMarkData(), serviceGetter(), livePusher()];
  if (process.env.NODE_ENV !== 'production') {
    // p.push(createLogger());
  }
  return p;
};

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
  modules,
  plugins: plugins(),
});
