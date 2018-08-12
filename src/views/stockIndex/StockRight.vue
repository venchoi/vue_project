<template>
  <div class="right-main">
    <div class="prediction">
      <div class="title">
        上证指数趋势预测（代表大盘股）

      </div>
      <div class="navigation">
        <div class="rang">
          预计{{SHIndex.interval.date}}收盘价区间
          <div class="details">
            <stock-details :value="SHIndex.interval.lower" boundary="0" unit="%" modal="normal" fixed="2"></stock-details>
            ~
            <stock-details :value="SHIndex.interval.upper" boundary="0" unit="%" modal="normal" fixed="2"></stock-details>
          </div>
        </div>
        <div>
          对应策略
          <tooltip tips="有持仓，空仓两种状态，持仓代表逢低买入，持仓，空仓代表逢高抛售，空仓。">
            <iconfont iconName="question-circle"></iconfont>
          </tooltip>
          <div class="details">
            <stock-details :value="strategyState[SHIndex.strategy.viewpoint]" :showValue="SHIndex.strategy.viewpoint" boundary="0" modal="normal"></stock-details>
            <span class="tips">
              ({{SHIndex.strategy.time}})
            </span>
          </div>
        </div>
      </div>
      <div class="fund">
        <div class="title">
          资金净流入
          <stock-details :value="SHIndex.fund.foundNet" boundary="0" modal="normal"></stock-details>
        </div>
        <div class="body">
          <div class="buy">
            <div>大单买入
              <stock-details :value="SZFund.bigBuy" boundary="0"></stock-details>
            </div>
            <div>小单买入
              <stock-details :value="SZFund.smallBuy" boundary="0"></stock-details>
            </div>
          </div>
          <div class="chart chart-b"></div>
          <div class="sell">
            <div>大单卖出
              <stock-details :value="SZFund.bigSell" boundary="0"></stock-details>
            </div>
            <div>小单卖出
              <stock-details :value="SZFund.smallSell" boundary="0"></stock-details>
            </div>
          </div>

        </div>
        <div class="legend">
          <div class="block pb">
            <b></b>
            大单买入
          </div>
          <div class="block ab">
            <b></b>
            小单买入
          </div>
          <div class="block ps">
            <b></b>
            大单卖出
          </div>
          <div class="block as">
            <b></b>
            小单卖出
          </div>
        </div>
      </div>
    </div>
    <div class="prediction">
      <div class="title">
        创业板指数趋势预测（代表小盘股）
      </div>
      <div class="navigation">
        <div class="rang">
          预计{{CYBIndex.interval.date}}收盘价区间
          <div class="details">
            <stock-details :value="CYBIndex.interval.lower" boundary="0" unit="%" modal="normal" fixed="2"></stock-details>
            ~
            <stock-details :value="CYBIndex.interval.upper" boundary="0" unit="%" modal="normal" fixed="2"></stock-details>
          </div>
        </div>
        <div>
          对应策略
          <tooltip tips="有持仓，空仓两种状态，持仓代表逢低买入，持仓，空仓代表逢高抛售，空仓。">
            <iconfont iconName="question-circle"></iconfont>
          </tooltip>
          <div class="details">
            <stock-details :value="strategyState[CYBIndex.strategy.viewpoint]" :showValue="CYBIndex.strategy.viewpoint" boundary="0" modal="normal"></stock-details>
            <span class="tips">
              ({{CYBIndex.strategy.time}})
            </span>
          </div>
        </div>
      </div>
      <div class="fund">
        <div class="title">
          资金净流入
          <stock-details :value="CYFund.foundNet" boundary="0" modal="normal"></stock-details>
        </div>
        <div class="body">
          <div class="buy">
            <div>大单买入
              <stock-details :value="CYFund.bigBuy" boundary="0"></stock-details>
            </div>
            <div>小单买入
              <stock-details :value="CYFund.smallBuy" boundary="0"></stock-details>
            </div>
          </div>
          <div class="chart chart-c"></div>
          <div class="sell">
            <div>大单卖出
              <stock-details :value="CYFund.bigSell" boundary="0"></stock-details>
            </div>
            <div>小单卖出
              <stock-details :value="CYFund.smallSell" boundary="0"></stock-details>
            </div>
          </div>

        </div>
        <div class="legend">
          <div class="block pb">
            <b></b>
            大单买入
          </div>
          <div class="block ab">
            <b></b>
            小单买入
          </div>
          <div class="block ps">
            <b></b>
            大单卖出
          </div>
          <div class="block as">
            <b></b>
            小单卖出
          </div>
        </div>
      </div>
    </div>
    <div class="ZDB">
      <div class="title">
        <div>下跌家数：
          <stock-details value="-1" :showValue="totalChange.down" unit="家" modal="normal"></stock-details>
        </div>
        <div>上涨家数：
          <stock-details value="1" :showValue="totalChange.up" unit="家" modal="normal"></stock-details>
        </div>
      </div>
      <div class="chart-z"></div>
    </div>
  </div>
</template>

<script>
  import {
    mapState,
    mapGetters,
  } from 'vuex';
  import evoChart from 'evoChart';

  import Tag from '../../components/base/Tags';
  import StockDetails from '../../components/stockBase/StockDetails';
  import ProgressBar from '../../components/base/ProgressBar';
  import StockProgressBar from '../../components/stockBase/StockProgressBar';
  import Iconfont from '../../components/base/IconFont';
  import Tooltip from '../../components/base/Tooltip';

  import {
    stockActions,
  } from '../../model/vuex/actionsType';
  import {
    baseUtil,
  } from '../../util';

  let upDownChart;
  let SZChart;
  let CYChart;

  export default {
    name: 'StockRight',
    data() {
      return {
        strategyState: {
          '-': 0,
          空仓: -1,
          持仓: 1,
        },
      };
    },
    components: {
      Tooltip,
      Iconfont,
      ProgressBar,
      StockProgressBar,
      StockDetails,
      Tag,
    },
    created() {
      this.$store.dispatch(stockActions.GET_INDEX_DATA, this.focusCode);
    },
    mounted() {
      SZChart = evoChart.create({
        chart: {
          container: '.chart-b',
          margin: [0, 0, 0, 0],
          background: 'rgba(0,0,0,0)',
          panable: false,
        },
        series: [
          {
            type: 'prismatic',
            id: 'SZ',
            data: [1, 1, -1, -1, 1, 1, -1, -1],
            gapSize: 0.5,
            statusColor: ['#FF3232', '#f5f7fb', '#00E600'],
          },
        ],
      });
      CYChart = evoChart.create({
        chart: {
          container: '.chart-c',
          margin: [0, 0, 0, 0],
          background: 'rgba(0,0,0,0)',
          panable: false,
        },
        series: [
          {
            type: 'prismatic',
            id: 'CY',
            data: [1, 1, -1, -1, 1, 1, -1, -1],
            gapSize: 0.5,
            statusColor: ['#FF3232', '#f5f7fb', '#00E600'],
          },
        ],
      });
      upDownChart = evoChart.create({
        chart: {
          container: '.chart-z',
          margin: [10, 10, 10, 10],
          background: 'rgba(0,0,0,0)',
          panable: false,
        },
        xAxis: [
          {
            position: evoChart.static.BOTTOM,
            space: 20,
            limit: 0,
            interval: 5,
            inverse: false,
            grid: false,
            ticks: [0, 1.5, 2.5, 3.5, 4.5, 5.5, 6.5, 7.5, 8.5, 9],
            label: (value) => {
              let result;
              switch (value) {
                case 0:
                  result = '跌停';
                  break;
                case 1.5:
                  result = '-7%';
                  break;
                case 2.5:
                  result = '-5%';
                  break;
                case 3.5:
                  result = '-3%';
                  break;
                case 4.5:
                  result = '0%';
                  break;
                case 5.5:
                  result = '3%';
                  break;
                case 6.5:
                  result = '5%';
                  break;
                case 7.5:
                  result = '7%';
                  break;
                case 9:
                  result = '涨停';
                  break;
                default:
                  break;
              }
              return result;
            },
            leftLimit: 20,
            rightLimit: 20,
            offset: 0,
            length: 100,
            style: {
              tick: {
                length: 0,
                lineWidth: 0,
              },
              line: {
                stroke: '#e0e0e0',
              },
              text: {
                fill: '#e0e0e0',
                y: -5,
              },
            },
          },
        ],
        yAxis: [
          {
            position: evoChart.static.LEFT,
            grid: {
              style: {
                stroke: '#2B2B2B',
                lineDash: null,
              },
            },
            space: 0,
            topLimit: 20,
            bottomLimit: 0,
            min: 0,
            inverse: false,
            ticks: (displayMax) => {
              const unit = displayMax / 5;
              const result = [];
              for (let i = 0; i < 6; i += 1) {
                result.push((unit * i));
              }
              return result;
            },

            splitLine: 0,

            offset: 0,
            length: 100,
            label: value => evoChart.format.num(value, 'cn'),
            style: {
              tick: {
                stroke: null,
              },
              line: {
                stroke: null,
              },
              text: {
                fill: '#e0e0e0',
              },
            },
          },
        ],

        series: [
          {
            type: 'histogram',
            id: 'up',
            data: [],
            withValue: {
              textFill: '#fff',
            },
            style: {
              rect: {
                lineWidth: 5,
                stroke: '#FF3232',
              },
            },
          },
          {
            type: 'histogram',
            id: 'down',
            data: [],
            withValue: {
              textFill: '#fff',
            },
            style: {
              rect: {
                lineWidth: 5,
                stroke: '#00E600',
              },
            },
          },
        ],
      });
    },
    props: {
      focusCode: null,
    },
    computed: {
      ...mapGetters({
        SHIndex: 'getSZIndex',
        CYBIndex: 'getCYIndex',
      }),
      SZFund() {
        return this.SHIndex.fund;
      },
      CYFund() {
        return this.CYBIndex.fund;
      },
      ...mapState({
        totalChange(state) {
          return state.moduleStock.indexData.changeTotal;
        },
        change(state) {
          return baseUtil.copy(state.moduleStock.indexData.change);
        },
      }),
    },
    beforeUpdate() {
      this.updateFund();
    },
    watch: {
      change() {
        const up = this.change.up;
        const down = this.change.down;
        upDownChart.getSeries('up').setSeries({
          points: up,
          displayRange: 'latest',
        });
        upDownChart.getSeries('down').setSeries({
          points: down,
          displayRange: 'latest',
        });
      },
    },
    methods: {
      updateFund() {
        const funds = [this.SZFund, this.CYFund];
        const chart = [SZChart, CYChart];
        const id = ['SZ', 'CY'];
        baseUtil.each(funds, (fund, index) => {
          const foundNet = fund.foundNet;
          const data = [
            0,
            fund.bigBuy,
            0,
            -fund.bigSell,
            fund.smallBuy,
            0,
            -fund.smallSell,
            0,
          ];
          if (foundNet !== 0) {
            chart[index].getSeries(id[index]).setSeries({
              points: data,
            });
          }
        });
      },
    },
  };
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/sass/static";

  .right-main {
    position: absolute;
    top: 68px;
    bottom: 0;
    right: 0;
    width: 400px;
    margin: auto 0;
    border: 1px solid $G5;
    border-top: none;
    background: $G3;
    .prediction {
      + .prediction {
        border-bottom: 1px solid $G5;
      }
      > .title {
        background: $G4;
        line-height: 24px;
        border-top: 1px solid $G5;
        border-bottom: 1px solid $G5;
      }
      .navigation {
        width: 100%;
        padding: 5px 10px;
        border-bottom: 1px dashed $G5;

        @extend %cf;
        > div {
          float: left;
          width: 50%;
        }
        .details {
          font-size: 18px;
          .tips {
            font-size: 12px;
            margin-left: 5px;
          }
        }
        .rang {

        }

      }
      .fund {

        .title {
          text-align: center;
          padding: 5px 0;
        }
        .body {
          display: flex;
          width: 100%;
          height: 65px;
          .buy,
          .sell,
          .chart {
            width: 33.3%;
            text-align: center;
            align-items: stretch;
          }
          .buy,
          .sell {
            > div + div {
              margin-top: 27px;
            }
          }
          .chart {
            width: 150px;
          }
        }
        .legend {
          display: flex;
          justify-content: center;
          .block {
            padding: 5px 0;
            width: 68px;
            &.ab {
              b {
                background: rgba($red,0.5);
              }
            }
            &.pb {
              b {
                background: $red;
              }
            }
            &.as {
              b {
                background: rgba($green,0.5);
              }
            }
            &.ps {
              b {
                background: $green;
              }
            }
            b {
              display: inline-block;
              width: 9px;
              height: 9px;

            }

          }
        }

      }
    }
    .ZDB {
      position: absolute;
      top: 406px;
      bottom: 0;
      left: 0;
      right: 0;
      margin: auto;
      display: flex;
      flex-direction: column;
      align-items: stretch;
      .title {
        height: 45px;
        display: flex;
        justify-content: center;
        align-items: center;
        > div {
          width: 120px;
          text-align: center;
        }

      }
      .chart-z {
        height: 100%;
      }
    }

  }
</style>
