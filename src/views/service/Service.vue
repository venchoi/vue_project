<template>
  <div class="choice-wrap">
    <div class="top">
      <!--目前菜单排序写死，0股票池，1基金，且只有2个-->
      <div class="fl">
        <top-menu class="fl" :titleList="menuList" v-on:clickMenu="openContent($event)"></top-menu>
      </div>
      <div class="tip fr"><span>*本页面内容仅供参考，据此操作风险自负</span></div>
    </div>
    <div class="content">
      <div class="left">
        <!--传入菜单id，显示股票池或者基金，子组件通过getter拿到对应数据-->
        <module-list :currentListId="currentListId"></module-list>
      </div>
      <!--右侧大盘分时图-->
      <div class="right">
        <right></right>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    mapGetters,
  } from 'vuex';
  import TopMenu from './TopMenu';
  import ModuleList from './ModuleList';
  import Right from './RightExponent';
  import BaseUnit from '../../util/baseUtil';

  export default {
    name: 'Service',
    data() {
      return {
        dataList: [],
        menuList: [],
        stockList: [],
        fundsList: [],
        currentListId: 0,
      };
    },
    props: {
    },
    components: {
      TopMenu,
      ModuleList,
      Right,
    },
    computed: {
      ...mapGetters([
        'getServiceIndex',
      ]),
    },
    methods: {
      getMenuList() {
        const vm = this;
        if (vm.menuList.length !== 0) {
          return;
        }
        const list = vm.dataList;
        if (!list) {
          return;
        }
        /**
         * 由于后端对服务没有顺序排列，前后端约定，只有一个股票池和一个基金池
         * 且股票池排在前面，基金池排在后面。
         */
        BaseUnit.each(list, (item) => {
          if (item.system_code === 'stockpool') {
            vm.menuList.unshift({ title: item.navigation, id: 0 });
          } else {
            vm.menuList.push({ title: item.navigation, id: 1 });
          }
        });
      },
      /**
       * 应用监听websocket更新首页数据到vuex
       * 当有变化时自动更新
       * 这个组件用getter拿到数据
       */
      getPageData() {
        const vm = this;
        vm.dataList = vm.getServiceIndex;
        vm.getMenuList();
      },
      openContent(event) {
        this.currentListId = event.id;
      },
    },
    watch: {
      getServiceIndex() {
        this.getPageData();
      },
    },
    created() {
      this.getPageData();
    },
  };
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/sass/static";
  *{
    padding: 0;
    margin: 0;
  }
  .fr {
    float: right;
  }
  .fl {
    float: left;
  }
  .clear {*zoom: 1;}
  .clear:after {
    content: '';
    display: block;
    width:100%;
    height:0;
    clear: both;
  }
  .choice-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: $G3;
    .top {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 54px;
      border: 1px solid $G3;
      .tip {
        width: 250px;
        height: 54px; /* 与tag同高（tag的border的高度） */
        padding: 32px 20px 10px 0;
        span {
          letter-spacing: 0;
          color: #838383;
        }
      }
    }
    .content {
      position: absolute;
      top: 54px;
      left: 0;
      right: 0;
      bottom: 0;
      .left {
        position: relative;
        width:66%;
        height: 100%;
        float: left;
        background: #242424;
        overflow: hidden;
      }
      .right {
        position: relative;
        width:33%;
        height: 100%;
        float: right;
      }
    }
  }
</style>
