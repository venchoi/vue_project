<template>
  <div class="from">
    <template v-for="item in config">
      <form-input :name="item.name" :placeholder="item.placeholder" :binding="postData" :reg="item.reg"
                  :icon="item.icon"></form-input>
    </template>
    <slot></slot>
  </div>
</template>

<script>
  import {
    baseUtil,
  } from '../../../util';
  import FormInput from './FormInput';

  /**
   * @example
   *
   * props.api = {
   *  url, // apiList 的key
   *  success,
   *  fail,
   *  complete,
   * }
   */

  export default {
    name: '',
    data() {
      return {
        postData: {},
        ready: {},
      };
    },
    components: {
      FormInput,
    },
    computed: {
      isReady() {
        let result = true;
        baseUtil.each(this.ready, (r) => {
          result = result && r;
        });
        return result;
      },
    },
    props: {
      /**
       * 接受父组件传递的api数据
       * {
       *    url,
       *    success,
       *    fail,
       * }
       */
      api: {
        type: Object,
        required: true,
      },
      config: {
        type: [Array, Boolean],
        default: false,
      },
    },
    created() {
      this.$on('updatePostData', (data) => {
        if (data) {
          baseUtil.merge(this.postData, data, true);
        }
      });
    },
    methods: {
      /**
       * 发送HTTP请求，并根据传入的API进行处理
       */
      submit() {
        const http = this.$ycjHttp;
        const url = this.api.url;

        if (http.api[url]) {
          http.api[url]({
            param: this.postData,
            success: this.api.success,
            fail: this.api.fail,
            complete: this.api.complete,
          });
        }
      },
    },
  };
</script>

<style lang="scss" rel="stylesheet/scss" scoped>

</style>
