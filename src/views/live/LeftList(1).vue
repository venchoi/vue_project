<template>
  <div class="left-list">
    <top-menu :systemCode="live"></top-menu>
    <div class="top">
      <div class="icon"></div>
      <p>{{currentTime}}</p>
      <span>（以下内容仅供参考，据此操作风险自负）</span>
    </div>
    <div class="news" @scroll="onScroll()">
      <ul class="news-list">
        <li v-for="item in newsList" v-if="item.id">
          <div class="time">
            <time v-html="transformhhmm(item.create_time)"></time>
            <span></span>
          </div>
          <div class="news-content">
            <p v-html="item.content"></p>
          </div>
        </li>
      </ul>
      <transition name="fade">
        <div v-show="loading" class="loading">
          <div class="loader"></div>
          <div class="txt">正在加载中&nbsp;·&nbsp;·&nbsp;·&nbsp;</div>
        </div>
      </transition>
      <div class="no-more" v-show="noMore">已无更多</div>
    </div>
  </div>
</template>

<script>
  import format from '../../util/format';
  import TopMenu from './TopMenu';
  import http from '../../plugins/http/http';
  import baseUtil from '../../util/baseUtil';
  import {
    columnSocket,
    EVENT,
  } from '../../plugins/YCJWebSocket/YCJWebSocket';

  export default {
    name: 'leftlist',
    data() {
      return {
        currentTime: '', // 当前时间
        timeLoop: true, // 时钟开关
        live: 'live', // 开关状态键名
        newsList: [], // 消息列表
        loading: false, // 正在加载中提示
        open: true, // 请求节流
        noMore: false, // 暂无更多提示
      };
    },
    components: {
      TopMenu,
    },
    methods: {
      onScroll() {
        const vm = this;
        const scrollHeight = vm.$el.children[2].scrollHeight;
        const scrollTop = vm.$el.children[2].scrollTop;
        const clientHeight = vm.$el.children[2].clientHeight;
        // 接近底部加载更多
        if (clientHeight + scrollTop >= 0.9 * scrollHeight && vm.open) {
          vm.loading = true;
          vm.open = false;
          const lastId = vm.newsList[vm.newsList.length - 1].id; // 当前列表中最后一条id
          vm.getNewsList(lastId, 20, 0, (data) => {
            if (data.length) {
              baseUtil.each(data, (item) => {
                vm.newsList.push(item);
              });
              vm.open = true;
            } else {
              vm.noMore = true;
              vm.loading = false;
              vm.open = false;
            }
          });
        }
      },
      transform() {
        const vm = this;
        if (!vm.timeLoop) {
          return;
        }
        vm.currentTime = format.date(new Date(), 'MM月dd日 hh:mm:ss');
        setTimeout(vm.transform, 1000);
      },
      // 判断消息时间
      transformhhmm(str) {
        const today = format.date(new Date(), 'MM-dd');
        let dateStr = format.date(new Date(Number(str) * 1000), 'MM-dd');
        if (today === dateStr) {
          dateStr = format.date(new Date(Number(str) * 1000), 'hh:mm');
        } else {
          dateStr = format.date(new Date(Number(str) * 1000), 'MM月dd日<br/>hh:mm');
        }
        return dateStr;
      },
      /*
      * 获取新闻列表
      * @param {number} id - 当前新闻列表中最后一条id
      * @param {number} size - 每页数据长度
      * @param {number} push - 处理socket推送，只拿一条内容
      * @param {function} callback - 处理response的回调,id判断取最新还是取历史数据
      * */
      getNewsList(id, size, push, callback) {
        const httpList = http.apiList;
        const httpData = {
          id,
          page_size: size,
          push,
        };
        http.api[httpList.GET_REAL_TIME_STARE]({
          success(response) {
            if (typeof callback === 'function') {
              callback(response);
            }
          },
          param: httpData,
        });
      },
      init() {
        const vm = this;
        vm.getNewsList('', 30, 0, (data) => {
          vm.newsList = data;
        });
      },
    },
    computed: {
    },
    created() {
      const vm = this;
      vm.timeLoop = true;
      vm.transform();
      vm.init();
      columnSocket.on(EVENT.LIVE, (data) => {
        vm.getNewsList(data.id, '', 1, (response) => {
          baseUtil.each(response, (item) => {
            vm.newsList.unshift(item);
          });
        });
      });
    },
    activated() {
      this.timeLoop = true;
      this.transform();
    },
    deactivated() {
      this.timeLoop = false;
    },
  };
</script>

<style lang="scss" rel="stylesheet/scss" >
  @import "../../assets/sass/static";
  *{
    padding: 0;
    margin: 0;
  }
  .left-list{
    width: 100%;
    height: 100%;
    .top {
      position: relative;
      flex:1;
      width: 100%;
      max-height: 80px;
      min-height:80px;
      p {
        position: relative;
        width:36%;
        height: 80px;
        line-height: 80px;
        font-size: 14px;
        color: #c0c0c0;
        text-align: left;
        font-weight: bold;
        padding-left: 150px;
        float: left;
      }
      .icon {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        left: 74px;
        width: 60px;
        height: 60px;
        background: url("../../assets/image/clock.png") no-repeat center center;
        background-size:cover;
      }
      >span{
        float: left;
        margin-left: 10px;
        height: 80px;
        line-height: 80px;
        font-size: 14px;
        color: #c0c0c0;
      }
    }
    .news{
      width: 100%;
      height: calc(100% - 150px);
      overflow-y: scroll;
      .news-list{
       float: left;
        width: 100%;
        list-style: none;
        >li{
          display: block;
          width: 100%;
          min-height: 34px;
          overflow: hidden;
          position: relative;
          &:after{
            content: '';
            display: block;
            position: absolute;
            height: 100%;
            width: 1px;
            background: #4e4e4e;
            top:0;
            left: 102.5px;
            z-index: 1;
          }
          .time{
            float: left;
            width: 130px;
            min-height: 34px;
            >time{
              width: 82px;
              word-break: break-all;
              text-align: center;
              color: #c0c0c0;
            }
            >time, >span{
              float: left;
              position: absolute;
              left:10px;
              top: 50%;
              transform: translateY(-50%);
            }
            >span{
              left:85px;
              display: block;
              width: 16px;
              height: 16px;
              border-radius: 100%;
              background: #4e4e4e;
              box-sizing: content-box!important;
              border: 10px solid #212121;
              z-index: 3;
            }
          }
          .news-content{
            float: left;
            width: calc(100% - 130px);
            height: 100%;
            padding: 20px;
            background: #2b2b2b;
            border-top:3px solid #212121;
            border-bottom:3px solid #212121;
            position: relative;
            &:before{
              content: '';
              position: absolute;
              left:-11px;
              z-index: 3;
              top:50%;
              transform: translateY(-50%);
              width: 0;
              height: 0;
              border-top: 6px solid transparent;
              border-right: 12px solid #2b2b2b;
              border-bottom: 6px solid transparent;
            }
            p{
              width: 100%;
              line-height: 1.4;
              font-size: 14px;
              color: #c0c0c0;
              word-break: break-all;
            }
            img{
              display: inline-block;
              max-width: 100%;
            }
            a{
              color: #ffcc66!important;
              text-decoration: none!important;
              b{
                u{
                  text-decoration: none!important;
                  font-size: 14px!important;
                }
              }
              span{
                color: #ffcc66!important;
                text-decoration: none!important;
              }
            }
          }
          &:first-child{
            .time{
              >time{
                color: #477eff;
              }
              >span{
                border-radius: 100%;
                background: #477eff;
              }
            }
            .news-content{
              position: relative;
              &:after{
                content: '';
                display: block;
                position: absolute;
                height: 50%;
                width: 30px;
                top:-3px;
                left: -30px;
                z-index: 2;
                background: #212121;
              }
            }
          }
          &:last-child{
            .news-content{
              position: relative;
              &:after{
                content: '';
                display: block;
                position: absolute;
                height: 50%;
                width: 30px;
                bottom:-3px;
                left: -30px;
                z-index: 2;
                background: #212121;
              }
            }
          }
        }
      }
      .no-more, .loading{
        float: left;
        width: 100%;
        height: 54px;
        line-height: 54px;
        text-align: center;
        position: relative;
        .txt{
          position: absolute;
          left:54%;
          top:50%;
          transform: translate(-50%, -50%);
        }
      }
    }
  }
  .loader{
    font-size: 15px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    position: absolute;
    left:45%;
    top:50%;
    transform: translate(-50%, -50%) scale(0.3,0.3);
    animation: loader 1.1s infinite ease;
    &:after {
      content: '';
      position: absolute;
      top: 0;
    }
  }
  @keyframes loader {
    0%,
    100% {
      box-shadow: 0em -2.6em 0em 0em #ffffff, 1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2), 2.5em 0em 0 0em rgba(255, 255, 255, 0.2), 1.75em 1.75em 0 0em rgba(255, 255, 255, 0.2), 0em 2.5em 0 0em rgba(255, 255, 255, 0.2), -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.2), -2.6em 0em 0 0em rgba(255, 255, 255, 0.5), -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.7);
    }
    12.5% {
      box-shadow: 0em -2.6em 0em 0em rgba(255, 255, 255, 0.7), 1.8em -1.8em 0 0em #ffffff, 2.5em 0em 0 0em rgba(255, 255, 255, 0.2), 1.75em 1.75em 0 0em rgba(255, 255, 255, 0.2), 0em 2.5em 0 0em rgba(255, 255, 255, 0.2), -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.2), -2.6em 0em 0 0em rgba(255, 255, 255, 0.2), -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.5);
    }
    25% {
      box-shadow: 0em -2.6em 0em 0em rgba(255, 255, 255, 0.5), 1.8em -1.8em 0 0em rgba(255, 255, 255, 0.7), 2.5em 0em 0 0em #ffffff, 1.75em 1.75em 0 0em rgba(255, 255, 255, 0.2), 0em 2.5em 0 0em rgba(255, 255, 255, 0.2), -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.2), -2.6em 0em 0 0em rgba(255, 255, 255, 0.2), -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2);
    }
    37.5% {
      box-shadow: 0em -2.6em 0em 0em rgba(255, 255, 255, 0.2), 1.8em -1.8em 0 0em rgba(255, 255, 255, 0.5), 2.5em 0em 0 0em rgba(255, 255, 255, 0.7), 1.75em 1.75em 0 0em rgba(255, 255, 255, 0.2), 0em 2.5em 0 0em rgba(255, 255, 255, 0.2), -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.2), -2.6em 0em 0 0em rgba(255, 255, 255, 0.2), -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2);
    }
    50% {
      box-shadow: 0em -2.6em 0em 0em rgba(255, 255, 255, 0.2), 1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2), 2.5em 0em 0 0em rgba(255, 255, 255, 0.5), 1.75em 1.75em 0 0em rgba(255, 255, 255, 0.7), 0em 2.5em 0 0em #ffffff, -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.2), -2.6em 0em 0 0em rgba(255, 255, 255, 0.2), -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2);
    }
    62.5% {
      box-shadow: 0em -2.6em 0em 0em rgba(255, 255, 255, 0.2), 1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2), 2.5em 0em 0 0em rgba(255, 255, 255, 0.2), 1.75em 1.75em 0 0em rgba(255, 255, 255, 0.5), 0em 2.5em 0 0em rgba(255, 255, 255, 0.7), -1.8em 1.8em 0 0em #ffffff, -2.6em 0em 0 0em rgba(255, 255, 255, 0.2), -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2);
    }
    75% {
      box-shadow: 0em -2.6em 0em 0em rgba(255, 255, 255, 0.2), 1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2), 2.5em 0em 0 0em rgba(255, 255, 255, 0.2), 1.75em 1.75em 0 0em rgba(255, 255, 255, 0.2), 0em 2.5em 0 0em rgba(255, 255, 255, 0.5), -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.7), -2.6em 0em 0 0em #ffffff, -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2);
    }
    87.5% {
      box-shadow: 0em -2.6em 0em 0em rgba(255, 255, 255, 0.2), 1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2), 2.5em 0em 0 0em rgba(255, 255, 255, 0.2), 1.75em 1.75em 0 0em rgba(255, 255, 255, 0.2), 0em 2.5em 0 0em rgba(255, 255, 255, 0.2), -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.5), -2.6em 0em 0 0em rgba(255, 255, 255, 0.7), -1.8em -1.8em 0 0em #ffffff;
    }
  }
</style>
