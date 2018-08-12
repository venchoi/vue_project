<template>
  <div class="tendency">
    <div class="body-left">
      <tendency-left></tendency-left>
    </div>
    <div class="body-right">
      <tendency-right></tendency-right>
    </div>
  </div>
</template>

<script>
  import TendencyLeft from './Left';
  import TendencyRight from './Right';

  export default {
    name: 'Tendency',
    data() {
      return {
      };
    },
    props: {
    },
    components: {
      TendencyLeft,
      TendencyRight,
    },
    methods: {
    },
    created() {
    },
    watch: {
    },
    computed: {

    },
  };
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/sass/static";
  .tendency{
    height: 100%;
    width: 100%;
    > *{
      float: left;
      height: 100%;
    }
    .body-left{
      width: 64%;
    }
    .body-right{
      width: 36%;
    }
  }
</style>
