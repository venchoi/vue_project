<template>
  <div id="myStock">
    <div class="main" v-if="hasMyStock">
      <div class="left">
        <my-stock-left @activeClick="changeRightCode"></my-stock-left>
      </div>
      <div class="right">
        <my-stock-right :focusCode="code"></my-stock-right>
      </div>
    </div>
    <div class="bg" v-else @click="bgClick"></div>
  </div>
</template>

<script>
  import {
    mapState,
  } from 'vuex';
  import {
    actions,
  } from '../../model/vuex/actionsType';
  import {
    bus,
    EVENT,
  } from '../../plugins/eventBus';
  import MyStockLeft from './MyStockLeft';
  import MyStockRight from './MyStockRight';
  import baseUtil from '../../util/baseUtil';

  let timer = null;
  let open = true;
  export default {
    name: 'myStock',
    data() {
      return {
        code: '', // 当前active股票代码
      };
    },
    components: {
      MyStockLeft,
      MyStockRight,
    },
    computed: {
      ...mapState({
        getMyStockList: state => baseUtil.copy(state.moduleUser.myStock),
      }),
      hasMyStock() {
        return !!this.getMyStockList && this.getMyStockList.length > 0;
      },
    },
    watch: {
      isLogined() {
        if (!this.isLogined) {
          this.$store.dispatch(actions.SHOW_LOGIN_TAB);
        }
      },
    },
    methods: {
      /**
       * 改变右侧显示
       * @param columnId - 当前行的columnID
       * @param row - 当前行的数据
       */
      changeRightCode(columnId, row) {
        /**
         *节流，每300毫秒提取一次数据。
         */
        const vm = this;
        if (open) {
          if (row) {
            vm.code = row.foxxcode;
          }
          open = false;
        }
        clearTimeout(timer);
        timer = setTimeout(() => {
          if (row) {
            vm.code = row.foxxcode;
          }
        }, 300);
      },
      /**
       * 如果没有自选股，则显示添加个股提示，点击触发搜索框
       */
      bgClick() {
        bus.$emit(EVENT.SHOW_SEARCH);
      },
    },
    created() {
      if (!this.isLogined) {
        this.$store.dispatch(actions.SHOW_LOGIN_TAB);
      }
    },
    updated() {
      if (!this.isLogined) {
        this.$store.dispatch(actions.SHOW_LOGIN_TAB);
      } else {
        this.$store.dispatch(actions.HIDE_LOGIN_SUIT);
      }
    },
    activated() {
      if (!this.isLogined) {
        this.$store.dispatch(actions.SHOW_LOGIN_TAB);
      }
    },
    destroyed() {
      this.$store.dispatch(actions.HIDE_LOGIN_SUIT);
    },
    deactivated() {
      this.$store.dispatch(actions.HIDE_LOGIN_SUIT);
    },
  };
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/sass/static";
  #myStock {
    position: relative;
    width: 100%;
    height: 100%;
    background: $background;
    .bg{
      height: 100%;
      width: 100%;
      background: url("../../assets/image/myStock.png") center no-repeat;
    }
    .left{
      position: absolute;
      top:0;
      bottom:0;
      right:445px;
      left:0;
      border-right:1px solid $G5;
    }
    .right{
      position: absolute;
      top:0;
      bottom:0;
      right:0;
      width:445px;
    }
    .empty {
      position: absolute;
      display: block;
      top: 50%;
      left: 50%;
      width: 338px;
      height: 119px;
      line-height: 119px;
      margin: -60px 0 0 -169px;
      cursor: pointer;
      font-size: 20px;
      text-align: center;
    }
  }
</style>
