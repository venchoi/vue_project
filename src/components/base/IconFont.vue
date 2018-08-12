<template>
  <i class="fa" :class="'fa-'+iconName" :style="{fontSize:size,color}"></i>
</template>

<script>
    export default {
      name: 'iconfont',
      props: {
        iconName: {
          type: String,
          required: true,
        },
        color: {
          type: String,
          default: 'inherit',
        },
        size: {
          type: String,
          default: 'inherit',
          validator: v => (v === 'inherit' || /px/.test(v)),
        },
      },
    };
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  i{
    cursor: pointer;
  }
</style>

