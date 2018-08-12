<template>
  <div class="progress-bar" :class="type" :style="{height,width}">
    <div class="progress" :class="color" :style="style"></div>
  </div>
</template>

<script>

  export default {
    name: 'program',
    data() {
      return {};
    },
    props: {
      type: {
        type: String,
        default: 'horizontal', // vertical
      },
      max: {
        type: Number,
      },
      value: {
        type: [Number, String],
        default: 0,
      },
      length: {
        type: Number,
      },
      color: {
        type: String,
        default: 'gray',
      },
      height: String,
      width: String,

    },
    computed: {
      style() {
        let length;
        const result = {};
        if (this.length) {
          length = this.length;
        } else if (this.max > 0) {
          length = ((this.value / this.max) * 100).toFixed(2);
        } else {
          length = 0;
        }
        length += '%';

        if (this.type === 'horizontal') {
          result.width = length;
        } else {
          result.height = length;
        }

        return result;
      },
    },
    components: {},
    methods: {},
  };
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/sass/static";

  .progress-bar {
    display: inline-block;
    &.horizontal {
      width: 100%;
      .progress {
        height: 100%;
        min-width: 2%;
        max-width: 100%;
      }
    }
    &.vertical {
      height: 100%;
      .progress {
        width: 100%;
        min-height: 1%;
        max-height: 100%;
      }
    }

    .progress {
      &.red {
        background: $red;
      }
      &.green {
        background: $green;
      }
      &.gray {
        background: $gray;
      }
      &.white {
        background: $white;
      }
    }
  }
</style>
