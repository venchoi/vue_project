<template>
  <div class="tooltip" :style="{zIndex:zIndex}">
    <span class="text" @mouseover="over" @mouseout="out">
      <slot>{{content}}</slot>
    </span>
    <transition name="fade">
      <div v-show="isShow" class="tips" :class="position" :style="style">{{tips}}</div>
    </transition>
  </div>

</template>

<script>


  export default {
    name: 'Tooltip',
    data() {
      return {
        height: 0,
        width: 0,
        tipsWidth: 5,
        tipsHeight: 0,
        isShow: false,
        zIndex: 1,
      };
    },
    props: {
      content: {
        type: String,
        default: '',
      },
      position: {
        type: String,
        default: 'left',
      },
      tips: {
        type: String,
        default: '',
      },
    },
    computed: {
      style() {
        const style = {};
        const position = this.position;

        switch (position) {
          case 'top':
            style.top = `${(-this.tipsHeight - 5)}px`;
            break;
          case 'bottom':
            style.top = `${this.height + 10}px`;
            break;
          case 'left':
            style.left = `${(-this.tipsWidth - 10)}px`;
            break;
          case 'right':
            style.left = `${(this.width + 10)}px`;
            break;
          default:
            break;
        }
        return style;
      },
    },
    methods: {
      over() {
        const el = this.$el.querySelector('.text');
        const tips = this.$el.querySelector('.tips');
        this.isShow = true;
        setTimeout(() => {  // fix bug,set prop add into other thread
          this.width = el.offsetWidth;
          this.height = el.offsetHeight;
          this.tipsWidth = tips.offsetWidth;
          this.tipsHeight = tips.offsetHeight;
          this.zIndex = 100;
        }, 0);
      },
      out() {
        this.isShow = false;
      },
      afterLeave() {
        this.zIndex = 1;
      },
    },
  };
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .tooltip{
    position: relative;
    display: inline-block;
    z-index: 0;
    .text{
      cursor: pointer;
    }
    .tips{
      position: absolute;
      border-radius: 4px;
      padding: 2px 5px;
      background: #000;
      width: 120px;
      &.left{
        top:0;
        &:before{
          top:5px;
          left:100%;
          border-top: 5px solid transparent;
          border-bottom: 5px solid transparent;
          border-left: 6px solid #000;
        }
      }
      &.right{
        top:0px;
        &:before{
          top:5px;
          left:-5px;
          border-top: 5px solid transparent;
          border-bottom: 5px solid transparent;
          border-right: 6px solid #000;
        }
      }
      &.bottom{
        &:before{
          top:-5px;
          left:10px;
          border-left: 5px solid transparent;
          border-right: 5px solid transparent;
          border-bottom: 6px solid #000;
        }
      }
      &.top{

        &:before{
          top:100%;
          left:10px;
          border-left: 5px solid transparent;
          border-right: 5px solid transparent;
          border-top: 6px solid #000;
        }
      }
      &:before{
        content: '';
        position: absolute;
        width: 0;
        height: 0;
        z-index: 100;
      }
    }
  }
</style>
