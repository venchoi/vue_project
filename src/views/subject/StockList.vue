<template>
  <div class="right-stock-list"  @contextmenu.prevent >
    <sort-list :listData="list" v-if="showBox"  @doubleClick="openStock" @viewListChange='viewList' :isGetFocus="true" :isHeadFixed="true" hoverColor="#2b2b2b" activeColor="transparent" style="background: #212121" ref="scrollBox">
      <list-column prop="name" label="名称" :sort="false" :colStyle="{width:'180px'}">
        <template scope="prop">
          <span @mouseenter="enterStock($event, prop.row.foxxcode)" @mouseleave="leaveStock()">{{getStockNameCode(prop.row.foxxcode)}}</span>
        </template>
      </list-column>
      <list-column prop="ratio" label="涨幅" :sort="true" icon="sort" :colStyle="{width:'calc((100% - 180px) / 4)'}">
        <template scope="prop">
          <stock-details :value='prop.row.ratio' unit="%" :format="false" fixed="2" :boundary='0' modal='normal' :isNeedDelist="prop.row.close"></stock-details>
        </template>
      </list-column>
      <list-column prop="hsl" label="换手率" :sort="true" icon="sort" :colStyle="{width:'calc((100% - 180px) / 4)'}">
        <template scope="prop">
          {{delist(prop.row.hsl, (value) => value + '%')}}
        </template>
      </list-column>
      <list-column prop="zsz" label="总市值/亿" :sort="true" icon="sort" :colStyle="{width:'calc((100% - 180px) / 4)'}">
        <template scope="prop">
          {{delist(prop.row.zsz, value => (value / 100000000).toFixed(2))}}
        </template>
      </list-column>
      <list-column prop="ltsz" label="流通市值/亿" :sort="true" icon="sort" :colStyle="{width:'calc((100% - 180px) / 4)'}">
        <template scope="prop">
          {{delist(prop.row.ltsz, value => (value / 100000000).toFixed(2))}}
        </template>
      </list-column>
    </sort-list>
    <tick-line-image :foxxcode="gifFoxxCode" :clientX="gifClientX" :clientY="gifClientY" ref="stockgif"></tick-line-image>
  </div>
</template>

<script>
  import {
    mapState,
    mapGetters,
  } from 'vuex';
  import StockDetails from '../../components/stockBase/StockDetails';
  import SortList from '../../components/base/SortList2/List';
  import ListColumn from '../../components/base/SortList2/ListColumn';
  import TickLineImage from '../../components/stockBase/TickLineImage';
  import {
    baseUtil,
    ycjUtil,
  } from '../../util';
  import {
    stockActions,
  } from '../../model/vuex/actionsType';

  export default {
    name: 'StockList',
    data() {
      return {
        lastStockList: [],
        list: [],
        showBox: true,
        gifFoxxCode: '',
        gifClientX: '',
        gifClientY: '',
      };
    },
    props: {
      listData: [Array],
    },
    components: {
      StockDetails,
      SortList,
      ListColumn,
      TickLineImage,
    },
    computed: {
      ...mapState({
        getBaseInfo: state => baseUtil.copy(state.moduleStock.baseInfo),
      }),
      ...mapGetters([
        'getStockRatio',
        'getStockNameCode',
        'getStockInfo',
      ]),
    },
    watch: {
      listData() {
        /*
        * 概念切换，清除股票列表上一次渲染内容
        * */
        this.switchSubject();
        /*
        * 渲染新内容
        * */
        const state = this.$store.state;
        if (!state.moduleStock.baseInfo) {
          return;
        }
        const baseInfo = state.moduleStock.baseInfo;
        const dispatch = this.$store.dispatch;
        baseUtil.each(this.listData, (item) => {
          if (baseInfo[item]) {
            this.list.push(baseInfo[item]);
            dispatch(stockActions.ADD_STOCK_LIST, item);
            dispatch(stockActions.GET_STOCK_DATA, item);
          }
        });
        setTimeout(() => {
          this.showBox = true;
        }, 0);
      },
    },
    created() {},
    methods: {
      /*
      * 分时图片
      * */
      enterStock($event, foxxcode) {
        const vm = this;
        vm.gifFoxxCode = foxxcode;
        vm.gifClientX = $event.clientX;
        vm.gifClientY = $event.clientY;
        vm.$refs.stockgif.show();
      },
      /*
      * 概念切换取消之前的股票订阅
      */
      switchSubject() {
        baseUtil.each(this.list, (item) => {
          const dispatch = this.$store.dispatch;
          dispatch(stockActions.REMOVE_STOCK_LIST, item.foxxcode);
          dispatch(stockActions.CANCEL_STOCK_DATA, item.foxxcode);
        });
        this.list = [];
        this.showBox = false;
        if (this.$refs.scrollBox) {
          this.$refs.scrollBox.clear();
        }
      },
      // 隐藏股票gif
      leaveStock() {
        this.$refs.stockgif.hide();
      },
      /*
      * 列表组件滚动
      * */
      viewList(v) {
        const stockList = [];
        const none = [];
        const fixed = [];
        const dispatch = this.$store.dispatch;
        baseUtil.each(this.list, (item) => {
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
      /**
       * 双击跳转到股票详情页,如想屏蔽新闻弹出框，需要在这里屏蔽
       * */
      openStock(row) {
        this.$router.push({ name: 'stock', params: { code: row.foxxcode } });
      },
      delist(...param) {
        return ycjUtil.detailInDelist(...param);
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
    },
  };
</script>
<style lang="scss" rel="stylesheet/scss">
  @import "../../assets/sass/static";
  .right-stock-list{
    text-align: center;
    height:calc(100% - 36px);
    width:100%;
    font-size: $subText;
    .list-head{ //头部样式
      color: $G2;
      height:36px;
      line-height: 36px;
      background: #2b2b2b;
    }
    .list-body{
      top:36px!important;
      height: calc(100% - 36px)!important;
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
        height:36px;
        float: left;
        >div{
          width:100%;
          height:100%;
          display:flex;
          justify-content: center;
          align-items: center;
        }
        a{
          color:#f5ba53;
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
  }
</style>
