<template>
  <div class="stock-left"  key="1"  @contextmenu.prevent >
    <sort-list :listData="listData" v-if="showTable" ref="ListTable"
               @viewListChange='viewList' @activeUpdate="itemClick"
               @doubleClick="openStock" @hasdraged="hasReordered"
               :isGetFocus="true" :isHeadFixed="true" :canDrag="true"
               hoverColor="rgba(43,43,43,1)" activeColor="#373737"  style="background: #212121"
               :contextMenu="contextConfig" :headStyle="tableHeadStyle">
      <list-column prop="foxxcode" label="序号" :sort="false" :colStyle="{width:'40px'}">
        <template scope="prop">
          <span>{{prop.index + 1}}</span>
        </template>
      </list-column>
      <list-column prop="code" label="代码" :sort="false" :colStyle="{width:'calc((40% - 40px) / 4)'}">
      </list-column>
      <list-column prop="name" label="名称" :sort="false" :colStyle="{width:'calc((40% - 40px) / 4)'}">
      </list-column>
      <list-column prop="price" label="现价" :sort="false" :colStyle="{width:'calc((40% - 40px) / 4)'}">
        <template scope="prop">
          <stock-details :value='prop.row.price' :format="false" fixed="2" :boundary='prop.row.preClose' modal='normal' :isNeedDelist="prop.row.price"></stock-details>
        </template>
      </list-column>
      <list-column prop="zdf" label="涨跌" :sort="false" :colStyle="{width:'calc((40% - 40px) / 4)'}">
        <template scope="prop">
          <stock-details :value='prop.row.zdf' unit="%" :boundary='0' modal='normal' :isNeedDelist="prop.row.price"></stock-details>
        </template>
      </list-column>
      <list-column prop="remark" label="备注" :sort="false" :colStyle="{width:'30%'}">
        <template scope="prop">
          <div class="news-wrap">
            <p class="news-title">{{prop.row.remark}}</p>
          </div>
        </template>
      </list-column>
      <list-column prop="news" label="新闻动态" :sort="false" :colStyle="{width:'30%'}">
        <template scope="prop">
          <div @click="clickNewsTitle(prop.row.news.id)" class="news-wrap">
            <p class="news-title">{{prop.row.news.title}}</p>
          </div>
        </template>
      </list-column>
    </sort-list>
    <popup ref="popup" :isShow="confirmDeleteShow" @click-popupBg="cancelDelete" :size="297" class="popups">
      <div class="content">
        <p class="p-top"> 删除自选股</p>
        <p class="p-middle">确认删除{{currentCodeName}}({{currentCode}})?</p>
        <div class="p-bottom">
          <span @click="cancelDelete">取消</span>
          <span @click="confirmDelete(currentCode)">确认</span>
        </div>
      </div>
    </popup>
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
  import DropPanelTransition from '../../components/base/DropPanel-Transition';
  import Popup from '../../components/base/Popup';
  import {
    baseUtil,
    ycjUtil,
  } from '../../util';
  import {
    userActions,
    stockActions,
    newsActions,
  } from '../../model/vuex/actionsType';

  let that = null; // 全局定义this,在data中contextConfig赋值用到
  export default {
    name: 'myStockLeft',
    data() {
      return {
        showTable: true,
        confirmDeleteShow: false, // 删除确认 tip
        currentCode: '', // 当前active的股票代码 foxxcode格式
        currentCodeName: '', // 当前active选中股票名
        listData: [], // 渲染股票列表
        lastStockList: [], // 显示区域股票
        newsList: {}, // 新闻列表
        hasReorderedMark: false, // 判断是否有重排序发生
        contextConfig: [ // 右键股票内容
          {
            text: '删除股票',
            click(row) {
              that.confirmDeleteShow = true;
              that.currentCode = row.foxxcode;
              that.currentCodeName = row.name;
            },
          },
          {
            text: '查看详情',
            click(row) {
              window.location.href = `#/stock/${row.foxxcode}`;
            },
          },
        ],
        tableHeadStyle: { // 表头样式
          background: '#2b2b2b',
          color: '#fff',
          height: '37px',
          'line-height': '37px',
          'border-right': '1px solid #212121',
        },
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
      ...mapGetters([
        'getStockRatio',
        'getStockNameCode',
        'getStockInfo',
      ]),
      ...mapState({
        myStock: state => baseUtil.copy(state.moduleUser.myStock),
        baseInfo: state => baseUtil.copy(state.moduleStock.baseInfo),
        lastNews: state => baseUtil.copy(state.moduleUser.stockLatestNews),
      }),
    },
    created() {
      that = this;
      const myStock = this.myStock; // 自选股
      const listData = this.listData; // 渲染列表
      this.initData(myStock, listData);
    },
    mounted() {
      that = this;
    },
    watch: {
      /*
      * 当myStorck变化时，更新页面
      * */
      myStock() {
        const vm = this;
        const myStock = vm.myStock; // 自选股
        const listData = vm.listData; // 渲染列表
        if (vm.hasReorderedMark) { // 如顺序变化
          vm.reorderData(myStock, listData);// 顺序变化处理
        } else {
          vm.initData(myStock, listData); // 处理新增情况
          vm.deleteData(myStock, listData); // 处理删除情况
          vm.updateMark(myStock, listData); // 更新备注和新闻
        }
      },
      /**
       * 更新股票行情
       * */
      baseInfo() {
        const vm = this;
        baseUtil.each(vm.listData, (item) => {
          const el = item;
          const info = vm.baseInfo[el.foxxcode];
          if (info) {
            el.price = info.close;
            el.zdf = info.ratio;
            el.preClose = info.preClose;
          }
        });
      },
      /**
       * 更新最近新闻
       * */
      lastNews() {
        baseUtil.each(this.listData, (item) => {
          const el = item;
          let lastnews = this.lastNews[el.foxxcode];
          if (!lastnews) {
            lastnews = {
              date: '',
              id: '',
              code: '',
              title: '',
            };
          }
          el.news = lastnews;
        });
      },
    },
    methods: {
      /**
       * 更新显示区域股票信息
       * */
      viewList(v) {
        const stockList = [];
        const none = [];
        const fixed = [];
        // 将listData中股票代码取出放入stockList
        baseUtil.each(this.listData, (item) => {
          baseUtil.each(v, (el) => {
            if (item.columnId === el) {
              stockList.push(item.foxxcode);
            }
          });
        });
        // 处理stockList数组：
        // 如果股票在lastStockList中，则将股票放入fixed的列表中；
        // 如果股票不在lastStockList中，则将股票放入none的列表中；
        baseUtil.each(stockList, (item) => {
          if (this.lastStockList.indexOf(item) === -1) {
            none.push(item);
          } else {
            fixed.push(item);
          }
        });
        // 将none中股票进行处理：将每个元素进行stockActions.ADD_STOCK_LIST
        baseUtil.each(none, (item) => {
          this.$store.dispatch(stockActions.ADD_STOCK_LIST, item);
        });
        // 遍历fixed，在lastStockList中移除同时也在fixed中的值；
        baseUtil.each(fixed, (item) => {
          if (this.lastStockList.indexOf(item) !== -1) {
            this.lastStockList.splice(this.lastStockList.indexOf(item), 1);
          }
        });
        // 对lastStockList中每个元素进行stockActions.REMOVE_STOCK_LIST。
        baseUtil.each(this.lastStockList, (item) => {
          this.$store.dispatch(stockActions.REMOVE_STOCK_LIST, item);
        });
        // lastStockList = none + fixed
        this.lastStockList = none.concat(fixed);
      },
      itemClick(columnId, row) { // 点击不同item
        this.$emit('activeClick', columnId, row);
      },
      /**
       * 双击跳转到股票详情页,如想屏蔽新闻弹出框，需要在这里屏蔽
       * */
      openStock(row) {
        this.$router.push({ name: 'stock', params: { code: row.foxxcode } });
      },
      /**
       * 拖拽完成后列表重排序
       * 向state提交myStock修改事件。
       * */
      hasReordered(dragStart, dragEnd) {
        // 如果位置没有变动，则不触发函数
        if(dragStart === dragEnd) {
          return;
        } else {
          this.hasReorderedMark = true; // 发生重排序标记
          // 提交信息给state处理：包括顺序的更改和与后台的通讯
          this.$store.dispatch(userActions.REORDER_MY_STOCK, { dragStart, dragEnd });
        }
      },
      /**
       * 删除选中股票
       * */
      cancelDelete() { // 确认删除时 的 取消
        this.confirmDeleteShow = false;
      },
      confirmDelete(code) { // 确认删除时 的 确认
        this.confirmDeleteShow = false;
        this.$store.dispatch(userActions.REMOVE_MY_STOCK, code);
      },
      /**
       * 初始化列表/列表有新增进行的操作
       * */
      initData(myStock, listData) {
        const vm = this;
        const listNews = vm.lastNews; // 最新新闻
        const currentLength = myStock.length; // 当前自选股数组长度
        const listLength = listData.length; // 渲染列表数组长度
        // 如果当前自选股数组长度大于渲染列表长度，则向渲染列表中添加新增项
        // 如当前自选股数组中有而渲染列表中没有的项，则加入(Push)渲染列表。
        if (currentLength > listLength) {
          baseUtil.each(myStock, (item) => {
            const foxxCode = item.foxxcode;
            let canPush = true;
            baseUtil.each(listData, (list) => {
              if (foxxCode === list.foxxcode) {
                canPush = false;
              }
            });
            if (canPush) {
              let news = listNews[foxxCode];
              const baseInfo = vm.getStockInfo(foxxCode);
              if (!news) {
                vm.$store.dispatch(userActions.GET_STOCK_NEWS, foxxCode);
                news = {
                  date: '',
                  id: '',
                  code: '',
                  title: '',
                };
              }
              // 按渲染列表格式传入数据
              listData.push({
                num: item.stock_index,
                code: ycjUtil.foxxCodeToCode(foxxCode), // 股票代码
                foxxcode: foxxCode, // 股票代码
                name: item.stock_name, // 股票名
                price: baseInfo.close, // 股票现价
                preClose: baseInfo.preClose, // 股票现价
                zdf: baseInfo.ratio, // 涨跌幅
                remark: item.info, // 备注
                news, // 新闻动态
              });
            }
          });
        }
      },
      /**
       * 列表重排序后进行的操作:
       * 注意！vue不能监测到array[index]=newValue这样的赋值变化，
       * 需要使用splice、set等
       * */
      reorderData(myStock, listData) {
        const vm = this;
        const listNews = vm.lastNews; // 最新新闻
        const currentLength = myStock.length; // 当前自选股数组长度
        const listLength = listData.length; // 渲染列表数组长度
        // 如果渲染列表长度和自选股列表长度相等
        if (currentLength === listLength) {
          baseUtil.each(myStock, (item, index) => {
            const foxxCode = item.foxxcode;
            const baseInfo = vm.getStockInfo(foxxCode);
            let news = listNews[foxxCode];
            if (!news) {
              vm.$store.dispatch(userActions.GET_STOCK_NEWS, foxxCode);
              news = {
                date: '',
                id: '',
                code: '',
                title: '',
              };
            }
            // 按渲染列表格式传入数据
            const newItem = {
              num: item.stock_index,
              code: ycjUtil.foxxCodeToCode(foxxCode), // 股票代码
              foxxcode: item.foxxcode, // 股票代码
              name: item.stock_name, // 股票名
              price: baseInfo.close, // 股票现价
              preClose: baseInfo.preClose, // 股票现价
              zdf: baseInfo.ratio, // 涨跌幅
              remark: item.info, // 备注
              news, // 新闻动态
            };
            listData.splice(index, 1, newItem);
          });
          vm.hasReorderedMark = false;
        }
      },
      /**
       * 列表有删除进行的操作
       * */
      deleteData(myStock, listData) {
        const currentLength = myStock.length; // 当前自选股数组长度
        const listLength = listData.length; // 渲染列表数组长度
        if (currentLength < listLength) { // 如果当期自选股数组长度大于渲染列表，则删除listData中多余的项。
          // 如果自选股数组已空，则清空渲染列表。
          if (currentLength === 0) {
            this.clearList();
            return;
          }
          // 遍历listData数组，删除在listData中有而在myStock中没有的项。
          baseUtil.each(listData, (item, index) => {
            const foxxCode = item.foxxcode;
            let canDelete = true;
            baseUtil.each(myStock, (stock) => {
              if (foxxCode === stock.foxxcode) {
                canDelete = false;
              }
            });
            if (canDelete) {
              listData.splice(index, 1);
            }
          });
        }
      },
      /**
       * 更新股票列表中的备注和新闻
       * */
      updateMark(myStock, listData) {
        const listNews = this.lastNews; // 最新新闻
        const currentLength = myStock.length; // 当前自选股数组长度
        const listLength = listData.length; // 渲染列表数组长度
        if (currentLength === listLength) {
          baseUtil.each(myStock, (item) => {
            const foxxCode = item.foxxcode;
            const info = item.info;
            baseUtil.each(listData, (stocks) => {
              const el = stocks;
              if (foxxCode === el.foxxcode) {
                let news = listNews[foxxCode];
                if (!news) {
                  news = {
                    date: '',
                    id: '',
                    code: '',
                    title: '',
                  };
                }
                el.remark = info;
                el.news = news;
              }
            });
          });
        }
      },
      /**
       * 清空渲染，不仅仅是清空渲染列表，还会直接清空ListTable。
       * */
      clearList() {
        const vm = this;
        vm.listData.splice(0, vm.listData.length);
        vm.showTable = false;
        if (vm.$refs.ListTable) {
          vm.$refs.ListTable.clear();
        }
      },
      /**
       * 点击新闻标题获取新闻信息
       * @param id - 新闻ID
       */
      clickNewsTitle(id) {
        this.$store.dispatch(newsActions.SHOW_NEWS_BY_ID, {
          id,
          show: true,
        });
      },
    },
    activated() {
      const vm = this;
      const myStock = vm.myStock; // 自选股
      vm.showTable = true;
      vm.initData(myStock, vm.listData);
      baseUtil.each(vm.lastStockList, (item) => {
        vm.$store.dispatch(stockActions.ADD_STOCK_LIST, item);
      });
    },
    deactivated() {
      baseUtil.each(this.lastStockList, (item) => {
        this.$store.dispatch(stockActions.REMOVE_STOCK_LIST, item);
      });
      this.clearList();
    },
  };
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/sass/static";
  .stock-left {
    text-align: center;
    height:100%;
    width:100%;
     overflow-y: scroll;
    font-size: $subText;
    .list-head{ //头部样式，目前没有用- -
      color: $G2;
      height:25px;
      line-height: 25px;
      border-bottom:1px solid $G6;
      margin-bottom: 2px;
      .zdf,.price{ //涨跌幅和价格
        position: relative;
        padding-right:17px;
        i{
          position: absolute;
          top:2px;
          right:5px;
          transform: scale(0.8) rotate(90deg);
        }
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
        }
        a{
          color:$white;
        }
        &:nth-of-type(6),&:last-of-type {
          div {
            height: 45px;
            text-align: left;
            display: -webkit-box;
            overflow: hidden;
            text-overflow: ellipsis;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            padding: 0 10px;
          }
        }
        &:last-of-type{
          height: 45px;
          cursor: pointer;
          display: flex;
          align-items: center;
        }
      }
      .cell{
        .news-wrap{
          height: 45px;
          display: flex!important;
          align-items: center!important;
          .news-title{
            line-height:1.5;
            text-align: left;
            display: -webkit-box;
            overflow: hidden;
            text-overflow: ellipsis;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            padding: 0 10px;
            margin:0;
          }
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
