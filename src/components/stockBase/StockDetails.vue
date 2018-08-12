<template>
  <span v-text="formatValue" :class="classObject"></span>
</template>

<script>
  import format from '../../util/format';

  export default {
    name: 'stockDetails',
    data() {
      return {};
    },
    props: {
      /**
       * 处理模式
       */
      modal: {
        type: String, // 'follow' , 'inherit' , 'normal'
        default: 'inherit',
      },
      value: {
        type: [Number, String],
        default: '-',
      },
      weight: {
        type: String,
        default: 'normal',
      },
      boundary: {
        type: [Number, String],
        default: 0,
      },
      /**
       * 是否需要退市，默认是否
       */
      isNeedDelist: {
        type: [Number, String],
        default: 1,
      },
      showValue: {
        type: [Number, String, Boolean],
        default: false,
      },
      /**
       * 公共添加部分
       */
      unit: {
        type: String,
        default: '',
      },
      fixed: {
        type: [Boolean, Number, String],
        default: false,
      },
      prefix: false,
      format: {
        type: [Boolean, Number],
        default: 2,
      },
    },
    computed: {
      classObject() {
        const classObj = [];
        const value = parseFloat(this.value);
        const boundary = parseFloat(this.boundary);

        classObj.push(this.weight);
        switch (this.modal) {
          case 'follow':
            break;
          case 'inherit':
            classObj.push('inherit');
            break;
          case 'normal':
            if (value > boundary) {
              classObj.push('stock-rise');
            } else if (value < boundary) {
              classObj.push('stock-drop');
            } else {
              classObj.push('stock-stop');
            }
            break;
          default:
            break;
        }
        return classObj;
      },
      formatValue() {
        // 如果后台传过来的数据是'--'，就直接显示'--'，不用处理
        if (this.value === '--') {
          return this.value;
        }
        let value = parseFloat(this.value);
        let prefix;

        if (this.showValue) {
          return this.showValue;
        }

        if (this.fixed) {
          value = value.toFixed(this.fixed);
        }

        if (this.format) {
          value = format.num(value, 'cn', this.format);
        }
        // 通过将isNeedDelist转化为2位小数的数，判断其是否为0.00，如果是则表示退市，显示为-
        if (parseFloat(this.isNeedDelist).toFixed(2) === '0.00') {
          return '-';
        }

        if (value > 0) {
          prefix = '+';
        } else {
          prefix = '';
        }

        if (this.prefix) {
          value = prefix + value;
        }
        value += this.unit;
        return value;
      },
    },
    components: {},
    methods: {},
  };
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .bold {
    font-weight: bold;
  }

  .lighter {
    font-weight: lighter;
  }

  .normal {
    font-weight: normal;
  }
  .inherit{
    font-weight: inherit;
    color: inherit;
    font-size: inherit;
  }

</style>
