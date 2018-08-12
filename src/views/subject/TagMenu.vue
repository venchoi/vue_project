<template>
  <div class="tag-menu clear">
    <div v-for="(item, index) in menuList" :class="{'current': currentIndnx === index }" @click="toggle(index)">{{item}}</div>
  </div>
</template>

<script>
  export default {
    name: 'TagMenu',
    data() {
      return {
        currentIndnx: Number(this.initIndex),
        menuList: this.config,
      };
    },
    props: {
      config: {
        type: Array,
        require: true,
      },
      initIndex: {
        type: [String, Number],
        require: false,
        default: 0,
      },
    },
    components: {
    },
    methods: {
      toggle(index) {
        this.currentIndnx = index;
        this.$emit('toggleMenu', index);
      },
    },
    computed: {
    },
    watch: {
      initIndex() {
        this.currentIndnx = this.initIndex;
      },
      config() {
        this.menuList = this.config;
      },
    },
    created() {
    },
  };
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/sass/static";
  *{
    padding: 0;
    margin: 0;
  }
  .clear {*zoom: 1;}
  .clear:after {
    content: '';
    display: block;
    width:100%;
    height:0;
    clear: both;
  }
  .fl {
    float: left;
  }
  .fr {
    float: right;
  }
  .fcolor {
    color: #F5BA53;
  }
  .text_hide {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .tag-menu {
    position: relative;
    width: 100%;
    height: 100%;
    div {
      list-style: none;
      position: relative;
      float: left;
      z-index: 0;
      text-align: center;
      font-size: 16px;
      color: #838383;
      padding: 0 20px;
      margin-left: -10px;
      cursor: pointer;
      min-width: 160px;
      height: 46px;
      line-height: 46px;
      width: auto;
      border-bottom: 46px solid #2b2b2b;
      border-left: 21px solid transparent;
      border-right: 21px solid transparent;
      transition: all 300ms;
      &:first-child{
        margin-left: 0;
        border-left: 0;
      }
    }
    .current {
      z-index: 2;
      border-bottom-color:#4d4d4d;
      color: #fff;
    }
  }
</style>
