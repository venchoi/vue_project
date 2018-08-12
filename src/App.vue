<template>
  <div id="YCJ">
    <notice></notice>
    <news-model></news-model>
    <analog-notice></analog-notice>
    <loading ref="loading" @finish="finish" v-show="isLogined"></loading>
    <div class="application" v-if="isLogined">
      <template v-if="isInit">
        <side-menu></side-menu>
        <div id="router">
          <keep-alive>
            <router-view></router-view>
          </keep-alive>
        </div>
        <app-footer></app-footer>
      </template>
      <chat-model></chat-model>
    </div>
    <login-suit v-else></login-suit>
  </div>
</template>

<script>
import {
  mapGetters,
} from 'vuex';

import SideMenu from './views/SideMenu';
import AppFooter from './views/footer/Footer';
import LoginSuit from './views/loginView/LoginSuit';

import Notice from './components/global/Notice';
import NewsModel from './components/global/NewsModel';
import Loading from './components/global/Loading';
import AnalogNotice from './components/global/AnalogNotice';
import chatModel from './views/chat/Chat';

import * as storage from './model/storage';

import {
  serviceActions,
  stockActions,
  actions,
} from './model/vuex/actionsType';
import interactionLimit from './model/vuex/plugins/interactionLimit';
import {
  base64,
  baseUtil,
} from './util';
import {
  extra,
} from './plugins/YCJWebSocket/YCJWebSocket';

import http from './plugins/http/http';

export default {
  name: 'app',
  data() {
    return {
      isInit: false,
    };
  },
  components: {
    Loading,
    SideMenu,
    AppFooter,
    LoginSuit,
    Notice,
    AnalogNotice,
    NewsModel,
    chatModel,
  },
  computed: {
    ...mapGetters([
      'isLogined',
    ]),
  },
  watch: {
    isLogined() {
      const loading = this.$refs.loading;
      if (loading && this.isLogined && !this.isInit) {
        this.init(loading);
      }
    },
  },
  methods: {
    finish() {
      this.isInit = true;
    },
    /**
     * 初始化函数
     * @param loading - loading组件对象
     */
    init(loading) {
      loading.clear();
      // storage 中涉及的 init部分
      baseUtil.each(storage, (module) => {
        loading.registerTasks((done) => {
          module.init(done);
        });
      });
      // 开启对resize的监听和取消右键事件
      loading.registerTasks((done) => {
        window.addEventListener('resize', () => {
          interactionLimit.isInteracting = true;
        });
        window.oncontextmenu = function oncontextmenu(e) {
          e.preventDefault();
        };
        done();
      });
      // 系统设置初始化，从后台获取系统信息
      loading.registerTasks((done) => {
        this.$store.dispatch(actions.GET_SYSTEM_CONFIG, {
          complete: done,
        });
      });
      // 获取选股数据
      loading.registerTasks((done) => {
        this.$store.dispatch(serviceActions.INIT_SERVICE_INDEX, {
          complete: () => {
            const serviceIndex = this.$store.state.moduleService.serviceIndex;
            baseUtil.each(serviceIndex, (item) => {
              baseUtil.each(item.list, (serviceItem) => {
                loading.synRegister(() => {
                  this.$store.dispatch(serviceActions.INIT_SERVICE_DETAILS, { // 获取选股内页数据
                    systemCode: serviceItem.system_code,
                    complete: done,
                  });
                });
              });
            });
            done();
          },
        });
      });
      /**
       * 初始化大势五日分时图交易点信息，并保存到state.moduleStock中
       */
      loading.registerTasks((done) => {
        this.$store.dispatch(stockActions.INIT_TRADE_DATA, {
          complete: done,
        });
      });
      loading.launch();
    },
  },
  mounted() {
    // 添加三方登录部分；从Cookie中获取uit和token值并写入user(location)。
    if (document.cookie) {
      const cookieData = document.cookie.split('; ');
      let cookieDetail = [];
      let userDataString = ''; // 用户信息(字符串类型)
      let userData = {}; // 用户uid/token对象
      cookieData.forEach((item, index) => {
        cookieDetail = cookieData[index].split('=');
        if (cookieDetail[0] === 'ycj_user') { // Cookie中存有用户信息数据（第三方跳转登录）
          userDataString = cookieDetail[1];
        }
      });
      if (userDataString) { // 有用户信息数据
        userDataString = decodeURIComponent(userDataString); // 解码
        userDataString = base64.decode(userDataString); // 解密
        try {
          userData = JSON.parse(userDataString); // 转换为对象
        } catch (e) {
          userData = userDataString;
        }
        const token = userData.token;
        const uid = userData.uid;
        storage.user.write({
          token,
          uid,
        }); // 写入localstorage,user
        this.$storage.application.save('autoLogin', {
          status: true,
        });
      }
    }
    // 读取本地用户信息，如果有则会跳过登录页面直接加载主页面数据
    storage.user.init(); // 如果有user（user存放是base64加密后的数据）就会将数据写入vuex
    const user = storage.user.read(); // read有解密过程
    if (!user) { // 无本地信息则跳出
      return;
    } // 有本地信息则添加user信息到HTTP请求头部
    http.setCommonParam(user);
    extra(user);
  },
};
</script>

<style  src="./assets/font/iconfont.css"></style>
<style  lang="scss">
  @import "assets/sass/common";
#YCJ{
  height: 100%;
  width: 100%;
  min-width: 1280px;
  min-height: 500px;
  font-family: "PingFang SC", "Lantinghei SC", "Microsoft YaHei", "HanHei SC", "Helvetica Neue", "Open Sans", Arial, "Hiragino Sans GB", "微软雅黑", STHeiti, "WenQuanYi Micro Hei", SimSun, sans-serif;
  color: #fff;
  *{
    box-sizing: border-box;
  }
}
  #router{
    position: absolute;
    left: $sideMenuWidth;
    right: 0;
    top:0;
    bottom: $footerHeight;
    min-width: 1280px - $sideMenuWidth;
    min-height: 500px - $footerHeight;
    margin: auto;
    background: #212121;
    * {
      user-select: none;
    }
  }
</style>
