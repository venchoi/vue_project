<template>
  <footer id="footer">
    <div class="index">
      <div class="item" v-for="item in indexList" v-if="indexInfo[item.code]" @click="codeClick(item.code)">
        <span>{{item.name}}</span>
        <stock-icon :value="indexInfo[item.code].close" :boundary="indexInfo[item.code].preClose"></stock-icon>
        <stock-details :value="indexInfo[item.code].close" :boundary="indexInfo[item.code].preClose" modal="normal" fixed="2" :format="false"></stock-details>

        <stock-details :value="upon(item.code)" :boundary="0"  modal="normal" :prefix="true"></stock-details>
        <stock-details :value="indexInfo[item.code].close" :boundary="indexInfo[item.code].preClose" :showValue="`${ratio(item.code)}%`"  modal="normal"></stock-details>
      </div>
    </div>
    <div class="options">
      <div class="button" @click="loginClick" v-if="!isLogin">
        <iconfont iconName="user" size="16px"></iconfont>
      </div>
      <div class="button" v-if="false">
        <span @click="networkClick">
          <iconfont iconName="wifi" size="16px"></iconfont>
        </span>
        <div class="panel-container">
          <network :isShow="networkShow"></network>
        </div>
      </div>
    </div>
    <div class="user">
      <span>
        <img class="usericon" @click="showUserInfo" src="../../assets/image/user.png" >
      </span>
      <div class="panel-container">
        <user-info ref="userbox"></user-info>
      </div>
    </div>
    <div class="chat" v-if="hasChat">
      <span @click="showChat()">
        <img src="../../assets/image/consult.png" class="chatIcon">
      </span>
    </div>
    <div class="searcher">
      <input ref='searcherInput'placeholder="搜索" v-model="searchKeys" @keyup="keyup"/>
      <span @click="showSearch">
        <iconfont class="searchIcon" iconName="search" size="16px"></iconfont>
      </span>
      <div class="panel-container">
        <search @update="update" ref="search"></search>
      </div>
    </div>
  </footer>
</template>

<script>
  import {
    mapGetters,
    mapState,
  } from 'vuex';

  import {
    baseUtil,
  } from '../../util';
  import {
    bus,
    EVENT,
  } from '../../plugins/eventBus';
  import StockDetails from '../../components/stockBase/StockDetails';
  import StockIcon from '../../components/stockBase/StockIcon';
  import Iconfont from '../../components/base/IconFont';
  import Network from './Network';
  import Search from './Search';
  import UserInfo from './UserInfo';
  import {
    actions,
    stockActions,
    userActions,
  } from '../../model/vuex/actionsType';

  export default {
    name: 'footer',
    data() {
      return {
        indexList: [{
          code: '399006.SZ',
          name: '创业板指',
        }, {
          code: '399005.SZ',
          name: '中小板指',
        }, {
          code: '399001.SZ',
          name: '深证成指',
        }, {
          code: '000001.SH',
          name: '上证指数',
        }],
        searchKeys: '',
      };
    },
    created() {
      const initList = this.indexList;
      bus.$on(EVENT.SHOW_SEARCH, () => {
        this.showSearch();
      });
      baseUtil.each(initList, (item) => {
        this.$store.dispatch(stockActions.ADD_STOCK_LIST, item.code);
      });
      this.$store.dispatch(userActions.GET_INFO);
    },
    computed: {
      ...mapGetters({
        indexInfo: 'getIndexInfo',
        isLogin: 'isLogined',
        canSearchShow: 'canSearchShow',
      }),
      ...mapState({
        /**
         * 获取state里的菜单列表判断是否有问股选项，有的话则显示问股功能
         * */
        hasChat(state) {
          const menu = state.menuConfig;
          let chatConfig = false;
          baseUtil.each(menu, (item) => {
            if (item.system_code === 'consult') {
              chatConfig = true;
            }
          });
          return chatConfig;
        },
      }),
    },
    components: {
      Iconfont,
      StockIcon,
      StockDetails,
      Network,
      Search,
      UserInfo,
    },
    watch: {
      canSearchShow() {
        this.clear();
      },
      searchKeys() {
        const search = this.$refs.search;
        if (this.canSearchShow) {
          search.updateWords(this.searchKeys);
          if (search.isShow) {
            search.show();
          }
        }
      },
    },
    methods: {
      networkClick() {
        this.networkShow = !this.networkShow;
      },
      loginClick() {
        this.$store.dispatch(actions.SHOW_LOGIN_TAB);
      },
      upon(code) {
        if (!this.indexInfo) {
          return 0;
        }
        const close = this.indexInfo[code].close;
        const preClose = this.indexInfo[code].preClose;
        if (!close || !preClose) {
          return 0;
        }
        return (close - preClose).toFixed(2);
      },
      ratio(code) {
        if (!this.indexInfo) {
          return 0;
        }
        const close = this.indexInfo[code].close;
        const preClose = this.indexInfo[code].preClose;
        if (!close || preClose === '0') {
          return 0;
        }
        return (((close - preClose) * 100) / preClose).toFixed(2);
      },
      codeClick(code) {
        this.$router.push(`/stock/${code}`);
      },
      update(keys) {
        if (this.canSearchShow) {
          this.searchKeys = keys;
        } else {
          this.searchKeys = '';
        }
      },
      clear() {
        this.searchKeys = '';
      },
      /**
       * 这个功能砍掉了，改为直接加全局mask层，点击任意地方消失；
       * 希望代码保留，如果需求更改可以直接用。
       * 点击搜索按钮：搜索框显示隐藏控制由Search.searchShow控制。
       * 如果搜索框此时打开，则关闭搜索框；
       * 如果搜索框此时关闭，且用户框未打开，而打开搜索框；
       * 如果搜索框此时关闭，且用户框打开，则先关闭用户框，再打开搜索框。
       */
      showSearch() {
        const search = this.$refs.search;
        if (!search.searchShow) {
          const userbox = this.$refs.userbox;
          userbox.close();
          search.show();
        } else {
          search.close();
        }
      },
      /**
       * 这个功能砍掉了，改为直接加全局mask层，点击任意地方消失；
       * 希望代码保留，如果需求更改可以直接用。
       * 点击用户按钮：搜索框显示隐藏控制由UserInfo.userShow控制。
       * 如果用户框此时打开，则关闭用户框；
       * 如果用户框此时关闭，且搜索框未打开，而打开用户框；
       * 如果用户框此时关闭，且搜索框打开，则先关闭搜索框，再打开用户框。
       */
      showUserInfo() {
        const userbox = this.$refs.userbox;
        if (!userbox.userShow) {
          const search = this.$refs.search;
          search.close();
          userbox.show();
        } else {
          userbox.close();
        }
      },
      keyup(e) {
        const key = e.key;
        // 当按下退格键时，也要阻止调用相同事件的其他监听器，否则会导致按一次退格键，删除两个字符的情况
        if (key.length === 1 || key === 'Backspace') {
          e.stopImmediatePropagation();
        }
      },
      // 点击问股，问股模态框显示
      showChat() {
        if (this.hasChat) {
          this.$store.dispatch(actions.SHOW_CHAT);
        }
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import "../../assets/sass/static";
  /*search弹窗的z-index=102;userInfo弹窗的z-index=103;
  userInfo的mask层z-index=101；
  因为在股票详情页，有一个问号的小图标tooltip,其z-index=100;
  sidebar的z-index=999*/
  #footer {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: $footerHeight;
    /*z-index: 1000;*/
    padding-left: $sideMenuWidth + 5px;
    padding-right: 15px;
    line-height: $footerHeight;
    min-width: 1280px;
    background-color: $black;
    user-select: none;
  @extend %cf;
  .index{
    float: left;
    padding-left: 15px;
  .item{
    display: inline-block;
    cursor: pointer;
  >*{
     margin-right: 3px;
   }
  }
  .item + .item{
    margin-left: 25px;
  }
  }
  .options,
  .user,
  .searcher,
  .chat{
    float: right;
    margin-right: 14px;
  }
  .searcher{
    height: 100%;
    input{
      width: 100px;
      height: 100%;
      padding: 0 5px;
      outline: none;
      border: none;
      background: $G5;
      color: #fff;
      margin-right: 5px;
    &:focus{
       outline: none;
       border: none;
     }
    }
  }
  .options{
    padding: 0 5px;
    margin-right: 5px;
    .button{
      display: inline-block;
      margin-left: 10px;
    }
    .panel-container{
      position: absolute;
      bottom: 100%;
      right: 0px;
      color: #000;
    }
  }
  .searcher{
    position: relative;
    .panel-container{
      position: absolute;
      z-index: 102;
      bottom: 100%;
      right: -60px;
      color: #000;
    }
  }
  .chat {
      .chatIcon {
        margin-bottom: -5px;
      }
      &:hover {
        cursor: pointer;
      }
    }
  .user{
    .panel-container{
      position: absolute;
      z-index: 103;
      bottom: 100%;
      right: 0px;
      color: #000;
    }
    .usericon {
      margin-bottom: -2px;
    }
  }
  .usericon:hover {
    cursor: pointer;
  }
  }
</style>
