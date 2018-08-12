<template>
  <div class="index-stock-box">
    <div class="stock-text">
      <p class="row1">上证指数应对策略（代表大盘股）</p>
      <div class="row2">
        <span class="recom">应对策略</span>
        <stock-details class="state" :value="strategyState[SHIndex.strategy.viewpoint]" :showValue="SHIndex.strategy.viewpoint" boundary="0" modal="normal"></stock-details>
        <span class="time">({{SHIndex.strategy.time}})</span>
      </div>
    </div>
    <div class="stock-text">
      <p class="row1">创业板指数应对策略（代表小盘股）</p>
      <div class="row2">
        <span class="recom">应对策略</span>
        <stock-details class="state" :value="strategyState[CYBIndex.strategy.viewpoint]" :showValue="CYBIndex.strategy.viewpoint" boundary="0" modal="normal"></stock-details>
        <span class="time">({{CYBIndex.strategy.time}})</span>
      </div>
    </div>
  </div>
</template>

<script>
import {
  mapGetters,
} from 'vuex';
import Tooltip from '../../components/base/Tooltip';
import Iconfont from '../../components/base/IconFont';
import StockDetails from '../../components/stockBase/StockDetails';
import { stockActions } from '../../model/vuex/actionsType';

export default {
  name: 'IndexStock',
  data() {
    return {
      strategyState: {
        '-': 0,
        空仓: -1,
        持仓: 1,
      },
      SZfoxxcode: '000001.SH',
      CYBfoxxcode: '399006.SZ',
    };
  },
  props: {
  },
  components: {
    Tooltip,
    Iconfont,
    StockDetails,
  },
  methods: {
  },
  computed: {
    ...mapGetters({
      SHIndex: 'getSZIndex',
      CYBIndex: 'getCYIndex',
    }),
  },
  created() {
    this.$store.dispatch(stockActions.GET_INDEX_DATA, this.SZfoxxcode);
    this.$store.dispatch(stockActions.GET_INDEX_DATA, this.CYBfoxxcode);
  },
  activated() {
    this.$store.dispatch(stockActions.GET_INDEX_DATA, this.SZfoxxcode);
    this.$store.dispatch(stockActions.GET_INDEX_DATA, this.CYBfoxxcode);
  },
  deactivated() {
    this.$store.dispatch(stockActions.CANCEL_UPDATE_INDEX_DATA, this.SZfoxxcode);
    this.$store.dispatch(stockActions.CANCEL_UPDATE_INDEX_DATA, this.CYBfoxxcode);
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
.fl {
  float: left;
}
.fr {
  float: right;
}
.fcolor {
  color: #F5BA53;
}
.text_hide {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.index-stock-box {
  position: relative;
  width:100%;
  height: 100%;
  border-top: 1px solid $G4;
  border-left: 1px solid $G4;
  border-bottom: 1px solid $G4;
  display: -webkit-flex;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-content: center;
  .stock-text {
    flex: 1;
    max-width: 356px;
    border-right: 1px solid $G4;
    padding: 20px 0 0 20px;
    .row1 {
      position: relative;
      width: 100%;
      height: 14px;
      line-height: 14px;
      font-size: $text;
      color: #838383;
      margin-bottom: 20px;
    }
    .row2 {
      position: relative;
      width: 100%;
      height: 21px;
      display: -webkit-flex;
      display: flex;
      flex-flow:row nowrap;
      justify-content: flex-start;
      align-items: flex-end;
      .recom {
        font-size: $text;
        color: #fff;
        margin-right: 10px;
      }
      .state {
        margin-left: 10px;
        font-size: 21px;
        margin-right: 10px;
      }
      .time {
        font-size: $text;
        color: #838383;
      }
    }
  }
}
</style>
