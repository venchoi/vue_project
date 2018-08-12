<template>
  <div class="right-exponent-wrap">
    <div class="stock-title">
      上证指数应对策略（代表大盘股）
      <p class="right">
        <stock-details class="state" :value="strategyState[SHIndex.strategy.viewpoint]" :showValue="SHIndex.strategy.viewpoint" boundary="0" modal="normal"></stock-details>
        <span class="time">({{SHIndex.strategy.time}})</span>
      </p>
    </div>
    <div class="tick-link">
      <tick-line :code="SZfoxxcode"></tick-line>
    </div>
    <div class="stock-title">
      创业板指数应对策略（代表小盘股）
      <p class="right">
        <stock-details class="state" :value="strategyState[CYBIndex.strategy.viewpoint]" :showValue="CYBIndex.strategy.viewpoint" boundary="0" modal="normal"></stock-details>
        <span class="time">({{CYBIndex.strategy.time}})</span>
      </p>
    </div>
    <div class="tick-link">
      <tick-line :code="CYBfoxxcode"></tick-line>
    </div>
  </div>
</template>

<script>
  import {
    mapGetters,
  } from 'vuex';
  import {
    stockActions,
  } from '../../model/vuex/actionsType';
  import TickLine from '../../components/stockBase/TickLine';
  import Tooltip from '../../components/base/Tooltip';
  import Iconfont from '../../components/base/IconFont';
  import StockDetails from '../../components/stockBase/StockDetails';

  export default {
    name: 'RightExponent',
    data() {
      return {
        SZfoxxcode: '000001.SH',
        CYBfoxxcode: '399006.SZ',
        strategyState: {
          '-': 0,
          空仓: -1,
          持仓: 1,
        },
      };
    },
    props: {
    },
    components: {
      TickLine,
      Tooltip,
      Iconfont,
      StockDetails,
    },
    computed: {
      ...mapGetters({
        SHIndex: 'getSZIndex',
        CYBIndex: 'getCYIndex',
      }),
    },
    methods: {
    },
    created() {
      this.$store.dispatch(stockActions.GET_INDEX_DATA, this.SZfoxxcode);
      this.$store.dispatch(stockActions.GET_INDEX_DATA, this.CYBfoxxcode);
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
  .right-exponent-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    .stock-title {
      position: relative;
      width: 100%;
      height: 44px;
      line-height: 44px;
      color: #838383;
      font-size:14px;
      text-indent: 10px;
      text-align: left;
      background: $G4;
      .tooltip {
        text-indent: 0;
      }
      .right {
        position: absolute;
        height:44px;
        line-height: 44px;
        top:0;
        right:10px;
        text-align: right;
        font-size: 20px;
        text-indent: 0;
        .state {
          height:44px;
          line-height: 44px;
          font-size: 20px;
        }
        .time {
          display: inline-block;
          height:44px;
          line-height:44px;
          font-size:14px;
          margin-left:10px;
        }
      }
    }
    .tick-link {
      position: relative;
      width: 100%;
      height: 316px;
    }
  }
  @media only screen and (max-width: 1680px) {
    .tick-link {
      height: 245px !important;
    }
  }
</style>
