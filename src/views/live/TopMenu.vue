<template>
  <div class="top-conten">
    <div class="live-info">
      <div class="logo"></div>
      <h4 class="title">实时解盘</h4>
    </div>
    <div class="button-wrap fr">
      <switch-group :switchId="systemCode" :config="[{label:'声音提示', name: `${systemCode}_audio`}, {label:'桌面提示', name: `${systemCode}_notify`}]">
      </switch-group>
    </div>
  </div>
</template>

<script>
  import SwitchGroup from '../../components/base/SwitchGroup';

  export default {
    name: 'topmenu',
    data() {
      return {};
    },
    props: {
      systemCode: {
        type: [Number, String],
        default: null,
      },
    },
    components: {
      SwitchGroup,
    },
    methods: {},
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
    height: 70px;
    background: #2b2b2b;
    .live-info{
      float: left;
      width: 50%;
      position: relative;
      top:50%;
      transform: translateY(-50%);
      .logo {
        width: 30px;
        height: 30px;
        background: url(../../assets/image/live.png) no-repeat left center;
        background-size: cover;
        margin:0 20px;
        float: left;
      }
      .title {
        float: left;
        height: 30px;
        line-height:30px;
        margin-right: 20px;
        font-size: 20px;
        font-weight: 300;
      }
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
      right: 20px;
      top:50%;
      transform: translateY(-50%);
    }
  }
</style>
