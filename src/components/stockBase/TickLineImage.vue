<template>
  <div class="tick-line-image" :style="`left:${x}px;top:${y}px;`">
    <img class="hide" :src="gifImg" alt="股票实时图" @load="checkLoaded" ref="imgElem">
    <div class="content" v-if="showGif && loaded">
      <img :src="gifImg" alt="股票实时图">
    </div>
  </div>
</template>
<script>
export default {
  name: 'StockProgressBar',
  data() {
    return {
      code: '',
      x: '',
      y: '',
      gifImg: 'http://image.sinajs.cn/newchart/small/nsh600022.gif',
      showGif: false,
      loaded: false,
    };
  },
  components: {
  },
  props: {
    foxxcode: {
      type: [String, Number],
      required: true,
    },
    clientX: {
      type: [String, Number],
      required: true,
    },
    clientY: {
      type: [String, Number],
      required: true,
    },
  },
  computed: {
  },
  methods: {
    show() {
      this.showGif = true;
    },
    // 图片加载完成
    checkLoaded() {
      this.loaded = true;
    },
    hide() {
      this.showGif = false;
    },
    codeTransform(foxxcode) {
      const code = `${foxxcode}`.split('.')[0];
      return (Number(code.charAt(0)) === 6 ? 'nsh' : 'nsz') + code;
    },
    init() {
      const vm = this;
      vm.code = vm.codeTransform(vm.foxxcode);
      vm.x = `${vm.clientX}`;
      vm.y = `${vm.clientY}`;
      vm.gifImg = `http://image.sinajs.cn/newchart/small/${vm.code}.gif`;
    },
  },
  watch: {
    foxxcode() {
      this.init();
      this.loaded = false;
    },
    clientX() {
      this.init();
    },
    clientY() {
      this.init();
    },
  },
  created() {
    this.init();
  },
  activated() {
    this.init();
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/sass/static";
  .tick-line-image {
    position: fixed;
    background: #fff;
    z-index: 1;
    .content {
      padding: 10px;
    }
  }
  .hide {
    display: none;
  }
</style>
