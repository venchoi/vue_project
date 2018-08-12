<template>
  <div class="table-test">
    <h2>TableTest</h2>
    <base-table class="table">
      <table-head slot="tableHead"></table-head>
      <table-body slot="tableBody" :listData="listData"></table-body>
    </base-table>
  </div>
</template>

<script>
  import BaseTable from './base/BaseTable/BaseTable';
  import TableHead from './base/BaseTable/TableHead';
  import TableBody from './base/BaseTable/TableBody';

  export default {
    name: 'TableTest',
    data() {
      return {
        listData: [], // 要展示数据
      };
    },
    components: {
      BaseTable,
      TableHead,
      TableBody,
    },
    created() {
      this.listData.push({
        num: '1',
        code: 'ycjUtil.foxxCodeToCode(foxxCode)', // 股票代码
        foxxcode: 'foxxCode', // 股票代码
        name: 'item.stock_name', // 股票名
        price: 'baseInfo.close', // 股票现价
        preClose: 'baseInfo.preClose', // 股票现价
        zdf: 'baseInfo.ratio', // 涨跌幅
        remark: 'item.info', // 备注
        news: 'news', // 新闻动态
      });
    },
  };
</script>

<style lang="scss" scoped>
  @import "../assets/sass/static";
  .table-test {
    /*background: url(http://ou2blo0sw.bkt.clouddn.com/%E6%B7%A1%E8%93%9D%E8%89%B2%E5%B0%8F%E6%96%B9%E6%A0%BC%E6%9D%A1%E7%BA%B9.jpg) repeat;*/
    background-color: #2b50a9;
    color: #f7f7f7;
  }
  .table{
    width: 100%;
    color: #f7f7f7;
  }
</style>
