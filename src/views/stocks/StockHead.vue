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
                       modal="normal" :isNeedDelist="baseInfo.preClose"></stock-details>
      </div>

      <stock-details :value="updownprice" :boundary="0" weight="bold" :format="2"
                     modal="normal" :isNeedDelist="baseInfo.preClose"></stock-details>
      <stock-details :value="ratio" weight="bold" modal="normal" :format="2" unit="%"
                     :prefix="true" :isNeedDelist="baseInfo.preClose"></stock-details>
    </div>
    <div class="item stock-info">
      <div class="block">
        <div>
          <span class="info-text">今开 :</span>
          <stock-details :value="baseInfo.open" :format="false" fixed="2" :boundary="baseInfo.preClose" modal="normal" :isNeedDelist="baseInfo.preClose"></stock-details>
        </div>
        <div>
          <span class="info-text">昨收 :</span>
          <stock-details :value="baseInfo.preClose" :format="false" fixed="2" :boundary="baseInfo.preClose" modal="normal" :isNeedDelist="baseInfo.preClose"></stock-details>
        </div>
      </div>
      <div class="block">
        <div>
          <span class="info-text">最低 :</span>
          <stock-details :value="baseInfo.low" :format="false" fixed="2" :boundary="baseInfo.preClose" modal="normal" :isNeedDelist="baseInfo.preClose"></stock-details>
        </div>
        <div>
          <span class="info-text">最高 :</span>
          <stock-details :value="baseInfo.high" :format="false" fixed="2" :boundary="baseInfo.preClose" modal="normal" :isNeedDelist="baseInfo.preClose"></stock-details>
        </div>
      </div>

      <div class="block">
        <div>
          <span class="info-text">成交量 :</span>
          <stock-details :value="baseInfo.vol" unit="手" :format="2" :isNeedDelist="baseInfo.preClose"></stock-details>
        </div>
        <div>
          <span class="info-text">成交额 :</span>
          <stock-details :value="baseInfo.money" unit="元" :format="2" :isNeedDelist="baseInfo.preClose"></stock-details>
        </div>
      </div>
      <div class="block">
        <div>
          <span class="info-text">换手率：</span>
          <stock-details :value="baseInfo.hsl" unit="%" :format="2" :isNeedDelist="baseInfo.preClose"></stock-details>
        </div>
        <div>
          <span class="info-text w1">量比</span>：
          <stock-details :value="baseInfo.lb" :isNeedDelist="baseInfo.preClose"></stock-details>
        </div>
      </div>
      <div class="block">
        <div>
          <span class="info-text w4-3">总市值</span>：
          <stock-details :value="baseInfo.zsz" :format="2" :isNeedDelist="baseInfo.preClose"></stock-details>
        </div>
        <div>
          <span class="info-text">流通市值：</span>
          <stock-details :value="baseInfo.ltsz" :format="2" :isNeedDelist="baseInfo.preClose"></stock-details>
        </div>
      </div>
      <div class="block">
        <div>
          <span class="info-text">市净率 :</span>
          <stock-details :value="baseInfo.sjl" :isNeedDelist="baseInfo.preClose"></stock-details>
        </div>
        <div>
          <span class="info-text">市盈率 :</span>
          <stock-details :value="baseInfo.ttm" :isNeedDelist="baseInfo.preClose"></stock-details>
        </div>
      </div>
    </div>
    <div class="add-to-my-stock" :class="{'in-list':isMyStock}" @mouseover.stop="toggleAddTip" @mouseout.stop="toggleAddTip" @click="addToMyStock">
      <span class="plus">
        <iconfont iconName="plus" color="#f5ba53" size="30px"></iconfont>
      </span>
      <div v-if="isMyStock" class="add-tip">删除自选</div>
      <div v-else class="add-tip">加入自选</div>
    </div>
    <div class="marker">
      <div class="tip" v-if="!mark">
        <iconfont iconName="pencil" color="#fff" size="18px"></iconfont>
        做笔记
      </div>
      <textarea maxlength="50" @focus="popTips($event)" @blur="setStockNotes" v-model="mark" @keyup.stop.prevent></textarea>
    </div>
  </div>
</template>

<script>
  import { mapState, mapGetters } from 'vuex';
  import {
    userActions,
    stockActions,
    actions,
  } from '../../model/vuex/actionsType';
  import {
    baseUtil,
    ycjUtil,
  } from '../../util';
  import Iconfont from '../../components/base/IconFont';
  import StockDetails from '../../components/stockBase/StockDetails';
  import StockIcon from '../../components/stockBase/StockIcon';

  export default {
    name: 'stockHead',
    data() {
      return {
        mark: '',
        preStock: this.focusCode,
        preMark: this.mark,
      };
    },
    props: {
      focusCode: null,
    },
    components: {
      StockIcon,
      StockDetails,
      Iconfont,
    },
    computed: {
      ...mapGetters([
        'getStockInfo',
        'getStockRatio',
        'getStockUpdownprice',
      ]),
      ...mapState({
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
        info(state) {
          let info = '';
          const foxxCode = ycjUtil.formatCode(this.focusCode);
          baseUtil.each(state.moduleUser.myStock, (item) => {
            if (foxxCode === item.foxxcode) {
              info = item.info;
            }
          });
          return info;
        },
      }),
      baseInfo() {
        return this.getStockInfo(this.focusCode);
      },
      ratio() {
        return this.getStockRatio(this.focusCode);
      },
      updownprice() {
        return this.getStockUpdownprice(this.focusCode);
      },
    },
    created() {
      this.$store.dispatch(stockActions.GET_STOCK_DATA, this.focusCode);
      this.mark = this.info;
    },
    watch: {
      focusCode() {
        this.$store.dispatch(stockActions.CANCEL_STOCK_DATA, this.preStock);
        this.$store.dispatch(stockActions.GET_STOCK_DATA, this.focusCode);
        this.preStock = this.focusCode;
        this.mark = this.info;
      },
      info() {
        this.mark = this.info;
      },
    },
    methods: {
      toggleAddTip() {
        const addTips = document.getElementsByClassName('add-tip');
        addTips[0].style.display = addTips[0].style.display === 'block' ? 'none' : 'block';
      },
      addToMyStock() {
        if (this.isMyStock) {
          this.$store.dispatch(userActions.REMOVE_MY_STOCK, this.focusCode);
        } else {
          this.$store.dispatch(userActions.ADD_MY_STOCK, {
            code: this.focusCode,
            name: this.baseInfo.name,
          });
        }
      },
      setStockNotes() {
        if (this.isMyStock) {
          this.$store.dispatch(userActions.UPDATE_MY_STOCK, {
            code: this.focusCode,
            info: this.mark,
          });
        }
      },
      popTips(e) {
        if (!this.isMyStock) {
          this.$store.dispatch(actions.UPDATE_NOTICE_DATA, {
            content: '请先将股票加入自选股',
            status: 'fail',
          });
          e.srcElement.blur();
        }
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
    .stock-base-details {
      height: 100%;
      width: 127px;
      padding: 8px 15px 8px 0;
      margin-right: 15px;
      line-height: 1.5;
      font-size: $subText;
      border-right: 1px solid $G4     ;
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
    .stock-info {
      width: 670px;
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
    .marker {
      position: relative;
      float: right;
      height: 100%;
      width: calc(100% - 1137px);
      min-width: 150px;
      padding: 15px 10px;
      textarea {
        position: relative;
        background: transparent;
        height: 40px;
        width: 100%;
        color: $white;
        border-color: $G5;
        resize: none;
        z-index: 2;
      }
      .tip {
        position: absolute;
        left: 31px;
        top: 24px;
        width: 75px;
        height: 20px;
        opacity: 0.6;
      }
    }
    .add-to-my-stock {
      position: relative;
      float: right;
      margin-right: 3px;
      padding: 19px 27px 19px 25px;
      border-left: 1px solid $G4;
      height: 100%;
      text-align: center;
      cursor: pointer;
      .plus {
        transition: transform 0.3s;
        display: inline-block;
        width: 30px;
        height: 30px;
      }
      .add-tip {
        z-index: 99;
        position: absolute;
        display: none;
        top: 100%;
        left: 0;
        padding: 9px 10px 9px 13px;
        border-radius: 4px;
        height: 33px;
        width: 80px;
        vertical-align: middle;
        text-align: center;
        font-size: $text;
        line-height: $text;
        background-color: #f5ba53;
        color: #4d4d4d;
        &:before {
          position: absolute;
          content: '';
          top: -10px;
          left: calc(50% - 10px);
          height: 0;
          width: 0;
          border-bottom: 10px solid #f5ba53;
          border-right: 10px solid transparent;
          border-left: 10px solid transparent;
        }
      }
      &.in-list {
        .plus {
          transform: rotate(45deg);
        }
      }
    }
  }
</style>
