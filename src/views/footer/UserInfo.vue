<template>
  <drop-panel-transition :isShow="userShow" transition="fade-top">
    <div class="user-information" >
      <div class="mask" @click="close"></div>
      <div class="detail-part">
        <div class="head">
          账号 :
          <span class="user-name">{{userInfo.username}}</span>
          <span class="close" @click="close">
            <iconfont iconName="times"></iconfont>
          </span>
        </div>
        <div class="package">
          <p class="subhead"> 当前套餐 :</p>
          <p class="nopackage" v-if="packageNum"> 您还未购买套餐！</p>
          <ul v-else  class="packageList">
            <li v-for="item in userInfo.package" class="listItem">
              <div class="itemLeft">
                <span class="left-name">{{ item.name }}</span>
                <span class="left-time">{{ item.end_time }}</span>
              </div>
              <div class="renew-button" @click="clickPay">续费</div>
            </li>
          </ul>
        </div>
        <div> <button @click="logout" class="logoutbtn">退出登录</button></div>
      </div>
    </div>
  </drop-panel-transition>
</template>
<script>
  import {
    mapGetters,
    mapState,
  } from 'vuex';
  import {
    userActions,
  } from '../../model/vuex/actionsType';
  import DropPanelTransition from '../../components/base/DropPanel-Transition';
  import Iconfont from '../../components/base/IconFont';
  import {
    columnSocket,
  } from '../../plugins/YCJWebSocket/YCJWebSocket';


  export default {
    name: 'userInfo',
    data() {
      return {
        userName: '12345', // 用户名(手机号)
        userPackageList: [], // 用户套餐
        packageNum: false,
        userShow: false,
      };
    },
    components: {
      Iconfont,
      DropPanelTransition,
    },
    created() { // 获取数据
      if (!!this.userPackageList === false) {
        this.packageNum = true;
      }
    },
    computed: {
      ...mapState({
        userInfo: state => state.moduleUser.userInfo,
      }),
      ...mapGetters([
        'canUserShow', // 用户信息弹窗是否可以打开
      ]),
    },
    watch: {
      // 监听问股和搜索弹窗是否出现，出现则关闭用户信息窗口。
      canUserShow() {
        if (!this.canUserShow) {
          this.close();
        }
      },
    },
    methods: {
      /**
       * 路由跳转有问题，可能要修改router文件。
       */
      logout() {
        this.$store.dispatch(userActions.LOGOUT);
        columnSocket.closeWs();
      },
      clickPay() {
        // 跳转去平台对应的商城购买服务
        const mallUrl = '/res/static/mall.html';
        window.location.href = mallUrl;
      },
      close() {
        this.userShow = false;
      },
      show() {
        this.userShow = true;
        document.addEventListener('click', this.hidePanel, false);
      },
    },
  };
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/sass/static";
  @keyframes rotate
  {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  .user-information{
    overflow: hidden;
    position: relative;

    .mask {
      position: fixed;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      background-color: transparent;
    }
    .detail-part {
      width: 266px;
      overflow: hidden;
      position: relative;
      background-color: #ebebeb;
      border-radius: 4px 4px 4px 4px;

      .head {
        height: 32px;
        border-radius: 4px 4px 0px 0px;
        position: relative;
        text-align: center;
        background: $blue1;
        color: $white;
        line-height: 32px;

        .close {
          position: absolute;
          top: 0;
          right: 10px;
        }
      }
      .package {
        margin: 20px;

        .subhead {
          font-family: MicrosoftYaHei;
          font-size: 14px;
          color: #233d7e;
        }
        .packageList {
          list-style: none;
          padding: 0;
          margin: 0;
          z-index: 100;

          .listItem {
            width: 100%;
            padding: 10px 0;
            background-color: #ebebeb;
            border-radius: 4px 4px 4px 4px;
            display: flex;
            display: -webkit-flex; /* Safari */
            flex-direction: row;
            flex-wrap: nowrap;
            justify-content: center;
            align-items: center;
            border-bottom: 1px solid #cccccc;
            font-size: 12px;
            color: #4d4d4d;
            font-family: SourceHanSansCN-Regular;

            .itemLeft {
              order: 1;
              flex-grow: 1;
              flex-shrink: 1;
              display: flex;
              display: -webkit-flex; /* Safari */
              flex-direction: column;
              justify-content: flex-start;
              align-items: flex-start;

              .left-name,
              .left-time {
                margin: 0;
                padding: 0;
                flex: auto;
                line-height: 1;
              }
              .left-name {
                margin-bottom: 10px;
              }
            }
            .renew-button {
              order: 2;
              flex-shrink: 1;
              flex-basis: 72px;
              width: 72px;
              height: 30px;
              line-height: 30px;
              text-align: center;
              font-size: 16px;
              color: #fff;
              -webkit-border-radius: 5px;
              -moz-border-radius: 5px;
              border-radius: 5px;
              background: #ff6148;
              cursor: pointer;
            }
          }
          .listItem:last-child {
            border: none;
          }
        }
      }
      .logoutbtn {
        position: relative;
        left: 50%;
        transform: translateX(-50%);
        bottom: 20px;
        width: 226px;
        height: 38px;
        margin-top: 10px;
        background-color: $blue4;
        border-radius: 4px 4px 4px 4px;
        font-family: ﻿SourceHanSansCN-Regular;
        font-size: 16px;
        line-height: 36px;
        color: #ebebeb;
        border: none;
      }
      .logoutbtn:hover {
        cursor: pointer;
      }
    }

    &:after {
      content: '';
      position: relative;
      display: block;
      width: 0px;
      height: 0px;
      left: 230px;
      border-left: 5px solid transparent;
      border-right: 5px solid transparent;
      border-top: 4px solid #ebebeb;
    }
  }
</style>

