<template>
  <div class="tick-line">
    <div class="details">
      <span class="weight">{{codeName}}</span>
      <span>分时图</span>
      <stock-details :value="ratio" boundary="0" unit="%" :prefix="true" modal="normal" :isNeedDelist="baseInfo.close"></stock-details>
      <stock-details :value="updownprice" :boundary="0" weight="bold" :format="2"
                     modal="normal" :isNeedDelist="baseInfo.close"></stock-details>
    </div>
    <tick-line :code="code"></tick-line>
  </div>
</template>

<script>
  import {
    mapGetters,
  } from 'vuex';
  import StockDetails from '../../components/stockBase/StockDetails';
  import TickLine from '../../components/stockBase/TickLine';

  export default {
    components: {
      TickLine,
      StockDetails,
    },
    name: '',
    data() {
      return {
      };
    },
    props: {
      code: {
        type: [String, Number],
        default: null,
      },
    },
    computed: {
      ...mapGetters([
        'getStockRatio',
        'getStockNameCode',
        'getStockInfo',
        'getStockUpdownprice',
      ]),
      baseInfo() {
        return this.getStockInfo(this.code);
      },
      codeName() {
        return this.getStockNameCode(this.code);
      },
      ratio() {
        return this.getStockRatio(this.code);
      },
      updownprice() {
        return this.getStockUpdownprice(this.code);
      },
    },
  };
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .tick-line {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    .details {
      line-height: 30px;
      padding-left: 45px;
      >span{
        margin-right: 10px;
        &.weight{
          font-weight: bold;
        }
      }
    }
  }
</style>
