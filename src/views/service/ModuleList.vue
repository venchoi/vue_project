<template>
  <div class="module-list-wrap">
    <!--显示股票池列表，股票池列表变化，传入新数组-->
    <div class="module-list" v-if="currentListId === 0">
      <stock v-for="produ in stockList" :key="produ.system_code" :stock="produ"></stock>
    </div>
    <!--显示基金列表-->
    <div class="module-list" v-if="currentListId === 1">
      <fund v-for="fund in fundsList" :key="fund.system_code" :fund="fund"></fund>
    </div>
  </div>
</template>

<script>
  import {
    mapGetters,
  } from 'vuex';
  import Stock from './Stock';
  import Fund from './Fund';
  import { stockActions } from '../../model/vuex/actionsType';
  import YCJutil from '../../util/ycjUtil';
  import BaseUtil from '../../util/baseUtil';

  export default {
    sname: 'ModuleList',
    data() {
      return {
        stockList: [],
        fundsList: [],
        stockStateList: {},
        subscriptList: [],
      };
    },
    props: {
      currentListId: [Number, String],
    },
    components: {
      Stock,
      Fund,
    },
    computed: {
      ...mapGetters([
        'getIndexStockList',
        'getIndexFundList',
      ]),
    },
    methods: {
      getStockList() {
        const vm = this;
        vm.subscriptList = [];
        vm.fundsList = vm.getIndexFundList;
        vm.stockList = vm.getIndexStockList;
        const list = vm.stockList;
        const len = vm.stockList.length;
        for (let i = 0; i < len; i += 1) {
          const curArr = list[i].stocks;
          for (let j = 0; j < curArr.length; j += 1) {
            const code = YCJutil.formatCode(curArr[j][0]);
            vm.subscriptList.push(code);
          }
        }
        vm.sendStock(vm.subscriptList);
      },
      /**
       * @param {array} arr - 增加监听的股票id数组
       */
      sendStock(arr) {
        const vm = this;
        BaseUtil.each(arr, (item) => {
          if (!vm.stockStateList[item]) {
            vm.stockStateList[item] = 1;
            vm.$store.dispatch(stockActions.ADD_STOCK_LIST, item);
          }
        });
        if (YCJutil.isEnd()) {
          // 股市通知交易后，进行最后一次订阅，10秒后订阅取消
          setTimeout(() => {
            BaseUtil.each(arr, (item) => {
              if (!vm.stockStateList[item]) {
                vm.stockStateList[item] = 1;
                vm.$store.dispatch(stockActions.REMOVE_STOCK_LIST, item);
              }
            });
          }, 10000);
        }
      },
    },
    created() {
    },
    mounted() {
      this.getStockList();
    },
    watch: {
      getIndexStockList() {
        this.getStockList();
      },
    },
  };
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/sass/static";
  *{
    padding: 0;
    margin: 0;
  }
  .clear {*zoom: 1;}
  .clear:after {
    content: '';
    display: block;
    width:100%;
    height:0;
    clear: both;
  }
  .module-list-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    .module-list {
      position: relative;
      display: flex;
      max-height: 100%;
      overflow-y: auto;
      flex-flow: row wrap;
      justify-content: flex-start;
      align-content: flex-start;
      background: #242424;
    }
  }
</style>
