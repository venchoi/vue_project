<template>
  <div class="login-page">
    <login :isShow="loginShow" @show-hide="hide" @change-tab="changeTab"></login>
    <register :isShow="registerShow" @show-hide="hide" @change-tab="changeTab"></register>
    <forget-pwd :isShow="forgetPwdShow" @show-hide="hide" @change-tab="changeTab"></forget-pwd>
  </div>
</template>

<script>
  import {
    mapState,
  } from 'vuex';
  import Login from './Login';
  import Register from './Register';
  import ForgetPwd from './ForgetPwd';
  import { actions } from '../../model/vuex/actionsType';

  export default {
    name: 'LoginSuit',
    data() {
      return {
      };
    },
    computed: {
      ...mapState({
        loginSuit: state => state.loginSuit,
      }),
      loginShow() {
        return this.loginSuit.loginShow;
      },
      registerShow() {
        return this.loginSuit.registerShow;
      },
      forgetPwdShow() {
        return this.loginSuit.forgetPwdShow;
      },
    },
    methods: {
      hide() {
        this.$store.dispatch(actions.HIDE_LOGIN_SUIT);
      },
      changeTab(data) {
        this.hide();
        switch (data.type) {
          case '注册用户':
            this.$store.dispatch(actions.SHOW_REGISTER_TAB);
            break;
          case '忘记密码':
            this.$store.dispatch(actions.SHOW_FORGET_PWD_TAB);
            break;
          case '用户登录':
            this.$store.dispatch(actions.SHOW_LOGIN_TAB);
            break;
          default:
            break;
        }
      },
    },
    components: {
      Login,
      Register,
      ForgetPwd,
    },
  };

</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/sass/static";
  .login-page {
    background-color: $background;
    $green:#00b017;
    >span{
      padding:0 20px;
      border:1px solid $G5;
      font-size: 15px;
      &:hover{
        cursor: pointer;
      }
    }
  }
</style>
