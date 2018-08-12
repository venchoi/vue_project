<template>
  <div class="chart-box">
    <div class="index-chart" v-for="code in indexlist">
      <div class="details">
        <div class="stock-name">
          <span @click="codeClick(code)">{{indexInfo[code].name}}</span>
          <stock-details :value="indexInfo[code].close" :boundary="indexInfo[code].close" modal="normal" fixed="2" :format="false"></stock-details>
        </div>
        <div class="stock-ratio">
          <stock-details :value="upon(code)" :boundary="0"  modal="normal" :prefix="true"></stock-details>
          <stock-details :value="indexInfo[code].close" :boundary="indexInfo[code].preClose" :showValue="ratio(code)"  modal="normal" unit="%"></stock-details>
        </div>
        <div class="stock-icon" :class="className(code).color"><iconfont size="28px" :iconName="className(code).icon"></iconfont></div>
      </div>
      <div @click="codeClick(code)" class="chart">
        <tick-chart :code="code"></tick-chart>
      </div>
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
  import {
    baseUtil,
  } from '../../util';
  import TickChart from '../../components/stockBase/TickLine';
  import StockDetails from '../../components/stockBase/StockDetails';
  import Iconfont from '../../components/base/IconFont';

  export default {
    components: {
      TickChart,
      Iconfont,
      StockDetails,
    },
    name: 'RightTick',
    data() {
      return {
        indexlist: ['000001.SH', '399001.SZ', '399006.SZ'],
      };
    },
    created() {
      baseUtil.each(this.indexlist, (code) => {
        this.$store.dispatch(stockActions.ADD_STOCK_LIST, code);
      });
    },
    computed: {
      ...mapGetters({
        indexInfo: 'getIndexInfo',
      }),
    },
    methods: {
      upon(code) {
        if (!this.indexInfo) {
          return 0;
        }
        const close = this.indexInfo[code].close;
        const preClose = this.indexInfo[code].preClose;
        if (!close || !preClose) {
          return 0;
        }
        return (close - preClose).toFixed(2);
      },
      ratio(code) {
        if (!this.indexInfo) {
          return 0;
        }
        const close = this.indexInfo[code].close;
        const preClose = this.indexInfo[code].preClose;
        if (!close || preClose === '0') {
          return 0;
        }
        return `${(((close - preClose) * 100) / preClose).toFixed(2)}%`;
      },
      codeClick(code) {
        this.$router.push(`/stock/${code}`);
      },
      className(code) {
        if (!this.indexInfo) {
          return 0;
        }
        const close = this.indexInfo[code].close;
        const preClose = this.indexInfo[code].preClose;
        const classObject = {
          icon: 'minus',
          color: 'stock-stop',
        };
        if (close - preClose > 0) {
          classObject.icon = 'arrow-up';
          classObject.color = 'stock-rise';
        } else if (close - preClose < 0) {
          classObject.icon = 'arrow-down';
          classObject.color = 'stock-drop';
        }
        return classObject;
      },
    },
  };
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/sass/static";
  .chart-box{
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-flow: column nowrap;
    overflow-y: auto;
    .index-chart{
      position: relative;
      flex:1;
      width:100%;
      max-height: 33.3%;
      min-height: 200px;
      padding: 0 15px;
      border-right:1px solid $G5;
      display: flex;
      flex-flow: column nowrap;
      justify-content: center;
      align-items: center;
      .details{
        flex:1;
        width: 100%;
        min-height: 70px;
        max-height: 70px;
        .stock-name{
          width:150px;
          float: left;
          height: 100%;
          >span{
            display: block;
            height: 35px;
            line-height: 35px;
            text-align: left;
            font-size: 24px;
            font-weight: 800;
            &:nth-child(1){
              font-size: 20px;
              font-weight: 300;
              line-height: 50px;
              cursor: pointer;
            }
          }
        }
        .stock-icon{
          height: 70px;
          width: 50px;
          float: right;
          text-align: center;
          line-height: 70px;
        }
        .stock-ratio{
          width: 70px;
          height: 70px;
          float: right;
          font-size: 20px;
          >span{
            text-align: center;
            display: block;
            height: 35px;
            line-height: 35px;
            &:nth-child(1){
              line-height: 50px;
            }
          }
        }
      }
      .chart{
        flex:1;
        width: 100%;
        min-height: 130px;
        max-height: 100%;
      }
    }
  }
</style>
