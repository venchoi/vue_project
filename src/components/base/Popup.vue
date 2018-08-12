<template>
  <transition name="fade-top">
    <div class="popup" v-if="isShow" @click-popupBg="hide" :size="750">
      <div class="popup-bg" @click="hide"></div>
      <div class="popup-dialog" :style="positionStyle">
        <div class="main-content">
          <slot></slot>
        </div>
      </div>

    </div>
  </transition>
</template>

<script>


  export default {
    name: 'popup',
    data() {
      return {
        top: 0,
      };
    },
    computed: {
      positionStyle() {
        const style = {};
        style.width = `${this.size}px`;
        style.top = `${this.top - 28}px`;
        return style;
      },
    },
    props: {
      isShow: {
        type: Boolean,
        default: false,
      },
      size: {
        type: Number,
        default: 600,
      },
    },
    mounted() {
      this.$emit('showPopup');
    },
    watch: {
      isShow: function isShow(newVal) {
        let fullHeight = 0;
        let dialogHeight = 0;

        if (newVal) {
          setTimeout(() => {
            fullHeight = this.$el.offsetHeight;
            dialogHeight = this.$el.querySelector('.popup-dialog').offsetHeight;

            this.top = (fullHeight - dialogHeight) / 2;
          }, 0);
        }
      },
    },
    methods: {
      hide(e) {
        this.$emit('click-popupBg', e);
      },
    },
  };
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/sass/static";

  .popup {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    margin: auto;
    text-align: center;
    z-index: 99;
    .popup-bg {
      width: 100%;
      height: 100%;
      background-color: $mask;
    }
    .popup-dialog {
      position: absolute;
      top: 10px;
      left: 0;
      right: 0;
      margin: auto;
    }
    .main-content {
      width: 100%;
    }
  }
</style>
