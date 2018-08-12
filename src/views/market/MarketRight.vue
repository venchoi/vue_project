<template>
  <div class="right-main">
    <div class="fenshi">
      <tick-line :code="focusCode"></tick-line>
    </div>
    <div class="news">
      <ul class="news-head">
        <li>消息时间</li>
        <li>来源</li>
        <li>标题</li>
      </ul>
      <ul class="news-item">
        <li v-for="item in news" @click="openNews(item)">
          <span v-text="transformDate(item.inputtime)"></span>
          <span v-text="item.from"></span>
          <span v-text="item.title"></span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>

  import { mapState } from 'vuex';
  import format from '../../util/format';
  import Tag from '../../components/base/Tags';
  import StockDetails from '../../components/stockBase/StockDetails';
  import ProgressBar from '../../components/base/ProgressBar';
  import StockProgressBar from '../../components/stockBase/StockProgressBar';
  import TickLine from './TickLine';
  import {
    actions,
    stockActions,
  } from '../../model/vuex/actionsType';

  export default {
    name: 'MarketRight',
    data() {
      return {
        code: '',
        prevCode: '',
      };
    },
    components: {
      ProgressBar,
      StockProgressBar,
      StockDetails,
      Tag,
      TickLine,
    },
    props: {
      focusCode: [String, Number],
    },
    watch: {
      focusCode() {
        const dispatch = this.$store.dispatch;
        if (this.prevCode !== this.focusCode) {
          if (this.focusCode) {
            dispatch(stockActions.GET_RELATIVE_NEWS, this.focusCode);
            dispatch(stockActions.ADD_STOCK_LIST, this.focusCode);
          }
          if (this.prevCode) {
            dispatch(stockActions.CANCEL_REALTIME_NEWS, this.prevCode);
          }
          this.prevCode = this.focusCode;
        }
      },
    },
    created() {
      const dispatch = this.$store.dispatch;
      if (this.focusCode) {
        dispatch(stockActions.GET_RELATIVE_NEWS, this.focusCode);
        dispatch(stockActions.ADD_STOCK_LIST, this.focusCode);
      }
      this.prevCode = this.focusCode;
    },
    computed: {
      ...mapState({
        newsList(state) {
          return state.moduleStock.relativeNews[this.focusCode] || {};
        },
      }),
      news() {
        return this.newsList.normal;
      },
    },
    methods: {
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
  };
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/sass/static";

  .right-main {
    position: absolute;
    top:0;
    bottom: 0;
    right: 0;
    width: 100%;
    margin: auto 0;
    .title{
      height:30px;
      line-height: 30px;
    }
    .fenshi{
      padding-right: 10px;
      height:300px;
      &.fenshi{
        border-bottom: 1px solid $G6;
      }
    }
    .news{
      height: calc(100% - 300px);
      .news-head{
        list-style: none;
        height: 26px;
        margin:0;
        padding: 0;
        border-bottom: 1px solid $G6;
        li{
          float: left;
          height: 26px;
          line-height: 26px;
          text-align: center;
          &:first-child,&:nth-child(2){
            width:20%;
          }
          &:last-child{
            width: 60%;
          }
        }
      }
      .news-item{
        height: calc(100% - 26px);
        overflow-y: auto;
        list-style: none;
        margin:0;
        padding: 0;
        cursor: default;
        li{
          height: 26px;
          line-height: 26px;
          &:hover{
            background: $G2;
          }
          >span{
            height: 26px;
            line-height: 26px;
            text-align: center;
            float: left;
            word-break: keep-all;
            &:first-child,&:nth-child(2){
              width:20%;
              white-space:nowrap;
              overflow:hidden;
              text-overflow:ellipsis;
            }
            &:last-child{
              width: 60%;
              white-space:nowrap;
              overflow:hidden;
              text-overflow:ellipsis;
            }
          }
        }
      }
    }

  }
</style>
