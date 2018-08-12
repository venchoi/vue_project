import Vue from 'vue';
import Router from 'vue-router';
import test from '../components/test';
import tabletest from '../components/tableTest';
import Stock from '../views/stocks/Stock';
import MyStock from '../views/mystocks/MyStock';
import Market from '../views/market/Market';
import Reference from '../views/reference/Reference';
import Service from '../views/service/Service';
import ServiceDetail from '../views/serviceDetail/ServiceDetail';
import FundDetail from '../views/fundDetail/FundDetail';
import LoginSuit from '../views/loginView/LoginSuit';
import Live from '../views/live/Live';
import Premium from '../views/premium/Premium';
import Subject from '../views/subject/Subject';
import Tendency from '../views/tendency/Tendency';
import Trading from '../views/trading/Trading';
import Video from '../views/videoEdu/Video';

Vue.use(Router);

const env = process.env.NODE_ENV;
const routerConfig = {
  routes: [{
    path: '/login',
    name: 'login',
    component: LoginSuit,
  },
  {
    path: '/',
    name: 'index',
    component: Service,
  },
  {
    path: '/stock/:code',
    name: 'stock',
    component: Stock,
  },
  {
    path: '/stock/:code/:type',
    name: 'stock',
    component: Stock,
  },
  {
    path: '/mystock',
    name: 'mystock',
    component: MyStock,
  },
  {
    path: '/market',
    name: 'market',
    component: Market,
  },
  {
    path: '/reference',
    name: 'reference',
    component: Reference,
  },
  {
    path: '/service',
    name: 'service',
    component: Service,
  },
  {
    path: '/service-detail/:type',
    name: 'service-detail',
    component: ServiceDetail,
  },
  {
    path: '/fund-detail/:type',
    name: 'fund-detail',
    component: FundDetail,
  },
  {
    path: '/live',
    name: 'live',
    component: Live,
  },
  {
    path: '/premium',
    name: 'premium',
    component: Premium,
  },
  {
    path: '/subject',
    name: 'subject',
    component: Subject,
  },
  {
    path: '/tendency',
    name: 'tendency',
    component: Tendency,
  },
  {
    path: '/trading',
    name: 'trading',
    component: Trading,
  },
  {
    path: '/video_edu',
    name: 'video',
    component: Video,
  },
  ],
};
/**
* 跳转测试页面
*/
if (env === 'development') {
  routerConfig.routes.push({
    path: '/test',
    name: 'test',
    component: test,
  });
  routerConfig.routes.push({
    path: '/tabletest',
    name: 'tabletest',
    component: tabletest,
  });
}
const router = new Router(routerConfig);

export default router;
