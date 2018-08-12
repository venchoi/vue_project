<template>
    <div class="drop-panel" v-show="isShow" @click="click">
      <slot></slot>
    </div>
</template>

<script>

  export default {
    name: '',
    data() {
      return {};
    },
    props: {
      isShow: {
        type: Boolean,
        default: false,
      },
    },
    computed: {},
    methods: {
      click(e) {
        this.$emit('click-dropPanel', e);
      },
    },
  };
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .drop-panel {
    width: 100%;
    height: 100%;
  }
</style>
