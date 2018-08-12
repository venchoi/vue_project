<template>
  <router-link :class="['stock-wrap', { 'has-update': stockItem.stocks.length > 0 }]" :to="{ name: 'service-detail', params: {type: stockItem.system_code}}">
    <div class="name">
      <div class="name-bg"></div>
      <span class="text_hide">{{stockItem.name}}</span>
    </div>
    <img :src="stockItem.logo" alt="产品图标">
    <!--相关股票列表，最多三个，后端已经排序过滤-->
    <div class="stock-list">
      <div class="stock-item" v-for="item in stockItem.stocks" :key="item.foxxcode">
        <div @mouseenter="enterStock($event, item[0])" @mouseleave="leaveStock()">
          <p class="stock-name text_hide">{{item[1]}}</p>
          <p class="ratio">
            <stock-detail :value="getStockRatio(item[0])" :format="2" :boundary="0" :prefix="true" unit="%" modal="normal"></stock-detail>
          </p>
        </div>
      </div>
      <p class="no-stock" v-if="stock.stocks.length === 0">今日暂未发现</p>
    </div>
    <!--组件默认不渲染，交互触发显示-->
    <tick-line-image :foxxcode="gifFoxxCode" :clientX="gifClientX" :clientY="gifClientY" ref="stockgif"></tick-line-image>
  </router-link>
</template>

<script>
  import { mapGetters } from 'vuex';
  import StockDetail from '../../components/stockBase/StockDetails';
  import YCJUnit from '../../util/ycjUtil';
  import TickLineImage from '../../components/stockBase/TickLineImage';

  export default {
    name: 'Stock',
    data() {
      return {
        stockItem: [],
        gifFoxxCode: '',
        gifClientX: '',
        gifClientY: '',
      };
    },
    props: {
      stock: Object,
    },
    components: {
      StockDetail,
      TickLineImage,
    },
    computed: {
      ...mapGetters([
        'getStockRatio',
      ]),
    },
    methods: {
      // 显示股票gif
      enterStock($event, foxxcode) {
        const vm = this;
        vm.gifFoxxCode = foxxcode;
        vm.gifClientX = $event.clientX;
        vm.gifClientY = $event.clientY;
        vm.$refs.stockgif.show();
      },
      // 隐藏股票gif
      leaveStock() {
        this.$refs.stockgif.hide();
      },
      getFoxxcode(code) {
        return YCJUnit.formatCode(code);
      },
      dateInfo() {
        const vm = this;
        for (let i = 0; i < vm.stock.stocks.length; i += 1) {
          vm.stock.stocks[i][0] = vm.getFoxxcode(vm.stock.stocks[i][0]);
        }
        vm.stockItem = this.stock;
      },
    },
    created() {
      this.dateInfo();
    },
    activated() {
      this.$refs.stockgif.hide();
    },
    watch: {
      stock() {
        this.dateInfo();
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
  .text_hide {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .stock-wrap {
    position: relative;
    max-width: 25%;
    min-width: 25%;
    border-left:1px solid #242424;
    border-bottom:1px solid #242424;
    flex: 1;
    background: $G4;
    align-items: flex-start;
    cursor: pointer;
    -webkit-transition: background 600ms;
    -moz-transition: background 600ms;
    -ms-transition: background 600ms;
    -o-transition: background 600ms;
    transition: background 600ms;
    .name {
      position: relative;
      width: 163px;;
      height: 37px;
      margin: 0 auto 30px auto;
      .name-bg {
        position: relative;
        display: block;
        width: 100%;
        height: 100%;
        border-top: 37px solid #373737;
        border-left: 15px solid transparent;
        border-right: 15px solid transparent;
      }
      span {
        position: absolute;
        display: block;
        top:0;
        left: 0;
        width: 100%;
        height:37px;
        line-height:37px;
        text-align: center;
        font-size: $text;
        color: #fff;
      }
    }
    img {
      position: relative;
      display: block;
      width: 102px;
      height: 102px;
      margin:0 auto 30px auto;
    }
    .stock-list {
      position: relative;
      width: 100%;
      height: 76px;
      padding: 20px 0;
      display: -webkit-flex;
      display: flex;
      flex-flow: row nowrap;
      justify-content: center;
      align-content: center;
      background: #373737;
      .stock-item {
        position: relative;
        flex: 1;
        max-width: 33%;
        height: 36px;
        .stock-name {
          position: relative;
          width: 100%;
          height:16px;
          line-height:16px;
          text-align: center;
          font-size: $text;
          color: #F5BA53;
          margin-bottom: 9px;
        }
        .ratio {
          position: relative;
          width: 100%;
          height: 14px;
          line-height: 14px;
          text-align: center;
          font-size: $text;
          color: #34c134;
        }
      }
      .stock-item:after {
        content: '';
        display: block;
        position: absolute;
        width: 1px;
        height: 36px;
        left: 0;
        top: 0;
        background: #fff;
      }
      .stock-item:first-child:after {
        background: #373737;
      }
      .no-stock {
        position: relative;
        width: 100%;
        height: 36px;
        line-height: 36px;
        text-align: center;
        font-size:14px;
        color: #C0C0C0;
      }
    }
  }
  .stock-wrap:hover {
    background: #373737;
  }
  .has-update:before {
    content: '';
    display: block;
    position: absolute;
    top: 20px;
    right: 20px;
    width: 10px;
    height: 10px;
    background: red;
    border: 1px solid red;
    -webkit-border-radius:50%;
    -moz-border-radius:50%;
    border-radius:50%;
  }
  @media only screen and (max-width: 1680px) {
    .stock-wrap {
      max-width: 33.3%;
      min-width: 33.3%;
    }
  }
</style>
