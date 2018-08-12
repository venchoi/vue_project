<template>
  <div class="stock-left"  @contextmenu.prevent >
    <sort-list :listData="listData" @viewListChange='viewList' @activeUpdate="itemClick" :isGetFocus="true" :isHeadFixed="true"
               hoverColor="rgba(43,43,43,1)" activeColor="#373737"
               style="background: #212121" @rowRightClick="rightClick" @doubleClick="openStock" :contextMenu="contextConfig" :customSortMap="customSortMap" @customSort="customSort">
      <list-column prop="name" label="名称" :sort="false" :colStyle="{width:'25%'}">
        <template scope="prop">
          {{getStockNameCode(prop.row.foxxcode)}}
        </template>
      </list-column>
      <list-column prop="close" label="现价" :sort="true" :colStyle="{width:'10%'}" icon="sort">
        <template scope="prop">
          <stock-details :value='prop.row.close' :format="false" fixed="2" :boundary='prop.row.preClose' modal='normal' :isNeedDelist="prop.row.close"></stock-details>
        </template>
      </list-column>
      <list-column prop="ratio" label="涨幅" :sort="true" :colStyle="{width:'10%'}" icon="sort">
        <template scope="prop">
          <stock-details :value='prop.row.ratio' unit="%" :format="false" fixed="2" :boundary='0' modal='normal' :isNeedDelist="prop.row.close"></stock-details>
        </template>
      </list-column>
      <list-column prop="lb" label="量比" :sort="true" :colStyle="{width:'calc(80% / 5)'}" icon="sort">
        <template scope="prop">
          <span>{{delist(prop.row.lb, (value) => value.toFixed(2))}}</span>
        </template>
      </list-column>
      <list-column prop="wb" label="场内资金" :sort="true" :colStyle="{width:'calc(80% / 5)'}" icon="sort">
        <template scope="prop">
          <span>{{delist(prop.row.wb, (value) => value.toFixed(2))}}</span>
        </template>
      </list-column>
      <list-column prop="zjqd" label="场外资金" :sort="true" :colStyle="{width:'calc(80% / 5)'}" icon="sort">
        <template scope="prop">
          <span>{{delist(prop.row.zjqd, (value) => value.toFixed(2))}}</span>
        </template>
      </list-column>
      <list-column prop="hsl" label="换手率" :sort="false" :colStyle="{width:'calc(80% / 5)'}">
        <template scope="prop">
         {{delist(prop.row.hsl, (value) => value + '%')}}
        </template>
      </list-column>
      <list-column prop="money" label="成交额/万" :sort="false" :colStyle="{width:'calc(80% / 5)'}">
        <template scope="prop">
          {{delist(prop.row.money, value => (value / 10000).toFixed(2))}}
        </template>
      </list-column>
    </sort-list>
    <popup ref="popup" :isShow="confirmDeleteShow" @click-popupBg="cancelDelete" :size="300" class="popups">
      <div class="content">
        <p v-show="currentIsMy" class="p-top"> 删除自选股</p>
        <p v-show="!currentIsMy" class="p-top"> 添加自选股</p>
        <p v-show="currentIsMy" class="p-middle">确认删除{{currentCodeName}}?</p>
        <p v-show="!currentIsMy" class="p-middle">确认添加{{currentCodeName}}?</p>
        <div class="p-bottom"><span @click="cancelDelete">取消</span><span v-show="currentIsMy" @click="confirmDelete(currentCode)">确认</span><span @click="confirmAdd(currentCode,currentCodeName)" v-show="!currentIsMy">确认</span></div>
      </div>
    </popup>
  </div>
</template>

<script>
  import {
    mapState,
    mapGetters,
  } from 'vuex';
  import {
    codes,
  } from '../../model/storage';
  import StockDetails from '../../components/stockBase/StockDetails';
  import SortList from '../../components/base/SortList2/List';
  import ListColumn from '../../components/base/SortList2/ListColumn';
  import DropPanelTransition from '../../components/base/DropPanel-Transition';
  import Popup from '../../components/base/Popup';
  import {
    baseUtil,
    ycjUtil,
  } from '../../util';
  import {
    userActions,
    stockActions,
  } from '../../model/vuex/actionsType';

  let vm = null;
  let timer = null;
  export default {
    name: 'MarketLeft',
    data() {
      return {
        confirmDeleteShow: false, // 删除确认 tip
        currentCode: '', // 当前active的股票代码 foxxcode格式
        currentCodeName: '', // 当前active选中股票名格式
        codeNames: '', // 当前股票名格式
        currentIsMy: false, // 是否已加入自选股
        listData: [],
        lastStockList: [],
        contextConfig: [
          {
            text: '添加自选',
            click(row) {
              vm.confirmDeleteShow = true;
              vm.currentCode = row.foxxcode;
              vm.currentCodeName = row.name;
              vm.codeNames = row.foxxname;
            },
          },
          {
            text: '查看详情',
            click(row) {
              // this.$router.push(link);
              window.location.href = `#/stock/${row.foxxcode}`;
            },
          },
        ],
        // 哪些列有自定义排序
        customSortMap: {
          close: true,
          ratio: true,
          lb: true,
          wb: true,
          zjqd: true,
        },
        // 列名对应的传递给后台sort键的值，sort=1表示根据现价排序，sort =2表示根据涨跌幅排序，以此类推
        columnSortMap: {
          close: 1,
          ratio: 2,
          lb: 3,
          wb: 4,
          zjqd: 5,
        },
        timer: '',
      };
    },
    components: {
      StockDetails,
      SortList,
      ListColumn,
      DropPanelTransition,
      Popup,
    },
    computed: {
      ...mapState({
        getBaseInfo: state => baseUtil.copy(state.moduleStock.baseInfo),
        getMyStockList: state => baseUtil.copy(state.moduleUser.myStock),
      }),
      ...mapGetters([
        'getStockRatio',
        'getStockNameCode',
        'getStockInfo',
      ]),
    },
    created() {
      vm = this;
      const state = this.$store.state;
      if (!state.moduleStock.baseInfo) {
        return;
      }
      const baseInfo = state.moduleStock.baseInfo; // baseUtil.copy();
      baseUtil.each(baseInfo, (item) => {
        if (!ycjUtil.isIndex(item.foxxcode)) {
          this.listData.push(item);
        }
      });
    },
    methods: {
      viewList(v) {
        const stockList = [];
        const none = [];
        const fixed = [];
        const dispatch = this.$store.dispatch;
        baseUtil.each(this.listData, (item) => {
          baseUtil.each(v, (el) => {
            if (item.columnId === el) {
              stockList.push(item.foxxcode);
            }
          });
        });
        baseUtil.each(stockList, (item) => {
          if (this.lastStockList.indexOf(item) === -1) {
            none.push(item);
          } else {
            fixed.push(item);
          }
        });
        baseUtil.each(none, (item) => {
          dispatch(stockActions.ADD_STOCK_LIST, item);
          dispatch(stockActions.GET_STOCK_DATA, item);
        });
        baseUtil.each(fixed, (item) => {
          if (this.lastStockList.indexOf(item) !== -1) {
            this.lastStockList.splice(this.lastStockList.indexOf(item), 1);
          }
        });
        baseUtil.each(this.lastStockList, (item) => {
          dispatch(stockActions.REMOVE_STOCK_LIST, item);
          dispatch(stockActions.CANCEL_STOCK_DATA, item);
        });
        this.lastStockList = none.concat(fixed);
      },
      rightClick($event, row, $index) {
        const myStock = this.getMyStockList;
        const that = this;
        that.voids = {
          $event,
          $index,
        };
        for (let i = 0; i < myStock.length; i += 1) {
          if (myStock[i].foxxcode === row.foxxcode) {
            that.currentIsMy = true;
            that.contextConfig[0].text = '删除股票';
            break;
          } else {
            that.currentIsMy = false;
            that.contextConfig[0].text = '添加自选';
          }
        }
      },
      itemClick(columnId, row) { // 点击不同item
        this.$emit('activeClick', columnId, row);
      },
      /**
       * 双击跳转到股票详情页
       * */
      openStock(row) {
        this.$router.push({ name: 'stock', params: { code: row.foxxcode } });
      },
      deleteStock() { // 点击删除自选
        this.deleteTipShow = false;
        this.confirmDeleteShow = true;
      },
      addStock() {
        this.confirmDeleteShow = true;
      },
      cancelDelete() { // 确认删除时 的 取消
        this.confirmDeleteShow = false;
      },
      confirmDelete(code) { // 确认删除时 的 确认
        this.confirmDeleteShow = false;
        this.$store.dispatch(userActions.REMOVE_MY_STOCK, code);
      },
      confirmAdd(code, name) {
        this.confirmDeleteShow = false;
        const payload = {
          code,
          name,
        };
        this.$store.dispatch(userActions.ADD_MY_STOCK, payload);
      },
      delist(...param) {
        return ycjUtil.detailInDelist(...param);
      },
      /**
       * 更新行情listData的数据
       * 行情股票列表的数据从本地的codes里获取。每次请求之后已经写入本地。
       */
      updateListData() {
        const state = this.$store.state;
        if (!state.moduleStock.baseInfo) {
          return;
        }
        const baseInfo = state.moduleStock.baseInfo;
        const list = codes.read(); // 读取股票列表， 数据格式为：[[code,name],[code,name],...]
        this.listData = []; // 先清空渲染的listData
        // 遍历本地的股票列表，将相应的股票从vuex的baseInfo里push进listData
        baseUtil.each(list, (item) => {
          const code = item[0];
          if (baseInfo[code]) {
            this.listData.push(baseInfo[code]);
          }
        });
      },
      /**
       * 自定义排序行数
       * @param {String} k - 需要进行排序的列
       * @param {Number} sortType - 排序状态，0-'desc'降序， 1-'asc'升序
       */
      customSort(k, sortType) {
        const sortStatusMap = {
          0: 'desc',
          1: 'asc',
        };
        const param = {
          type: 'stk', // 股票类型，idx是股指，stk是个股，默认是idx
          sort: this.columnSortMap[k], // 需要排序的列
          sort_type: sortStatusMap[sortType], // 升序或降序
        };
        /**
         * 排序并没有setState,并且存在异步问题。没有必要也不能放在vuex里执行。
         */
        codes.param = param;
        codes.request(vm.updateListData);
        if (timer) {
          clearInterval(timer);
        }
        // 如果是盘中，则在点击排序之后，隔一分钟请求一次排序
        if (ycjUtil.isOpening()) {
          timer = setInterval(() => {
            codes.request(vm.updateListData);
          }, 10000);
        }
      },
    },
    activated() {
      baseUtil.each(this.lastStockList, (item) => {
        this.$store.dispatch(stockActions.ADD_STOCK_LIST, item);
      });
    },
    deactivated() {
      baseUtil.each(this.lastStockList, (item) => {
        this.$store.dispatch(stockActions.REMOVE_STOCK_LIST, item);
      });
      // 离开页面时，清除定时器
      if (timer) {
        clearInterval(timer);
      }
    },
  };
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/sass/static";
  .stock-left {
    text-align: center;
    height:100%;
    width:100%;
    font-size: $subText;
    .list-head{ //头部样式
      color: $G2;
      height:25px;
      line-height: 25px;
      border-bottom:1px solid $G6;
      margin-bottom: 2px;
      .zdf,.price{ //涨跌幅和价格
        i{
          display: inline-block;
          transform: scale(.9) rotate(90deg);
        }
      }
    }
    .scroll-bar{
      background: #212121!important;
      width: 6px!important;
      .block{
        background: #4d4d4d!important;
      }
    }
    .row { //list-body部分
      >div{
        height:45px;
        float: left;
        >div{
          width:100%;
          height:100%;
          display:flex;
          justify-content: center;
          align-items: center;
          // line-height: 45px;
        }
        a{
          color:$white;
        }
        &:first-of-type{
          width:20%;
        }
        &:nth-of-type(2), &:nth-of-type(3), &:nth-of-type(4),&:nth-of-type(5), &:nth-of-type(6), &:nth-of-type(7){
          width:10%;
          line-height: 45px;
        }
        &:last-of-type{
          width: 20%;
          // line-height: 45px;
        }
      }
    }
    .popups{ // 删除样式
      color:$G3;
      .content{
        background-color: $white;
        padding:16px 23px;
        padding-bottom: 0;
        font-size: $auxilliary;
        border-radius: 6px;
        p{
          margin: 0;
        }
        .p-top{
          text-align: left;
          font-size: $subText;
        }
        .p-middle{
          padding-top:36px;
          padding-bottom: 20px;
          border-bottom: 1px solid #dedede;
        }
        .p-bottom{
          height:48px;
          padding:12px 0;
          span{
            float: right;
            width:72px;
            height:24px;
            line-height: 22px;
            border: 1px solid $blue1;
            border-radius: 5px;
            color:$G2;
            &:first-of-type{
              margin-left:5px;
            }
            &.active,&:hover{
              background-color: $blue2;
              color:$white;
            }
            &:hover{
              cursor: pointer;
            }
          }
        }
      }
    }
    .delete-tip{ // 删除提示
      position:absolute;
      top:0;
      z-index: 10000;
      .content{
        background-color: $white;
        width:85px;
        border-radius: 4px;
        .del{
          cursor: pointer;
          color:#000333;
          display:block;
          width:100%;
          height:30px;
          font-size:13px;
          line-height: 30px;
          text-align: center;
          &:hover{
            color:$white;
            background-color: $blue1;
          }
        }
      }
    }
  }
</style>
