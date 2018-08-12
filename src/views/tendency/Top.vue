<template>
  <div class="tendency-top">
    <div class="logo">
      <img src="http://aliyun.yuncaijing.com/upload/2017-09-15/59bb9fa6be40f.png"/>
      <span class="title">
        大势
      </span>
    </div>
    <div class="button-wrap">
      <switch-group switchId="tendency" :config="[{label:'声音提示', name: 'tendency_audio'}, {label:'桌面提示', name: 'tendency_notify'}]"></switch-group>
    </div>
  </div>
</template>

<script>
  import SwitchGroup from '../../components/base/SwitchGroup';

  export default {
    name: 'TendencyTop',
    data() {
      return {};
    },
    components: {
      SwitchGroup,
    },
    methods: {},
  };
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .tendency-top{
    height: 100%;
    width: 100%;
    .logo{
      display: inline-block;
      height: 100%;
      width: 150px;
      line-height: 70px;
      >img{
        float: left;
        margin: 15px 20px 0 20px;
        width: 40px;
        height: 40px;
      }
      .title{
        float: left;
        font-size: 20px;
        color: #c0c0c0;
      }
    }
    .button-wrap{
      float: right;
      margin-top: 23px;
      margin-right: 20px;
    }
  }
</style>
