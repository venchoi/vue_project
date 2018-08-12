<template>
  <div class="choose-detail-wrap">
    <!--页面顶部header-->
    <div class="top">
      <top-menu @clickExplain="openExplain" @clickPay="toPay" :topData="topData" :systemCode="systemCode"></top-menu>
    </div>
    <div class="content">
      <!--页面左侧表格内容-->
      <div class="left">
        <!--今日发现，历史数据列表切换tag-->
        <div class="left-menu">
          <tag-menu @toggleMenu="toggleLeft" :config="[`今日发现(${DateStr ? DateStr : '暂无数据'})`, '历史记录']" :initIndex="getMenuIndex"></tag-menu>
        </div>
        <!--today今日发现，history历史数据列表，表格内部数据通过vuex的getter绑定，不需要传入-->
        <div class="left-table">
          <div class="today" key="0" v-if="MenuIndex === 0">
            <today-table @clickRow="clickStock" @activeChange="activeUpdate" ref="todayList"></today-table>
          </div>
          <div class="history" key="1" v-if="MenuIndex === 1">
            <history-table @clickRow="clickStock" @activeChange="activeUpdate"></history-table>
          </div>
        </div>
      </div>
      <!--页面右侧数据内容，包括分时、K线、大盘推荐操作、模型性能、股票相关新闻列表-->
      <div class="right" v-show="showRightContent">
        <!--右侧菜单，切换分时和K线，今日发现默认显示分时，历史数据默认显示K线-->
        <div class="right-menu">
          <tag-menu @toggleMenu="toggleRight" :config="['分时', 'K线']" :initIndex="rightMenuIndex"></tag-menu>
          <!--当前股票名称代码-->
          <div class="stock-name">{{getNameCode}}</div>
        </div>
        <!--右侧菜单对应内容-->
        <div class="right-content">
          <!--分时图模块内容-->
          <div class="left-view" v-show="rightMenuIndex === 0">
            <!--分时图-->
            <div class="canvas-box">
              <tick-chart :code="currentFoxxcode" ref="sertickchart" :marker="getMarket"></tick-chart>
            </div>
            <!--大盘推荐操作-->
            <div class="middle-box">
              <index-stock></index-stock>
            </div>
            <!--股票相关新闻列表-->
            <div class="bottom-box">
              <div class="table-head">
                <div class="four">消息时间</div>
                <div class="four">来源</div>
                <div class="two">{{getStockInfo(currentFoxxcode).name}}关联新闻</div>
              </div>
              <new-list :newsList="stockNewsList" @clickNew="openNews"></new-list>
            </div>
          </div>
          <!--K线图模块内容-->
          <div class="right-view" v-show="rightMenuIndex === 1">
            <!--K线图-->
            <div class="k-line">
              <k-chart :code="currentFoxxcode" ref="serkchart" :marker="currentPush_date"></k-chart>
            </div>
            <!--普通服务的模型性能，与低风险布局不一致，数据结构也不同-->
            <div class="statistics-data" v-if="systemCode !== 'lowrisk' &&statistics_data">
              <div class="module-title">
                <p>模型性能数据消息时间(截止{{statistics_data.date}})</p>
              </div>
              <div class="data-list" >
                <div class="data-item">
                  <p>最优胜率</p>
                  <stock-details :value='statistics_data.high_probability' :boundary='0' unit="%" modal='normal'></stock-details>
                </div>
                <div class="data-item">
                  <p>最高获利</p>
                  <stock-details :value='statistics_data.high_profit' :boundary='0' unit="%" modal='normal'></stock-details>
                </div>
                <div class="data-item">
                  <p>平均获利</p>
                  <stock-details :value='statistics_data.avg_profit' :boundary='0' unit="%" modal='normal'></stock-details>
                </div>
                <div class="data-item">
                  <p>总样本数</p>
                  <span class="fcolor">{{statistics_data.sample_num}}</span>
                </div>
                <div class="data-item">
                  <p>最大回撤</p>
                  <stock-details :value='statistics_data.loss_profit' :boundary='0' prefix="true" unit="%" modal='normal'></stock-details>
                </div>
              </div>
            </div>
            <!--低风险股票池的模型性能-->
            <div class="statistics-data" v-if="systemCode === 'lowrisk' && lowrisk_statistics">
              <div class="module-title">
                <p>模型性能数据消息时间(截止{{lowrisk_statistics.date}})</p>
              </div>
              <div class="low-list" >
                <div class="low-row">
                  <p>T+7日内平均最高盈利</p>
                  <p>
                    <stock-details :value='lowrisk_statistics.high_avg' :boundary='0' unit="%" modal='normal'></stock-details>
                  </p>
                </div>

                <div class="low-row">
                  <p>T+7日收盘价卖出的胜率</p>
                  <p>
                    <stock-details :value='lowrisk_statistics.close_win_rate' :boundary='0' unit="%" modal='normal'></stock-details>
                  </p>
                </div>
                <div class="low-row">
                  <p>T+7日收盘价卖出平均涨幅</p>
                  <p>
                    <stock-details :value='lowrisk_statistics.close_avg' :boundary='0' unit="%" modal='normal'></stock-details>
                  </p>
                </div>
                <div class="low-row">
                  <p>样本数</p>
                  <p class="fcolor">
                    {{lowrisk_statistics.sample_num}}
                  </p>
                </div>
                <div class="low-row">
                  <p>T+7日内平均最大回撤</p>
                  <p>
                    <stock-details :value='lowrisk_statistics.low_avg' :boundary='0' unit="%" modal='normal'></stock-details>
                  </p>
                </div>
              </div>
            </div>
            <!--低风险股票池的模型性能-->
            <div class="statistics-data" v-if="systemCode === 'nline' && lowrisk_statistics">
              <div class="module-title">
                <p>模型性能数据消息时间(截止{{lowrisk_statistics.date}})</p>
              </div>
              <div class="low-list" >
                <div class="low-row">
                  <p>T+3日内平均最高盈利</p>
                  <p>
                    <stock-details :value='lowrisk_statistics.high_avg' :boundary='0' unit="%" modal='normal'></stock-details>
                  </p>
                </div>

                <div class="low-row">
                  <p>T+3日收盘价卖出的胜率</p>
                  <p>
                    <stock-details :value='lowrisk_statistics.close_win_rate' :boundary='0' unit="%" modal='normal'></stock-details>
                  </p>
                </div>
                <div class="low-row">
                  <p>T+3日收盘价卖出平均涨幅</p>
                  <p>
                    <stock-details :value='lowrisk_statistics.close_avg' :boundary='0' unit="%" modal='normal'></stock-details>
                  </p>
                </div>
                <div class="low-row">
                  <p>样本数</p>
                  <p class="fcolor">
                    {{lowrisk_statistics.sample_num}}
                  </p>
                </div>
                <div class="low-row">
                  <p>T+3日内平均最大回撤</p>
                  <p>
                    <stock-details :value='lowrisk_statistics.low_avg' :boundary='0' unit="%" modal='normal'></stock-details>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    mapGetters,
  } from 'vuex';
  import Tooltip from '../../components/base/Tooltip';
  import Iconfont from '../../components/base/IconFont';
  import {
    actions,
    stockActions,
  } from '../../model/vuex/actionsType';
  import TickChart from './TickChart';
  import KChart from './KChart';
  import SortList from '../../components/base/SortList2/List';
  import ListColumn from '../../components/base/SortList2/ListColumn';
  import StockDetails from '../../components/stockBase/StockDetails';
  import http from '../../plugins/http/http';
  import Format from '../../util/format';
  import NewList from './newsList';
  import TopMenu from './TopMenu';
  import TagMenu from './TagMenu';
  import IndexStock from './IndexStock';
  import TodayTable from './TodayList';
  import HistoryTable from './HistoryList';
  import baseUtil from '../../util/baseUtil';

  export default {
    name: 'ServiceDetail',
    data() {
      return {
        topExplain: '', // 使用说明
        topQrcode: '',
        statistics_data: { // 普通服务的模型性能
          avg_probability: '0%', // 平均胜率
          avg_profit: '0%', // 平均获利
          high_probability: '0%', // 最优胜率
          high_profit: '0%', // 最高获利
          loss_profit: '0%', // 最大回撤
          sample_num: '0', // 总样本数
          trading_day: '0',
        },
        lowrisk_statistics: { // 低风险股票池的模型性能
          high_avg: '0%', // 7日内平均最高盈利
          low_avg: '0%', // T+7日内平均最大回撤
          close_win_rate: '0%', // T+7日收盘价卖出的胜率
          close_avg: '0%', // T+7日收盘价卖出平均涨幅
          sample_num: '0', // 总样本数
          trading_day: '0',
        },
        MenuIndex: 0, // tag菜单，0表示今日发现，1表示历史记录
        systemCode: '', // 选股code，例：'lowrisk'为低风险股票池
        rightMenuIndex: 0, // 右侧菜单，0表示分时图，1表示K线图
        DateStr: '', // 今日发现日期
        currentFoxxcode: '', // 当前选中的股票代码
        currentPush_time: '', // 当前分时图的股票push进监听队列的时间
        currentPush_date: '', // 当前K线图的股票push进监听队列的日期
        stockNewsList: [], // 当前股票对应的新闻列表
        newsStore: {}, // 已经缓存的新闻列表
        requestNew: true, // http获取股票列表数据时，防止重复提交
        topData: {}, // 选股内页头部的数据，包括logo及名称等
      };
    },
    props: {
    },
    components: {
      TopMenu,
      TagMenu,
      IndexStock,
      SortList,
      ListColumn,
      StockDetails,
      TickChart,
      KChart,
      Iconfont,
      Tooltip,
      NewList,
      TodayTable,
      HistoryTable,
    },
    methods: {
      transfromDate(str) {
        if (!str || str === '0') {
          return '--';
        }
        const today = Format.date(new Date(), 'MM-dd');
        let dateStr = Format.date(new Date(Number(str) * 1000), 'MM-dd hh:mm');
        dateStr = dateStr.replace(today, '今天');
        return dateStr;
      },
      transfromhhmm(str) {
        if (!str || str === '0') {
          return '--';
        }
        const date = Format.date(new Date(Number(str) * 1000), 'hh:mm');
        return date;
      },
      transfromyyyyMMdd(str) {
        if (!str || str === '0') {
          return '--';
        }
        const date = Format.date(new Date(Number(str) * 1000), 'yyyy-MM-dd');
        return date;
      },
      openExplain() {
        this.$store.dispatch(actions.UPDATE_NEWS_DATA, {
          title: '使用说明',
          date: '',
          from: '',
          desc: this.topExplain,
        });
      },
      openNews(newObj) {
        const vm = this;
        if (!newObj || !newObj.title || !newObj.content) {
          return;
        }
        vm.$store.dispatch(actions.UPDATE_NEWS_DATA, {
          title: newObj.title,
          date: vm.transfromDate(newObj.inputtime),
          from: newObj.from,
          desc: newObj.content,
        });
      },
      toggleRight(index) {
        this.rightMenuIndex = index;
      },
      toggleLeft(index) {
        this.MenuIndex = index;
      },
      /**
       * 列表组件中点击股票，切换当前股票信息
       */
      clickStock(row) {
        if (!row.code || row.code === '') {
          return;
        }
        const vm = this;
        if (vm.currentFoxxcode !== row.code) {
          vm.currentFoxxcode = row.code;
          vm.currentPush_time = vm.transfromhhmm(row.push_time);
          vm.currentPush_date = vm.transfromyyyyMMdd(row.push_time);
        }
        vm.getStockNews(vm.currentFoxxcode);
      },
      /**
       * 列表组件上下选股票时，动态切换当前股票的信息，包括新闻列表
       * @param rowid
       * @param row
       */
      activeUpdate(rowid, row) {
        const vm = this;
        const item = row;
        if (!item.code || item.code === '') {
          return;
        }
        if (vm.currentFoxxcode !== item.code) {
          vm.setCurrentFoxx(item);
        }
        if (vm.MenuIndex === 0) {
          vm.getStockNews(vm.currentFoxxcode);
        }
      },
      /**
       * 获取股票数据
       * @param foxxcode[String] - 股票代码foxxcode
       */
      getStockNews(foxxcode) {
        const code = `${foxxcode}`;
        const vm = this;
        if (!vm.requestNew) {
          return;
        }
        const id = foxxcode.substring(0, 6);
        if (vm.newsStore[id] && vm.newsStore[id].length > 0) {
          vm.stockNewsList = vm.newsStore[id];
          return;
        }
        const httpList = http.apiList;
        const httpData = {
          type: ['1'],  // 新闻类型 1.最新消息 2.特别提示 3.公司公告,4.机构研报，5.实时报盘（股指）,6.利好利空（无需foxxcode_list和page参数）
          page: 1,      // 第几页
          page_size: 15,     // 每页多少数据
          foxxcode_list: [
            `${code}`,
          ],
        };
        vm.requestNew = false;
        http.api[httpList.GET_STOCK_NEWS]({
          success(response) {
            vm.stockNewsList = response['1'][code];
            vm.newsStore[id] = response['1'][code];
            vm.requestNew = true;
          },
          param: httpData,
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
      getCurrent() {
        const vm = this;
        const pageData = vm.getServiceInfo(vm.getCurrentCode);
        const temp = [];
        if (vm.MenuIndex === 1 && pageData.historyList && pageData.historyList.length > 0) {
          vm.setCurrentFoxx(pageData.historyList[0]);
          vm.toggleRight(1);
          baseUtil.each(pageData.todayList, (item) => {
            temp.push(item.code);
          });
        } else if (vm.MenuIndex === 0 && pageData.todayList && pageData.todayList.length > 0) {
          vm.setCurrentFoxx(pageData.todayList[0]);
          vm.toggleRight(0);
          baseUtil.each(pageData.historyList, (item) => {
            temp.push(item.code);
          });
        }
        vm.removeStock(temp);
      },
      setCurrentFoxx(row) {
        const vm = this;
        vm.currentFoxxcode = row.code;
        vm.currentPush_time = vm.transfromhhmm(row.push_time);
        vm.currentPush_date = vm.transfromyyyyMMdd(row.push_time);
      },
      toPay() {
        // 跳转去平台对应的商城购买服务
        const mallUrl = `http://${this.topQrcode}/res/static/mall.html`;
        window.location.href = mallUrl;
      },
      init() {
        const vm = this;
        vm.systemCode = this.$route.params.type;
        const pageData = vm.getServiceInfo(vm.getCurrentCode);
        if (pageData.date && pageData.todayList.length > 0) {
          vm.DateStr = pageData.date;
        } else {
          vm.DateStr = '暂无数据';
        }
        vm.topData = pageData.top;
        vm.topExplain = pageData.top.topExplain;
        vm.topQrcode = pageData.top.topQrcode;
        vm.lowrisk_statistics = pageData.top.lowrisk_statistics;
        vm.statistics_data = pageData.top.statistics_data;
        vm.toggleLeft(0);
      },
    },
    watch: {
      // 左边菜单变更，自动切换当前股票foxxcode
      MenuIndex() {
        this.getCurrent();
      },
      // 右边菜单变更，自动刷新视图
      rightMenuIndex() {
        const vm = this;
        if (vm.rightMenuIndex === 0) {
          setTimeout(() => {
            vm.$refs.sertickchart.resize();
          }, 0);
        } else {
          setTimeout(() => {
            vm.$refs.serkchart.resize();
          }, 0);
        }
        vm.getStockNews(vm.currentFoxxcode);
      },
      getServiceIndex() {
        const vm = this;
        setTimeout(() => {
          vm.$refs.sertickchart.resize();
          vm.$refs.serkchart.resize();
          vm.$refs.todayList.refresh();
        }, 0);
      },
    },
    computed: {
      ...mapGetters([
        'getStockInfo',
        'getServiceInfo',
        'getServiceIndex',
      ]),
      showRightContent() {
        const tl = this.getServiceInfo(this.getCurrentCode).todayList.length;
        const hl = this.getServiceInfo(this.getCurrentCode).historyList.length;
        return (this.MenuIndex === 0 && tl > 0) || (this.MenuIndex === 1 && hl > 0);
      },
      getMarket() {
        const vm = this;
        return vm.MenuIndex === 0 ? vm.currentPush_time : '08:00';
      },
      getNameCode() {
        const vm = this;
        const code = vm.currentFoxxcode.split('.')[0];
        return `${vm.getStockInfo(vm.currentFoxxcode).name}(${code})`;
      },
      getCurrentCode() {
        return this.$route.params.type;
      },
      getMenuIndex() {
        return this.MenuIndex;
      },
    },
    created() {
      this.init();
    },
    activated() {
      this.init();
      this.getCurrent();
    },
    deactivated() {
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
  .fl {
    float: left;
  }
  .fr {
    float: right;
  }
  .fcolor {
    color: #F5BA53;
  }
  .text_hide {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .history-box {
    position: relative;
    width: 100%;
    height: 100%;
    .empty {
      position: absolute;
      display: block;
      top: 77px;
      left: 0;
      width: 100%;
      height: 16px;
      line-height: 16px;
      text-align: center;
      font-size: 16px;
      color: #838383;
    }
  }
  .choose-detail-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    background: #242424;
    .top {
      position: relative;
      width:100%;
      height: 70px;
      background: $G4;
    }
    .content {
      position: absolute;
      top:70px;
      left:0;
      right:0;
      bottom:0;
      display: -webkit-flex;
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-between;
      align-items: flex-start;
      .left {
        position: relative;
        height:100%;
        flex:1;
        min-width: 58%;
        .left-menu {
          position: relative;
          display: block;
          width: 100%;
          height: 36px;
        }
        .left-table {
          position: absolute;
          top: 36px;
          left:0;
          right:0;
          bottom:0;
          .today, .history {
            position: relative;
            width: 100%;
            height: 100%;
          }
        }
      }
      .right {
        position: relative;
        height:100%;
        flex:1;
        min-width: 42%;
        max-width: 42%;
        background: $G3;
        .right-menu {
          position: relative;
          display: block;
          width: 100%;
          height: 36px;
          .menu {
            position: relative;
            float: left;
            height: 36px;
            line-height:36px;
            padding: 0 20px;
            font-size: $text;
            color: #838383;
            list-style: none;
            cursor: pointer;
            -webkit-transition: all 400ms;
            -moz-transition: all 400ms;
            -ms-transition: all 400ms;
            -o-transition: all 400ms;
            transition: all 400ms;
          }
          .current {
            color: #3370fe;
          }
          .current:after {
            content: '';
            display: block;
            position: absolute;
            bottom:0;
            left:0;
            width: 100%;
            height: 2px;
            background: #3370fe;
          }
          .stock-name {
            position: absolute;
            top:0;
            right: 20px;
            height: 36px;
            line-height: 36px;
            font-size: $text;
            color: #838383;
          }
        }
        .right-content {
          position: absolute;
          top: 36px;
          left:0;
          right:0;
          bottom:0;
          .left-view, .right-view {
            position: relative;
            width: 100%;
            height:100%;
            display: -webkit-flex;
            display: flex;
            flex-flow: column nowrap;
            justify-content: flex-start;
            align-items: center;
            overflow: hidden;
            .canvas-box {
              position: relative;
              flex: 1;
              width: 100%;
              max-height: 52%;
              min-height: 52%;
            }
            .middle-box {
              position: relative;
              flex: 1;
              width: 90%;
              max-height:95px;
              min-height:95px;
              max-width: 712px;
              margin: 10px auto;
            }
            .bottom-box{
              position: relative;
              flex: 1;
              width: 100%;
              max-height: 100%;
              display: -webkit-flex;
              display: flex;
              flex-flow: column nowrap;
              justify-content: flex-start;
              align-items: center;
              .table-head {
                position: relative;
                flex: 1;
                width: 100%;
                max-height: 36px;
                min-height: 36px;
                display: -webkit-flex;
                display: flex;
                flex-flow: row nowrap;
                justify-content: center;
                align-items: center;
                background: $G4;
                div {
                  height: 36px;
                  line-height: 36px;
                  border-right: 1px solid $G3;
                  text-align: center;
                }
                .four {
                  position: relative;
                  flex: 1;
                  max-width: 25%;
                  min-width: 25%;
                }
                .two {
                  position: relative;
                  flex: 1;
                  max-width: 50%;
                  min-width: 50%;
                }
              }
            }
            .k-line {
              position: relative;
              flex: 1;
              width: 100%;
              max-height: 50%;
              min-height: 50%;
            }
            .statistics-data {
              position: relative;
              flex: 1;
              width: 100%;
              max-height: 50%;
              overflow-y: auto;
              .module-title {
                position: relative;
                width: 100%;
                height: 36px;
                display: -webkit-flex;
                display: flex;
                flex-flow: row nowrap;
                justify-content: flex-start;
                align-items: center;
                background: $G4;
                p {
                  height: 36px;
                  line-height: 36px;
                  text-indent: 20px;
                  text-align: left;
                  font-size: 13px;
                  color: #fff;
                  margin-right: 10px;
                }
              }
              .data-list {
                position: relative;
                display: -webkit-flex;
                display: flex;
                flex-flow: row wrap;
                justify-content: flex-start;
                align-items: flex-start;
                align-content: flex-start;
                border-top: 1px solid $G4;
                border-left: 1px solid $G4;
                .data-item {
                  position: relative;
                  flex: 1;
                  height: 36px;
                  line-height: 36px;
                  min-width: 33.3%;
                  max-width:33.3%;
                  display: -webkit-flex;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  align-content: center;
                  flex-flow: row nowrap;
                  border-right: 1px solid $G4;
                  border-bottom: 1px solid $G4;
                  p {
                    flex:1;
                    position: relative;
                    font-size: 13px;
                    text-align: right;
                    text-indent: 10px;
                  }
                  span {
                    flex:1;
                    text-align: left;
                    text-indent: 10px;
                  }
                }
                &:after {
                  content: '';
                  position: absolute;
                  display: block;
                  width: 100%;
                  height: 1px;
                  background: $G4;
                  bottom: 0;
                  left: 0;
                }
                &:before {
                   content: '';
                   position: absolute;
                   display: block;
                   height: 100%;
                   width: 1px;
                   background: $G4;
                   right: 0;
                   top: 0;
                 }
              }
              .low-list {
                position: relative;
                width: 100%;
                border-top: 1px solid $G4;
                border-left: 1px solid $G4;
                .low-row {
                  position: relative;
                  max-widht: 120px;
                  height: 36px;
                  display: -webkit-flex;
                  display: flex;
                  flex-flow: row nowrap;
                  justify-content: flex-start;
                  align-items: center;
                  p {
                    flex:1;
                    max-width: 30%;
                    height: 36px;
                    line-height:36px;
                    border-right: 1px solid $G4;
                    border-bottom: 1px solid $G4;
                    text-align: center;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
</style>
