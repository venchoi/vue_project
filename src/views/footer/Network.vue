<template>
  <drop-panel-transition :isShow="isShow" transition="fade-top">
    <div class="head">
      网络链接
    </div>
    <div class="list">
      <div class="item" v-for="(item,index) in list" @click="show(index)">
        <span class="name">{{item}}</span>
        <span class="delay">198ms</span>
        <span class="state">良好</span>
        <span class="choose" v-show="index === showItem">
          <iconfont iconName="check-circle" size="15px"></iconfont>
        </span>
      </div>
    </div>
  </drop-panel-transition>
</template>

<script>
  import DropPanelTransition from '../../components/base/DropPanel-Transition';
  import Iconfont from '../../components/base/IconFont';

  export default {
    name: '',
    data() {
      return {
        showItem: 1,
        list: [
          '广州电信1',
          '广州电信2',
          '北京联通1',
          '北京电信1',
          '深圳电信1',
        ],
      };
    },
    props: {
      isShow: {
        type: Boolean,
        default: false,
      },
    },
    components: {
      Iconfont,
      DropPanelTransition,
    },
    computed: {
    },
    methods: {
      show(index) {
        this.showItem = index;
      },
    },
  };
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/sass/static";
  .head{
    text-align: center;
    background: $blue1;
  }
  .list{
    padding: 5px;
    width: 200px;
    background: $black;
    color: $white;
    @extend %cf;
    .item{
      >span{
        float: left;
        text-align: center;
      }
      .name{
        width: 33%;
      }
      .delay{
        width: 27%;
      }
      .state{
        width: 27%;
      }
    }
  }
</style>
