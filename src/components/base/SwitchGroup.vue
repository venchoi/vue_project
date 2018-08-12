<template>
  <div class="switch-group">
    <div class="switch-box" v-for="item in config" @click="click(item)">
      <span>{{item.label}}</span>
      <div class="button-box">
        <div class="button" :class="{'full': buttonConfig[item.name]}">
          <div class="circle"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    baseUtil,
  } from '../../util';
  import {
    switchGroup,
  } from '../../model/storage';

  function defaultConfigMarker(config) {
    const result = {};
    baseUtil.each(config, (item) => {
      result[item.name] = true;
    });
    return result;
  }

  export default {
    name: 'SwitchGroup',
    data() {
      return {
        buttonConfig: {},
      };
    },
    props: {
      switchId: {
        type: String,
        required: true,
      },
      config: {
        type: Array,
        default() {
          return {};
        },
      },
    },
    created() {
      this.init();
    },
    watch: {
      switchId() {
        this.init();
      },
    },
    methods: {
      /**
       * 点击按钮，toggle推送开关
       */
      click(item) {
        const name = item.name;
        const id = this.switchId;
        // 1、获取所有推送开关设置并暂存在switchGroupConfig中
        const switchGroupConfig = switchGroup.read();
        // 2、将该页面的推送开关的值取反并保存在switchGroupConfig
        this.buttonConfig[name] = !this.buttonConfig[name];
        switchGroupConfig[id] = this.buttonConfig;
        // 3、将switchGroupConfig写入storage
        switchGroup.write(switchGroupConfig);
      },
      init() {
        const id = this.switchId;
        const switchGroupConfig = switchGroup.read();
        if (!switchGroupConfig[id]) {
          switchGroupConfig[id] = defaultConfigMarker(this.config);
          switchGroup.write(switchGroupConfig);
        }
        this.buttonConfig = switchGroupConfig[id];
      },
    },
  };
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/sass/static";
  .switch-group {
    width: 100%;
    height: 100%;
    display: flex;
    .switch-box {
      position: relative;
      display: flex;
      margin-left:20px;
      align-items: center;
      > span {
        font-size:12px;
        color: #C0C0C0;
        margin-right: 5px;
      }
      .button-box {
        position: relative;
        width: 40px;
        height: 20px;
        border-radius:20px;
        overflow: hidden;
        background: $G3;
        cursor: pointer;
        *{
          padding: 0;
          margin: 0;
        }
        .button {
          position: relative;
          width:50%;
          height:100%;
          background: #3370fe;
          border-radius:20px;
          transition: all 300ms;
          .circle {
            position: absolute;
            top:0;
            right:0;
            width:20px;
            height:20px;
            border-radius:50%;
            background: #fff;
          }
        }
        .full {
          width: 100%;
        }
      }
    }
  }

</style>
