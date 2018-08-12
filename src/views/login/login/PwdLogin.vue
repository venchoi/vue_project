<template>
  <div class="contents" v-show="isShow">
    <ycj-form :postData="formData" :api="loginApi">
      <form-input name="account" placeholder="手机号码" :binding="formData" :reg="reg.phone" icon="mobile"></form-input>
      <div class="pwd">
        <div class="pwd-inner">
          <form-input name="password" placeholder="请输入密码" :binding="formData" :reg="reg.password" icon="lock" :inputType="inputType"></form-input>
        </div>
        <span class="eye" @click="changeInputType">
          <icon-font iconName="eye" size="14px"></icon-font>
        </span>
      </div>
      <auto-login :binding="autoData"></auto-login>
      <form-button :binding="formData">登录</form-button>
      <div class="footer" @click="changeTab($event)"><span>注册用户</span><span>忘记密码</span></div>
    </ycj-form>
  </div>
</template>
<script>
  import IconFont from '../../../components/base/IconFont';
  import YcjForm from '../../../components/base/form/YcjForm';
  import FormInput from '../../../components/base/form/FormInput';
  import FormButton from '../../../components/base/form/FormButton';
  import AutoLogin from './AutoLogin';
  import { actions } from '../../../model/vuex/actionsType';
  import handler from './loginHandler';

  export default {
    name: 'PwdLogin',
    data() {
      return {
        reg: { // 正则
          phone: {
            value: /^1[34578]\d{9}$/,
            errorMsg: '手机号码不正确',
          },
          password: {
            value: /^([a-zA-Z0-9_]{6,16})$/,
            errorMsg: '密码不正确',
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
        inputType: 'password', // 密码框类型
      };
    },
    props: {
      isShow: {
        // 该页面是否显示
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
      changeInputType() {
        // 密码显示或者隐藏
        this.inputType = this.inputType === 'password' ? 'text' : 'password';
      },
    },
    components: {
      IconFont,
      YcjForm,
      FormInput,
      FormButton,
      AutoLogin,
    },
  };
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../../assets/sass/static";
  .contents{
    width:100%;
    height:100%;
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
</style>
