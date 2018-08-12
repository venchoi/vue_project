<template>
  <div class="tendency-top">
    <div class="logo fl">
      <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAAH7+Yj7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA+tpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDE0IDc5LjE1Njc5NywgMjAxNC8wOC8yMC0wOTo1MzowMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxNCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDE3LTA5LTI2VDEwOjEyOjA0KzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAxNy0wOS0yN1QxMDowMDoxNiswODowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAxNy0wOS0yN1QxMDowMDoxNiswODowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OUI4QjA0NUNBMzI3MTFFNzgxMDA4QUU0RTk2RDEzNEYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OUI4QjA0NURBMzI3MTFFNzgxMDA4QUU0RTk2RDEzNEYiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RS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"/>
      <span class="title">
        大势
      </span>
    </div>
    <!-- 风险提示 -->
    <div class="tip fl"><span>*本页面内容仅供参考，据此操作风险自负</span></div>
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
    .tip {
      margin-top: 30px;
      span {
        letter-spacing: 0;
        color: #838383;
      }
    }
    .button-wrap{
      float: right;
      margin-top: 23px;
      margin-right: 20px;
    }
  }
</style>
