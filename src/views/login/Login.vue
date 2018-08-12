<template>
   <div id="login">
      <popup ref="popup" :isShow="isShow" @click-popupBg="hide" :size=300>
        <div class="title">登 录 <div class="close" @click="hide"><icon-font iconName="close" size="14px"></icon-font></div></div>
        <div class="content">
          <ul class="login-type" @click="changeType($event)">
            <li class="pwd-type" data-type="pwd" :class="{'active':'pwd' === loginActive}">密码登录</li>
            <li class="msg-type" data-type="msg" :class="{'active':'msg' === loginActive}">短信登录</li>
            <li class="ycj-type" data-type="ycj" :class="{'active':'ycj' === loginActive}">云财经登录</li>
          </ul>
          <div class="login-content">
            <pwd-login  :isShow="loginActive === 'pwd'" @change-tab="changeTab" :formData="pwdData" :autoData="autoLoginData" ></pwd-login>
            <msg-login  :isShow="loginActive === 'msg'" @change-tab="changeTab" :formData="msgData" :autoData="autoLoginData"></msg-login>
            <ycj-login  :isShow="loginActive === 'ycj'" @change-tab="changeTab" :formData="ycjData" :autoData="autoLoginData"></ycj-login>
          </div>
        </div>
      </popup>
    </div>
</template>
<script>

  import Popup from '../../components/base/Popup';
  import IconFont from '../../components/base/IconFont';
  import PwdLogin from './login/PwdLogin';
  import MsgLogin from './login/MsgLogin';
  import YcjLogin from './login/YcjLogin';

  export default {
    name: 'Login',
    data() {
      return {
        loginActive: 'pwd', // 登录时 选中登录方式（密码、短信、云财经）
        pwdData: {
          account: '',
          password: '',
        }, // 密码登录时数据
        msgData: {
          account: '',
          password: '',
        }, // 短信登录时数据
        ycjData: {
          account: '',
          password: '',
        }, // 云财经登录数据
        autoLoginData: { // 自动登录数据
          autoLogin: this.$storage.read('autoLogin'),
          rememberPwd: this.$storage.read('rememberPwd'),
        },
      };
    },
    props: {
      isShow: {
        type: Boolean,
        default: false,
      },
    },
    mounted() {
      this.getAutoLoginData();
    },
    methods: {
      hide() {
        // 关闭登录框
        this.$emit('show-hide');
      },
      changeType(event) {
        // 登录时切换不同的登录方式
        const targetDom = event.target;
        const type = targetDom.dataset.type;
        this.loginActive = type;
        targetDom.classList.add('active');
        this.getAutoLoginData();
      },
      changeTab(data) {
        // 登录-注册-忘记密码切换
        this.$emit('change-tab', {
          type: data.type,
        });
      },
      getAutoLoginData() {
        // 自动登录时
        const accountData = this.$storage.read('accountData');
        if (accountData) {
          this.pwdData.account = accountData.account;
          this.msgData.account = accountData.account;
          this.ycjData.account = accountData.account;

          this.pwdData.password = accountData.password;
          this.ycjData.password = accountData.password;
        }
      },
    },
    components: {
      Popup,
      IconFont,
      PwdLogin,
      MsgLogin,
      YcjLogin,
    },
  };
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/sass/static";
  .title{
    height:30px;
    line-height: 30px;
    font-size: $text;
    background-color: $blue1;
    padding:0 10px;
    .close{
      float: right;
      transition: transform 0.3s;
      &:hover{
        transform: rotate(180deg);
      }
    }
  }
  .content{
    padding-top: 18px;
    background-color: $white;
    color:$G2;
    font-size: $subText;
    height:310px;
    .login-type{
      width: 100%;
      list-style: none;
      padding: 0;
      margin: 0 0 13px 0;
      @extend %cf;
      >li{
        float: left;
        width:98px;
        text-align: center;
        position: relative;
        cursor: pointer;
        &:after{
          content: '|';
          position: absolute;
          right:0;
          font-weight: normal;
        }
        &:last-of-type{
          &:after{
            content: '';
          }
        }
        &.active{
          font-weight: bold;
          color:$G4;
        }
      }
    }
    .login-content{
      width:252px;
      margin: 0 auto;
    }
  }
</style>
