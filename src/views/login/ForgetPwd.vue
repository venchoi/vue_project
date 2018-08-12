<template>
  <div id="forget-pwd">
    <popup ref="popup" :isShow="isShow" v-on:click-popupBg="hide" :size=300>
      <div class="title">忘记密码 <div class="close" @click="hide"><icon-font iconName="close" size="14px"></icon-font></div></div>
      <div class="content">
        <div class="content-inner">
          <ycj-form :postData="formData" :api="forgetPwdApi">
            <form-input name="account" placeholder="手机号码" :binding="formData" :reg="reg.phone" icon="mobile"></form-input>
            <div class="input-content">
              <div class="input-left">
                <form-input name="imgCode" placeholder="图形验证码" :binding="formData" :reg="reg.imgCode" icon="image"></form-input>
              </div>
              <div class="input-right">
                <img-code></img-code>
              </div>
            </div>
            <div class="input-content">
              <div class="input-left">
                <form-input name="password" placeholder="短信验证码" :binding="formData" :reg="reg.msgCode" icon="envelope"></form-input>
              </div>
              <div class="input-right">
                <msg-code :binding="formData"></msg-code>
              </div>
            </div>
            <div class="pwd">
              <div class="pwd-inner">
                <form-input name="password" placeholder="请输入密码" :binding="formData" :reg="reg.password" icon="lock" :inputType="inputType"></form-input>
              </div>
              <span class="eye" @click="changeInputType">
                  <icon-font iconName="eye" size="14px"></icon-font>
                </span>
            </div>
            <form-button :binding="formData">登录</form-button>
            <div class="footer" @click="changeTab"><span>用户登录</span></div>
          </ycj-form>
        </div>
      </div>
    </popup>
  </div>
</template>

<script>

  import Popup from '../../components/base/Popup';
  import IconFont from '../../components/base/IconFont';
  import YcjForm from '../../components/base/form/YcjForm';
  import FormInput from '../../components/base/form/FormInput';
  import FormButton from '../../components/base/form/FormButton';
  import MsgCode from './login/MsgCode';
  import ImgCode from './login/ImgCode';
  import { actions } from '../../model/vuex/actionsType';

  export default {
    name: 'ForgetPwd',
    data() {
      return {
        formData: {},
        reg: {
          phone: {
            event: 'blur',
            value: /^1[34578]\d{9}$/,
            errorMsg: '手机号码不正确',
          },
          imgCode: {
            event: 'blur',
            value: /^[0-9a-zA-Z]{4}$/,
            errorMsg: '图形验证码不正确',
          },
          msgCode: {
            event: 'blur',
            value: /^\d{6}$/,
            errorMsg: '短信验证码不正确',
          },
          password: {
            event: 'blur',
            value: /^([a-zA-Z0-9@*#]{6,30})$/,
            errorMsg: '密码不正确',
          },
        },
        forgetPwdApi: {
          url: this.$ycjHttp.apiList.REGISTER,
          success: (data) => {
            this.$store.dispatch(actions.UPDATE_NOTICE_DATA, {
              status: 'success',
              content: data.msg,
            });
          },
          fail: (data) => {
            this.$store.dispatch(actions.UPDATE_NOTICE_DATA, {
              status: 'fail',
              content: data.msg,
            });
          },
        },
        agreeRegister: true,
        inputType: 'password',
      };
    },
    props: {
      isShow: {
        type: Boolean,
        default: false,
      },
    },
    methods: {
      changeInputType() {
        this.inputType = this.inputType === 'password' ? 'text' : 'password';
      },
      hide() {
        this.$emit('show-hide');
      },
      changeTab(event) {
        // 登录-注册-忘记密码 中切换
        const targetDom = event.target;
        if (targetDom.nodeName === 'SPAN') {
          const targetText = targetDom.innerText;
          this.$emit('change-tab', {
            type: targetText,
          });
          this.formData = {};
        }
      },
    },
    components: {
      Popup,
      YcjForm,
      FormInput,
      FormButton,
      MsgCode,
      ImgCode,
      IconFont,
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
      float:right;
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
    .content-inner{
      width:252px;
      margin: 0 auto;
      .input-content{
        width:100%;
        margin: 13px auto;
        height:31px;
        .input-left{
          float: left;
          width:130px;
          margin-right: 12px;
        }
        .input-right{
          float: left;
          width:106px;
          height:31px;
        }
      }
      .pwd{
        margin: 13px auto;
        position: relative;
        .eye{
          position: absolute;
          right:13px;
          top:6px;
        }
      }
      .footer{
        text-align: left;
        font-size: 13px;
        span{
          text-decoration: underline;
          color:$blue1;
          cursor: pointer;
          &:nth-of-type(2){
            float: right;
          }
        }
      }
    }
  }
</style>
