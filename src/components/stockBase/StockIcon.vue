<template>
  <i :class="classObject">
    <iconfont :iconName="iconType" :size="size"></iconfont>
  </i>
</template>

<script>
  import Iconfont from '../base/IconFont';

  export default {
    name: 'StockIcon',
    props: {
      iconName: {
        type: String,
      },
      value: {
        type: [Number, String],
        required: true,
        default: 0,
      },
      boundary: {
        type: [Number, String],
        default: 0,
      },
      size: {
        type: String,
      },
    },
    computed: {
      classObject() {
        const classObj = [];
        const value = parseFloat(this.value);
        if (value > this.boundary) {
          classObj.push('stock-rise');
        } else if (value < this.boundary) {
          classObj.push('stock-drop');
        } else {
          classObj.push('stock-stop');
        }
        return classObj;
      },
      iconType() {
        const value = parseFloat(this.value);
        let type = '';
        if (this.iconName) {
          return this.iconName;
        }
        if (value > this.boundary) {
          type = 'caret-up';
        } else if (value < this.boundary) {
          type = 'caret-down';
        } else {
          type = 'minus';
        }

        return type;
      },
    },
    components: {
      Iconfont,
    },
  };
</script>
