import Vue from 'vue';

import {
  NOTICE_CONTENT_UPDATE,
  NOTICE_STATUS_UPDATE,
  NOTICE_SHOW,
  NOTICE_HIDE,

  NEWS_DATA_UPDATE,
  NEWS_SHOW,
  NEWS_HIDE,

  LOGIN_TAB_SHOW,
  LOGIN_TAB_HIDE,

  REGISTER_TAB_SHOW,
  REGISTER_TAB_HIDE,

  FORGET_PWD_TAB_SHOW,
  FORGET_PWD_TAB_HIDE,

  CHAT_SHOW,
  CHAT_HIDE,

  SEARCHVIEW_SHOW,
  SEARCHVIEW_HIDE,
} from './mutationType';


export default {
  [NOTICE_HIDE](state) {
    Vue.set(state.notice, 'isShow', false);
  },
  [NOTICE_SHOW](state) {
    Vue.set(state.notice, 'isShow', true);
  },
  [NOTICE_CONTENT_UPDATE](state, content) {
    Vue.set(state.notice, 'content', content);
  },
  [NOTICE_STATUS_UPDATE](state, status) {
    Vue.set(state.notice, 'status', status);
  },

  [NEWS_HIDE](state) {
    Vue.set(state.newsModel, 'isShow', false);
  },
  [NEWS_SHOW](state) {
    Vue.set(state.newsModel, 'isShow', true);
  },
  [NEWS_DATA_UPDATE](state, newsData) {
    Vue.set(state.newsModel, 'newsData', newsData);
  },

  [LOGIN_TAB_SHOW](state) {
    Vue.set(state.loginSuit, 'loginShow', true);
  },
  [LOGIN_TAB_HIDE](state) {
    Vue.set(state.loginSuit, 'loginShow', false);
  },

  [REGISTER_TAB_SHOW](state) {
    Vue.set(state.loginSuit, 'registerShow', true);
  },
  [REGISTER_TAB_HIDE](state) {
    Vue.set(state.loginSuit, 'registerShow', false);
  },

  [FORGET_PWD_TAB_SHOW](state) {
    Vue.set(state.loginSuit, 'forgetPwdShow', true);
  },
  [FORGET_PWD_TAB_HIDE](state) {
    Vue.set(state.loginSuit, 'forgetPwdShow', false);
  },

  [CHAT_HIDE](state) {
    Vue.set(state.chatModel, 'isShow', false);
  },
  [CHAT_SHOW](state) {
    Vue.set(state.chatModel, 'isShow', true);
  },

  [SEARCHVIEW_SHOW](state) {
    Vue.set(state.searchView, 'isShow', true);
  },
  [SEARCHVIEW_HIDE](state) {
    Vue.set(state.searchView, 'isShow', false);
  },
};
