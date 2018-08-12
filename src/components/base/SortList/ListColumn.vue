<template>
  <div class="list-column" @click="clickColumn" :style="style">
    <slot name="content" >
      {{property}}
    </slot>
  </div>
</template>

<script>


  export default {
    name: 'ListColumn',
    data() {
      return {};
    },
    props: {
      property: String,
      sort: {
        type: Boolean,
        default: false,
      },
      width: {
        type: String,
        default: 'auto',
      },
    },
    created() {
      this.$parent.columnUpdate(this.property, {
        width: this.width,
      });
    },
    computed: {
      style() {
        const result = {};
        if (this.width.indexOf('px') || this.width.indexOf('%')) {
          result.width = this.width;
        } else {
          result.width = this.width;
        }
        if (this.sort) {
          result.cursor = 'pointer';
        }
        return result;
      },
    },
    components: {},
    methods: {
      clickColumn() {
        if (this.sort) {
          this.$parent.sort(this.property);
        }
      },
    },
  };
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .list-column {
    float: left;
  }
</style>
