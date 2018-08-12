import vue from 'vue';

import {
  TOKEN_UPDATE,
  UID_UPDATE,
  INFO_UPDATE,
  USER_LOGOUT,
} from './mutationType';


export default {
  [TOKEN_UPDATE](state, token) {
    vue.set(state, 'token', token);
  },
  [UID_UPDATE](state, uid) {
    vue.set(state, 'uid', uid);
  },
  [INFO_UPDATE](state, info) {
    vue.set(state, 'userInfo', info);
  },
  [USER_LOGOUT](state) {
    vue.set(state, 'token', null);
    vue.set(state, 'uid', null);
  },
};
