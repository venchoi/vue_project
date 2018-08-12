<template>
  <div class="history-box">
    <sort-list :listData="getServiceInfo(getCurrentCode).historyList" ref="HistoryTable"
               hoverColor="rgba(43,43,43,1)" activeColor="#373737"
               style="background: #242424" @viewListChange='getHisChangeList' :headStyle="tableHeadStyle" @rowClick='clickStock' @doubleClick="openStock" @activeUpdate='activeUpdate'>
      <list-column prop="name" :label="'名称（共' + getServiceInfo(getCurrentCode).historyList.length + '支）'" :sort="false" :colStyle="{width:'16.6%'}" icon="">
        <template scope="prop">
          <span class="fcolor">{{prop.row.name}}</span>
        </template>
      </list-column>
      <list-column v-if="getCurrentCode === 'lowrisk'" prop="profit" label="T+7日最高盈利" :colStyle="{width:'16.6%'}" icon="">
        <template scope="prop">
          <stock-details :value='prop.row.profit' :boundary='0' prefix="true" unit="%" modal='normal'></stock-details>
        </template>
      </list-column>
      <list-column v-else-if="getCurrentCode === 'nline'" prop="profit" label="T+3日最高盈利" :colStyle="{width:'16.6%'}" icon="">
        <template scope="prop">
          <stock-details :value='prop.row.profit' :boundary='0' prefix="true" unit="%" modal='normal'></stock-details>
        </template>
      </list-column>
      <list-column v-else prop="profit" label="次日最高盈利" :colStyle="{width:'16.6%'}" icon="">
        <template scope="prop">
          <stock-details :value='prop.row.profit' :boundary='0' prefix="true" unit="%" modal='normal'></stock-details>
        </template>
      </list-column>
      <list-column prop="close" label="发现价" :sort="true" :colStyle="{width:'16.6%'}" icon="sort">
      </list-column>
      <list-column prop="grade" label="评级" :sort="true" :colStyle="{width:'16.6%'}" icon="sort">
        <template scope="prop">
          {{showTextGrade(prop.row.grade)}}
        </template>
      </list-column>
      <list-column prop="push_time" label="发现时间" :sort="true" :colStyle="{width:'16.6%'}" icon="sort">
        <template scope="prop">
          {{transfromhhmm(prop.row.push_time)}}
        </template>
      </list-column>
      <list-column prop="push_date" label="发现日期" :sort="true" :colStyle="{width:'17%'}" icon="sort">
        <template scope="prop">
          {{transfromyyyyMMdd(prop.row.push_date)}}
        </template>
      </list-column>
      <list-column prop="reaper_profit" label="点评" :sort="false" :colStyle="{width:'100%'}" icon="" :auxiliary="true">
        <template scope="prop">
          <div class="row-auxiliary">
            <div class="auxiliary-wrapper">
              <span class="fcolor">跟踪点评：</span>
              <span>{{prop.row.review}}</span>
              <span class="fcolor">AI机器人操作收益：</span>
              <span>{{prop.row.reaper_profit}}</span>
            </div>
          </div>
        </template>
      </list-column>
    </sort-list>
    <div class="empty" v-if="!getServiceInfo(getCurrentCode).historyList || getServiceInfo(getCurrentCode).historyList.length === 0">--暂未发现股票--</div>
  </div>
</template>

<script>
  import {
    mapGetters,
  } from 'vuex';
//  import YCJUtil from '../../util/ycjUtil';
  import BaseUtil from '../../util/baseUtil';
  import { stockActions } from '../../model/vuex/actionsType';
  // import SortList from '../../components/base/SortList2/List';
  import SortList from '../../components/base/SortList3/List';
  import ListColumn from '../../components/base/SortList2/ListColumn';
  import StockDetails from '../../components/stockBase/StockDetails';
  import Format from '../../util/format';

  export default {
    name: 'HistoryList',
    data() {
      return {
        todayList: [],
        hisOldList: [],
        hisAddList: [],
        hisCancelList: [],
        historyList: [],
        hisCurrentList: [],
        hisAllList: [],
        tableHeadStyle: {
          background: '#2b2b2b',
          color: '#fff',
          height: '37px',
          'line-height': '37px',
          'border-right': '1px solid #212121',
        },
        stockStateList: {},
      };
    },
    props: {
    },
    components: {
      SortList,
      ListColumn,
      StockDetails,
    },
    methods: {
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
      /**
       * @param {array} arr - 增加监听的股票id数组
       */
//      sendStock(arr) {
//        const vm = this;
//        if (YCJUtil.isEnd()) {
//          BaseUtil.each(arr, (item) => {
//            if (!vm.stockStateList[item]) {
//              vm.stockStateList[item] = 1;
//              vm.$store.dispatch(stockActions.ADD_STOCK_LIST, item);
//            }
//          });
//          return;
//        }
//        BaseUtil.each(arr, (item) => {
//          vm.$store.dispatch(stockActions.ADD_STOCK_LIST, item);
//          vm.stockStateList[item] = 1;
//        });
//      },
      /**
       * @param {array} arr - 移除监听的股票id数组
       */
      removeStock(arr) {
        const vm = this;
        BaseUtil.each(arr, (item) => {
          vm.$store.dispatch(stockActions.REMOVE_STOCK_LIST, item);
        });
      },
      getHisChangeList(indexList) {
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
        vm.hisCurrentList = BaseUtil.arrUnique(vm.hisCurrentList);
        if (vm.hisOldList.length === 0) {
          // 页面初次渲染，没数据，直接订阅
          vm.hisOldList = [...vm.hisCurrentList];
//          vm.sendStock(vm.hisOldList);
        } else {
          // 数组有数据，则新老数组交集不动，新数组与全集的差集取消订阅，老数组与全集的差集增加订阅
          vm.hisAllList = BaseUtil.arrUnique([...vm.hisOldList, ...vm.hisCurrentList]);
          vm.hisAddList = BaseUtil.minus(vm.hisOldList, vm.hisAllList);
//          vm.sendStock(vm.hisAddList);
          vm.hisCancelList = BaseUtil.minus(vm.hisCurrentList, vm.hisAllList);
//          vm.removeStock(vm.hisCancelList);
          vm.hisOldList = vm.hisCurrentList;
        }
      },
      /**
       * 列表组件上下选股票时，动态切换当前股票的信息，包括新闻列表
       * @param rowid
       * @param row
       */
      activeUpdate(rowid, row) {
        this.$emit('activeChange', rowid, row);
      },
      /**
       * 列表组件中点击股票，切换当前股票信息
       */
      clickStock($event, row, index) {
        this.$emit('clickRow', $event, row, index);
      },
      /**
       * 跳转到股票详情页
       * @param row - 当前行信息，其code属性为股票代码
       */
      openStock(row) {
        this.$router.push({ name: 'stock', params: { code: row.code } });
      },
    },
    computed: {
      ...mapGetters([
        'getServiceInfo',
      ]),
      getCurrentCode() {
        return this.$route.params.type;
      },
    },
    watch: {
      getCurrentCode() {
        this.historyList = this.getServiceInfo(this.getCurrentCode).historyList;
      },
    },
    created() {
      const vm = this;
      vm.historyList = this.getServiceInfo(this.getCurrentCode).historyList;
    },
    activated() {
      const vm = this;
      vm.historyList = this.getServiceInfo(this.getCurrentCode).historyList;
    },
    deactivated() {
      const vm = this;
      vm.removeStock(vm.hisOldList);
      vm.$refs.HistoryTable.clear();
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
  .row-auxiliary {
    text-align: left;
    .auxiliary-wrapper {
      position: relative;
      margin: 10px 20px;
      border: solid 1px rgba(245,186,83,0.4);
      border-radius: 4px;
      padding: 10px;
      line-height: 18px;
      &:before {
        position: absolute;
        top: -15px;
        left: 45px;
        content: '';
        width: 3px;
        height: 15px;
        background:  linear-gradient(transparent, #f5ba53);
      }
      span {
        color: #c0c0c0;
        &.fcolor {
          color: #f5ba53;
        }
      }
    }
  }
</style>
