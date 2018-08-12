<template>
  <div class="tendency-left">
    <div class="top">
      <left-top></left-top>
    </div>
    <div class="main">
      <left-main></left-main>
    </div>
  </div>
</template>

<script>
  import LeftTop from './LeftTop';
  import LeftMain from './LeftMain';

  export default {
    name: 'TendencyLeft',
    data() {
      return {};
    },
    components: {
      LeftTop,
      LeftMain,
    },
    methods: {},
  };
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/sass/static";
  .tendency-left{
    position: relative;
    height: 100%;
    width: 100%;
    .top{
      height: 70px;
      background: $G4;
    }
    .main{
      position: absolute;
      top:70px;
      bottom: 0;
      left: 0;
      right: 0;
      margin: auto;
    }
  }
</style>
