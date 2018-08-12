<template>
  <div class="table-body">
    <div>TableBody</div>
    <table-row :rowData="rowData"></table-row>
  </div>
</template>

<script>
  import TableRow from './TableRow';

  export default {
    name: 'TableBody',
    data() {
      return {
        renderList: [], // 当前渲染数据列表
        rowData: {}, // 行数据
      };
    },
    components: {
      TableRow,
    },
    props: {
      /**
       * 从父组件获取所要显示的列表数据，
       * listData: 列表数据；数组形式
       * */
      listData: {
        type: Array,
        required: true,
        default: [],
      },
      /**
       * 从父组件获取列名信息
       * columnConfig: 列名数据；对象形式
       * */
      columnConfig: {
        type: Object,
        default: {},
      },
      hoverColor: String, // 鼠标悬停颜色
      activeColor: String, // 鼠标点击颜色
      isHeadFixed: Boolean, // 表头是否固定
      canDrag: Boolean, // 是否可以拖拽
    },
    created() {
      this.rowData = this.listData.slice(0, 1);
    },
    computed: {
    },
  };
</script>

<style lang="scss" scoped>
  .table-body{
    background-color: transparent;
    height: 100%;
    width: 100%;
    font-size: 40px;
  }
</style>
