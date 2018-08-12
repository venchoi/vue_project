import {
  UPDATE_NOTICE_DATA,
  HIDE_NOTICE,

  UPDATE_NEWS_DATA,
  HIDE_NEWS,

  HIDE_LOGIN_SUIT,
  SHOW_LOGIN_TAB,
  SHOW_REGISTER_TAB,
  SHOW_FORGET_PWD_TAB,

  SHOW_CHAT,
  HIDE_CHAT,

  SHOW_SEARCHVIEW,
  HIDE_SEARCHVIEW,
} from './actionType';
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
} from '../mutations/mutationType';

export default {
  [UPDATE_NOTICE_DATA]({ commit }, payload) {
    commit(NOTICE_CONTENT_UPDATE, payload.content);
    commit(NOTICE_STATUS_UPDATE, payload.status);
    commit(NOTICE_SHOW);

    const closeTime = payload.delay || 1500;
    setTimeout(() => {
      commit(NOTICE_HIDE);
    }, closeTime);
  },
  [HIDE_NOTICE]({ commit }) {
    commit(HIDE_NOTICE);
  },

  [UPDATE_NEWS_DATA]({ commit }, payload) {
    commit(NEWS_DATA_UPDATE, payload);
    commit(NEWS_SHOW);
  },
  [HIDE_NEWS]({ commit }) {
    commit(NEWS_HIDE);
  },

  [HIDE_LOGIN_SUIT]({ commit }) {
    commit(LOGIN_TAB_HIDE);
    commit(REGISTER_TAB_HIDE);
    commit(FORGET_PWD_TAB_HIDE);
  },
  [SHOW_LOGIN_TAB]({ commit }) {
    commit(LOGIN_TAB_SHOW);
    commit(REGISTER_TAB_HIDE);
    commit(FORGET_PWD_TAB_HIDE);
  },
  [SHOW_REGISTER_TAB]({ commit }) {
    commit(LOGIN_TAB_HIDE);
    commit(REGISTER_TAB_SHOW);
    commit(FORGET_PWD_TAB_HIDE);
  },
  [SHOW_FORGET_PWD_TAB]({ commit }) {
    commit(LOGIN_TAB_HIDE);
    commit(REGISTER_TAB_HIDE);
    commit(FORGET_PWD_TAB_SHOW);
  },

  [HIDE_CHAT]({ commit }) {
    commit(CHAT_HIDE);
  },
  [SHOW_CHAT]({ commit }) {
    commit(CHAT_SHOW);
  },

  [SHOW_SEARCHVIEW]({ commit }) {
    commit(SEARCHVIEW_SHOW);
  },
  [HIDE_SEARCHVIEW]({ commit }) {
    commit(SEARCHVIEW_HIDE);
  },
};
