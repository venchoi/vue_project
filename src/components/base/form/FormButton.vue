<template>
  <div class="button" :class="buttonClass" @click="click">
    <slot></slot>
  </div>
</template>

<script>

  export default {
    name: 'FormButton',
    data() {
      return {};
    },
    props: {
      type: {
        type: String,
        default: 'large', // mid small
      },
      binding: {
        type: [Object, Boolean],
        default: false,
      },
    },
    computed: {
      buttonClass() {
        const result = {};
        result.pass = this.isPass;
        result[this.type] = true;
        return result;
      },
      isPass() {
        let result = true;
        if (this.$parent && typeof this.$parent.isReady !== 'undefined') {
          result = this.$parent.isReady;
        }
        return result;
      },
    },
    methods: {
      click() {
        if (this.isPass) {
          this.$parent.submit();
        }
      },
    },
  };
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../../assets/sass/static";

  .button {
    height: 31px;
    line-height: 31px;
    background-color: $G2;
    color: $white;
    margin-bottom: 13px;
    border-radius: 8px;
    cursor: no-drop;
    text-align: center;
    transition: all 0.5s;
    &.pass {
      cursor: pointer;
      background-color: $green;
      &:hover {
        opacity: 0.4;
      }
    }
  }
</style>
