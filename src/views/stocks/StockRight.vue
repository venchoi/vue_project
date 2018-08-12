<template>
  <div class="right-main">
    <div class="tag-container">
      <tag :items="['全景委托', '板块概念']">
        <div slot="panel_0" class="entrustment">
          <div class="sell-stage">
            <div class="stage">
              <div class="stage-item" v-for="(item, index) in sellStage">
                <span class="stage-tag">卖{{5 - index}}</span>
                <span class="close">
                  <stock-details :value="item.price" :boundary="preclose" modal="normal" :format="2" v-if="item.price != 0"></stock-details>
                  <stock-details showValue="-" modal="normal"  v-else></stock-details>
                </span>
                <div class="bar">
                  <stock-progress-bar :boundary="preclose" :close="item.price" :max="sellVolMax"
                                      :value="item.vol"></stock-progress-bar>
                </div>
                <span>{{item.vol}}</span>
              </div>
            </div>
            <!-- 先不要删，这是买卖队列统计-->
            <!--<div class="queue">-->
              <!--<div class="title">-->
                <!--<b>卖一队列 </b><span> 共{{sellFri.entrust}}笔委托，共{{sellFri.vol}}手</span>-->
              <!--</div>-->
              <!--<div class="pre-ent">-->
                <!--<div v-for="cols in sellFri.queue">-->
                  <!--<span v-for="item in cols"> {{item}}</span>-->
                <!--</div>-->
              <!--</div>-->
            <!--</div>-->
          </div>
          <div class="buy-stage">
            <div class="stage">
              <div v-for="(item, index) in buyStage">
                  <span class="stage-tag">买{{1 + index}}</span>
                  <span class="close">
                    <stock-details :value="item.price" :boundary="preclose" modal="normal" :format="2" v-if="item.price != 0"></stock-details>
                    <stock-details showValue="-" modal="normal"  v-else></stock-details>
                  </span>
                  <div class="bar">
                    <stock-progress-bar :boundary="preclose" :close="item.price" :max="buyVolMax"
                                        :value="item.vol"></stock-progress-bar>
                  </div>
                  <span>{{item.vol}}</span>
              </div>
            </div>
            <!--<div class="queue">-->
              <!--<div class="title">-->
                <!--<b>买一队列 </b><span> 共{{buyFri.entrust}}笔委托，共{{buyFri.vol}}手</span>-->
              <!--</div>-->
              <!--<div class="pre-ent">-->
                <!--<div v-for="cols in buyFri.queue">-->
                  <!--<span v-for="item in cols"> {{item}}</span>-->
                <!--</div>-->
              <!--</div>-->
            <!--</div>-->
          </div>
        </div>
        <div slot="panel_1" class="theme">
          <div class="desc" v-if="false">
            <span>{{stockTheme.titleSub}}</span>
            <b>{{stockTheme.titleMain}}</b>
            <p>
              {{stockTheme.des}}
            </p>
          </div>
          <div style="text-align: center;">概念相关性</div>
          <div class="themes">
            <div class="theme-item" v-for="theme in relativeThemes">
              <span class="theme-name">{{theme.name}}</span>
              <span class="relation-bar"><progress-bar :max="100" :value="theme.relation" color="red" height="10px"></progress-bar></span>
              <span>{{theme.relation}}%</span>
            </div>
          </div>
        </div>
      </tag>
    </div>
    <div class="list-container">
        <tag :items="tagItem" height="31px">
          <div slot="panel_0" class="full">
            <entrustment-list :focusCode="focusCode"></entrustment-list>
          </div>
        </tag>
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
  import EntrustmentList from './EntrustmentList';
  import {
    stockActions,
  } from '../../model/vuex/actionsType';

  export default {
    name: 'StockRight',
    data() {
      return {
        tagItem: ['交易明细'],
      };
    },
    components: {
      EntrustmentList,
      ProgressBar,
      StockProgressBar,
      StockDetails,
      Tag,
    },
    props: {
      focusCode: null,
    },
    created() {
      this.$store.dispatch(stockActions.GET_THEME_DATA, this.focusCode);
    },
    activated() {
      this.$store.dispatch(stockActions.GET_THEME_DATA, this.focusCode);
    },
    computed: {
      ...mapState({
        preclose(state) {
          if (!state.moduleStock.baseInfo[this.focusCode]) {
            return '0';
          }
          return state.moduleStock.baseInfo[this.focusCode].preClose;
        },
        handicap(state) {
          return state.moduleStock.handicap[this.focusCode] || {};
        },
        themeData(state) {
          return state.moduleStock.themeData[this.focusCode] || {};
        },
      }),
      sellStage() {
        return this.handicap.sellStage || {};
      },
      sellFri() {
        return this.handicap.sellFri || {};
      },
      buyStage() {
        return this.handicap.buyStage || {};
      },
      buyFri() {
        return this.handicap.buyFri || {};
      },
      stockTheme() {
        return this.themeData.stockTheme || {};
      },
      relativeThemes() {
        return this.themeData.relativeThemes || {};
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
      buyVolMax() {
        let max = 0;
        const buyStage = this.buyStage;
        baseUtil.each(buyStage, (item) => {
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

<style lang="scss" rel="stylesheet/scss">
  @import "../../assets/sass/static";

  .right-main {
    position: absolute;
    top:68px;
    bottom: 0;
    right: 0;
    width: 400px;
    margin: auto 0;
    .tag-container{
      height: 285px;
      border-bottom: 1px solid $G5;
      .entrustment {
        border: 1px solid $G5;
        border-bottom: none;
        height: 250px;
        padding: 0px 10px;
        > div {
          height: 50%;
          padding-top: 4px;
        }
        .sell-stage,
        .buy-stage{
          line-height: 1.9;
          @extend %cf;
          .stage-tag{
            display: inline-block;
            width: 30px;
          }
          > div {
            float: left;
          }
          .stage {
            width: 100%;
          }
          .close{
            display: inline-block;
            width: 35.5px;
          }
        }

        .sell-stage{
          border-bottom: 1px dashed #666;
          .queue {
            position: relative;
            width: 213px;
            height: 100%;
            .title {
              position: absolute;
              bottom: 5px;
            }
            .pre-ent{
              position: absolute;
              width: 100%;
              bottom: 30px;
              color: $green;
              >div{
                @extend %cf;
                width: 100%;
                span{
                  float: left;
                  width: 20%;
                }
              }
            }
          }
        }
        .buy-stage {
          .queue {
            position: relative;
            width: 213px;
            height: 100%;
            .pre-ent{
              position: relative;
              width: 100%;
              color: $red;
              top:5px;
              >div{
                width: 100%;
                span{
                  float: left;
                  width: 20%;
                }
              }
            }
          }
        }
        .bar {
          display: inline-block;
          width: 253px;
          margin-right: 5px;
        }
      }
      .theme{
        border: 1px solid $G5;
        border-bottom: none;
        height: 400px;
        padding: 12px 10px;
        .desc{
          border-bottom: 1px solid #444;
          margin-bottom: 3px;
        }
        .themes{
          border-top: 1px solid #444;
          margin-top: 5px;
          padding: 10px 0;
          .theme-item{
            display: inline-block;
            vertical-align: top;
            width: 50%;
            margin-bottom: 5px;
            .theme-name{
              display: inline-block;
              line-height: 1;
              width: 62px;
            }
            .relation-bar{
              display: inline-block;
              margin:0 5px;
              width: 65px;
            }
            span {
              vertical-align: middle;
            }
          }
        }
      }
    }
    .list-container{
      position: absolute;
      top: 287px;
      bottom: 0;
      left: 0;
      right: 0;
      margin: auto;
      .tag-body {
        border: 1px solid $G5;
        border-top: none;
        height: calc(100% - 31px);
      }
    }

  }
</style>
