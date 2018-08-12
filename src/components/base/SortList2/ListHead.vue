<template>
  <div class="list-head" :class="{fixed: isFixed}">
    <div class="cell" v-for="(col, prop) in columnConfig" :key="prop" :style="styleMaker(col.style)" @click="cellClick($event, col, prop)" v-if="!col.auxiliary">
      <span :class="{pointer: col.isSort}">
        {{col.label}}
        <!-- 如果是可排序的，并且是处于排序状态时，显示相应的排序图片，其他情况下显示默认的icon -->
        <img v-if="col.isSort && sortStatus[prop] === 0" src="../../../assets/image/up.png" class="sortStatus">
        <img v-else-if="col.isSort && sortStatus[prop] === 1" src="../../../assets/image/down.png" class="sortStatus">
        <iconfont v-else-if="col.isSort && sortStatus[prop] === 2" :iconName="col.icon"></iconfont>
        <iconfont v-else-if="col.icon" :iconName="col.icon"></iconfont>
      </span>
    </div>
  </div>
</template>

<script>
  import {
    baseUtil,
  } from '../../../util';
  import Iconfont from '../IconFont';

  export default {
    name: 'ListHead',
    data() {
      return {
        style: {},
      };
    },
    props: {
      columnConfig: {
        type: Object,
        default: {},
      },
      headStyle: {
        type: Object,
        default: () => {},
      },
      isFixed: Boolean,
      sortStatus: {
        type: Object,
        default: () => {},
      },
    },
    created() {
      baseUtil.merge(this.style, this.headStyle, true);
    },
    mounted() {},
    components: {
      Iconfont,
    },
    methods: {
      /**
       * 点击表头元素，提交排序信息
       * @param event - 点击事件
       * @param col - 每一列信息
       * @param prop - 当前列位置
       * 如果是可排序的行则提交排序事件。
       */
      cellClick(event, col, prop) {
        const isSort = col.isSort;
        if (isSort) {
          this.$emit('sort', prop);
        }
      },
      styleMaker(style) {
        return baseUtil.merge(style, this.style);
      },
    },
  };
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .list-head{
    width: 100%;
    display: flex;
    line-height: 25px;
    text-align: center;
    color: #949494;
    font-size: 13px;
    background: inherit;
    &.fixed{
      position: absolute;
      z-index: 9;
    }
    .pointer {
      cursor: pointer;
    }
    .sortStatus {
      height: 50%;
    }
  }
</style>
