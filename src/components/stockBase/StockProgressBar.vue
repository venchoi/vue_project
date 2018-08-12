<template>
  <progress-bar :color="color" :height="height" :max="max" :value="value"></progress-bar>
</template>
<script>
  import ProgressBar from '../base/ProgressBar';

  export default {
    name: 'StockProgressBar',
    data() {
      return {

      };
    },
    components: {
      ProgressBar,
    },
    props: {
      boundary: {
        type: [Number, String],
        default: 0,
      },
      close: {
        type: [Number, String],
        default: 0,
      },
      height: {
        type: String,
        default: '7px',
      },
      max: {
        type: Number,
      },
      value: {
        type: [Number, String],
        default: 0,
      },
    },
    computed: {
      color() {
        const value = parseFloat(this.close);
        const boundary = parseFloat(this.boundary);
        let color;
        if (value > boundary) {
          color = 'red';
        } else if (value < boundary) {
          color = 'green';
        } else {
          color = 'white';
        }
        return color;
      },
    },
  };
</script>
