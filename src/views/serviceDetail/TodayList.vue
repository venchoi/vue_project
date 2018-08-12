<template>
  <div class="today-box">
    <sort-list :listData="todayList" ref="TodayTable" hoverColor="rgba(43,43,43,1)" activeColor="#373737"
               style="background: #242424" :headStyle="tableHeadStyle" @viewListChange='getTodayChangeList' @rowClick='clickStock' @doubleClick="openStock" @activeUpdate='activeUpdate'>
      <list-column prop="name" :label="'名称（共' + getServiceInfo(getCurrentCode).todayList.length + '支）'" :sort="false" :colStyle="{width:'16.6%'}" icon="">
        <template scope="prop">
          <span class="fcolor">{{prop.row.name}}</span>
        </template>
      </list-column>
      <list-column prop="code" label="现价" :colStyle="{width:'16.6%'}" icon="">
        <template scope="prop">
          <stock-details :value='getStockInfo(prop.row.code).close' :boundary='getStockInfo(prop.row.code).preClose' modal='normal' :isNeedDelist="prop.row.price"></stock-details>
        </template>
      </list-column>
      <list-column prop="profit" label="涨幅" :colStyle="{width:'16.6%'}" icon="">
        <template scope="prop">
          <stock-details :value='getStockInfo(prop.row.code).ratio' :boundary='0' :prefix="true" modal='normal' unit="%" :isNeedDelist="prop.row.price"></stock-details>
        </template>
      </list-column>
      <list-column prop="close" label="发现价" :sort="true" :colStyle="{width:'16.6%'}" icon="sort">
      </list-column>
      <list-column prop="push_time" label="发现时间" :sort="true" :colStyle="{width:'16.6%'}" icon="sort">
        <template scope="prop">
          {{transfromhhmm(prop.row.push_time)}}
        </template>
      </list-column>
      <list-column prop="grade" label="评级" :sort="true" :colStyle="{width:'17%'}" icon="sort">
        <template scope="prop">
          {{showTextGrade(prop.row.grade)}}
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
    <div class="empty" v-if="!getServiceInfo(getCurrentCode).todayList || getServiceInfo(getCurrentCode).todayList.length === 0">--暂未发现股票--</div>
  </div>
</template>

<script>
import {
  mapGetters,
} from 'vuex';
import YCJUtil from '../../util/ycjUtil';
import BaseUtil from '../../util/baseUtil';
import {
  stockActions,
  serviceActions,
} from '../../model/vuex/actionsType';
// import SortList from '../../components/base/SortList2/List';
import SortList from '../../components/base/SortList3/List';
import ListColumn from '../../components/base/SortList2/ListColumn';
import StockDetails from '../../components/stockBase/StockDetails';
import Format from '../../util/format';

export default {
  name: 'TodayList',
  data() {
    return {
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
      stockStateList: {},
      timer: '', // 定时器
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
     * @param {array} arr - 增加监听的股票id数组,不会重复订阅
     */
    sendStock(arr) {
      const vm = this;
      BaseUtil.each(arr, (item) => {
        if (!vm.stockStateList[item]) {
          vm.stockStateList[item] = 1;
          vm.$store.dispatch(stockActions.ADD_STOCK_LIST, item);
        }
      });
      if (YCJUtil.isEnd()) {
        // 股市通知交易后，进行最后一次订阅，10秒后订阅取消
        setTimeout(() => {
          BaseUtil.each(arr, (item) => {
            if (!vm.stockStateList[item]) {
              vm.stockStateList[item] = 1;
              vm.$store.dispatch(stockActions.REMOVE_STOCK_LIST, item);
            }
          });
        }, 10000);
      }
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
    getTodayChangeList(indexList) {
      if (!indexList || !(indexList.length > 0)) {
        return;
      }
      const vm = this;
      vm.todayCurrentList = [];
      BaseUtil.each(vm.todayList, (i) => {
        BaseUtil.each(indexList, (j) => {
          if (j === i.columnId) {
            vm.todayCurrentList.push(i.code);
          }
        });
      });
      vm.todayCurrentList = BaseUtil.arrUnique(vm.todayCurrentList);
      if (!vm.todayOldList || vm.todayOldList.length === 0) {
        // 页面初次渲染，没数据，直接订阅
        vm.todayOldList = [...vm.todayCurrentList];
        vm.sendStock(vm.todayOldList);
      } else {
        // 数组有数据，则新老数组交集不动，新数组与全集的差集取消订阅，老数组与全集的差集增加订阅
        vm.todayAllList = BaseUtil.arrUnique([...vm.todayOldList, ...vm.todayCurrentList]);
        vm.todayAddList = BaseUtil.minus(vm.todayOldList, vm.todayAllList);
        vm.sendStock(vm.todayAddList);
        vm.todayCancelList = BaseUtil.minus(vm.todayCurrentList, vm.todayAllList);
        vm.removeStock(vm.todayCancelList);
        vm.todayOldList = vm.todayCurrentList;
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
     * 路由跳转到股票详情页
     * @param row - 当前行信息，其code属性为股票代码
     */
    openStock(row) {
      this.$router.push({ name: 'stock', params: { code: row.code } });
    },
    refresh() {
      const vm = this;
      const codeArr = [];
      const todayList = vm.getServiceInfo(vm.getCurrentCode).todayList;
      BaseUtil.each(todayList, (item) => {
        codeArr.push(item.code);
      });
      vm.sendStock(codeArr);
    },
    /**
     * 定时更新数据
     * 每隔三分钟请求一次服务内页数据，如果是收盘时间，则清除定时器
     * */
    updateRegularly() {
      const vm = this;
      vm.timer = setInterval(() => {
        this.$store.dispatch(serviceActions.INIT_SERVICE_DETAILS, {
          systemCode: this.getCurrentCode,
          complete: () => {},
        });
        vm.getTodayChangeList(vm.todayList);
        if (YCJUtil.isEnd()) {
          clearInterval(vm.timer);
        }
      }, 180000);
    },
  },
  computed: {
    ...mapGetters([
      'getStockInfo',
      'getServiceInfo',
    ]),
    getCurrentCode() {
      return this.$route.params.type;
    },
  },
  watch: {
    getCurrentCode() {
      this.todayList = this.getServiceInfo(this.getCurrentCode).todayList;
    },
  },
  created() {
    const vm = this;
    vm.todayList = this.getServiceInfo(this.getCurrentCode).todayList;
  },
  activated() {
    const vm = this;
    /**
     * 原本是在用户一打开HTS时就拉取全部数据，包括增值服务。
     * 如果用户在打开HTS之后，在其他栏目停留超过5分钟，再打开搓揉或者N字时，获取到的是旧数据。
     * 现修改为：打开页面时如果是盘中，并且是（搓揉或者N字）,则更新增值服务数据，即更新服务内页数据，并且开始定时更新数据
     * */
    if ((vm.getCurrentCode === 'kneading' || vm.getCurrentCode === 'nline') && YCJUtil.isOpening()) {
      this.$store.dispatch(serviceActions.INIT_SERVICE_DETAILS, {
        systemCode: this.getCurrentCode,
        complete: () => {},
      });
      vm.getTodayChangeList(vm.todayList);
      vm.updateRegularly();
    }
    vm.todayList = this.getServiceInfo(this.getCurrentCode).todayList;
    vm.$refs.TodayTable.sortStatus.grade = 0;
    vm.$refs.TodayTable.sort('grade');
  },
  deactivated() {
    const vm = this;
    vm.removeStock(vm.todayOldList);
    vm.$refs.TodayTable.clear();
    // 离开页面时清除定时器，不再定时更新数据
    if (vm.timer) {
      clearInterval(vm.timer);
    }
  },
};
</script>

<style lang="scss" rel="stylesheet/scss">
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
  .today-box {
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
    .sortStatus {
      margin-bottom: -1px;
      padding-top: 5px;
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
