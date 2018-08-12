<template>
  <div class="new-buttons">
    <div class="drop-buttons">
      <div class="button" :class=" {'active':activeButton == 0}" @click="buttonClick(0)">
        <span v-if="isIndex">实时盯盘
          <img src="../../assets/image/arrowDownActive.png" v-if="activeButton == 0">
          <img src="../../assets/image/arrowUp.png" v-else>
        </span>
        <span v-else>消息聚合
          <img src="../../assets/image/arrowDownActive.png" v-if="activeButton == 0">
          <img src="../../assets/image/arrowUp.png" v-else>
        </span>
        <i v-show="news.newIconStatus.first" style="color:yellow">[!]</i>
      </div>
      <div class="button" :class=" {'active':activeButton == 1}" @click="buttonClick(1)">
        <span v-if="isIndex">利好利空
          <img src="../../assets/image/arrowDownActive.png" v-if="activeButton == 1">
          <img src="../../assets/image/arrowUp.png" v-else>
        </span>
        <span v-else>特别提醒
          <img src="../../assets/image/arrowDownActive.png" v-if="activeButton == 1">
          <img src="../../assets/image/arrowUp.png" v-else>
        </span>
        <i v-show="news.newIconStatus.second" style="color:yellow">[!]</i>
      </div>
    </div>
    <div class="news-panel" v-show="activeButton != null">
      <drop-panel :isShow="activeButton == 0">
        <div class="news-list" v-if="!isIndex">
          <div class="list-item" v-for="item in news.normal" @click="(newsClick(item))">
            <span class="title">{{item.from}}</span>
            <time v-text="transformhhmm(item.inputtime)"></time>
            <span class="desc">{{item.title}}</span>
          </div>
        </div>
        <div class="news-list" v-else>
          <div class="list-item" v-for="item in news.realtime" @click="(newsClick(item))" >
            <span class="title">{{item.from}}</span>
            <time v-text="transformhhmm(item.inputtime)"></time>
            <span class="desc">{{item.title}}</span>
          </div>
        </div>
      </drop-panel>
      <drop-panel :isShow="activeButton == 1">
        <div class="particular" v-if="!isIndex">
          <div class="list-item" v-for="item in news.particular" @click="(newsClick(item))">
            <div class="head">
              <time>{{item.create_date}}</time>
              <span>特别提醒</span>
            </div>
            <div class="title"><strong>{{item.cat}}</strong></div>
            <div class="desc" v-html="item.content"></div>
          </div>
        </div>
        <div class="news-list" v-else>
          <div class="list-item" :class="{ 'stock-rise':item.type=='利好', 'stock-drop':item.type=='利空' }" v-for="item in news.good" @click="(newsClick(item))">
            <time>{{item.date}}</time>
            <span class="title">[ {{item.type}} ]</span>
            <span class="desc">{{item.title}}</span>
          </div>
        </div>
      </drop-panel>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import {
    actions,
    stockActions,
  } from '../../model/vuex/actionsType';
  import {
    ycjUtil,
    format,
  } from '../../util';
  import DropPanel from '../../components/base/DropPanel';

  export default {
    name: 'stockNews',
    data() {
      return {
        activeButton: null,
        prevCode: null,
      };
    },
    props: {
      focusCode: null,
    },
    components: {
      DropPanel,
    },
    computed: {
      ...mapState({
        news(state) {
          return state.moduleStock.relativeNews[this.focusCode];
        },
      }),
      isIndex() {
        return ycjUtil.isIndex(this.focusCode);
      },
    },
    created() {
      const dispatch = this.$store.dispatch;
      dispatch(stockActions.GET_RELATIVE_NEWS, this.focusCode);
      if (this.isIndex) {
        this.activeButton = 0;
      }
    },
    watch: {
      focusCode() {
        this.activeButton = null;
        if (this.prevCode !== this.focusCode) {
          const dispatch = this.$store.dispatch;
          dispatch(stockActions.GET_RELATIVE_NEWS, this.focusCode);
          if (this.prevCode) {
            dispatch(stockActions.CANCEL_REALTIME_NEWS, this.prevCode);
          }
          this.prevCode = this.focusCode;
        }
        if (this.isIndex) {
          this.activeButton = 0;
        }
      },
    },
    methods: {
      buttonClick(index) {
        if (this.activeButton === index) {
          this.activeButton = null;
        } else {
          this.activeButton = index;
        }
      },
      newsClick(news) { // 新闻动态
        this.$store.dispatch(actions.UPDATE_NEWS_DATA, {
          title: news.cat || news.title,
          date: this.transformDate(news.inputtime) || news.create_date || news.date,
          from: news.from || '云财经',
          desc: `<p>${news.content || news.title}</p>`,
        });
      },
      // 获取“今天”日期
      getToday() {
        const today = format.date(new Date(), 'MM-dd');
        return today;
      },
      // 判断消息时间，今天则显示‘时-分’，其他时间则显示‘月-日’
      transformhhmm(str) {
        if ((typeof str) !== 'string' || !str) {
          return str;
        }
        const today = this.getToday();
        let dateStr = format.date(new Date(Number(str) * 1000), 'MM-dd hh:mm');
        if (dateStr.indexOf(today) !== -1) {
          dateStr = dateStr.replace(today, '');
        } else {
          dateStr = dateStr.substring(0, dateStr.length - 5);
        }
        return dateStr;
      },
      // 判断消息时间，今天则显示‘今天 时:分’，其他时间则显示‘月-日 时:分’
      transformDate(str) {
        if ((typeof str) !== 'string' || !str) {
          return str;
        }
        const today = this.getToday();
        let dateStr = format.date(new Date(Number(str) * 1000), 'MM-dd hh:mm');
        dateStr = dateStr.replace(today, '今天');
        return dateStr;
      },
    },
  };
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../../assets/sass/static";
  .left-main {
    position: absolute;
    top: 68px;
    bottom: 0;
    right: 400px;
    left: 0;
    margin: auto;
    .chart-container {
      height: calc(100% - 26px);
      width: 100%;
    }
    .new-buttons {
      position: relative;
      bottom: 0;
      width: 100%;
      background: $G4;
      border: none;
      .drop-buttons {
        line-height: 26px;
        @extend %cf;
        > .button {
          float: left;
          padding: 0 15px;
          user-select: none;
          cursor: pointer;
          transition: all 0.3s;
          font-size: 13px;
          color: $G2;
          &:hover,
          &.active {
            color: #fff;
            background-color: $witheMask;
          }
        }
      }

    }
  }

  .news-panel {
    position: absolute;
    bottom: 100%;
    z-index: 16;
    width: 100%;
    background: $G4;
    border-top: 1px solid $G5;
    border-bottom: 1px solid $G5;
    .news-list {
      height: 215px;
      padding: 5px 8px;
      overflow-y: scroll;
      .list-item {
        font-size: 12px;
        line-height: 1.9;
        cursor: default;
        @extend %cf;
        > * {
          float: left;
          text-align: center;
        }
        time {
          width: 105px;
        }
        .title {
          width: 20%;
          margin-right: 20px;
          @extend %text-ellipsis;
        }
        .desc {
          text-align: left;
          width: calc(100% - 105px - 23%);
          @extend %text-ellipsis;
        }
      }
    }
    .particular {
      width: 100%;
      height: 215px;
      padding: 10px;
      overflow-y: auto;
      @extend %cf;
      .list-item {
        float: left;
        width: 32.5%;
        height: 200px;
        margin:0 5px 5px 0!important;
        padding: 7px;
        border: 1px solid $G5;
        .head {
          span {
            float: right;
          }
        }
        .title {
          line-height: 2;
        }
        .desc {
          min-height: 110px;
          line-height: 1.9;
          overflow : hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 6;
          -webkit-box-orient: vertical;
        }
      }
      .list-item + .list-item {
        margin-left: 5px;
      }
    }
  }

</style>
