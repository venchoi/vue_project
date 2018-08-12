<template>
  <div class="tendency-left-main">
    <div class="chart-container" v-for="(item, k) in charts">
      <div class="head">
        <div class="title">
          {{item.name}}对应策略（{{item.desc}}）
        </div>
        <div class="viewPoint">
          <span>对应策略：</span>
          <span class="point" :class="viewPointColor(indexData[k].point)">{{viewPoint(indexData[k].point)}}</span>
          <span>（{{indexData[k].time}}）</span>
          <div class="border" :class="viewPointBorderColor(indexData[k].point)"></div>
        </div>
      </div>
      <div class="tendency-chart">
        <five-days-tick-chart :code="item.code"></five-days-tick-chart>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    mapGetters,
  } from 'vuex';

  import FiveDaysTickChart from './FiveDaysTickChart';
  import {
    stockActions,
  } from '../../model/vuex/actionsType';

  const viewPoint = ['逢高抛售，空仓', '逢低买入，持仓'];
  const CYBINDEX = 13;
  const SHINDEX = 14;

  export default {
    name: '',
    data() {
      return {
        charts: {
          [CYBINDEX]: {
            code: '399006.SZ',
            name: '创业板指数',
            desc: '代表中小盘股',
          },
          [SHINDEX]: {
            code: '000016.SH',
            name: '上证50',
            desc: '代表大盘股',
          },
        },
      };
    },
    computed: {
      ...mapGetters([
        'getSZIndex',
        'getCYIndex',
      ]),
      indexData() {
        return {
          [CYBINDEX]: this.getCYIndex.strategy,
          [SHINDEX]: this.getSZIndex.strategy,
        };
      },
    },
    components: {
      FiveDaysTickChart,
    },
    created() {
      this.$store.dispatch(stockActions.GET_INDEX_DATA);
    },
    methods: {
      viewPoint(status) {
        return viewPoint[status];
      },
      viewPointColor(status) {
        return status ? 'stock-rise' : 'stock-drop';
      },
      viewPointBorderColor(status) {
        return status ? 'rise' : 'drop';
      },
    },
  };
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/sass/static";
  .tendency-left-main{
    height: 100%;
    width: 100%;
    .chart-container{
      width: 100%;
      height: 50%;
      padding-top: 10px;
      .head{
        width: 100%;
        line-height: 100px;
        background: $G4;
        @extend %cf;
        .title{
          float: left;
          padding-left: 20px;
          height: 100px;
          font-size: 20px;
          color: #fff;
        }
        .viewPoint{
          position: relative;
          float: right;
          padding-right: 35px;
          font-size: 15px;
          color: #c0c0c0;
          .border {
            position: absolute;
            width: 100%;
            height: 2px;
            bottom: 0;
            &.rise{
              background: linear-gradient(to right,#fd5a44, #ed2f2e);
            }
            &.drop{
              background: linear-gradient(to right, #3cc13e, #198b1a);
            }
          }

          > *{
            vertical-align: middle;
          }
          .point{
            font-size: 20px;
          }
        }
      }
      .tendency-chart{
        width: 100%;
        height: calc(100% - 100px);
      }
    }
  }
</style>
