<template>
  <div class="entrust-main">
    <div class="table-head">
      <div class="item">时间</div>
      <div class="item">价格</div>
      <!--<div class="item">成交</div>-->
      <!--<div class="item">金额</div>-->
      <!--<div class="item">买方</div>-->
      <!--<div class="item">卖方</div>-->
      <div class="item">主动买入成交额</div>
      <div class="item">主动卖出成交额</div>
    </div>
    <!--<div class="scroll">-->
      <!--<div class="base">-->
        <!--<div class="table-body">-->
          <!--<div class="cols" :class="{'bold' : item.bigDeal}" v-for="item in baseList">-->
            <!--<span>{{item.money}}万</span>-->
            <!--<span>{{item.amount}}手</span>-->
            <!--<span><stock-details :value="item.price" modal="inherit"></stock-details></span>-->
            <!--<time>{{item.connect == 0 ? item.time :''}}</time>-->
          <!--</div>-->
        <!--</div>-->
      <!--</div>-->
      <!--<div class="business">-->
        <!--<div class="table-body">-->
          <!--<div class="buyer-block">-->
            <!--<template v-for="(item,key) in buyer">-->
              <!--<template v-if="typeof item == 'object'">-->
                <!--<div class="block" :class="{'full': item.state > 0}">-->
                  <!--<div class="state">-->
                    <!--<span v-if="item.amount && item.state > 0">{{item.amount}}万</span>{{meaning(item.state)}}-->
                  <!--</div>-->
                  <!--<div class="item" v-for="n in parseInt(item.length)"></div>-->
                <!--</div>-->
              <!--</template>-->
              <!--<template v-else>-->
                <!--<div class="item"><span v-if="item > 0">{{item}}万</span>{{meaning(item)}}</div>-->
              <!--</template>-->
            <!--</template>-->

          <!--</div>-->
          <!--<div class="seller-block">-->
            <!--<template v-for="(item,key) in seller">-->
              <!--<template v-if="typeof item == 'object'">-->
                <!--<div class="block" :class="{'full': item.state > 1}">-->
                  <!--<div class="state">-->
                    <!--<span v-if="item.amount">{{item.amount}}万</span>{{meaning(item.state)}}-->
                  <!--</div>-->
                  <!--<div class="item" v-for="n in item.length"></div>-->
                <!--</div>-->
              <!--</template>-->
              <!--<template v-else>-->
                <!--<div class="item"><span v-if="item > 0">{{item}}万</span>{{meaning(item)}}</div>-->
              <!--</template>-->
            <!--</template>-->
          <!--</div>-->
        <!--</div>-->
      <!--</div>-->
    <!--</div>-->
    <div class="scroll">
      <div class="row" v-for="item in dealData">
        <span class="time">{{item[0]}}</span>
        <span class="price">{{item[1]}}</span>
        <span class="buy" v-if="item[2] === 0 || item[2] === '0'">
          {{item[2]}}
        </span>
        <span class="buy" v-else>
          {{item[2]}}万
        </span>
        <span class="sell" v-if="item[3] === 0 || item[3] === '0'">
          {{item[3]}}
        </span>
        <span class="sell" v-else>
          {{item[3]}}万
        </span>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import { stockActions } from '../../model/vuex/actionsType';
  import StockDetails from '../../components/stockBase/StockDetails';

  export default {
    name: '',
    data() {
      return {
        meaningOfState: ['小单', '大单'],
      };
    },
    props: {
      focusCode: null,
    },
    components: {
      StockDetails,
    },
    mounted() {
      this.$store.dispatch(stockActions.GET_DEAL_DATA, this.focusCode);
    },
    watch: {
      focusCode() {
        if (this.prevCode !== this.focusCode) {
          const dispatch = this.$store.dispatch;
          dispatch(stockActions.GET_DEAL_DATA, this.focusCode);
          if (this.prevCode) {
            dispatch(stockActions.CANCEL_DEAL_DATA, this.prevCode);
          }
          this.prevCode = this.focusCode;
        }
      },
    },
    computed: {
      ...mapState({
        dealData(state) {
          return state.moduleStock.dealData[this.focusCode].data;
        },
      }),
//      baseList() {
//        console.log('this.dealData', this.dealData);
//        return this.dealData.baseList;
//      },
//      buyer() {
//        return this.dealData.buyer;
//      },
//      seller() {
//        return this.dealData.seller;
//      },
    },
    methods: {
      meaning(value) {
        return value > 0 ? this.meaningOfState[1] : this.meaningOfState[0];
      },
    },
    deactivated() {
      this.$store.dispatch(stockActions.CANCEL_DEAL_DATA, this.focusCode);
    },
  };
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import '../../assets/sass/static';
  .entrust-main{
    height: 100%;
    background: $background;
    @extend %cf;
    .table-head{
      .item{
        width: 20%;
        &:nth-of-type(4){
          padding-right: 5px;
        }
        &:nth-last-of-type(2){
          padding-right: 4px;
          width: 28%;
        }
        &:last-child{
          width: 28%;
          padding-right: 10px;
        }
      }
    }
    .scroll{
      position: absolute;
      top:26px;
      bottom: 0;
      left: 0;
      right: 0;
      margin: auto;
      overflow-y:scroll;
    };
    .base,
    .business{
      float: left;
      .table-body{
        line-height: 20px;
        .cols{
          @extend %cf;
        }
      }
    }

    .base{
      width: 60%;
      .table-body{
        @extend %cf;
        .cols{
          &.bold{
            font-weight: bold;
          }
          text-align: right;
          padding-right: 3px;
          @extend %cf;
          time{
            float: right;
            display: inline-block;
            padding-left: 10px;
            width: 25%;
            height: 100%;
            text-align: right;
          }
          >span{
            width: 25%;
            float: right;
            display: inline-block;
          }
        }
      }
    }

    .business{
      width: 40%;
      .table-body{
        padding-right: 3px;
        @extend %cf;
        .seller-block,
        .buyer-block{
          float: left;
          width: 50%;
          .block{
            position: relative;
            &:after{
              content: '';
              position: absolute;
              top:0;
              bottom:0;
              left:0;
              right: 0;
              margin: auto;
              border: 1px dashed #fff;
            }
            .state{
              position: absolute;
              top:0;
              bottom: 0;
              right: 3px;
              margin: auto 0;
              height: 20px;
              line-height: 20px;
            }
          }
          .item{
            display: block;
            height: 20px;
            line-height: 20px;
            text-align: right;
            padding-right: 3px;
          }
        }
        .buyer-block{
          color: $red;
          .block{
            &:after{
              border-color: $red;
            }

            &.full{
              &:after{
                border: 1px solid $G3;
                border-left: none;
                border-right: none;
              }
              background: $glassyRed;
              color: $white;
              font-weight: bold;
            }
          }
        }
        .seller-block{
          color: $green;
          .block{
            &:after{
              border-color: $green;
            }
            &.full{
              &:after{
                border: 1px solid $G3;
                border-left: none;
                border-right: none;
              }
              background: $glassyGreen;
              color: $white;
              font-weight: bold;
            }
          }
        }
      }
    }

    .table-head{
      padding: 3px 0;
      border-top: 1px solid $G5;
      border-bottom: 1px solid $G5;
      background: $G4;
      @extend %cf;
      .item{
        float: left;
        text-align: right;
      }
    }
    .scroll{
      .row > span {
        display: inline-block;
        line-height: 20px;
        width: 20%;
        text-align: right;
        &:nth-last-of-type(2){
          width: 27%;
        }
        &:last-child{
          width: 27%;
          padding-right: 10px;
        }
        &.buy {
          color: $red;
        }
        &.sell {
          color: $green;
        }
      }
    }
  }
</style>
