<template>
  <div class="news-model">
    <popup :isShow="isShow" @click-popupBg="hide" :size="750">
      <div class="close-bar">
          <span class="close" @click="hide">
            <iconfont iconName="times" size="18px"></iconfont>
          </span>

      </div>
      <div class="head">
        <h2>{{newsData.title}}</h2>
        <time v-if="newsData.date" v-text="newsData.date"></time>
        <span class="from" v-if="newsData.from" v-text="newsData.from"></span>
        <div class="line"></div>
      </div>
      <div class="content" v-html="newsData.desc"></div>
    </popup>
  </div>
</template>

<script>
  import {
    mapState,
    mapActions,
  } from 'vuex';

  import Popup from '../base/Popup';
  import Iconfont from '../base/IconFont';
  import { actions } from '../../model/vuex/actionsType';

  export default {
    name: '',
    data() {
      return {};
    },
    computed: {
      ...mapState({
        isShow: state => state.newsModel.isShow,
        newsData: state => state.newsModel.newsData,
      }),
    },
    components: {
      Iconfont,
      Popup,
    },
    methods: {
      ...mapActions({
        update: actions.UPDATE_NEWS_DATA,
        hide: actions.HIDE_NEWS,
      }),
    },
  };
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../../assets/sass/static";
  .news-model{
    color: #333;
    .close-bar{
      height: 30px;
      background: #F2F2F2;
      border-top-left-radius: 5px;
      border-top-right-radius: 5px;
      .close{
        position: absolute;
        top:7px;
        right: 10px;
        transition: transform 0.3s;
        &:hover{
          transform: rotate(180deg);
        }
      }
    }
    .head{
      padding: 10px 25px 0px 25px;
      text-align: left;
      background: $white;
      .line{
        margin-top: 10px;
        border-bottom: 1px solid #000000;
      }
      h2{
        font-size: 18px;
        margin: 0;
      }
      time,
      .from{
        color: $G2;
        font-size: 12px;
        padding-top: 5px;
      }
      time{
        margin-right: 20px;
      }

    }
    .content{
      border-bottom-left-radius: 5px;
      border-bottom-right-radius: 5px;
      font-size: 13px;
      line-height: 24px;
      background: $white;
      padding: 10px 25px;
      max-height: 450px;
      overflow-y: auto;
      text-align: left;
      &::-webkit-scrollbar-track {
        background-color: $white;
      }
      &::-webkit-scrollbar-track:hover {
        background-color: $white
      }
      img {
        display: inline-block;
        width: 100%;
      }
    }
  }
</style>
