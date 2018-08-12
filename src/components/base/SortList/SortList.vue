<template>
  <div class="sort-list" :tabindex=tabIndex @keyup="keyUp($event,sortData)">
    <div class="head" ref="head">
      <slot name="head"></slot>
    </div>
    <div :class="['body', {fixed:isHeadFixed, hover:isRowHover}]" :style="bodyStyle">
      <div class="row" v-for="(row, index) in sortData" @mousedown.right="bodyColumnRightDown(row,index,$event)" @click="bodyColumnClick(row,index,$event)" :class="row.class">
        <slot v-for="(item,key) in row" :name="'slot_'+key" v-if="keySet[key]" :item="item" :row="row" :index="index">
         </slot>
      </div>
    </div>
  </div>

</template>

<script>
  import ListColumn from './ListColumn';
  import {
    baseUtil,
  } from '../../../util';

  export default {
    name: '',
    data() {
      return {
        keys: {},
        sortStatus: {}, // 0升序 1降序
        sortData: [], // 数据
        tabIndex: false,
        bodyStyle: {
          'max-height': '',
        },
      };
    },
    props: {
      data: [Object, Array],
      itemStyle: Object,
      isGetFocus: { // 是否获取焦点
        type: [Boolean],
        default: false,
      },
      defaultSort: { // 默认排序
        type: Object,
        default() {
          return {
            prop: '',
            order: '',
          };
        },
      },
      isHeadFixed: { // 是否固定表头
        type: [Boolean],
        default: false,
      },
      isRowHover: { // row是否有hover状态
        type: [Boolean],
        default: false,
      },
    },
    computed: {
      keySet() {
        return this.keys;
      },
    },
    components: {
      ListColumn,
    },
    mounted() {
      this.sortData = baseUtil.copy(this.data);
      if (this.isGetFocus === true) { // 获取焦点
        this.tabIndex = 1;
      }
      if (this.defaultSort.prop) { // 默认排序
        this.sortStatus[this.defaultSort.prop] = (this.defaultSort.order === 1 ? 0 : 1);
        this.sort(this.defaultSort.prop);
      }
      if (this.isHeadFixed) { // 固定表头
        this.bodyStyle['max-height'] = `calc(100% - ${this.$refs.head.clientHeight}px)`;
      }
    },
    watch: {
      data() {
        this.sortData = baseUtil.copy(this.data);
        baseUtil.each(this.sortStatus, (s, k) => {
          if (s) {
            this.sortStatus[k] = 0;
          } else {
            this.sortStatus[k] = 1;
          }
          this.sort(k);
        });
      },
    },
    methods: {
      columnUpdate(key, config) {
        if (!this.keys[key]) {
          this.$set(this.keys, key, {
            ...config,
            ...this.itemStyle,
          });
        }
      },
      bodyColumnClick(row, index, event) {
        this.$emit('item-click', {
          index,
          row,
          event,
        });
      },
      bodyColumnRightDown(row, index, event) {
        this.$emit('item-right-down', {
          index,
          row,
          event,
        });
      },
      keyUp(event, data) { // 键盘事件
        this.$emit('keyUp', {
          event,
          data,
        });
      },
      sort(k) {
        if (this.sortStatus[k]) {
          this.sortData = this.sortData.sort((a, b) => a[k] - b[k]);
          this.sortStatus[k] = 0;
        } else {
          this.sortStatus[k] = 1;
          this.sortData = this.sortData.sort((a, b) => b[k] - a[k]);
        }
      },
    },
  };
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../../assets/sass/static";

  .sort-list {
    width: 100%;
    height: 100%;
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
      &.hover{
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
