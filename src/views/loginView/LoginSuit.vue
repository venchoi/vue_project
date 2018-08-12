<template>
  <div class="login-view" v-show="isShow" :style="{backgroundImage: 'url(' +platformConfig.sign_in_background_img+ ')'}">
    <ycj-form :api="loginApi">
      <div class="platform-head-wrap">
        <div class="platform-head">
          <div class="platform-logo"><img :src="platformConfig.client_logo" alt="高端平台"></div><p class="platform-name" v-text="platformConfig.platform_name"></p>
      </div>
      </div>
      <div class="form-head">
        <p @click="showPop">获取账号>></p>
      </div>
      <div class="phone-num">
        <form-input name="code" :inputStyle="inputStyle" placeholder="输入图片验证码" :reg="reg.imgCode"></form-input>
        <div class="img-code">
          <img-code></img-code>
        </div>
      </div>
      <div class="phone-num">
        <form-input name="phone"  :inputStyle="inputStyle" placeholder="输入您的手机号" :reg="reg.account"></form-input>
        <div class="send-msg">
          <msg-code @toShow="showPop"></msg-code>
        </div>
      </div>
      <div class="msg-code">
          <form-input name="captcha" :inputStyle="inputStyle" placeholder="输入您的验证码" :reg="reg.msgCode" :inputType="inputType"></form-input>
      </div>
      <div class="refer-button">
        <form-button>登录</form-button>
      </div>
      <div class="checkbox-groups">
        <form-check-box name="autoLogin" label="下次自动登录" :type="checkBoxHandler"></form-check-box>
      </div>
    </ycj-form>
    <div class="pop-tips">
      <popup :isShow="popIsShow" @click-popupBg="hidePop" :size="420">
        <div class="close-bar">
          <span class="close" @click="hidePop">
            <span class="thick">
            </span>
          </span>
        </div>
        <div class="msg-area">
          <p>此账号没有开通登录权限，请联系客服开通:</p>
          <p>电话：{{platformConfig.customer_telphome}} QQ：{{platformConfig.customer_qq}}</p>
        </div>
      </popup>
    </div>
  </div>
</template>
<script>
  import {
    mapState,
  } from 'vuex';
  import {
    extra,
  } from '../../plugins/YCJWebSocket/YCJWebSocket';
  import http from '../../plugins/http/http';
  import Iconfont from '../../components/base/IconFont';
  import YcjForm from '../../components/base/form/YcjForm';
  import FormInput from '../../components/base/form/FormInput';
  import FormButton from '../../components/base/form/FormButton';
  import FormCheckBox from '../../components/base/form/FormCheckBox';
  import { actions } from '../../model/vuex/actionsType';
  import { user } from '../../model/storage';
  import MsgCode from './login/MsgCode';
  import ImgCode from './login/ImgCode';
  import Popup from '../../components/base/Popup';

  export default {
    name: 'MsgLogin',
    data() {
      return {
        formData: {},
        autoChecked: true,
        reg: { // 正则
          account: {
            value: /^1[34578]\d{9}$/,
            errorMsg: '手机号码不正确',
          },
          imgCode: {
            value: /^[0-9a-zA-Z]{4}$/,
            errorMsg: '图形验证码不正确',
          },
          msgCode: {
            value: /^\d{6}$/,
            errorMsg: '短信验证码不正确',
          },
        },
        loginApi: { // 登录相关
          url: this.$ycjHttp.apiList.MSG_LOGIN,
          success: (data) => {
            this.$store.dispatch(actions.UPDATE_NOTICE_DATA, {
              status: 'success',
              content: data.msg,
            });
            this.handler(data);
            this.$store.dispatch(actions.GET_SYSTEM_CONFIG);
          },
          fail: (data) => {
            this.$store.dispatch(actions.UPDATE_NOTICE_DATA, {
              status: 'fail',
              content: data.msg,
            });
          },
        },
        inputType: 'text', // 密码框类型
        isShow: true,
        popIsShow: false,
        inputStyle: {
          border: 0,
          background: '#ebebeb',
          borderRadius: '4px',
          height: '46px',
          outline: 0,
          padding: '12px',
          color: '#c0c0c0',
          fontSize: '16px',
          lineHeight: '46px',
          float: 'left',
        },
      };
    },
    computed: {
      ...mapState({
        platformConfig(state) {
          return state.appConfig || {};
        },
      }),
    },
    beforeCreate() {
      this.$store.dispatch(actions.GET_BASE_CONFIG);
    },
    methods: {
      checkBoxHandler() {
        return {};
      },
      /**
       * 账户权限弹窗提示控制
       * */
      hidePop() {
        this.popIsShow = false;
      },
      showPop() {
        this.popIsShow = true;
      },
      /**
       * 保存用户登录状态，将用户token和uid写入数据层：model/storage中的user中
       * @param {object} data 接口返回用户信息
       * isAutoLogin 是否下次自动登录判断：如自动登录则将用户数据写入application中；否则写入session中
       * 注意：write的参数传入，如果的第2个参数传入true，则写入session.
       * */
      handler(data) {
        const isAutoLogin = this.$storage.read('autoLogin').status;
        const token = data.token;
        const uid = data.uid;
        if (isAutoLogin) {
          user.write({
            token,
            uid,
          });
        } else {
          user.write({
            token,
            uid,
          }, true);
        }
        http.setCommonParam(user.read());
        extra(user.read());
        this.$emit('loginSuccess');
      },
    },
    components: {
      Iconfont,
      YcjForm,
      FormInput,
      FormButton,
      FormCheckBox,
      MsgCode,
      ImgCode,
      Popup,
    },
  };
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/sass/static";
  .login-view{
    width:100%;
    height:100%;
    background: #000;
    position: absolute;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    .from{
      width:450px;
      height: 395px;
      margin:0 auto;
      position: relative;
      top:50%;
      margin-top: -195px;
      padding:30px 40px;
      border-radius:4px;
      background: #fff;
      .platform-head-wrap{
        height: 50px;
        position: absolute;
        top:-70px;
        width: 200%;
        left: -50%;
        display: flex;
        justify-content: center;
        .platform-head{
          height: 50px;
          .platform-logo{
            width:120px;
            float: left;
            height: 50px;
            >img{
              width: 100%;
              height: 100%;
              display: block;
            }
          }
          .platform-name{
            float: left;
            height: 50px;
            margin:0 20px;
            font-size: 40px;
            line-height: 48px;
            font-weight: 100;
            overflow: hidden;
          }
        }
      }
      .form-head{
        height: 18px;
        padding-bottom: 10px;
        border-bottom: 1px solid #a7a7a7;
        box-sizing: content-box!important;
        >p{
          font-size: 16px;
          margin:0;
          color: #223e80;
          float: right;
          cursor: pointer;
          height: 29px;
          border-bottom: 1px solid #223e80;
        }
      }
      .phone-num, .msg-code{
        height: 46px;
        margin:20px 0;
        .input-group{
          height: 46px;
          color:#c0c0c0;
          ::-webkit-input-placeholder {
            color:#c0c0c0;
          }
          input{
            height: 46px!important;
            background: #000;
          }
          .icon{
            display: none!important;
          }
        }
        .send-msg{
          .count-time{
            font-size: 14px;
            background: #223e80;
            color: #fff;
            height: 46px;
            line-height: 44px;
          }
        }
        .send-msg, .img-code{
          width: 100px;
          height: 46px;
          line-height: 46px;
          border-radius: 4px;
          background: #223e80;
          color: #fff;
          text-align: center;
          float: left;
          margin-left: 10px;
          font-size: 14px;
          opacity: 0.8;
          cursor: pointer;
        }
      }
      .phone-num{
        .input-group{
          float: left;
          width:calc(100% - 110px);
        }
      }
      .refer-button{
        height: 46px;
        margin: 20px 0;
        >div{
          height: 46px;
          line-height: 46px;
          background: #223e80;
          color: #fff;
          font-size: 16px;
          border-radius: 4px!important;
        }
      }
    }
    .checkbox-groups{
      color: #223d80;
      height: 16px;
      margin-left: 20px;
      float: left;
    }
    .pop-tips{
      .close-bar{
        color:#223D80;
        height: 40px;
        background: #fff;
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
        .close{
          position: absolute;
          top:7px;
          right: 10px;
          transition: transform 0.3s;
          width: 30px;
          height: 30px;
          .thick {
            width: 30px;
            height: 30px;
            display: block;
            position: relative;
            &:before, &:after{
              position: absolute;
              height: 4px;
              margin-top: -2px;
              content: '';
              background: #223D80;
            }
            &:before{
              transform: rotate(45deg);
              height: 2px;
              width: 100%;
              top: 50%;
              left: 0;
              margin-top: -1px;
            }
            &:after{
              transform: rotate(-45deg);
              height: 2px;
              width: 100%;
              top: 50%;
              left: 0;
              margin-top: -1px;
            }
          }
          &:hover{
            transform: rotate(180deg);
          }
        }
      }
      .msg-area{
        height: 144px;
        background: #fff;
        color: #838383;
        font-size: 18px;
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 4px;
        >p{
          margin: 0;
          padding: 20px 0 10px 0;
          &:last-child{
            padding-top: 10px;
          }
        }
      }
    }
  }
</style>
