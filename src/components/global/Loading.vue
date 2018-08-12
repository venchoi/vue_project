<template>
  <transition name="fade-scale">
    <div v-if="isShow" id="content" class="fullwidth">
      <div class="bar">
        <span class="expand" :style="{width : `${loadingPercent}%`}"></span>
        <span class="num" v-text="`${loadingPercent}%`"></span>
      </div>
    </div>
  </transition>
</template>
<script>
  import {
    baseUtil,
  } from '../../util';

  export default {
    name: 'loading',
    data() {
      return {
        timer: null,
        isShow: true,
        finishCount: 0, // 已完成任务计数
        loadingPercent: 0, // 显示的百分比
        taskList: [], // 注册任务(函数/方法)列表
      };
    },
    props: {

    },
    computed: {
      /**
       * finishPercent:计算属性，完成百分比，由完成任务数和总任务数计算得到
       */
      finishPercent() {
        if (!this.finishCount && !this.taskList.length) {
          return 0;
        }
        return parseInt((this.finishCount / this.taskList.length) * 100, 10);
      },
    },
    watch: {
      /**
       * 监控完成百分比，根据完成百分比修改loading的百分数
       */
      finishPercent() {
        const unit = this.finishPercent - this.loadingPercent;
        if (this.timer) {
          clearInterval(this.timer);
        }
        this.timer = setInterval(() => {
          if (this.loadingPercent >= this.finishPercent) {
            this.loadingPercent = this.finishPercent;
            clearInterval(this.timer);
            if (this.taskList.length === this.finishCount) {
              setTimeout(() => {
                this.isShow = false;
                this.$emit('finish');
                this.taskList = [];
              }, 200);
            }
          } else {
            this.loadingPercent += unit / 10;
            this.loadingPercent = parseFloat(this.loadingPercent.toFixed(2));
          }
        }, 50);
      },

    },
    methods: {
      /**
       * 注册任务
       * fn - 方法
       * 添加方法到taskList中。
       */
      registerTasks(fn) {
        if (typeof fn === 'function') {
          this.taskList.push(fn);
        }
      },
      /**
       * 同步寄存器
       * 添加方法到taskList中
       */
      synRegister(fn) {
        if (typeof fn === 'function') {
          this.taskList.push(fn);
          fn();
        }
      },
      /**
       * 遍历taskList,即逐个完成任务，完成后一项后将finishCount加1
       */
      launch() {
        baseUtil.each(this.taskList, (task) => {
          task(this.done);
        });
      },
      /**
       * 完成任务计数
       */
      done() {
        if (this.finishCount >= this.taskList.length) {
          return;
        }
        this.finishCount += 1;
      },
      clear() {
        this.finishCount = 0;
        this.loadingPercent = 0;
        this.taskList = [];
      },
    },
  };
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  #content {
    position: fixed;
    left:0;
    top:0;
    right: 0;
    bottom:0;
    z-index: 1000;
    box-sizing: border-box;
    background:#333;
    .num{
      position: absolute;
      display: block;
      left:50%;
      top:50%;
      color:#2187e7;
      font-size: 24px;
      margin-left:-24px;
      transition: 0.5s linear;
    }
  }
  .fullwidth {
    .expand {
      width:100%;
      height:10px;
      position:absolute;
      box-shadow:0 0 10px 1px rgba(0,198,255,0.7);
      transition: width .1s linear;
    }
    .bar{
      position: relative;
      margin: auto;
      height: 100%;
      width: 50%;
    }
  }
  .expand{
    top:50%;
    margin-top: -50px;
    background-color: #2187e7;
    background-image: repeating-linear-gradient(-45deg, #477eff, #477eff 30px, #75BEFF 30px, #75BEFF 60px);
    background-size: 600px 100%;
    animation: barberpole 6s linear infinite;
    border-radius: 10px;
  }
  @-webkit-keyframes barberpole {
    0% {
      background-position: 0 0;
    }
    100% {
      background-position: 600px 0;
    }
  }
</style>

