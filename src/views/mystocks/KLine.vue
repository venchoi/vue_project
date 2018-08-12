<template>
  <div class="k-line">
    <div class="details">
      <span class="weight">{{codeName}}</span>
      <span>日K线图</span>
      <stock-details :value="ratio" boundary="0" unit="%" :prefix="true" modal="normal" :isNeedDelist="baseInfo.close"></stock-details>
      <stock-details :value="updownprice" :boundary="0" weight="bold" :format="2"
                     modal="normal" :isNeedDelist="baseInfo.close"></stock-details>
    </div>
    <k-line :code="code"></k-line>
  </div>
</template>

<script>
  import {
    mapGetters,
  } from 'vuex';

  import StockDetails from '../../components/stockBase/StockDetails';
  import KLine from '../../components/stockBase/KLine';

  export default {
    components: {
      StockDetails,
      KLine,
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
  .k-line {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    .details {
      line-height: 30px;
      padding-left: 50px;
      >span{
        margin-right: 10px;
        &.weight{
          font-weight: bold;
        }
      }
    }
  }

</style>
