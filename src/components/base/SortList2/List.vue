<template>
  <div class="sort-list" @keydown="this.keyDown($event)" v-recive-global-event="'click'" :style="listStyle">
    <div class="colmn">
      <slot></slot>
    </div>
    <config-dialog ref="configDialog" :config="contextMenu"></config-dialog>
    <list-head
    :columnConfig="headColumnConfig"
    :headStyle="headStyle"
    :isFixed="isHeadFixed"
    :sortStatus="sortStatus"
    @sort='sort'></list-head>
    <list-row ref="row"
    :listData="listData"
    :columnConfig="bodyColumnConfig"
    :isHeadFixed="isHeadFixed"
    :hoverColor="hoverColor"
    :activeColor="activeColor"
    :canDrag="canDrag"
    @activeChange="activeUpdate"
    @viewListChange="viewListChange"
    @rowClick="rowClick"
    @rowRightClick="rowRightClick"
    @doubleClick="doubleClick"
    @dragDone="dragDone"></list-row>
  </div>
</template>


<script>
  import { baseUtil } from '../../../util';
  import ListColumn from './ListColumn';
  import ListRow from './ListRow';
  import configDialog from './Dialog';
  import ListHead from './ListHead';

  export default {
    name: 'list',
    data() {
      return {
        headColumnConfig: {}, // 表头设置
        bodyColumnConfig: {}, // 行设置
        sortStatus: {}, // 排序类型：0升序 1降序 2非处于升序或降序状态
        sortData: [], // 数据
        tabIndex: false, // 无用属性
        bodyStyle: {
          'max-height': '',
        },
      };
    },
    props: {
      listData: [Object, Array], // 所有要显示的列表数据
      isHeadFixed: { // 是否固定表头
        type: [Boolean],
        default: true,
      },
      canDrag: { // 是否可拖拽
        type: [Boolean],
        default: false,
      },
      listHeight: {  // 列表高度
        type: [String],
        default: '100%',
      },
      listWidth: {  // 列表宽度
        type: [String],
        default: '100%',
      },
      hoverColor: String,
      activeColor: String,
      headStyle: {
        type: Object,
        default: () => {},
      },
      contextMenu: Array, // 右键配置
      customSortMap: { // 是否有自定义的排序方法
        type: Object,
        default: () => {},
      },
    },
    computed: {
      listStyle() {
        const style = {};
        style.height = this.listHeight;
        style.width = this.listWidth;
        return style;
      },
    },
    components: {
      ListHead,
      ListColumn,
      ListRow,
      configDialog,
    },
    mounted() {
      this.$on('click', () => {
        this.$refs.configDialog.isShow = false; // 点击关闭右键弹框
      });
    },
    methods: {
      /**
       * 更新列信息。
       * 注意：该方法在listColumn中被调用，用来设置headColumnConfig和bodyColumnConfig的值；
       * @param key - 列标识
       * @param config - 列设置
       */
      columnUpdate(key, config) {
        const bodyConfig = config;
        const style = config.style;
        bodyConfig.style = {};
        if (style.width) {
          bodyConfig.style.width = style.width;
        }
        this.$set(this.headColumnConfig, key, {
          ...config,
        });
        this.$set(this.bodyColumnConfig, key, {
          ...bodyConfig,
        });
      },
      /**
       * 向父组件提交单击事件
       */
      rowClick($event, row, $index) {
        this.$emit('rowClick', $event, row, $index);
        this.$refs.configDialog.isShow = false;
      },
      /**
       *  向父组件提交鼠标右键事件，并传递当前的鼠标位置（作为弹窗的位置信息）
       *  注意：坐标获取可能有浏览器适配问题
       */
      rowRightClick($event, row, $index) {
        this.$emit('rowRightClick', $event, row, $index);
        const dialog = this.$refs.configDialog;
        const x = $event.x;
        const y = $event.y;
        dialog.update(row, x, y);
      },
      /**
       *  向父组件提交双击事件
       */
      doubleClick(row) {
        this.$emit('doubleClick', row);
      },
      /**
       *  向父组件提交拖拽结束事件，提交拖拽开始和结束位置给父组件进行进一步操作
       */
      dragDone(dragStart, dragEnd) {
        this.$emit('hasdraged', dragStart, dragEnd);
      },
      /**
       *  获取listRow中鼠标点击行的提交的activeChange事件，并提交给父组件
       */
      activeUpdate(columnId, row) {
        this.$emit('activeUpdate', columnId, row);
      },
      /**
       *  listRow中每次更新渲染队列后会向父组件提交viewListChange事件，
       *  这里是list对listRow提交的viewListChange的处理：将其提交给父组件
       */
      viewListChange(viewList) {
        this.$emit('viewListChange', viewList);
      },
      /**
       * 排序函数，如果被排序的列有自定义的排序函数，则提交排序事件
       * 如果被排序的列没有自定义的排序函数，则使用数组自带的排序函数实现
       * 排序操作完成后，toggle当前列排序状态，并注意将其他列的排序状态置为2（非升非降）
       * */
      sort(k) {
        const vm = this;
        const status = vm.sortStatus; // 排序状态，升序或降序，键值为数值
        const map = vm.customSortMap; // 是否有自定义排序， 键值为布尔值
        if (status[k]) { // 升序
          status[k] = 1;
          if (!map || !map[k]) { // 升序，无自定义排序函数
            vm.listData.sort((a, b) => a[k] - b[k]);
          } else { // 升序，有自定义排序函数
            vm.$emit('customSort', k, status[k]);
          }
          baseUtil.each(status, (s, key) => {
            if (key === k) {
              status[k] = 0;
            } else {
              status[key] = 2;
            }
          });
        } else if (!map || !map[k]) { // 非升序，无自定义的排序函数
          status[k] = 0;
          vm.listData.sort((a, b) => b[k] - a[k]);
          baseUtil.each(status, (s, key) => {
            if (key === k) {
              status[k] = 1;
            } else {
              status[key] = 2;
            }
          });
        } else { // 非升序，有自定义的排序函数
          status[k] = 0;
          vm.$emit('customSort', k, status[k]);
          baseUtil.each(status, (s, key) => {
            if (key === k) {
              status[k] = 1;
            } else {
              status[key] = 2;
            }
          });
        }
      },
      /**
       * 清空行数据
       */
      clear() {
        this.$refs.row.clear();
      },
    },
    deactivated() {
      // 离开页面时，清除排序状态
      this.sortStatus = {};
    },
  };
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../../assets/sass/static";

  .sort-list {
    position: relative;
    &:focus{
      outline:none;
    }
    .head {
      width: 100%;
      @extend %cf;
    }
    .body {
      width: 100%;
      &.fixed{
        overflow-y:scroll;
      }
      &.hover{ // 样式设置目前没起作用。
        .row{
          &:hover{
            background-color: $G5;
          }
        }
      }
      .row {
        width: 100%;
        &.active{
         background-color: $G5;
        }
        @extend %cf;
        .item {
          float: left;
        }
      }
    }
  }
</style>
