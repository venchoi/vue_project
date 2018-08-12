<template>
  <div class="top-conten">
    <div class="return-back-page fl" @click="goBack()"></div>
    <!--股票池logo-->
    <img class="logo fl" :src="topData.topImg" alt="股票服务">
    <!--股票池名称-->
    <p class="title fl">{{topData.topName}}</p>
    <!--使用说明，点击后广播事件，在父组件调用弹出层-->
    <div class="explain fl" @click="clickExplain">使用说明</div>
    <!-- 风险提示 -->
    <div class="tip fl"><span>*本页面内容仅供参考，据此操作风险自负</span></div>
    <!--续费，点击后广播事件，在父组件打开对应商城-->
    <div class="renew-button fr" @click="clickPay">续费</div>
    <!--会员股票池服务有效期-->
    <p class="date fr">有效期至{{topData.topValidity}}</p>
    <!--绑定每个systemCode的开关控制，保存到localStorage用于浏览器通知提示-->
    <div class="button-wrap fr">
      <switch-group :switchId="systemCode" :config="[{label:'声音提示', name: `${systemCode}_audio`}, {label:'桌面提示', name: `${systemCode}_notify`}]"></switch-group>
    </div>
  </div>
</template>

<script>
import SwitchGroup from '../../components/base/SwitchGroup';

export default {
  name: 'TopMenu',
  data() {
    return {
    };
  },
  props: {
    systemCode: {
      type: [Number, String],
      default: null,
    },
    topData: Object,
  },
  components: {
    SwitchGroup,
  },
  methods: {
    clickPay() {
      this.$emit('clickPay');
    },
    goBack() {
      this.$router.go(-1);
    },
    clickExplain() {
      this.$emit('clickExplain');
    },
  },
  computed: {
  },
  created() {
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
  .top-conten {
    position: relative;
    width: 100%;
    height: 100%;
    padding: 20px;
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
      margin-right:10px;
    }
    .title {
      height: 30px;
      line-height:30px;
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
    .tip {
      width: 250px;
      height: 30px; /* 与tag同高（tag的border的高度） */
      padding: 15px 0 3px 20px;
      line-height: 12px;
      span {
        letter-spacing: 0;
        color: #838383;
      }
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
</style>
