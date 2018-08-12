<template>
  <drop-panel-transition :isShow="searchShow" transition="fade-top">
    <div class="associate" v-recive-global-event="['keyup']">
      <div class="mask" @click="close"></div>
      <div class="detail-part">
        <div class="head">
          股票搜索
          <span class="close" @click="close">
          <iconfont iconName="times"></iconfont>
        </span>
        </div>
        <div class="search-input">
          <label for="search-value" class="search-label">
            <iconfont iconName="search" color="#c0c0c0"></iconfont>
          </label>
          <input type="text" id="search-value" placeholder="输入股票代码/首字母" v-model="searchWords" @keyup="keyup"　ref="searcherInput"/>
          <div class="search-clear" @click="clear">
            <iconfont iconName="times-circle" color="#c0c0c0"></iconfont>
          </div>
        </div>
        <div class="list">
          <!--<div class="loading" v-if="isLoading">-->
          <!--<iconfont iconName="spinner" size="25px"></iconfont>-->
          <!--</div>-->
          <div class="item" :class="{'active' : activeIndex === index}"  @mouseover="itemHover(index)" v-for="(item,index) in list" @click="itemClick(item)">
            <span class="name">{{item.code}}</span>
            <span class="delay">{{item.name}}</span>
          </div>
        </div>
      </div></div>
  </drop-panel-transition>
</template>

<script>
  import {
    mapGetters,
  } from 'vuex';
  import {
    actions,
  } from '../../model/vuex/actionsType';
  import DropPanelTransition from '../../components/base/DropPanel-Transition';
  import Iconfont from '../../components/base/IconFont';
  import {
    ycjUtil,
  } from '../../util';
  import http from '../../plugins/http/http';
  import {
    timerWorker,
  } from '../../worker';

  const apiList = http.apiList;

  export default {
    name: '',
    data() {
      return {
        list: [],
        ajaxData: [],
        activeIndex: 0,
        isLoading: true,
        searchWords: '',
        searchShow: false,
        event: false,
        key: false,
      };
    },
    components: {
      Iconfont,
      DropPanelTransition,
    },
    created() {
      const cache = this.$storage.read('searchCache') || [];
      if (cache.length > 0) {
        this.list = cache;
      }
      this.$on('keyup', (e) => {
        const key = e.key;
        if (this.searchShow) {
          e.preventDefault();
        }
        // 有模态框出现的时候，直接返回，不进行keyup事件处理
        if (!this.canSearchShow) {
          return;
        }
        if (key === 'Escape') {
          this.searchWords = '';
          this.searchShow = false;
        } else if (key === 'ArrowUp') {
          if (this.activeIndex > 0) {
            this.activeIndex -= 1;
          } else {
            this.activeIndex = this.list.length - 1;
          }
        } else if (key === 'ArrowDown') {
          if (this.activeIndex < this.list.length - 1) {
            this.activeIndex += 1;
          } else {
            this.activeIndex = 0;
          }
        } else if (key === 'Enter') {
          const item = this.list[this.activeIndex];
          this.itemClick(item);
        } else if (key.length === 1) {
          this.searchWords += key;
        } else if (key === 'Backspace') {
          this.searchWords = this.searchWords.substr(0, this.searchWords.length - 1);
        }
      });
      timerWorker.addEventListener(timerWorker.chanel.ZERO_ONE, () => {
        this.list = this.ajaxData;
      });
    },
    watch: {
      // 监听canSearchShow变化，如果发生变化则清空搜索栏。如canSearchShow为false则关闭搜索框。
      canSearchShow() {
        this.clear();
        if (!this.canSearchShow) {
          this.close();
        }
      },
      searchWords() {
        if (this.canSearchShow) {
          const word = this.searchWords;
          const vm = this;
          this.update();
          http.api[apiList.SEARCH_STOCK]({
            param: {
              word,
            },
            success(data) {
              if (data.length > 0) {
                vm.ajaxData = data;
              } else {
                vm.ajaxData = vm.$storage.read('searchCache');
              }
            },
          });
        }
      },
    },
    computed: {
      ...mapGetters([
        'canSearchShow', // 搜索弹窗是否可以打开
      ]),
    },
    methods: {
      itemHover(index) {
        this.activeIndex = index;
      },
      clear() {
        this.searchWords = '';
      },
      close() {
        this.clear();
        this.$store.dispatch(actions.HIDE_SEARCHVIEW);
        this.searchShow = false;
      },
      show() {
        if (!this.searchShow) {
          this.activeIndex = 0;
        }
        if (this.canSearchShow) {
          this.searchShow = true;
          this.$store.dispatch(actions.SHOW_SEARCHVIEW);
          // 当搜索框一显示，便自动对焦到搜索框。
          // 这是解决按上下键时新闻列表跟随搜索框上下滚动的问题的一个应急办法，如果找到联动滚动的原因，可删除自动对焦这条语句。
          this.$refs.searcherInput.focus();
        }
      },
      updateWords(words) {
        if (this.canSearchShow) {
          this.searchWords = words;
          if (words) {
            this.show();
          }
        }
      },
      update() {
        this.$emit('update', this.searchWords);
      },
      /*
      * 上面created函数中的keyup事件监听是在一开始创建该组件的时候监听的（全局监听）
      * 下面这个keyup函数是监听搜索panel中的input框
      * */
      keyup(e) {
        if (this.canSearchShow) {
          const key = e.key;
          // 当按下退格键时，也要阻止调用相同事件的其他监听器，否则会导致按一次退格键，删除两个字符的情况
          if (key.length === 1 || key === 'Backspace') {
            e.stopImmediatePropagation();
          }
        }
      },
      itemClick(item) {
        // 当search不能显示时，不会跳转
        if (this.canSearchShow) {
          let cache = this.$storage.read('searchCache') || [];
          this.clear();
          this.close();
          this.$router.push(`/stock/${ycjUtil.formatCode(item.code)}`);
          cache.unshift(item);
          if (cache.length > 6) {
            cache = cache.splice(0, 6);
          }
          this.$storage.application.save('searchCache', cache);
        }
      },
    },
  };
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/sass/static";
  @keyframes rotate
  {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  .associate{
    ::-webkit-scrollbar-track {
      background-color: #ebebeb;
    }
    ::-webkit-scrollbar-track:hover {
      background-color: #ebebeb;
    }
    &:after{
      content: '';
      position: relative;
      display: block;
      width: 0px;
      height: 0px;
      left: 120px;
      border-left: 5px solid transparent;
      border-right: 5px solid transparent;
      border-top: 4px solid #ebebeb;
    }
    .mask {
      position: fixed;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      background-color: transparent;
    }
    .detail-part {
      position: relative;

      .head {
        position: relative;
        text-align: center;
        background: $blue1;
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
        color: $white;
        .close {
          position: absolute;
          top: 0;
          right: 10px;
        }
      }
      .search-input {
        position: relative;
        color: #c0c0c0;
        background: #ebebeb;
        padding: 10px 20px;
        .search-label {
          position: absolute;
          padding: 0px 10px;
        }
        .search-clear {
          position: absolute;
          top: 10px;
          right: 15px;
          padding: 0px 10px;
        }
        input {
          color: #c0c0c0;
          padding-left: 25px;
          font-size: 12px;
        }
      }
      .list {
        padding: 5px 0;
        height: 205px;
        overflow-y: auto;
        color: $G5;
        background: #ebebeb;
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;
        @extend %cf;
        .loading {
          text-align: center;
          line-height: 180px;
          i {
            display: inline-block;
            animation: rotate 1s infinite linear;
          }
        }
        .item {
          height: 32px;
          cursor: pointer;
          &.active {
            background: #467fff;
            color: $white;
          }
          > span {
            float: left;
            width: 50%;
            text-align: center;
          }
        }
      }
    }
  }
</style>
