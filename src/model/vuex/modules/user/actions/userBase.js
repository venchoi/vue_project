import {
  SET_BASE_USER_INDEX,
  CLEAR_BASE_USER_INDEX,
  GET_MY_STOCK,
  GET_INFO,
  LOGOUT,
} from './actionType';

import {
  TOKEN_UPDATE,
  UID_UPDATE,
  INFO_UPDATE,
} from '../mutations/mutationType';
import {
  http,
} from '../../../../../util/index';
import {
  user,
} from '../../../../storage';

export default {
  [SET_BASE_USER_INDEX]({ dispatch, commit }, deploy) {
    const token = deploy.token;
    const uid = deploy.uid;
    commit(TOKEN_UPDATE, token);
    commit(UID_UPDATE, uid);
    dispatch(GET_MY_STOCK, deploy);
    dispatch(GET_INFO);
  },
  [CLEAR_BASE_USER_INDEX]({ commit }) {
    commit(TOKEN_UPDATE, '');
    commit(UID_UPDATE, '');
    user.clear();
  },
  [GET_INFO]({ state, commit }) {
    const token = state.token;
    const uid = state.uid;
    const apiList = http.apiList;
    http.api[apiList.GET_USER_INFO]({
      param: {
        uid,
        token,
      },
      success(data) {
        commit(INFO_UPDATE, data);
      },
    });
  },
  [LOGOUT]({ state, dispatch }) {
    const token = state.token;
    const uid = state.uid;
    const apiList = http.apiList;
    http.api[apiList.LOGOUT]({
      param: {
        uid,
        token,
      },
      success() {
        dispatch(CLEAR_BASE_USER_INDEX);
      },
    });
  },
};
