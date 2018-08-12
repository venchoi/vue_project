// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import evoChart from 'evoChart';
import axios from 'axios';
import VueAxios from 'vue-axios';

import {
  actions,
  userActions,
} from './model/vuex/actionsType';
import store from './model/vuex';
import router from './router';
import App from './App';
import http from './plugins/http/http';
import globalResource from './plugins/globalResource';
import httpPlugin from './plugins/http/httpPlugin';
import html5Api from './plugins/base/html5Api';
import {
  columnSocket,
} from './plugins/YCJWebSocket/YCJWebSocket';

const env = process.env.NODE_ENV;
Vue.config.productionTip = false;
Vue.config.devtools = true;

Vue.use(VueAxios, axios);
Vue.use(globalResource);
Vue.use(httpPlugin);
Vue.use(html5Api);

if (env === 'production') {
  evoChart.inPub();
  Vue.config.devtools = false;
}

http.setErrorHandler((dataPacket) => {
  const errorCode = dataPacket.error_code;
  switch (errorCode) {
    case '201':
      break;
    case '301':
      store.dispatch(actions.UPDATE_NOTICE_DATA, {
        status: 'fail',
        content: dataPacket.msg,
        delay: 5000,
      });
      store.dispatch(userActions.CLEAR_BASE_USER_INDEX);
      columnSocket.closeWs();
      break;
    case '303':
      store.dispatch(actions.UPDATE_NOTICE_DATA, {
        status: 'fail',
        content: dataPacket.msg,
        delay: 5000,
      });
      store.dispatch(userActions.CLEAR_BASE_USER_INDEX);
      columnSocket.closeWs();
      break;
    default:
      break;
  }
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {
    App,
  },
});
