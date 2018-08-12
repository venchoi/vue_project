<template>
  <div class="body-content">
    <div class="top-menu">
      <tag-menu @toggleMenu="toggle" :config="['早报', '涨停分析','研报透析']" :initIndex="0"></tag-menu>
    </div>
    <div class="center-content">
      <reading :listData="reading" v-show="currentIndex === 0"></reading>
      <analysis :listData="analysis" v-show="currentIndex === 1"></analysis>
      <report :listData="analysis" v-show="currentIndex === 2"></report>
    </div>
  </div>
</template>

<script>
  import Reading from './Reading';
  import Analysis from './Analysis';
  import Report from './Report';
  import TagMenu from './TagMenu';
  import http from '../../plugins/http/http';

  export default {
    name: 'premium',
    data() {
      return {
        currentIndex: 0,
        reading: [],
        analysis: [],
        report: [],
      };
    },
    components: {
      TagMenu,
      Reading,
      Analysis,
      Report,
    },
    methods: {
      toggle(index) {
        this.currentIndex = index;
      },
    },
    watch: {
      reading() {
      },
      analysis() {
      },
    },
    created() {
      const vm = this;
      const httpList = http.apiList;
      const httpData = {
        type: 1,
      };
      http.api[httpList.GET_NEW_LIST]({
        success(response) {
          vm.reading = response;
          vm.analysis = response;
        },
        param: httpData,
      });
    },
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
