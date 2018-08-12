<template>
  <!--列表滚动，自动订阅屏幕内的股票涨跌数据,1分钟更新一次-->
  <div class="news-page" @scroll="onScroll()" ref="scroll-box">
    <div class="new-list" v-if="newsList && newsList.length > 0">
      <ul>
        <li v-for="(item, index) in newsList" :key="item.id" :ref="'new'+index">
          <div class="new-info-block clear">
            <p class="new-time">
              <span>{{transformhhmm(item.inputtime)}}</span>
            </p>
            <div class="new-text">
              <span class="fist-news" v-if="item.hasNew === true">NEW</span>
              <div class="tags" v-if="item.tag && item.tag.length > 0">
                <span class="type" v-for="type in item.tag">#{{type}}</span>
              </div>
              <!--点击新闻标题，弹窗显示新闻详细内容-->
              <span :class="['new-title', {'red': item.hasNew === true }]" @click="clickNewsTitle(item.id, index)">【{{item.title}}】</span>{{item.description}}
            </div>
            <div class="stock-info-block clear" v-if="item.stocks && item.stocks.length>0">
              <p class="relative-stock">相关股票:</p>
              <div class="stock-list">
                <!--点击相关股票，跳转去股票详情页面-->
                <router-link v-for="(stock, index) in item.stocks" :key="stock.foxxcode" :to="{ name: 'stock', params: { code: stock.foxxcode }}" class="stock-item">
                  <!--鼠标移入股票区域，显示股票的gif分时图，移出时隐藏-->
                  <div @mouseenter="enterStock($event, stock.foxxcode)" @mouseleave="leaveStock()">
                    <p class="stock-name">{{getStockNameCode(stock.foxxcode)}}</p>
                    <p class="stock-change">
                      <stock-detail :value="getStockRatio(stock.foxxcode)" :format="2" :boundary="0" :prefix="true" unit="%" modal="normal"></stock-detail>
                    </p>
                  </div>
                </router-link>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <!--组件默认不渲染，交互触发显示-->
    <tick-line-image :foxxcode="gifFoxxCode" :clientX="gifClientX" :clientY="gifClientY" ref="stockgif"></tick-line-image>
  </div>
</template>

<script>
import {
  mapGetters,
} from 'vuex';
import {
  columnSocket,
  EVENT,
} from '../../plugins/YCJWebSocket/YCJWebSocket';
import StockDetail from '../../components/stockBase/StockDetails';
import http from '../../plugins/http/http';
import format from '../../util/format';
import {
  stockActions,
  newsActions,
} from '../../model/vuex/actionsType';
import NewsModel from '../../components/global/NewsModel';
import baseUtil from '../../util/baseUtil';
import logMsg from '../../util/logger';
import YCJutil from '../../util/ycjUtil';
import TickLineImage from '../../components/stockBase/TickLineImage';

export default {
  name: 'LeftList',
  data() {
    return {
      newsList: [],
      listLen: 0,
      topNews: {},
      oldStockList: [],
      allList: [],
      currlyList: [],
      addStockList: [],
      cancelList: [],
      timeout: null,
      stockStateList: {},
      gifFoxxCode: '',
      gifClientX: '',
      gifClientY: '',
    };
  },
  components: {
    StockDetail,
    NewsModel,
    TickLineImage,
  },
  methods: {
    // 显示股票gif
    enterStock($event, foxxcode) {
      const vm = this;
      vm.gifFoxxCode = foxxcode;
      vm.gifClientX = $event.clientX;
      vm.gifClientY = $event.clientY;
      vm.$refs.stockgif.show();
    },
    // 隐藏股票gif
    leaveStock() {
      this.$refs.stockgif.hide();
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
      if ((typeof str) !== 'string' || !str) {
        return str;
      }
      const today = format.date(new Date(), 'MM-dd');
      let dateStr = format.date(new Date(Number(str) * 1000), 'MM-dd');
      if (today === dateStr) {
        dateStr = format.date(new Date(Number(str) * 1000), 'hh:mm');
      } else {
        dateStr = format.date(new Date(Number(str) * 1000), 'MM月dd日  hh:mm');
      }
      return dateStr;
    },
    /**
     * 渲染页面，作为成功的callback方法传入到请求的异步success中
     * @param {json} response - 新闻列表数组
     * */
    renderPage(response) {
      const vm = this;
      const arr = [];
      for (let i = 0; i < response.length; i += 1) {
        response[i].detailInfo = 0;
        response[i].hasNew = false;
        if (!response[i].tag) {
          response[i].tag = [];
        }
        arr.push(response[i]);
      }
      vm.newsList = arr;
      vm.$nextTick(() => {
        vm.showStockList();
      });
    },
    /**
     * 翻页共用方法
     * @param {number} page - 翻页页码
     * @param {number} limit - 每页数据长度
     * @param {function} callback - 处理response的成功回调方法
     * @param {function} falseFun - 处理response的失败回调方法
     */
    getNewsList(page, limit, callback) {
      const httpList = http.apiList;
      const httpData = {
        page: 1,
        limit: 40,
      };
      if (limit && limit !== 0) {
        this.listLen += limit;
        httpData.limit = this.listLen;
      }
      http.api[httpList.GET_REFERENCE_NEWS]({
        success(response) {
          callback(response);
        },
        param: httpData,
      });
    },
    /**
     * 点击到具体新闻，查看
     * @param {number} id - 要查看的新闻id
     * @param {number} index - 点击序列号
     * @param {function} vm.openNews - 内部加入这个方法作为请求数据成功的回调，弹出新闻窗口
     */
    clickNewsTitle(id, index) {
      const vm = this;
      // 不可以直接使用数组下标操作属性，vue无法检测并更新到视图，需要调用$set方法
      const item = vm.newsList[index];
      item.hasNew = false;
      vm.$set(vm.newsList, index, item);
      this.$store.dispatch(newsActions.SHOW_NEWS_BY_ID, {
        id,
        show: true,
      });
    },
    /**
     * 获取推送新闻
     * @param {json} newObj - websoket推送的新闻内容
     */
    getTopNews(newsObj) {
      if (!newsObj) {
        return;
      }
      const vm = this;
      const httpList = http.apiList;
      const httpData = {
      };
      httpData.id = newsObj.news_id;
      http.api[httpList.GET_NEWS_INFO]({
        success(response) {
          if (!response.description) {
            logMsg.log('缓存服务器有脏数据，不进行渲染');
            return;
          }
          vm.topNews = response;
          vm.topNews.hasNew = true;
          vm.topNews.detailInfo = 0;
          vm.newsList.unshift(vm.topNews);
          if (vm.newsList.length > 100) {
            vm.newsList.length = 100;
          }
          vm.topNews = {};
          vm.$nextTick(() => {
            vm.showStockList();
          });
        },
        param: httpData,
      });
    },
    onScroll() {
      const vm = this;
      if (vm.timeout != null) {
        clearTimeout(vm.timeout);
      }
      vm.timeout = setTimeout(vm.showStockList, 100);
    },
    /**
     * @param {array} arr - 增加监听的股票id数组
     */
    sendStock(arr) {
      const vm = this;
      if (YCJutil.isEnd()) {
        baseUtil.each(arr, (item) => {
          if (!vm.stockStateList[item]) {
            vm.stockStateList[item] = 1;
            vm.$store.dispatch(stockActions.ADD_STOCK_LIST, item);
          }
        });
        return;
      }
      baseUtil.each(arr, (item) => {
        vm.$store.dispatch(stockActions.ADD_STOCK_LIST, item);
        vm.stockStateList[item] = 1;
      });
    },
    /**
     * @param {array} arr - 移除监听的股票id数组
     */
    removeStock(arr) {
      const vm = this;
      baseUtil.each(arr, (item) => {
        vm.$store.dispatch(stockActions.REMOVE_STOCK_LIST, item);
      });
    },
    /**
     * 动态监听屏幕内的股票更新
     */
    showStockList() {
      const vm = this;
      const len = vm.newsList.length - 1;
      let lastH = 0;
      if (vm.$refs[`new${len}`][0]) {
        lastH = vm.$refs[`new${len}`][0].clientHeight;
      }
      const cHeight = vm.$refs['scroll-box'].clientHeight - lastH;
      const scrollTop = vm.$refs['scroll-box'].scrollTop;
      const startIndex = vm.getStarIndex(scrollTop, 'start');
      const endIndex = vm.getStarIndex(scrollTop + cHeight, 'end');
      const newstockArr = vm.getStockArr(startIndex, endIndex);
      if (vm.oldStockList.length === 0) {
        // 页面初次渲染，没数据，直接订阅
        vm.oldStockList = [...newstockArr];
        vm.sendStock(vm.oldStockList);
      } else {
        // 数组有数据，则新老数组交集不动，新数组与全集的差集取消订阅，老数组与全集的差集增加订阅
        vm.allList = vm.arrUnique([...vm.oldStockList, ...newstockArr]);
        vm.addStockList = vm.intersect(vm.allList, vm.oldStockList);
        vm.sendStock(vm.addStockList);
        vm.currlyList = [...newstockArr];
        vm.cancelList = vm.intersect(vm.allList, vm.currlyList);
        vm.removeStock(vm.cancelList);
        vm.oldStockList = vm.currlyList;
      }
    },
    /**
     * 获取滚条窗口内显示的新闻下标
     * @param {number} top - 需要计算的高度
     * @param {string} type - 下标的类型，start（获取屏幕最上方的新闻下标），end（获取屏幕最下方的新闻下标）
     */
    getStarIndex(top, type) {
      const vm = this;
      const list = vm.objToArray(vm.$refs);
      const result = { index: 0, height: 0 };
      if (type === 'start') {
        for (let i = 0; i < list.length; i += 1) {
          result.height += list[i];
          if (result.height > top) {
            result.index = i;
            break;
          }
        }
      } else if (type === 'end') {
        for (let i = 0; i < list.length; i += 1) {
          result.height += list[i];
          if (result.height > top) {
            result.index = i + 1;
            break;
          }
        }
      }
      return result.index;
    },
    /**
     * @param {object} obj - 传入转换的对象
     * @returns {Array}
     */
    objToArray(obj) {
      const vm = this;
      const newArr = [];
      for (let i = 0; i < vm.newsList.length; i += 1) {
        if (obj[`new${i}`]) {
          const item = obj[`new${i}`];
          newArr.push(item[0].clientHeight);
        } else {
          break;
        }
      }
      return newArr;
    },
    /**
     * @param {number} start - 开始搜索的新闻下标（包含）
     * @param {number} end - 结束搜索的新闻下标（包含）
     * @returns {Array}
     */
    getStockArr(start, end) {
      const vm = this;
      const stockArr = [];
      for (let i = start; i < end; i += 1) {
        for (let j = 0; j < vm.newsList[i].stocks.length; j += 1) {
          stockArr.push(vm.newsList[i].stocks[j].foxxcode);
        }
      }
      return stockArr;
    },
    /**
     * 数组去重
     * @param array
     * @returns {Array}
     */
    arrUnique(array) {
      const tmp = {};
      const ret = [];
      for (let i = 0, j = array.length; i < j; i += 1) {
        if (!tmp[array[i]]) {
          tmp[array[i]] = 1;
          ret.push(array[i]);
        }
      }
      return ret;
    },
    /**
     * 删除特定新闻
     * @param {string} id - 新闻id
     */
    removeNewItem(id) {
      const newId = `${id}`;
      const vm = this;
      logMsg.log(`删除特定新闻>>>>>${newId}`);
      for (let i = 0; i < vm.newsList.length; i += 1) {
        if (vm.newsList[i].id.indexOf(newId) > -1) {
          vm.newsList.splice(i, 1);
          break;
        }
      }
    },
    /**
     * 求数组补集
     * @param {array} a - 补集最终所在的数组
     * @param {array} b - 需要排除的数组
     * eg：a: [0, 1, 2, 3]; b: [3];
     * intersect(a, b);//[0, 1, 2]
     */
    intersect(a, b) {
      const result = new Array(0);
      const obj = {};
      for (let i = 0; i < b.length; i += 1) {
        obj[b[i]] = 1;
      }
      for (let j = 0; j < a.length; j += 1) {
        if (!obj[a[j]]) {
          obj[a[j]] = 1;
          result.push(a[j]);
        }
      }
      return result;
    },
    init() {
      const vm = this;
      // 获取页面数据
      this.getNewsList(1, 100, vm.renderPage);
      // 订阅推送新闻
      if (columnSocket) {
        columnSocket.on(EVENT.REFERENCE, (data) => {
          if (data.op_id === 1) {
            vm.getTopNews(data);
          }
          if (data.op_id === 2) {
            vm.removeNewItem(data.news_id);
          }
        });
      }
    },
  },
  computed: {
    ...mapGetters([
      'getStockRatio',
      'getStockNameCode',
    ]),
  },
  created() {
    const vm = this;
    vm.init();
  },
  activated() {
    this.$refs.stockgif.hide();
    baseUtil.each(this.lastStockList, (item) => {
      this.$store.dispatch(stockActions.ADD_STOCK_LIST, item);
    });
  },
  deactivated() {
    baseUtil.each(this.lastStockList, (item) => {
      this.$store.dispatch(stockActions.REMOVE_STOCK_LIST, item);
    });
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/sass/static";
  *{
    padding: 0;
    margin: 0;
  }
  .clear {*zoom: 1;}
  .clear:after {
    content: '';
    display: block;
    width:100%;
    height:0;
    clear: both;
  }
  .news-page {
    position: relative;
    width: 100%;
    padding-left:10px;
    height: 100%;
    background: $background;
    overflow-y: auto;
    .new-list {
      width: 100%;
      min-height: 100%;
      margin: 0 auto;
      background: $G4;
      >ul>li {
        position: relative;
        display: block;
        width: 100%;
        border-bottom: 1px solid $G3;
        padding: 16px 20px 12px 0;
        .new-info-block {
          .new-time {
            position: absolute;
            top:0;
            left:0;
            bottom:0;
            display: block;
            width: 120px;
            min-width: 90px;
            background: #373737;
            span {
              position: absolute;
              top:50%;
              left:0;
              margin-top: -7px;
              display: block;
              width: 100%;
              height: 14px;
              line-height: 14px;
              font-size: 14px;
              color: #c0c0c0;
              text-align: center;
            }
          }
          .new-text {
            position: relative;
            display: block;
            width:100%;
            padding-left:140px;
            overflow: hidden;
            color: #c0c0c0;
            line-height: 22px;
            font-size: 14px;
            font-weight:normal;
            span {
              display: inline-block;
              vertical-align: middle;
            }
            .tags {
              position: relative;
              display: inline-block;
              line-height: 16px;
              margin-left:4px;
              overflow: hidden;
              vertical-align: middle;
              .type {
                position: relative;
                font-size: 12px;
                color: #c0c0c0;
                border: 1px solid #c0c0c0;
                margin-right: 6px;
                padding: 0 4px;
                line-height: 16px;
              }
              .type:last-child {
                margin-right: 0;
              }
            }
            .new-title {
              font-weight: bold;
              cursor: pointer;
            }
            .red {
              color: #f03426;
            }
            .new-title:hover {
              text-decoration: underline;
            }
            .fist-news {
              position: relative;
              display: inline-block;
              height: 18px;
              line-height: 18px;
              background: red;
              padding: 0 2px;
              font-size:12px;
              color: #fff;
            }
          }
        }
        .stock-info-block {
          position: relative;
          width: 100%;
          margin-top: 10px;
          padding-left: 140px;
          .relative-stock {
            display: inline-block;
            float: left;
            height: 20px;
            line-height: 20px;
            font-size: 14px;
            min-width: 60px;
            text-align: left;
            color: #bebebe;
          }
          .stock-list {
            overflow: hidden;
            .stock-item {
              position: relative;
              display: inline-block;
              width: 20%;
              height: 20px;
              line-height: 20px;
              padding-left:10px;
              margin: 0 0 4px 0;
              float: left;
              cursor: pointer;
              border-right:1px solid $G2;
              .stock-name {
                position: relative;
                display: inline-block;
                height: 20px;
                line-height: 20px;
                font-size: 12px;
                color: #ffcc66;
              }
              .stock-change {
                position: absolute;
                top:0;
                right: 10px;
                display: inline-block;
                font-size: 12px;
                height: 20px;
                line-height: 20px;
                color: green;
              }
              .des {
                color: red;
              }
            }
            .stock-item:hover .stock-name {
              text-decoration: underline;
            }
            .stock-item:last-child {
              border-right:1px solid $G4;
            }
          }
        }
      }
      ul li:last-child {
        border-bottom: 1px solid $G4;
      }
    }
  }
  @media only screen and (max-width: 1780px) {
    .stock-item {
      width: 25% !important;
    }
    .stock-item:nth-child(4) {
      border-right:1px solid $G4 !important;
    }
  }
  @media only screen and (max-width: 1500px) {
    .stock-item {
      width: 33.3% !important;
    }
    .stock-item:nth-child(4) {
      border-right:1px solid $G2 !important;
    }
    .stock-item:nth-child(3) {
      border-right:1px solid $G4 !important;
    }
  }
</style>
