<template>
  <div class="count-time" @click=getMsgCode>{{msgContent}}</div>
</template>

<script>
  import { actions } from '../../../model/vuex/actionsType';

  export default {
    name: 'MsgCode',
    data() {
      return {
        canMsgCode: true, // 是否能够获取短信验证码
        msgContent: '获取短信验证码',
      };
    },
    props: {
      binding: [Object],
    },
    methods: {
      check(type, param) {
        // 验证信息
        let checked = false;
        let content = '';
        const status = 'fail';
        // 验证正则
        const reg = {
          phone: /^1[34578]\d{9}$/,
          email: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
          password: /^([a-zA-Z0-9@*#]{6,30})$/,
          verify: /^[0-9a-zA-Z]{4}$/,
          msgCode: /^\d{8}$/,
          nickname: /^[a-zA-Z0-9\u4e00-\u9fa5_-]{2,10}$/,
          username: [/^1[34578]\d{9}$/, /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/],
        };
        if (reg[type] !== undefined) {
          // 判断是否正确
          if (type === 'username') {
            if (reg.phone.test(param) || reg.email.test(param)) {
              checked = true;
            }
          } else {
            checked = reg[type].test(param);
          }
          // 不正确时的提示
          if (!checked) {
            switch (type) {
              case 'phone': content = '手机号码不正确';
                break;
              case 'password': content = '密码不正确';
                break;
              case 'verify': content = '图形验证码不正确';
                break;
              case 'msgCode': content = '短信验证码不正确';
                break;
              case 'username': content = '手机或者邮箱格式不正确';
                break;
              default: break;
            }
            this.$store.dispatch(actions.UPDATE_NOTICE_DATA, {
              content,
              status,
            });
          }
        }
        return checked;
      },
      getMsgCode() {
        // 获取短信验证码
        if (this.binding) {
          const phone = this.binding.account;
          const imgCode = this.binding.imgCode;
          if (this.check('phone', phone) && this.check('verify', imgCode)) {
            if (this.canMsgCode) {
              let countNum = 60;
              const self = this;
              const timer = setInterval(() => {
                self.canMsgCode = false;
                self.msgContent = `${countNum}秒后重新发送`;
                countNum -= 1;
                if (countNum < 0) {
                  clearInterval(timer);
                  self.msgContent = '重新获取';
                  self.canMsgCode = true;
                }
              }, 1000);
              this.$ycjHttp.api[this.$ycjHttp.apiList.GET_REG_CODE]({
                param: this.binding,
                success(data) {
                  this.$store.dispatch(actions.UPDATE_NOTICE_DATA, {
                    status: 'success',
                    content: data.msg,
                  });
                },
                fail(data) {
                  this.$store.dispatch(actions.UPDATE_NOTICE_DATA, {
                    status: 'fail',
                    content: data.msg,
                  });
                },
              });
            }
          }
        }
      },
    },
  };
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../../assets/sass/static";
 .count-time{
   display: inline-block;
   height:100%;
   line-height: 29px;
   border: 1px solid $blue1;
   font-size: 12px;
   width:100%;
   color: $blue2;
   cursor: pointer;
   border-radius: 5px;
 }
</style>

