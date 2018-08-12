<template>
  <div class="body-content">
    <div class="left-list">
      <ul class="news-wrap">
        <li v-for="(item, index) in newsList" v-if="item.name" :class="{active: index === selectItem}" @click="clickItem(index, item.stock.stock)">
          <div class="index" v-text="index + 1"></div>
          <div class="name" v-text="item.name"></div>
          <div class="content">
            <p>
              <span @click="clickTitle(item.new.id)">驱动事件：{{item.new.title}}</span><br>
              <span>发现时间：{{transformhhmm(item.foundtime)}}</span>
            </p>
          </div>
          <div class="num">
            <p>概念涨幅：<stock-details :value="item.stock.ave_radio" :boundary="-0.0001" modal="normal" unit="%"></stock-details><br>
              上涨家数：<span class="up">{{item.stock.up}}</span><br>
              下跌家数：<span class="down">{{item.stock.down}}</span><br></p>
          </div>
        </li>
      </ul>
    </div>
    <div class="right-list">
      <div class="head-subject" v-if="newsList.length" v-text="newsList[selectItem].name"></div>
      <stock-list :listData="stockList"></stock-list>
    </div>
  </div>
</template>

<script>
  import http from '../../plugins/http/http';
  import StockDetails from '../../components/stockBase/StockDetails';
  import {
    actions,
  } from '../../model/vuex/actionsType';
  import format from '../../util/format';
  import StockList from './StockList';

  export default {
    name: 'hotnews',
    data() {
      return {
        selectItem: 0,
        newsList: [],
        newsCache: {},
        stockList: [],
      };
    },
    components: {
      StockDetails,
      StockList,
    },
    methods: {
      clickItem(index, stockList) {
        const vm = this;
        vm.selectItem = index;
        vm.stockList = stockList;
      },
      clickTitle(id) {
        this.clickNews(id);
      },
      // 判断消息时间，今天则显示‘今天’
      transformDate(str) {
        if ((typeof str) !== 'string' || !str) {
          return str;
        }
        const today = format.date(new Date(), 'MM-dd');
        let dateStr = format.date(new Date(Number(str) * 1000), 'MM-dd hh:mm');
        dateStr = dateStr.replace(today, '今天');
        return dateStr;
      },
      transformhhmm(str) {
        const today = format.date(new Date(), 'MM-dd');
        let dateStr = format.date(new Date(Number(str) * 1000), 'MM-dd');
        if (today === dateStr) {
          dateStr = format.date(new Date(Number(str) * 1000), 'hh:mm');
        } else {
          dateStr = format.date(new Date(Number(str) * 1000), 'MM月dd日  hh:mm');
        }
        return dateStr;
      },
      init() {
        const vm = this;
        const httpList = http.apiList;
        const httpData = {
          type: 1,
        };
        http.api[httpList.GET_HOT_NEWS]({
          success(response) {
            vm.newsList = response;
            vm.stockList = response[0].stock.stock;
          },
          param: httpData,
        });
      },
      /**
       * 点击到具体新闻，查看
       * @param {number} id - 要查看的新闻id
       * @param {function} vm.openNews - 内部加入这个方法作为请求数据成功的回调，弹出新闻窗口
       */
      clickNews(id) {
        const vm = this;
        // 不可以直接使用数组下标操作属性，vue无法检测并更新到视图，需要调用$set方法
        const item = vm.newsCache[id];
        if (!item) {
          const httpList = http.apiList;
          const httpData = {
            id,
          };
          http.api[httpList.GET_NEWS_INFO]({
            success(response) {
              vm.newsCache[id] = response;
              vm.openNews(response);
            },
            param: httpData,
          });
        } else {
          vm.openNews(vm.newsCache[id]);
        }
      },
      openNews(newObj) {
        const vm = this;
        if (!newObj || !newObj.title || !newObj.content) {
          vm.$store.dispatch(actions.UPDATE_NOTICE_DATA, {
            status: 'fail',
            content: '暂无详情！',
          });
          return;
        }
        vm.$store.dispatch(actions.UPDATE_NEWS_DATA, {
          title: newObj.title,
          date: vm.transformDate(newObj.inputtime),
          from: newObj.from,
          desc: newObj.content,
        });
      },
    },
    watch: {},
    created() {
      this.init();
    },
  };
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
@import "../../assets/sass/static";
*{
  padding: 0;
  margin: 0;
}
.body-content{
  flex-flow: row nowrap;
  width:100%;
  height: 100%;
  .left-list{
    width:52%;
    height: 100%;
    overflow-y: scroll;
    .news-wrap{
      overflow: hidden;
      list-style: none;
      >li{
        float: left;
        width: 100%;
        height: 92px;
        border-bottom: 1px solid #212121;
        cursor: pointer;
        >div{
          float: left;
          height: 100%;
          background-color: #2b2b2b;
        }
        .index, .name{
          line-height: 92px;
          text-align: center;
          font-size: 20px;
          color: #c0c0c0;
        }
        .index{
          width: 98px;
          background-color: #373737;
        }
        .name{
          width: 144px;
          overflow: hidden;
          text-overflow: ellipsis;
          word-break: keep-all;
          white-space:nowrap;
        }
        .content{
          width: calc(100% - 98px - 144px - 154px);
          height: 100%;
          font-size: 14px;
          border-left: 1px solid #212121;
          color: #c0c0c0;
          display: flex;
          align-items: center;
          >p{
            width: 100%;
            padding:0 10px 0 30px;
            line-height: 1;
           span{
             display: -webkit-box;
             -webkit-box-orient: vertical;
             -webkit-line-clamp: 2;
             overflow: hidden;
           }
          }
        }
        .num{
          width: 154px;
          height: 100%;
          font-size: 14px;
          color: #c0c0c0;
          display: flex;
          align-items: center;
          border-left: 1px solid #212121;
          >p{
            width: 100%;
            padding:0 5px 0 25px;
            line-height: 1.5;
            .up{
              color: #f03426;
            }
            .down{
              color: #34c134;
            }
          }
        }
        &:first-child, &:nth-child(2), &:nth-child(3){
          .index, .name{
            color: #f5ba53;
          }
        }
      }
      .active{
        .content, .num{
          border-left-color: transparent;
        }
        .content, .num, .name{
          background:#373737;
        }
      }
    }
  }
  .right-list{
    width: 48%;
    height: 100%;
    .head-subject{
      width: 100%;
      height: 36px;
      line-height: 36px;
      background-color: #373737;
      color: #c0c0c0;
      font-size: 16px;
      text-align: center;
    }
  }
}
</style>
