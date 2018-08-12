<template>
  <div class="read">
    <div class="list">
      <news-list :newsList="data" :headName="headName"  @itemClick="clickItem"></news-list>
    </div>
    <div class="content" v-if="data.length">
      <transition name="fade">
        <div v-show="loading" class="loading">
          <div class="loader"></div>
        </div>
      </transition>
      <div class="title" v-text="content.title"></div>
      <div class="time" v-text="transfromyyyyMMdd(content.inputtime)"></div>
      <div class="txt" v-html="content.content"></div>
    </div>
  </div>
</template>

<script>

  import NewsList from './NewsList';
  import Format from '../../util/format';
  import http from '../../plugins/http/http';

  export default {
    name: 'Reading',
    data() {
      return {
        loading: false,
        headName: '往期文章', // 表头标题
        data: [], // 新闻列表
        content: '', // 新闻内容
        newsCache: {}, // 新闻缓存
        timer: '', // 节流定时器
      };
    },
    props: {
      listData: {
        type: [Object, Array],
        require: true,
      },
    },
    components: {
      NewsList,
    },
    watch: {
      listData() {
        const vm = this;
        vm.data = vm.listData.analysis_list;
        vm.data.unshift(vm.listData.analysis);
        vm.content = vm.listData.analysis;
        if (!vm.newsCache[vm.listData.analysis.id]) {
          vm.newsCache[vm.listData.analysis.id] = vm.content;
        }
      },
    },
    methods: {
      clickItem(id) {
        const vm = this;
        clearTimeout(vm.timer);
        vm.timer = setTimeout(() => {
          if (!vm.newsCache[id]) {
            vm.loading = true;
            vm.getNewsContent(id, (data) => {
              vm.content = data;
              vm.newsCache[id] = data;
              vm.$el.lastChild.scrollTop = 0;
              vm.loading = false;
            });
          } else {
            vm.loading = false;
            vm.content = vm.newsCache[id];
            vm.$el.lastChild.scrollTop = 0;
          }
        }, 300);
      },
      transfromhhmm(str) {
        if (!str || str === '0') {
          return '--';
        }
        return Format.date(new Date(Number(str) * 1000), 'hh:mm');
      },
      transfromyyyyMMdd(str) {
        if (!str || str === '0') {
          return '--';
        }
        return Format.date(new Date(Number(str) * 1000), 'yyyy-MM-dd hh:mm:ss');
      },
      getNewsContent(id, callback) {
        const httpList = http.apiList;
        const httpData = {
          id,
        };
        http.api[httpList.GET_NEWS_INFO]({
          success(response) {
            if (typeof callback === 'function') {
              callback(response);
            }
          },
          param: httpData,
        });
      },
    },
    computed: {},
    created() {},
    activated() {},
    deactivated() {},
  };
</script>

<style lang="scss" rel="stylesheet/scss" >
  @import "../../assets/sass/static";
  *{
    padding: 0;
    margin: 0;
  }
  .read{
    width: 100%;
    height: 100%;
    .list{
      float: left;
      width: 36%;
      height: 100%;
    }
    .content{
      float: left;
      width: 64%;
      height: 100%;
      overflow-y: scroll;
      padding:0 3.8%;
      background: #242424;
      position: relative;
      .loading{
        width: calc(64% - 84px);
        height: calc(100% - 28px);
        position: fixed;
        top:0;
        right:0;
        z-index: 100;
        background-color: #242424;
        .loader{
          font-size: 15px;
          width: 15px;
          height: 15px;
          border-radius: 50%;
          position: absolute;
          left:50%;
          top:50%;
          transform: translate(-50%, -50%);
          animation: loader 1.1s infinite ease;
          &:after {
            content: '';
            position: absolute;
            top: 0;
          }
        }
      }
      .title{
        font-size: 36px;
        color: #c0c0c0;
        text-align: center;
        line-height: 1.5;
      }
      .time{
        text-align: center;
        font-size: 14px;
        color: #c0c0c0;
        margin:20px 0;
      }
      .txt{
        color:#c0c0c0;
        font-size: 14px;
        margin-bottom: 50px;
        img{
          display: inline-block;
          max-width: 100%;
        }
        span{
          color: #c0c0c0!important;
        }
        table{
          border-color: #c0c0c0;
          tbody{
            border-color: #c0c0c0;
            tr{
              border-color: #c0c0c0;
              td{
                border-color: #c0c0c0!important;
                color: #c0c0c0!important;
                font-size: 14px!important;
                a{
                  color: #ffcc66!important;
                  text-decoration: none!important;
                  font-size: 14px!important;
                  b{
                    u{
                      text-decoration: none!important;
                      font-size: 14px!important;
                    }
                  }
                }
              }
            }
          }
        }
      }
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
