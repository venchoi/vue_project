<template>
  <div class="table-row">
    <div>TableRow</div>
    <span v-for="cell in rowData" class="table-cell">
      {{ cell }}
    </span>
  </div>
</template>

<script>
  export default {
    name: 'TableRow',
    data() {
      return {
        rowData: [], // 当前行数据
      };
    },
    props: {
      /**
       * 从父组件获取所要显示的列表数据，
       * rowData: 当前行数据，对象形式，必填字段
       * */
      rowData: {
        type: Object,
        required: true,
        default: {
          num: 1,
          code: '000000',
          name: '云智投',
          info: '欢迎使用云智投！',
        },
      },
      /**
       * 从父组件获取列样式信息
       * columnStyle: 数组
       * */
      columnStyle: {
        type: Array,
        default: [],
      },
      canDrag: Boolean, // 是否可以拖拽
    },
  };
</script>

<style lang="scss" scoped>
  .table-row{
    background-color: transparent;
    height: 100%;
    width: 100%;
    .table-cell{
      margin: 0 10px;
    }
  }
</style>
