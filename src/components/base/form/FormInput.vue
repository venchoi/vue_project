<template>
  <div class="input-group">
    <span class="icon" v-if="icon !== 'none'">
      <iconfont :iconName="icon" size="14px"></iconfont>
    </span>
    <template v-if="inputType === 'text'">
      <input type="text" :style="inputStyle" :placeholder="placeholder" v-model="inputData" @blur="blur" @keyup="keyup" autocomplete="off"/>
    </template>
    <template v-if="inputType === 'password'">
      <input type="password" :style="inputStyle" :placeholder="placeholder" v-model="inputData" @blur="blur" @keyup="keyup" autocomplete="off"/>
    </template>

  </div>
</template>

<script>
  import {
    actions,
  } from '../../../model/vuex/actionsType';
  import Iconfont from '../IconFont';
  import {
    baseUtil,
  } from '../../../util';

  export default {
    name: 'FormInput',
    data() {
      return {
        binding: {},
        inputData: '',
      };
    },
    components: {
      Iconfont,
    },
    props: {
      name: {
        type: String,
        required: true,
      },
      inputType: {
        type: String,
        default: 'text',
      },
      placeholder: {
        type: String,
        required: true,
      },
      reg: {
        type: [Object, Boolean, String], // notNull
        default: false,
      },
      icon: {
        type: String,
        default: 'none',
      },
      inputStyle: Object,
    },
    watch: {
      inputData() {
        if (!this.binding) {
          return false;
        }
        this.$parent.$emit('updatePostData', {
          [this.name]: this.inputData,
        });
        return false;
      },
      binding: {
        handler() {
          if (this.binding[this.name] && (this.binding[this.name] !== this.inputData)) {
            this.inputData = this.binding[this.name];
          }
        },
        deep: true,
      },
    },
    created() {
      this.binding = this.$parent.postData;
      if (!this.binding[this.name]) {
        this.$set(this.binding, this.name, '');
      }
      this.$set(this.$parent.ready, this.name, false);
    },
    methods: {
      checkReg(event) {
        let reg = this.reg.value;
        let msg = this.reg.errorMsg;
        let ready = this.$parent.ready;
        if (baseUtil.isObject(this.reg)) {
          reg = this.reg.value;
          msg = this.reg.errorMsg;
          ready = this.$parent.ready;
          if (!reg.test(this.inputData)) {
            if (msg && event === 'blur' && !!(this.inputData)) {
              this.$store.dispatch(actions.UPDATE_NOTICE_DATA, {
                status: 'fail',
                content: msg,
              });
            }
            this.$set(ready, this.name, false);
          } else {
            this.$set(ready, this.name, true);
          }
        }
      },
      keyup() {
        this.checkReg('keyup');
      },
      blur() {
        this.checkReg('blur');
      },
    },
  };
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../../assets/sass/static";

  .input-group {
    position: relative;
    .icon {
      position: absolute;
      line-height: 1;
      left: 16px;
      top: 10px;
    }
    input {
      width: 100%;
      height: 32px;
      line-height: 32px;
      padding-left: 30px;
    }
    img {
      width: 106px;
      height: 31px;
      vertical-align: top;
      cursor: pointer;
    }
  }
</style>
