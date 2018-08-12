<template>
  <div class="chat-model">
    <popup :isShow="isShow" @click-popupBg="hide" :size="750">
      <div class="close-bar">
          <span class="close" @click="hide">
            <iconfont iconName="times" size="18px"></iconfont>
          </span>
      </div>
      <div class="msg-area">
          <div v-for="(item, index) in chatMsg" :key="index" class="msgs">
            <img v-if="item.type === '2'" class="portrait" :class="{ m: item.type === '2' }" src="../../assets/image/default.png">
            <img v-else="item.type === '1'" class="portrait" :class="{ s: item.type === '1' }" src="../../assets/image/service.png">
            <div class="inner-msg" :class="{ l: item.type === '2', r: item.type === '1' }" v-html="item.content"></div>
          </div>
      </div>
      <div class="msg-send">
        <textarea v-model="content" rows="1" @keyup.stop.prevent  @keyup.13="sendClick" placeholder="请说出你的疑问" class="content" >
        </textarea>
        <div class="send-btn" @click="sendClick">发送</div>
      </div>
    </popup>
  </div>
</template>

<script>
  import {
    mapState,
    mapActions,
    mapGetters,
  } from 'vuex';

  import {
    columnSocket,
    EVENT,
  } from '../../plugins/YCJWebSocket/YCJWebSocket';
  import Popup from '../../components/base/Popup';
  import Iconfont from '../../components/base/IconFont';
  import { actions } from '../../model/vuex/actionsType';
  import * as storage from '../../model/storage';
  import storageApi from '../../plugins/base/storage';
  import http from '../../plugins/http/http';
  import {
    baseUtil,
    ycjUtil,
  } from '../../util';

  export default {
    name: 'chat',
    data() {
      return {
        content: '', // 聊天输入框内容
        saveContent: storageApi.read('chatMsg') || [], // 本地存储消息列表
        chatMsg: [],  // 渲染聊天列表
        response: [], // 接口返回消息
        first: true, // 第一次开启推送
        timer: null,
        firstContent: {
          type: '1',
          content: '【智能问股】<br/>1、 输入股票代码/简称，查看股票最新智能诊断等信息；<br/><br/>2.、输入“关键词”查阅相关概念股，如“石墨烯”；<br/><br/>3、如有更多问题，可直接回复问题联系客服！',
          addAuto: '1', // 验证是否是最后一句
        },
      };
    },
    computed: {
      ...mapState({
        isShow: state => state.chatModel.isShow,
      }),
      ...mapGetters([
        'isLogined',
      ]),
    },
    components: {
      Iconfont,
      Popup,
    },
    created() {},
    mounted() {
      const vm = this;
      if (columnSocket && vm.first) {
        columnSocket.on(EVENT.CONSULT, (data) => {
          if (data.op_id === 1 && data.consult_id) {
            vm.getMsg(data.consult_id);
          }
        });
        vm.first = false;
      }
      if (storageApi.read('chatMsg')) {
        const msg = storageApi.read('chatMsg');
        if (!msg[msg.length - 1].addAuto) {
          msg.push(this.firstContent);
        }
        vm.chatMsg = msg;
      } else {
        vm.getMsg();
      }
    },
    watch: {
      isShow() {
        const vm = this;
        // 打开问股模态框自动对焦到输入框
        if (vm.isShow) {
          setTimeout(() => {
            vm.$el.querySelector('.content').focus();
            const el = vm.$el.querySelector('.msg-area');
            el.scrollTop = el.scrollHeight;
          }, 0);
        }
      },
      response() {
        const vm = this;
        if (vm.response.length) {
          baseUtil.each(vm.response, (item) => {
            const inner = { type: item.type, content: item.content };
            vm.saveContent.push(inner);
            vm.chatMsg.push(inner);
          });
          vm.saveMsg(vm.saveContent);
          vm.refreshScroll();
        }
      },
      chatMsg() {
        this.refreshScroll();
      },
    },
    methods: {
      ...mapActions({
        hide: actions.HIDE_CHAT,
      }),
      /*
      * 发送消息
      * */
      sendClick() {
        const vm = this;
        const content = vm.content.trim();
        const type = '2';
        clearTimeout(vm.timer);
        const userMsg = {
          type,
          content,
        };
        if (content) {
          vm.chatMsg.push(userMsg);
          vm.saveContent.push(userMsg);
          vm.saveMsg(vm.saveContent);
          vm.content = '';
        } else {
          vm.$store.dispatch(actions.UPDATE_NOTICE_DATA, {
            status: 'fail',
            content: '消息内容不能为空！',
          });
          return;
        }
        setTimeout(() => {
          const el = vm.$el.querySelector('.msg-area');
          el.scrollTop = el.scrollHeight;
        }, 0);
        vm.timer = setTimeout(() => {
          vm.sendMsg(content, (data) => {
            let str = data;
            if (str && str !== '-') {
              str = vm.chatFilter(str);
              const responseMsg = {
                type: '1',
                content: str,
              };
              vm.$store.dispatch(actions.UPDATE_NOTICE_DATA, {
                status: 'success',
                content: '发送成功',
              });
              vm.saveContent.push(responseMsg);
              vm.chatMsg.push(responseMsg);
              if (vm.saveContent.length > 100) {
                vm.saveContent.splice(0, vm.saveContent.length - 100);
              }
              vm.saveMsg(vm.saveContent);
              vm.refreshScroll();
            }
          });
        }, 1000);
      },
      /*
      * 向后端发送消息内容
      * */
      sendMsg(content, callback) {
        const httpList = http.apiList;
        const httpData = {
          sender_id: storage.user.read().uid, // 用户id
          content,
        };
        http.api[httpList.SEND_CHAT_MESSAGE]({
          success(response) {
            if (typeof callback === 'function') {
              callback(response);
            }
          },
          param: httpData,
        });
      },
      /*
      * 后台请求聊天记录
      * */
      getMsg(id) {
        const httpList = http.apiList;
        const vm = this;
        const httpData = {
          id,
          userid: storage.user.read().uid, // 发送者的用户id
        };
        if (!id) {
          // 默认开场白
          vm.saveContent.push(this.firstContent);
          vm.chatMsg.push(this.firstContent);
          vm.saveMsg(vm.saveContent);
        }
        http.api[httpList.GET_CHAT_MESSAGE]({
          success(responses) {
            if (id) {
              vm.response = responses;
            } else {
              // 倒序插入消息
              baseUtil.each(responses, (item, index) => {
                const sort = responses[responses.length - 1 - index];
                const inner = { type: sort.type, content: sort.content };
                vm.saveContent.push(inner);
                vm.chatMsg.push(inner);
              });
              vm.saveMsg(vm.saveContent);
              vm.refreshScroll();
            }
          },
          param: httpData,
        });
      },
      /*
      * 将聊天记录保存在本地
      * */
      saveMsg(data) {
        storageApi.application.save('chatMsg', data);
      },
      /**
       * 智能问股微服务内容过滤
       * 1.所有股票代码加上路由跳转
       * 2.换行符转义
       */
      chatFilter(str) {
        let data = str;
        const reg = {
          stock: /[0-9]{6}/g,
          ln: /\\n/g,
        };
        if (data) {
          data = data.replace(reg.ln, '<br/>');
          data = data.replace(reg.stock, (tag) => {
            const stockCode = ycjUtil.formatCode(tag);
            return `<a href="#/stock/${stockCode}" target="_self">${tag}</a>`;
          });
        }
        return data;
      },
      /**
       * 滚动显示最新消息
       */
      refreshScroll() {
        setTimeout(() => {
          const el = this.$el.querySelector('.msg-area');
          if (el) {
            if (el.clientHeight + el.scrollTop >= el.scrollHeight * 0.8) {
              el.scrollTop = el.scrollHeight;
            }
          }
        }, 100);
      },
    },
  };
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/sass/static";
  .chat-model{
    color:#477eff;
    .close-bar{
      height: 32px;
      background: #fff;
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
      .close{
        position: absolute;
        top:7px;
        right: 10px;
        transition: transform 0.3s;
        &:hover{
          transform: rotate(180deg);
        }
      }
    }
    .msg-area{
      height:442px;
      background: #fff;
      padding: 20px 15px;
      overflow-x: hidden;
      overflow-y: auto;
      &::-webkit-scrollbar {
        width: 0;
        height: 0;
      }
      .msgs{
        width: 100%;
        margin:20px 0;
        overflow: hidden;
        >span{
          padding:5px 10px;
          font-size: 14px;
          border-radius: 4px;
        }
        .inner-msg {
          padding:5px 10px;
          font-size: 14px;
          border-radius: 4px;
        }
        &:last-child{
          margin-bottom: 0px;
        }
      }
      .inner-msg{
        max-width: calc(100% - 120px);
        min-height: 30px;
        min-width:35px;
        margin-top: 6px;
        text-align: left;
        word-break: break-all;
        // white-space: pre;
        word-wrap: break-word;
        display: block;
      }
      .portrait{
        height: 34px;
        width: 34px;
        border-radius: 50%;
        position: relative;
        top:50%;
        margin-top: 4px;
        margin-left: 5px;
      }
      .m{
        float: right;
        background: #477eff;
        margin-left: 10px;
        position: relative;
        color: #fff;
      }
      .l{
        float: right;
        background: #477eff;
        margin-left: 10px;
        position: relative;
        right:10px;
        color: #fff;
        &:before{
          position: absolute;
          right:-8px;
          content: '';
          margin-top: 5px;
          display: block;
          width: 0;
          height: 0;
          border-top: 6px solid transparent;
          border-left: 9px solid #477eff;
          border-bottom: 6px solid transparent;
        }
      }
      .s{
        float: left;
        background: #ebebeb;
        margin-right: 10px;
        position: relative;
        color: #4d4d4d;
      }
      .r{
        float: left;
        background: #ebebeb;
        margin-right: 10px;
        position: relative;
        left: 10px;
        color: #4d4d4d;
        &:before{
          position: absolute;
          left:-8px;
          content: '';
          margin-top: 5px;
          display: block;
          width: 0;
          height: 0;
          border-top: 6px solid transparent;
          border-right: 9px solid #ebebeb;
          border-bottom: 6px solid transparent;
        }
      }
    }
    .msg-send{
      height: 66px;
      background: #ebebeb;
      padding:12px 20px 12px 10px;
      border-bottom-left-radius: 4px;
      border-bottom-right-radius: 4px;
      .content{
        width:625px;
        max-width: 625px;
        height: 42px;
        max-height: 42px;
        resize:none;
        float: left;
        text-align: left;
        outline: 0;
        font-size: 16px;
        color: #c0c0c0;
        word-wrap: break-word;
        line-height: 20px;
        background: #fff;
        border-radius: 3px;
        overflow-x: hidden;
        overflow-y: auto;
        border:10px solid #fff;
        box-sizing: border-box;
        &::-webkit-scrollbar {
          width: 0;
          height: 0;
        }
        &::-webkit-input-placeholder {
          color: #c0c0c0;
        }
      }
      .send-btn{
        width:calc(100% - 645px);
        height: 38px;
        line-height: 38px;
        text-align: center;
        float: right;
        background:#477eff;
        border-radius: 4px;
        font-size: 16px;
        color: #fff;
        margin-left: 20px;
        margin-top: 2px;
        cursor: pointer;
      }
    }
  }
</style>
