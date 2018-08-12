import vue from 'vue';

import {
  SERVICE_INFO_UPDATE,
  NEW_ITEMS_UPDATE,
  SERVICE_INDEX_UPDATE,
} from './mutationType';


/** @namespace payload.systemCode */
export default {
  [SERVICE_INFO_UPDATE](state, payload) {
    const systemCode = payload.systemCode;
    const data = payload.data;
    vue.set(state.serviceInfo, systemCode, data);
  },
  [NEW_ITEMS_UPDATE](state, payload) {
    const systemCode = payload.systemCode;
    const data = payload.data;
    vue.set(state.newItems, systemCode, data);
  },
  [SERVICE_INDEX_UPDATE](state, data) {
    vue.set(state, 'serviceIndex', data);
  },
};
