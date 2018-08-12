<template>
  <div class="right-main">
   <div class="fenshi">
     <tick-line :code="focusCode"></tick-line>
   </div>
    <div class="dayk">
      <k-line :code="focusCode"></k-line>
    </div>
  </div>
</template>

<script>

  import { mapState } from 'vuex';
  import { baseUtil } from '../../util';
  import Tag from '../../components/base/Tags';
  import StockDetails from '../../components/stockBase/StockDetails';
  import ProgressBar from '../../components/base/ProgressBar';
  import StockProgressBar from '../../components/stockBase/StockProgressBar';
  import TickLine from './TickLine';
  import KLine from './KLine';

  export default {
    name: 'MyStockRight',
    data() {
      return {
      };
    },
    components: {
      ProgressBar,
      StockProgressBar,
      StockDetails,
      Tag,
      TickLine,
      KLine,
    },
    props: {
      focusCode: [String, Number],
    },
    watch: {
      focusCode() {
      },
    },
    computed: {
      ...mapState({
        preclose(state) {
          if (!state.moduleStock.baseInfo[this.focusCode]) {
            return '0';
          }
          return state.moduleStock.baseInfo[this.focusCode].preclose;
        },
        handicap(state) {
          return state.moduleStock.handicap[this.focusCode];
        },
        themeData(state) {
          return state.moduleStock.themeData[this.focusCode];
        },
      }),
      sellStage() {
        return this.handicap && this.handicap.sellStage;
      },
      sellFri() {
        return this.handicap && this.handicap.sellFri;
      },
      buyStage() {
        return this.handicap && this.handicap.buyStage;
      },
      buyFri() {
        return this.handicap && this.handicap.buyFri;
      },
      stockTheme() {
        return this.themeData.stockTheme;
      },
      relativeThemes() {
        return this.themeData.relativeThemes;
      },
      sellVolMax() {
        let max = 0;
        const sellStage = this.sellStage;
        baseUtil.each(sellStage, (item) => {
          const vol = parseFloat(item.vol);
          if (!max) {
            max = vol;
          } else if (max < vol) {
            max = vol;
          }
        });
        return parseFloat(max);
      },
    },
    methods: {},
  };
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/sass/static";

  .right-main {
    position: absolute;
    overflow: scroll; // 页面缩小的时候右侧两个图应该可以滚动以显示完整信息。
    top:0;
    bottom: 0;
    right: 0;
    width: 445px;
    margin: auto 0;
    .title{
      height:30px;
      line-height: 30px;
    }
    .fenshi,
    .dayk{
      height:300px;
      &.fenshi{
        border-bottom: 1px solid $G6;
      }
    }

  }
</style>
