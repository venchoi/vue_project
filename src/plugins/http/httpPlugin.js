import http from './http';

const $http = {};

$http.install = function install(vue) {
  const Vue = vue;

  Vue.prototype.$ycjHttp = http;
};

export default $http;
