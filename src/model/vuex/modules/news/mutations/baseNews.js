import vue from 'vue';

import {
  NEWS_ID_ADD,
} from './mutationType';


/** @namespace payload.systemCode */
export default {
  [NEWS_ID_ADD](state, payload) {
    const newsId = payload.id;
    const data = payload.data;
    vue.set(state.baseNews, newsId, data);
  },
};
