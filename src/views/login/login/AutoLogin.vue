<template>
  <div class="auto-remember" >
    <input type="checkbox" id="auto" v-model="autoChecked">
    <label for="auto">自动登录</label>
    <input type="checkbox" id="remember" v-if="showRemember" v-model="rememberChecked">
    <label for="remember" v-if="showRemember">记住密码</label>
  </div>
</template>

<script>

  export default {
    name: 'AutoLogin',
    data() {
      return {
        autoChecked: this.$storage.read('autoLogin'),
        rememberChecked: this.$storage.read('rememberPwd'),
      };
    },
    props: {
      showRemember: {
        type: Boolean,
        default: true,
      },
      binding: {
        type: Object,
        required: true,
      },
    },
    watch: {
      autoChecked() {
        this.binding.autoLogin = this.autoChecked;
        this.$storage.application.save('autoLogin', this.autoChecked);
      },
      rememberChecked() {
        this.binding.rememberPwd = this.rememberChecked;
        this.$storage.application.save('rememberPwd', this.rememberChecked);
      },
    },
  };
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../../assets/sass/static";
  .auto-remember {
    margin: 0 auto 18px;
    text-align: left;
    input {
      padding: 0;
      margin: 0;
      vertical-align: middle;
      display: inline-block;
      outline: 0;
    }
    #remember {
      margin-left: 30px;
    }
    label {
      display: inline;
    }
  }
</style>
