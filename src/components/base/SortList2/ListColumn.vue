
<script>
  export default {
    name: 'ListColumn',
    data() {
      return {
      };
    },
    props: {
      /*
      * 是否是附属列（附属列显示在行下作为独立一行）
      * */
      auxiliary: {
        type: Boolean,
        default: false,
      },
      /**
       * 列别称
       */
      prop: {
        type: String,
        required: true,
      },
      /**
       * 是否排序
       */
      sort: {
        type: Boolean,
        default: false,
      },
      /**
       * 列名列标
       */
      label: {
        type: [String, Boolean],
        default: this.property,
      },
      /**
       * 排序样式
       */
      icon: {
        type: [String, Boolean],
      },
      /**
       * 列样式
       */
      colStyle: {
        type: Object,
        default: {},
      },
    },
    render() {},
    created() {
      this.configMaker();
    },
    updated() {
      this.configMaker();
    },
    mounted() {
    },
    computed: {
    },
    components: {},
    methods: {
      /**
       * 无用代码
       */
      clickColumn() {
        if (this.sort) {
          this.$parent.sort(this.property);
        }
      },
      /**
       * 对列的渲染，也是通过render函数进行的
       */
      configMaker() {
        /**
         * render函数实现列渲染
         * @param h - createElement方法用于创建VNode
         * @param data - context参数，提供上下文信息，这里是行信息
         * @returns 返回列的HTML结构
         * 处理过程：cell 保存列的html结构
         * 如果有作用域插槽则将其信息赋值给cell；
         * 否则如果有slot插槽则将其信息赋值给cell；
         * 否则直接获取row数据生成html结构
         */
        const render = (h, data) => {
          let cell = null; // cell 保存表头html结构
          const row = data.row;
          if (this.$scopedSlots.default) {
            cell = this.$scopedSlots.default({
              ...data,
            });
          } else if (this.$slots.default) {
            cell = this.$slots.default;
          } else {
            cell = <div>{row[this.prop]}</div>;
          }
          if (this.auxiliary && (row[this.prop] === '' || typeof row[this.prop] === 'undefined')) {
            return '';
          }
          return <div class="cell" key={data.$index} style={this.colStyle}>
          {
            cell
          }
          </div>;
        };
        /**
         * 调用list.vue中的columnUpdate方法,对list中headColumnConfig操作
         * 即向list传入列设置信息，包括样式、排序判断、标签（名称）等。
         */
        this.$parent.columnUpdate(this.prop, {
          style: this.colStyle, // 列样式
          label: this.label, // 列标签（名称）
          isSort: this.sort, // 是否可排序
          icon: this.icon, // 排序标识
          render,
          auxiliary: this.auxiliary,
        });
      },
    },
  };
</script>

