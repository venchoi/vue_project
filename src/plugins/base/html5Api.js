import logger from '../../util/logger';
import storage from './storage';
import {
  ycjVoice,
} from './audio';

const html5Api = {};

html5Api.installed = false;
html5Api.install = function install(vue) {
  const Vue = vue;
  if (!window && !window.localStorage) {
    logger.error('需要浏览器支持html5-localstorage ');
  }
  if (!window && !window.JSON) {
    logger.error('需要浏览器支持html5-JSON ');
  }
  Vue.prototype.$storage = storage;
  Vue.prototype.$ycjVoice = ycjVoice;
};

export default html5Api;
