<template>
  <router-link :class="['funds-wrap', { 'has-update': fundItem.hasModify }]" :to="{ name: 'fund-detail', params: {type: fundItem.system_code}}">
    <div class="name">
      <div class="name-bg"></div>
      <span class="text_hide">{{fundItem.name}}</span>
    </div>
    <p class="all-earn"><span>基金总收益：</span>{{fundItem.allEarn}}</p>
    <p :class="['recently-earn', { 'greed': greed()}]"><span>近10天收益：</span>{{fundItem.recentlyEarn}}</p>
    <p class="created-time"><span>成立时间：</span>{{fundItem.createdTime}}</p>
    <div class="status has" v-if="fundItem.hasModify">今日有操作</div>
    <div class="status not" v-if="!fundItem.hasModify">今日无操作</div>
  </router-link>
</template>

<script>
  export default {
    name: 'Fund',
    data() {
      return {
        fundItem: this.fund,
      };
    },
    props: {
      fund: Object,
    },
    components: {
    },
    methods: {
      greed() {
        return parseFloat(this.fundItem.recentlyEarn) < 0;
      },
    },
    computed: {
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
  .text_hide {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .funds-wrap {
    position: relative;
    max-width: 25%;
    min-width: 25%;
    border-left:1px solid #242424;
    border-bottom:1px solid #242424;
    flex: 1;
    background: $G4;
    align-items: flex-start;
    cursor: pointer;
    -webkit-transition: background 600ms;
    -moz-transition: background 600ms;
    -ms-transition: background 600ms;
    -o-transition: background 600ms;
    transition: background 600ms;
    .name {
      position: relative;
      width: 163px;;
      height: 37px;
      margin: 0 auto 40px auto;
      .name-bg {
        position: relative;
        display: block;
        width: 100%;
        height: 100%;
        border-top: 37px solid #373737;
        border-left: 15px solid transparent;
        border-right: 15px solid transparent;
      }
      span {
        position: absolute;
        display: block;
        top:0;
        left: 0;
        width: 100%;
        height:37px;
        line-height:37px;
        text-align: center;
        font-size: $text;
        color: #fff;
      }
    }
    .all-earn {
      height: 24px;
      line-height: 24px;
      font-size: 24px;
      color: #f03426;
    }
    .recently-earn {
      height: 14px;
      line-height: 14px;
      font-size: 14px;
      color: #f03426;
    }
    .greed {
      color: #34c134;
    }
    .created-time {
      height: 14px;
      line-height: 14px;
      font-size: 14px;
      color: #c0c0c0;
      margin-bottom: 35px;
      span {
        letter-spacing: 4px;
      }
    }
    p {
      position: relative;
      width: 100%;
      text-align: left;
      text-indent: 50px;
      margin-bottom: 20px;
      span {
        font-size: 14px;
        height: 24px;
        padding-top: 10px;
        line-height:14px;
        color: #c0c0c0;
        margin-right: 18px;
      }
    }
    .status {
      position: relative;
      width: 100%;
      height: 36px;
      line-height: 36px;
      text-align: center;
      font-size: 14px;
      background: #373737;
    }
    .has {
      color: #F5BA53;
    }
    .not {
      color: #C0C0C0;
    }
  }
  .funds-wrap:hover {
    background: #373737;
  }
  .has-update:before {
    content: '';
    display: block;
    position: absolute;
    top: 20px;
    right: 20px;
    width: 10px;
    height: 10px;
    background: red;
    border: 1px solid red;
    -webkit-border-radius:50%;
    -moz-border-radius:50%;
    border-radius:50%;
  }

  @media only screen and (max-width: 1680px) {
    .funds-wrap {
      max-width: 33.3%;
      min-width: 33.3%;
    }
  }
</style>
