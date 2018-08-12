<template>
  <div class="tick-line">
    <div class="details">
      <span class="weight">{{codeName}}</span>
      <stock-details :value="ratio" boundary="0" unit="%" :prefix="true" modal="normal"></stock-details>
      <stock-details :value="updownprice" :boundary="0" weight="bold" :format="2"
                     modal="normal"></stock-details>
    </div>
    <tick-line :code="code"></tick-line>
  </div>
</template>

<script>
  import {
    mapState,
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
      ...mapState({
        baseInfo(state) {
          return state.moduleStock.baseInfo[this.code];
        },
        codeName() {
          let name = '-';
          if (this.baseInfo) {
            name = this.baseInfo.name;
          }
          return name;
        },
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
      }),
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
