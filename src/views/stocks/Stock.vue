<template>
  <div id="stock">
    <header>
      <stock-index-head :focusCode="code" v-if="isIndex"></stock-index-head>
      <stock-head :focusCode="code" v-else></stock-head>
    </header>
    <stock-index-right :focusCode="code" v-if="isIndex"></stock-index-right>
    <stock-right :focusCode="code" v-else></stock-right>
    <stock-left :focusCode="code"></stock-left>
  </div>
</template>

<script>
  import StockHead from './StockHead';
  import StockRight from './StockRight';
  import StockIndexRight from '../stockIndex/StockRight';
  import StockIndexHead from '../stockIndex/StockHead';
  import StockLeft from './StockLeft';

  import { stockActions } from '../../model/vuex/actionsType';
  import { ycjUtil } from '../../util';

  let prevCode = null;
  const checkRoute = ({ $route, $store }) => {
    const routeCode = $route.params.code;
    if (routeCode) {
      $store.dispatch(stockActions.UPDATE_CURRENT_CODE, routeCode);
      $store.dispatch(stockActions.ADD_STOCK_LIST, routeCode);
      if (prevCode) {
        $store.dispatch(stockActions.REMOVE_STOCK_LIST, prevCode);
      }
      prevCode = routeCode;
    }
    return routeCode;
  };

  export default {
    name: 'Stock',
    data() {
      return {
        code: this.$store.state.moduleStock.currentCode,
      };
    },
    components: {
      StockRight,
      StockIndexRight,
      StockIndexHead,
      StockHead,
      StockLeft,
    },
    computed: {
      isIndex() {
        return ycjUtil.isIndex(this.code); // 判断是否是指数代码
      },
    },
    beforeCreate() {
      checkRoute(this);
    },
    created() {
      window.vm = this;
    },
    watch: {
      $route() {
        const rCode = checkRoute(this);
        if (rCode) {
          this.code = rCode;
        }
      },
    },
    methods: {
    },
  };
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  #stock {
    position: relative;
    width: 100%;
    height: 100%;
    header {
      height: 68px;
    }

  }


</style>
