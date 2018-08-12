<template>
  <div class="contents" v-show="isShow">
    <ycj-form :postData="formData" :api="loginApi">
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
      <auto-login :binding="autoData" :showRemember="showRemember"></auto-login>
      <form-button :binding="formData">登录</form-button>
      <div class="footer" @click="changeTab"><span>注册用户</span></div>
    </ycj-form>
  </div>
</template>
<script>
  import YcjForm from '../../../components/base/form/YcjForm';
  import FormInput from '../../../components/base/form/FormInput';
  import FormButton from '../../../components/base/form/FormButton';
  import MsgCode from './MsgCode';
  import ImgCode from './ImgCode';
  import AutoLogin from './AutoLogin';
  import { actions } from '../../../model/vuex/actionsType';
  import handler from './loginHandler';

  export default {
    name: 'MsgLogin',
    data() {
      return {
        reg: { // 正则
          phone: {
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
          url: this.$ycjHttp.apiList.LOGIN,
          success: (data) => {
            this.$store.dispatch(actions.UPDATE_NOTICE_DATA, {
              status: 'success',
              content: data.msg,
            });
            handler(this, data);
            this.$store.dispatch(actions.HIDE_LOGIN_SUIT, '');
          },
          fail: (data) => {
            this.$store.dispatch(actions.UPDATE_NOTICE_DATA, {
              status: 'fail',
              content: data.msg,
            });
          },
        },
        showRemember: false, // 忘记密码
      };
    },
    props: {
      // 该页面是否显示
      isShow: {
        type: Boolean,
        default: false,
      },
      formData: {
        // 提交表单数据
        type: Object,
      },
      autoData: {
        // 自动登录数据
        type: Object,
      },
    },
    methods: {
      changeTab(event) {
        // 登录-注册-忘记密码 中切换
        const targetDom = event.target;
        if (targetDom.nodeName === 'SPAN') {
          const targetText = targetDom.innerText;
          this.$emit('change-tab', {
            type: targetText,
          });
        }
      },
      changeStatus(type) {
        // 自动登录与忘记密码状态改变
        this.$emit('change-status', type);
      },
    },
    components: {
      YcjForm,
      FormInput,
      FormButton,
      MsgCode,
      ImgCode,
      AutoLogin,
    },
  };
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../../assets/sass/static";
  .contents{
    width:100%;
    height:100%;
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

</style>
