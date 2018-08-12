<template>
  <div class="associate">
    <drop-panel :isShow="isShow">
      <div class="head">
        qweqwe
      </div>
      <div class="list">
        <div class="item" v-for="item in result" @click="clickItem(item.code)">
          {{item.name}}  {{item.code}}
        </div>
      </div>
    </drop-panel>
  </div>
</template>

<script>
  import DropPanel from './base/DropPanel';

  export default {
    name: '',
    data() {
      return {
        result: [
          {
            code: '000002',
            name: '测试1',
          },
          {
            code: '050002',
            name: '测试2',
          },
          {
            code: '030002',
            name: '测试3',
          },
        ],
      };
    },
    props: {
      isShow: {
        type: Boolean,
        default: true,
      },
    },
    computed: {},
    components: {
      DropPanel,
    },
    methods: {
      clickItem() {
        this.isShow = false;
      },
      hide() {
        this.isShow = false;
      },
    },
  };
</script>

<style lang="scss" rel="stylesheet/scss" scoped="">
  .item{
    cursor: pointer;
  }
</style>
