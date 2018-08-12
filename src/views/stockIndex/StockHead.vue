<template>
  <div class="head-main">
    <div class="item stock-main">
      <div class="stock-name">
        <div class="name">{{baseInfo.name}}</div>
        <div class="code">{{baseInfo.code}}</div>
      </div>
    </div>
    <div class="item stock-base-details">
      <div class="close">
        <stock-details :value="baseInfo.close" :format="false" fixed="2" :boundary="baseInfo.preClose" weight="bold"
                       modal="normal"></stock-details>
      </div>
      <stock-details :value="updownprice" :boundary="0" weight="bold" :format="2"
                     modal="normal"></stock-details>
      <stock-details :value="ratio" weight="bold" modal="normal" :format="2" unit="%"
                     :prefix="true"></stock-details>
    </div>
    <div class="item stock-info">
      <div class="block">
        <div>今开 :
          <stock-details :value="baseInfo.open" :format="false" fixed="2" :boundary="baseInfo.preClose" modal="normal"></stock-details>
        </div>
        <div>昨收 :
          <stock-details :value="baseInfo.preClose" :format="false" fixed="2" :boundary="baseInfo.preClose" modal="normal"></stock-details>
        </div>
      </div>
      <div class="block">
        <div>最低 :
          <stock-details :value="baseInfo.low" :format="false" fixed="2" :boundary="baseInfo.preClose" modal="normal"></stock-details>
        </div>
        <div>最高 :
          <stock-details :value="baseInfo.high" :format="false" fixed="2" :boundary="baseInfo.preClose" modal="normal"></stock-details>
        </div>
      </div>
      <div class="block">
        <div>成交量 :
          <stock-details :value="baseInfo.vol" unit="手" :format="2"></stock-details>
        </div>
        <div>成交额 :
          <stock-details :value="baseInfo.money" unit="元" :format="2"></stock-details>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import {
    baseUtil,
    ycjUtil,
  } from '../../util';
  import Iconfont from '../../components/base/IconFont';
  import StockDetails from '../../components/stockBase/StockDetails';
  import StockIcon from '../../components/stockBase/StockIcon';

  export default {
    name: 'stockHead',
    props: {
      focusCode: null,
    },
    components: {
      StockIcon,
      StockDetails,
      Iconfont,
    },
    computed: {
      ...mapState({
        baseInfo(state) {
          return state.moduleStock.baseInfo[this.focusCode];
        },
        isMyStock(state) {
          let result = false;
          const foxxCode = ycjUtil.formatCode(this.focusCode);
          baseUtil.each(state.moduleUser.myStock, (item) => {
            if (foxxCode === item.foxxcode) {
              result = true;
            }
          });
          return result;
        },
      }),
      ratio() {
        if (!this.baseInfo) {
          return 0;
        }
        const close = this.baseInfo.close;
        const preClose = this.baseInfo.preClose;
        if (!close || preClose === '0') {
          return 0;
        }

        return (((close - preClose) * 100) / preClose).toFixed(2);
      },
      updownprice() {
        if (!this.baseInfo) {
          return 0;
        }
        const close = this.baseInfo.close;
        const preClose = this.baseInfo.preClose;
        return (close - preClose).toFixed(2);
      },
    },
  };
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/sass/static";

  .w1 {
    letter-spacing: 1em; /*如果需要y个字两端对齐，则为(x-y)/(y-1),这里是（4-2）/(2-1)=2em */
    margin-right: -1em;
  }

  .w4-3 {
    letter-spacing: 0.5em; /*如果需要y个字两端对齐，则为(x-y)/(y-1),这里是（4-3）/(3-1)=0.5em */
    margin-right: -0.5em; /*同上*/
  }

  .head-main {
    position: relative;
    background-color: #323232;
    width: 100%;
    height: inherit;
    color: #fff;
    .item {
      float: left;
    }
    .stock-base-details {
      height: 100%;
      width: 127px;
      padding: 8px 15px 8px 0;
      margin-right: 15px;
      line-height: 1.5;
      font-size: $text;
      border-right: 1px solid $G4;
      .close {
        width: 100%;
        text-align: center;
        font-size: $title;
      }
      >span{
        float: left;
        width: 50%;
        text-align: center;
        word-break: keep-all;
      }
    }
    .stock-main {
      padding: 0 15px;
      text-align: center;
      line-height: 1.5;
      .stock-name {
        display: inline-block;
        vertical-align: middle;
        padding: 10px 15px 0 15px;
        height: 68px;
        .name {
          margin-bottom: 9px;
          height: $title;
          font-size: $title;
          line-height: $title;
          color: #fefefe;
        }
        .code {
          height: $subText;
          line-height: $subText;
          font-size: $subText;
          color: $G1;
        }
      }
      > i {
        line-height: 68px;
      }
    }
    .stock-info {
      width: 650px;
      height: 100%;
      padding: 7px 0 7px 0px;
      font-size: 13px;
      line-height: 1.8;
      color: $G7;
      .block {
        float: left;
        margin: 4px 15px 0 0;
        .info-text {
          color: $G1;
        }
        &:last-child {
          margin-right: 0px;
        }
      }
    }
  }
</style>
