<template>
  <div class="left-main">
    <div class="chart-container">
       <stock-chart :code="focusCode"></stock-chart>
    </div>
    <stock-news :focusCode="focusCode"></stock-news>
  </div>
</template>

<script>
  import StockChart from './StockChart';
  import StockNews from './StockNews';
  import { ycjUtil } from '../../util';

  export default {
    name: '',
    data() {
      return {
        activeButton: null,
      };
    },
    props: {
      focusCode: null,
    },
    components: {
      StockChart,
      StockNews,
    },
    computed: {
      isIndex() {
        return ycjUtil.isIndex(this.focusCode);
      },
    },
    methods: {},
  };
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../../assets/sass/static";

  .left-main {
    position: absolute;
    top: 68px;
    bottom: 0;
    right: 400px;
    left: 0;
    margin: auto;
    .chart-container {
      height: calc(100% - 26px);
      width: 100%;
    }
    .new-buttons {
      position: relative;
      bottom: 0;
      width: 100%;
      background: $G4;
      border-top: 1px solid $G5;
      border-bottom: 1px solid $G5;
      .drop-buttons {
        line-height: 24px;
        @extend %cf;
        > .button {
          float: left;
          padding: 0 15px;
          user-select: none;
          cursor: pointer;
          transition: all 0.3s;
          font-size: 13px;
          color: $G2;
          &:hover,
          &.active {
            color: #fff;
            background-color: $witheMask;
          }
        }
      }

    }
  }

</style>
