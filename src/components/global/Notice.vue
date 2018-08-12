<template>
  <div class="global-notice" v-show="isShow">
    <div class="container">
      <drop-panel-transition transition="fade-scale" :isShow="isShow">
        <div class="content">
          <iconfont iconName="check-circle" color="#00E600" v-if="status === 'success'"></iconfont>
          <iconfont iconName="times-circle" color="#FF3232" v-if="status === 'fail'"></iconfont>
          {{content}}
        </div>
      </drop-panel-transition>
    </div>
  </div>
</template>

<script>
  import {
    mapState,
  } from 'vuex';

  import DropPanelTransition from '../base/DropPanel-Transition';
  import Iconfont from '../base/IconFont';

  export default {
    name: 'globalTips',
    computed: {
      ...mapState({
        isShow: state => state.notice.isShow,
        status: state => state.notice.status,
        content: state => state.notice.content,
      }),
    },
    components: {
      Iconfont,
      DropPanelTransition,
    },
  };
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/sass/static";
  .global-notice{
    position: fixed;
    top:50px;
    left: 0;
    right: 0;
    margin: 0 auto;
    z-index: 19999;
    text-align: center;
    .container{
      display: inline-block;
      max-width: 50%;
      margin: 0 auto;
    }
    .content{
      border-radius: 5px;
      color: $black;
      font-size: 13px;
      background: #fff;
      padding: 5px 10px;
      @extend %text-ellipsis;
    }
  }
</style>
