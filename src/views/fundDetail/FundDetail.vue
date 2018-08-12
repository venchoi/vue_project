<template>
  <div class="choose-detail-wrap">
    <div class="top">
      <div class="return-back-page fl" @click="goBack()"></div>
      <img class="logo fl" :src="topImg" alt="基金服务">
      <p class="title fl text_hide">{{topName}}</p>
      <div class="explain fl" @click="openExplain()">使用说明</div>
      <earn-info :all_earn="all_earn" :mounth_earn="mounth_earn" :day_earn="day_earn"></earn-info>
      <div class="renew-button fr" @click="payMoney()">续费</div>
      <p class="date fr">有效期至{{topValidity}}</p>
      <div class="button-wrap fr">
        <switch-group :switchId="system_code" :config="[{label:'短信通知', name: `${system_code}_message`}, {label:'声音提示', name: `${system_code}_audio`}, {label:'桌面提示', name: `${system_code}_notify`}]"></switch-group>
      </div>
    </div>
    <div class="content" v-show="shoePage">
      <div class="left">
        <ul class="left-menu">
          <li :class="{'current': showToday }" @click="toggleLeft(0)">当前持仓（{{pageData.date ? pageData.date : '暂无数据'}}）</li>
          <li :class="{'current': !showToday }" @click="toggleLeft(1)">调仓记录</li>
        </ul>
        <div class="left-table">
          <div class="today" key="0" v-if="showToday">
            <sort-list :listData="todayList" ref="TodayTable" hoverColor="rgba(43,43,43,1)" activeColor="#373737" style="background: #242424" @viewListChange='getTodayChangeList' :headStyle="tableHeadStyle" @rowClick='clickStock'>
              <list-column prop="code" :label="'名称（共' + todayList.length + '支）'" :sort="false" :colStyle="{width:'14.2%'}" icon="">
                <template scope="prop">
                  <span class="fcolor">{{getStockNameCode(prop.row.code)}}</span>
                </template>
              </list-column>
              <list-column prop="store_percent" label="持仓占比" :sort="true" :colStyle="{width:'14.2%'}" icon="sort">
                <template scope="prop">
                  {{prop.row.store_percent}}%
                </template>
              </list-column>
              <list-column prop="cost_price" label="成本价" :sort="true" :colStyle="{width:'14.2%'}" icon="sort">
              </list-column>
              <list-column prop="close" label="现价" :colStyle="{width:'14.2%'}" icon="">
                <template scope="prop">
                  <stock-details :value='getStockInfo(prop.row.code).close' :boundary='getStockInfo(prop.row.code).preClose' modal='normal'></stock-details>
                </template>
              </list-column>
              <list-column prop="push_time" label="发现日期" :sort="true" :colStyle="{width:'14.2%'}" icon="sort">
                <template scope="prop">
                  {{transfromyyyyMMdd(prop.row.push_time)}}
                </template>
              </list-column>
              <list-column prop="buy_time" label="买入时间" :sort="true" :colStyle="{width:'14.2%'}" icon="sort">
                <template scope="prop">
                  {{transfromhhmm(prop.row.buy_time)}}
                </template>
              </list-column>
              <list-column prop="ratio" label="盈亏比例" :colStyle="{width:'14.8%'}" icon="">
                <template scope="prop">
                  <stock-details :value='getStockRatio(prop.row.code)' :boundary='0' prefix="true" unit="%" modal='normal'></stock-details>
                </template>
              </list-column>
            </sort-list>
            <div class="empty" v-if="!todayList || todayList.length === 0">--暂未发现股票--</div>
          </div>
          <div class="history" key="1" v-if="!showToday">
            <sort-list :listData="historyList" ref="HistoryTable" hoverColor="rgba(43,43,43,1)" activeColor="#373737" style="background: #242424" @viewListChange='getChangeList' :headStyle="tableHeadStyle" @rowClick='clickStock'>
              <list-column prop="push_date" label="日期" :sort="true" :colStyle="{width:'16.6%'}" icon="sort">
                <template scope="prop">
                  {{transfromyyyyMMdd(prop.row.push_date)}}
                </template>
              </list-column>
              <list-column prop="code" label="交易股票" :sort="false" :colStyle="{width:'16.6%'}" icon="">
                <template scope="prop">
                  <span class="fcolor">{{getStockNameCode(prop.row.code)}}</span>
                </template>
              </list-column>
              <list-column prop="type" label="买卖方向" :sort="true" :colStyle="{width:'16.6%'}" icon="sort">
                <template scope="prop">
                  {{prop.row.type === 0 ? '买入' : '卖出'}}
                </template>
              </list-column>
              <list-column prop="price" label="成交价" :sort="true" :colStyle="{width:'16.6%'}" icon="sort">
              </list-column>
              <list-column prop="push_time" label="交易时间" :sort="true" :colStyle="{width:'16.6%'}" icon="sort">
                <template scope="prop">
                  {{transfromhhmm(prop.row.push_time)}}
                </template>
              </list-column>
              <list-column prop="store_percent" label="所占仓位" :sort="true" :colStyle="{width:'17%'}" icon="sort">
                <template scope="prop">
                  {{prop.row.store_percent}}%
                </template>
              </list-column>
            </sort-list>
            <div class="empty" v-if="!historyList || historyList.length === 0">--暂未发现股票--</div>
          </div>
        </div>
      </div>
      <div class="right" v-show="(MenuIndex === 0 && todayList.length > 0 ) || (MenuIndex === 1 && historyList.length > 0)">
        <div class="right-menu">
          <div :class="['menu', {'current': !showRightMenu }]" @click="toggleRight(0)">分时</div>
          <div :class="['menu', {'current': showRightMenu }]" @click="toggleRight(1)">K线</div>
          <div class="stock-name">{{getNameCode}}</div>
        </div>
        <div class="right-content">
          <div class="left-view" v-show="!showRightMenu">
            <div class="canvas-box">
              <tick-chart :code="currentFoxxcode" ref="sertickchart" :marker="getMarket"></tick-chart>
            </div>
          </div>
          <div class="right-view" v-show="showRightMenu">
            <div class="k-line">
              <k-chart :code="currentFoxxcode" ref="serkchart" :marker="currentPush_date"></k-chart>
            </div>
          </div>
          <div class="bottom-box" v-if="showToday">
            <div class="table-head">
              <div class="four">消息时间</div>
              <div class="four">来源</div>
              <div class="two">{{getStockInfo(currentFoxxcode).name}}关联新闻</div>
            </div>
            <new-list :newsList="stockNewsList" @clickNew="clickNews"></new-list>
          </div>
        </div>
      </div>
    </div>
    <popup :isShow="popupShow" @click-popupBg="popupShow = false">
      <p style="margin-bottom:10px;">续费二维码</p>
      <img :src="topQrcode" alt="续费二维码">
    </popup>
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
  import Tooltip from '../../components/base/Tooltip';
  import Iconfont from '../../components/base/IconFont';
  import { actions, stockActions } from '../../model/vuex/actionsType';
  import TickChart from '../serviceDetail/TickChart';
  import KChart from '../serviceDetail/KChart';
  import SortList from '../../components/base/SortList2/List';
  import ListColumn from '../../components/base/SortList2/ListColumn';
  import StockDetails from '../../components/stockBase/StockDetails';
  import http from '../../plugins/http/http';
  import chartHandler from '../../plugins/dataHandler/chart';
  import YCJUtil from '../../util/ycjUtil';
  import BaseUtil from '../../util/baseUtil';
  import Format from '../../util/format';
  import MsgLog from '../../util/logger';
  import Popup from '../../components/base/Popup';
  import NewList from '../serviceDetail/newsList';
  import EarnInfo from './EarnInfo';
  import SwitchGroup from '../../components/base/SwitchGroup';

  export default {
    name: 'ServiceDetail',
    data() {
      return {
        topImg: '',
        topName: '',
        topExplain: '',
        topValidity: '',
        topQrcode: '',
        all_earn: '',
        mounth_earn: '',
        day_earn: '',
        system_code: this.$route.params.type,
        pageData: {
        },
        MenuIndex: 0,
        rightMenuIndex: 0,
        todayList: [],
        todayOldList: [],
        todayAddList: [],
        todayCancelList: [],
        todayCurrentList: [],
        todayAllList: [],
        tableHeadStyle: {
          background: '#2b2b2b',
          color: '#fff',
          height: '37px',
          'line-height': '37px',
          'border-right': '1px solid #212121',
        },
        hisOldList: [],
        hisAddList: [],
        hisCancelList: [],
        historyList: [],
        hisCurrentList: [],
        hisAllList: [],
        stockStateList: {},
        currentFoxxcode: '',
        currentPush_time: '',
        currentPush_date: '',
        stockNewsList: [],
        newsStore: {},
        popupShow: false,
        shoePage: false,
        requestNew: true,
        requestPage: true,
      };
    },
    props: {
    },
    components: {
      SortList,
      ListColumn,
      StockDetails,
      TickChart,
      KChart,
      Iconfont,
      Tooltip,
      Popup,
      NewList,
      EarnInfo,
      SwitchGroup,
    },
    methods: {
      getMsgStatu(event) {
        MsgLog.log('是否开启短信通知>>>>>>>', event.open);
      },
      payMoney() {
        this.popupShow = true;
      },
      goBack() {
        this.$router.go(-1);
      },
      getPageData() {
        const vm = this;
        if (!vm.requestPage) {
          return;
        }
        const type = vm.system_code;
        const httpList = http.apiList;
        const httpData = {
        };
        httpData.type = type;
        vm.requestPage = false;
        http.api[httpList.GET_STOCK_SERVICE_LIST]({
          success(response) {
            vm.pageData = response;
            vm.topImg = vm.pageData.top.img;
            vm.topName = vm.pageData.top.name;
            vm.topExplain = vm.pageData.top.explain;
            vm.topValidity = vm.pageData.top.validity;
            vm.topQrcode = vm.pageData.top.qr_code;
            vm.lowrisk_statistics = vm.pageData.lowrisk_statistics;
            vm.statistics_data = vm.pageData.statistics_data;
            vm.requestPage = true;
            vm.getTodayList();
            vm.getHistoryList();
            vm.toggleLeft(0);
          },
          param: httpData,
        });
      },
      setPageData() {
        const vm = this;
        const setData = {
          top: {
            explain: '金色两点半票池详情',
            img: 'http://aliyun.yuncaijing.com/upload/2017-01-12/58771d4313e10.png',
            name: '金色两点半',
            qr_code: 'http://aliyun.yuncaijing.com/upload/2017-01-12/58771d4313e10.png',
            validity: '2017-08-08',
            all_earn: '33.21',
            mounth_earn: '20.21',
            day_earn: '11.21',
          },
          current_head: [
            'code',
            'store_percent',
            'cost_price',
            'push_time',
            'buy_time',
          ],
          record_head: [
            'code',
            'type',
            'push_time',
            'price',
            'store_percent',
          ],
          date: '2017-08-09',
          current: [
            ['600337', '16', '33.10', '1501817193', '1501817193'],
            ['000526', '17', '23.10', '1501817193', '1501818193'],
            ['002120', '18', '33.10', '1494380829', '1501819193'],
            ['000526', '19', '23.10', '1499184000', '1501827193'],
            ['000723', '20', '33.10', '1499184000', '1501816193'],
            ['000526', '21', '23.10', '1499184000', '1501815193'],
          ],
          record: [
            ['600337', '买入', '1501817193', '15.10', '16'],
            ['000526', '买入', '1494380829', '16.10', '17'],
            ['600337', '卖出', '1501817193', '17.10', '18'],
            ['000526', '买入', '1494380829', '18.10', '19'],
            ['600337', '卖出', '1501817193', '19.10', '20'],
            ['600337', '买入', '1501817193', '20.10', '21'],
          ],
        };
        vm.pageData = setData;
        vm.topExplain = vm.pageData.top.explain;
        vm.topImg = vm.pageData.top.img;
        vm.topName = vm.pageData.top.name;
        vm.topQrcode = vm.pageData.top.qr_code;
        vm.topValidity = vm.pageData.top.validity;
        vm.all_earn = vm.pageData.top.all_earn;
        vm.mounth_earn = vm.pageData.top.mounth_earn;
        vm.day_earn = vm.pageData.top.day_earn;
        vm.getTodayList();
        vm.getHistoryList();
        vm.toggleLeft(0);
      },
      getHistoryList() {
        const vm = this;
        const dataObj = {};
        const head = vm.pageData.record_head;
        const data = vm.pageData.record;
        if (!data) {
          return;
        }
        dataObj.head = head;
        dataObj.data = data;
        /**
         * chartHandler对象，用于组合key、value数组
         * 网络层为了节省流量，把json的key抽离成单独的数组
         * json的value抽离成二维的数据
         * 想要得到完整的json表单数据
         * 需要把数据结构封装成dataobj的格式
         * head属性放keys
         * data放values的二维数组
         * k是最后的json数据
         * @type {*}
         */
        const k = chartHandler
          .add(dataObj)
          .object('code', 'type', 'push_time', 'price', 'store_percent');
        BaseUtil.each(k, (item) => {
          const obj = item;
          obj.code = YCJUtil.formatCode(obj.code);
          obj.type = obj.type === '买入' ? 0 : 1; // 0-->买入;1-->卖出
          obj.push_date = obj.push_time;
        });
        vm.historyList = k;
        vm.shoePage = true;
      },
      getTodayList() {
        const vm = this;
        const dataObj = {};
        const head = vm.pageData.current_head;
        const data = vm.pageData.current;
        if (!data) {
          return;
        }
        dataObj.head = head;
        dataObj.data = data;
        const k = chartHandler
          .add(dataObj)
          .object('code', 'store_percent', 'cost_price', 'push_time', 'buy_time');
        BaseUtil.each(k, (item) => {
          const i = item;
          i.code = YCJUtil.formatCode(i.code);
        });
        vm.todayList = k;
        if (vm.todayList && vm.todayList.length > 0) {
          vm.currentFoxxcode = vm.todayList[0].code;
          vm.currentPush_time = vm.transfromhhmm(vm.todayList[0].push_time);
          vm.currentPush_date = vm.transfromyyyyMMdd(vm.todayList[0].push_time);
          vm.getStockNews(vm.currentFoxxcode);
        }
        vm.shoePage = true;
      },
      transfromDate(str) {
        if ((typeof str) !== 'string' || !str) {
          return str;
        }
        const today = Format.date(new Date(), 'MM-dd');
        let dateStr = Format.date(new Date(Number(str) * 1000), 'MM-dd hh:mm');
        dateStr = dateStr.replace(today, '今天');
        return dateStr;
      },
      transfromhhmm(str) {
        const date = Format.date(new Date(Number(str) * 1000), 'hh:mm');
        return date;
      },
      transfromyyyyMMdd(str) {
        const date = Format.date(new Date(Number(str) * 1000), 'yyyy-MM-dd');
        return date;
      },
      openExplain() {
        const textObj = {};
        textObj.title = '使用说明';
        textObj.content = this.topExplain;
        textObj.inputtime = '1482372660';
        textObj.from = '云财经';
        this.openNews(textObj);
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
      getChangeList(indexList) {
        const vm = this;
        const len = indexList.length;
        vm.hisCurrentList = [];
        BaseUtil.each(vm.historyList, (item) => {
          for (let i = 0; i < len; i += 1) {
            if (indexList[i] === item.columnId) {
              vm.hisCurrentList.push(item.code);
              break;
            }
          }
        });
        vm.hisCurrentList = vm.arrUnique(vm.hisCurrentList);
        if (vm.hisOldList.length === 0) {
          // 页面初次渲染，没数据，直接订阅
          vm.hisOldList = [...vm.hisCurrentList];
          vm.sendStock(vm.hisOldList);
        } else {
          // 数组有数据，则新老数组交集不动，新数组与全集的差集取消订阅，老数组与全集的差集增加订阅
          vm.hisAllList = vm.arrUnique([...vm.hisOldList, ...vm.hisCurrentList]);
          vm.hisAddList = vm.minus(vm.hisOldList, vm.hisAllList);
          vm.sendStock(vm.hisAddList);
          vm.hisCancelList = vm.minus(vm.hisCurrentList, vm.hisAllList);
          vm.removeStock(vm.hisCancelList);
          vm.hisOldList = vm.hisCurrentList;
        }
      },
      getTodayChangeList(indexList) {
        const vm = this;
        const len = indexList.length;
        vm.todayCurrentList = [];
        BaseUtil.each(vm.todayList, (item) => {
          for (let i = 0; i < len; i += 1) {
            if (indexList[i] === item.columnId) {
              vm.todayCurrentList.push(item.code);
              break;
            }
          }
        });
        vm.todayCurrentList = vm.arrUnique(vm.todayCurrentList);
        if (vm.todayOldList.length === 0) {
          // 页面初次渲染，没数据，直接订阅
          vm.todayOldList = [...vm.todayCurrentList];
          vm.sendStock(vm.todayOldList);
        } else {
          // 数组有数据，则新老数组交集不动，新数组与全集的差集取消订阅，老数组与全集的差集增加订阅
          vm.todayAllList = vm.arrUnique([...vm.todayOldList, ...vm.todayCurrentList]);
          vm.todayAddList = vm.minus(vm.todayOldList, vm.todayAllList);
          vm.sendStock(vm.todayAddList);
          vm.todayCancelList = vm.minus(vm.todayCurrentList, vm.todayAllList);
          vm.removeStock(vm.todayCancelList);
          vm.todayOldList = vm.todayCurrentList;
        }
      },
      /**
       * @param {array} arr - 增加监听的股票id数组
       */
      sendStock(arr) {
        const vm = this;
        if (YCJUtil.isEnd()) {
          BaseUtil.each(arr, (item) => {
            if (!vm.stockStateList[item]) {
              vm.stockStateList[item] = 1;
              vm.$store.dispatch(stockActions.ADD_STOCK_LIST, item);
            }
          });
          return;
        }
        BaseUtil.each(arr, (item) => {
          vm.$store.dispatch(stockActions.ADD_STOCK_LIST, item);
          vm.stockStateList[item] = 1;
        });
      },
      /**
       * @param {array} arr - 移除监听的股票id数组
       */
      removeStock(arr) {
        const vm = this;
        BaseUtil.each(arr, (item) => {
          vm.$store.dispatch(stockActions.REMOVE_STOCK_LIST, item);
        });
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
       * 求数组补集
       * @param {array} a - 补集最终所在的数组
       * @param {array} b - 需要排除的数组
       * eg：a: [3]; b: [0, 1, 2, 3];
       * intersect(a, b);//[0, 1, 2]
       */
      minus(a, b) {
        const result = new Array(0);
        const obj = {};
        for (let i = 0; i < a.length; i += 1) {
          obj[a[i]] = 1;
        }
        for (let j = 0; j < b.length; j += 1) {
          if (!obj[b[j]]) {
            obj[b[j]] = 1;
            result.push(b[j]);
          }
        }
        return result;
      },
      showTextGrade(num) {
        const index = Number(num);
        if (index === 0) {
          return '普通';
        } else if (index === 1) {
          return '优选';
        } else if (index === 2) {
          return '极优';
        }
        return '普通';
      },
      toggleRight(index) {
        const vm = this;
        vm.rightMenuIndex = index;
        if (vm.rightMenuIndex === 0) {
          vm.$nextTick(() => {
            vm.$refs.sertickchart.resize();
          });
        } else {
          vm.$nextTick(() => {
            vm.$refs.serkchart.resize();
          });
        }
        vm.getStockNews(vm.currentFoxxcode);
      },
      toggleLeft(index) {
        const vm = this;
        if (vm.MenuIndex === index) {
          return;
        }
        vm.MenuIndex = index;
        if (index === 1 && vm.historyList && vm.historyList.length > 0) {
          vm.currentFoxxcode = vm.historyList[0].code;
          vm.currentPush_time = vm.transfromhhmm(vm.historyList[0].push_time);
          vm.currentPush_date = vm.transfromyyyyMMdd(vm.historyList[0].push_time);
        } else if (index === 0 && vm.todayList && vm.todayList.length > 0) {
          vm.currentFoxxcode = vm.todayList[0].code;
          vm.currentPush_time = vm.transfromhhmm(vm.todayList[0].push_time);
          vm.currentPush_date = vm.transfromyyyyMMdd(vm.todayList[0].push_time);
        }
        vm.toggleRight(0);
      },
      clickStock($event, row, index) {
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
        MsgLog.log(`$event>>>>>>>>>>>${$event}`);
        MsgLog.log(`index>>>>>>>>>>>${index}`);
      },
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
      clickNews(row) {
        this.openNews(row);
      },
      clearTable() {
        const vm = this;
        vm.pageData = {};
        vm.historyList = [];
        vm.todayList = [];
        vm.topImg = '';
        vm.topName = '';
        vm.topExplain = '';
        vm.topValidity = '';
        vm.topQrcode = '';
        vm.shoePage = false;
        if (vm.$refs.TodayTable) {
          vm.$refs.TodayTable.clear();
        }
        if (vm.$refs.HistoryTable) {
          vm.$refs.HistoryTable.clear();
        }
      },
    },
    computed: {
      ...mapGetters([
        'getStockInfo',
        'getStockNameCode',
        'getStockRatio',
      ]),
      showToday() {
        return this.MenuIndex === 0;
      },
      showRightMenu() {
        return this.rightMenuIndex === 1;
      },
      ...mapGetters({
        SHIndex: 'getSZIndex',
        CYBIndex: 'getCYIndex',
      }),
      getMarket() {
        const vm = this;
        return vm.MenuIndex === 0 ? vm.currentPush_time : '08:00';
      },
      getNameCode() {
        const vm = this;
        const code = vm.currentFoxxcode.split('.')[0];
        return `${vm.getStockInfo(vm.currentFoxxcode).name}(${code})`;
      },
    },
    created() {
      const vm = this;
      vm.pageData = {};
//      vm.getPageData();
      vm.setPageData();
      /**
       * 选股首页推送通知,有新股票时，重新拿一次数据
       */
      if (columnSocket) {
        columnSocket.on(EVENT.STOCK_INDEX_SERVICE, (data) => {
          if (data.system_code !== '' && data.system_code === vm.system_code) {
            vm.getPageData();
          }
        });
      }
    },
    activated() {
      const vm = this;
      vm.clearTable();
//      vm.getPageData();
      vm.setPageData();
    },
    deactivated() {
      const vm = this;
      vm.removeStock(vm.hisOldList);
      vm.removeStock(vm.todayOldList);
      vm.clearTable();
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
  .text_hide {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .fcolor {
    color: #F5BA53;
  }
  .text_hide {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
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
      padding: 20px;
      background: $G4;
      .return-back-page {
        width: 30px;
        height: 30px;
        background: url(../../assets/image/icon-1.png) no-repeat left center;
        background-size: cover;
        margin-right:20px;
        cursor: pointer;
      }
      .logo {
        display: block;
        height: 30px;
        max-width: 30px;
        margin-right:10px;
      }
      .title {
        height: 30px;
        line-height:30px;
        max-width: 115px;
        font-size: 16px;
        margin-right: 20px;
      }
      .explain {
        display: inline-block;
        height:30px;
        line-height:28px;
        text-align: center;
        padding: 0 10px;
        color: #838383;
        border:1px solid #838383;
        -webkit-border-radius:3px;
        -moz-border-radius:3px;
        border-radius:3px;
        cursor: pointer;
      }
      .renew-button {
        position: relative;
        width: 72px;
        height: 30px;
        line-height:30px;
        text-align: center;
        font-size: 16px;
        color: #fff;
        -webkit-border-radius: 5px;
        -moz-border-radius: 5px;
        border-radius: 5px;
        background: #ff6148;
        cursor: pointer;
        margin-left: 10px;
      }
      .date {
        position: relative;
        height: 30px;
        line-height:30px;
        font-size: $text;
        color: #838383;
        margin-left:40px;
      }
      .switch-box {
        position: relative;
        display: inline-block;
        height: 30px;
        line-height: 30px;
        margin-left:30px;
        span {
          font-size:12px;
          color: #C0C0C0;
        }
        .click-button {
          position: relative;
          top: 5px;
          margin-left:10px;
        }
      }
      .button-wrap {
        position: relative;
        height: 30px;
        line-height: 30px;
      }
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
          li {
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
        }
        .left-table {
          position: absolute;
          top: 36px;
          left:0;
          right:0;
          bottom:0;
          .history, .today {
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
          display: -webkit-flex;
          display: flex;
          flex-flow: column nowrap;
          justify-content: flex-start;
          align-items: center;
          overflow: hidden;
          .left-view, .right-view {
            position: relative;
            flex: 1;
            width: 100%;
            max-height: 60%;
            min-height: 60%;
            .canvas-box {
              position: relative;
              flex: 1;
              width: 100%;
              height: 100%;
            }
            .k-line {
              position: relative;
              flex: 1;
              width: 100%;
              height: 100%;
            }
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
        }
      }
    }
  }
  @media only screen and (max-width: 1430px) {
    .choose-detail-wrap .top .date {
      margin-left: 20px;
    }
    .choose-detail-wrap .top .switch-box {
      margin-left: 10px;
    }
  }
</style>
