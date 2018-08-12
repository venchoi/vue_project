<template>
  <div class="top-menu-wrap">
    <ul class="clear">
      <li v-for="(item, index) in list" :key="1" v-on:click="clickMenu(item.id)" :class="{current: currentNum === index}">{{item.title}}</li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: 'TopMenu',
    data() {
      return {
        list: this.titleList,
        currentNum: 0,
      };
    },
    props: {
      titleList: Array,
    },
    methods: {
      clickMenu(id) {
        const vm = this;
        const menuObj = {};
        menuObj.id = id;
        vm.$emit('clickMenu', menuObj);
        vm.currentNum = id;
      },
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
  .top-menu-wrap {
    position: relative;
    width: 100%;
    height: 54px;
    padding-top: 10px;
    overflow-x: auto;
    ul {
      position: relative;
      display: block;
      li {
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
        height: 44px;
        line-height: 44px;
        width: auto;
        border-bottom:44px solid $G4;
        border-left:21px solid transparent;
        border-right:21px solid transparent;
        -webkit-transition: all 300ms;
        -moz-transition: all 300ms;
        -ms-transition: all 300ms;
        -o-transition: all 300ms;
        transition: all 300ms;
      }
      .current {
        color: red;
        z-index: 2;
        border-bottom:44px solid $G5;
        color: #fff;
      }
      li:first-child {
        margin-left:0;
        border-left:0;
      }
    }
  }
</style>
