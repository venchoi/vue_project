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
      position: relative;
      float: left;
      height: 36px;
      line-height:36px;
      padding: 0 20px;
      font-size: $text;
      color: #838383;
      list-style: none;
      cursor: pointer;
      transition: all 400ms;
    }
    .current {
      color: #3370fe;
    }
    .current:after {
      content: '';
      display: block;
      position: absolute;
      bottom:0;
      left:0;
      width: 100%;
      height: 2px;
      background: #3370fe;
    }
  }
</style>
