<template>
  <div class="base-table">
    <div>BaseTable</div>
    <div class="table-head">
      <slot name="tableHead"></slot>
    </div>
    <div class="table-body">
      <slot name="tableBody"></slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'BaseTable',
  };
</script>

<style lang="scss" scoped>
  .base-table{
    background-color: transparent;
    height: 100%;
    width: 100%;
    font-size: 30px;
  }
</style>
