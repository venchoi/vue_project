<template>
  <div id="market">
    <div class="top">
      <market-top></market-top>
    </div>
    <div class="stock-list">
      <market-left @activeClick="changeRightCode"></market-left>
    </div>
    <div class="right">
      <market-right :focusCode="code"></market-right>
    </div>
  </div>
</template>

<script>
  import MarketTop from './MarketTop';
  import MarketLeft from './MarketLeft';
  import MarketRight from './MarketRight';

  let timer = null;
  let open = true;
  export default {
    name: '',
    data() {
      return {
        code: '', // 当前active股票代码
        isFirst: true, // 初始化时
        codeList: '',
        stockList: [],
      };
    },
    components: {
      MarketTop,
      MarketRight,
      MarketLeft,
    },
    methods: {
      changeRightCode(columnId, row) {
        // 节流
        const vm = this;
        clearTimeout(timer);
        if (open) {
          vm.code = row.foxxcode;
          open = false;
        }
        timer = setTimeout(() => {
          if (!open) {
            vm.code = row.foxxcode;
          }
        }, 300);
      },
    },
  };
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/sass/static";
  #market {
    position: relative;
    width: 100%;
    height: 100%;
    background: $background;
    .top{
      width: 100%;
      height: 265px;
      position: absolute;
      top:0;
      left:0;
      border-bottom:1px solid $G5;
    }
    .stock-list{
      position: absolute;
      left:0;
      top:265px;
      bottom:0;
      right:510px;
      margin: 0 auto;
      border-right:1px solid $G5;
    }
    .right{
      position: absolute;
      width:510px;
      right:0;
      top:265px;
      bottom: 0;
    }
  }
</style>
