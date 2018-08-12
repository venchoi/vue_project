<template>
  <div class="tag">
    <template v-if="position === 'top'">
      <div class="tag-body top">
        <div class="tag-panel" v-for="(item, index) in items" v-show="index === active">
          <slot :name="'panel_' + index"></slot>
        </div>
      </div>
    </template>
    <div class="tag-head" :class="{'border':border}" :style="tabHeadStyle">
      <div class="tab-item" v-for="(item,index) in items" :class="{'active':index === active}"
           @click="tagClick(index,$event)" v-html="item">
      </div>
    </div>
    <template v-if="position === 'bottom'">
      <div class="tag-body">
        <div class="tag-panel" v-for="(item, index) in items" v-show="index === active">
          <slot :name="'panel_' + index"></slot>
        </div>
      </div>
    </template>
  </div>
</template>

<script>

  export default {
    name: '',
    data() {
      return {
        active: this.type === 'toggle' ? null : 0,
      };
    },
    props: {
      type: {
        type: String,
        default: 'normal', // normal event toggle
      },
      position: {
        type: String,
        default: 'bottom', // top
      },
      items: { // tag
        type: Array,
        required: true,
      },
      height: {
        type: String,
        default: '34px',
      },
      border: {
        type: Boolean,
        default: false,
      },
      tagEvent: {
        type: Function,
        default: () => {
        },
      },
    },
    computed: {
      tabHeadStyle() {
        const style = {};
        if (this.border) {
          style.height = this.height;
          style.lineHeight = '24px';
        } else {
          style.height = this.height;
          // 底部border的高度是2px，line-height要比height的值小2
          const lineHeight = parseInt(this.height.replace('px', ''), 10) - 2;
          style.lineHeight = `${lineHeight}px`;
        }
        return style;
      },
    },
    components: {},
    methods: {
      tagClick(active, e) {
        if (this.type === 'event') {
          this.tagEvent(this.active, active, e);
          this.active = active;
        } else if (this.type === 'toggle') {
          if (this.active === active) {
            this.active = null;
          } else {
            this.active = active;
          }
        } else {
          this.active = active;
        }
      },
      setActive(index) {
        this.active = index;
      },
    },
  };
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/sass/static";

  .tag {
    position: relative;
    width: 100%;
    height: 100%;
    background-color: $background;
    .tag-head {
      width: 100%;
      &.border{
        border-top: 1px solid $G5;
        border-bottom: 1px solid $G5;
      }
      @extend %cf;
      .tab-item {
        float: left;
        padding: 0 15px;
        user-select: none;
        cursor: pointer;
        transition: all 0.3s;
        font-size: 13px;
        color: $G2;
        &:hover,
        &.active {
          color: $blue4;
          border-bottom: 2px solid $blue4;
        }
      }
    }
    .tag-body {
      position: relative;
      .tag-panel {
        width: 100%;
      }
      &.top {
        height: calc(100% - 36px);
        width: 100%;
        margin: auto;
        .tag-panel {
         height: 100%;
          width: 100%;
        }
      }
    }
  }
</style>
