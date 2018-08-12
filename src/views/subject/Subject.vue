<template>
  <div class="body-content">
    <div class="top-menu">
      <tag-menu @toggleMenu="toggle" :config="['热门题材']" :initIndex="0"></tag-menu>
    </div>
    <div class="center-content">
      <hot-news v-show="currentIndex === 0"></hot-news>
    </div>
  </div>
</template>

<script>
  import TagMenu from './TagMenu';
  import HotNews from './HotNews';

  export default {
    name: 'premium',
    data() {
      return {
        currentIndex: 0,
      };
    },
    components: {
      TagMenu,
      HotNews,
    },
    methods: {
      toggle(index) {
        this.currentIndex = index;
      },
    },
    watch: {},
    created() {},
  };
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/sass/static";
  *{
    padding: 0;
    margin: 0;
  }
  .body-content{
    width: 100%;
    height: 100%;
    .top-menu{
      width: 100%;
      height: 46px;
      margin-top: 10px;
    }
    .center-content{
      width: 100%;
      height: calc(100% - 56px);
    }
  }
</style>
