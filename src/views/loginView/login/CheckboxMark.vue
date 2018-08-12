<template>
  <div class="checkbox-mark" :class="config.className" >
    <input type="checkbox" :id="config.name" v-model="defaultChecked">
    <label :class="{ en : defaultChecked, un : !defaultChecked }" @click="switchBox" :for="config.name">{{config.text}}</label>
  </div>
</template>

<script>

  /*
  * @param  {String} className  自定义类名
  * @param  {String} name  储存键名（唯一）
  * @param  {Boolean} defaultChecked  CheckBox初始化状态
  * @param  {String} text  label文字描述
  * */
  export default {
    name: 'CheckboxMark',
    data() {
      return {
        defaultChecked: this.config.defaultChecked,
      };
    },
    props: {
      config: {
        type: Object,
        required: true,
      },
    },
    watch: {
      defaultChecked() {
        const vm = this;
        vm.$storage.application.save(vm.config.name, vm.defaultChecked);
      },
    },
    mounted() {
      const vm = this;
      const mark = this.$storage.read(vm.config.name);
      if (mark === null) {
        vm.$storage.application.save(vm.config.name, vm.defaultChecked);
      } else {
        vm.defaultChecked = mark;
      }
    },
    methods: {
      switchBox() {
        this.defaultChecked = this.defaultChecked ? false : true;
      },
    },
  };
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../../assets/sass/static";
  .checkbox-mark {
    margin: 0 auto 18px;
    text-align: left;
    input {
      padding: 0;
      margin: 0;
      vertical-align: middle;
      display: none;
      outline: 0;
    }
    label{
      position: relative;
      height: 16px;
      font-size: 12px;
      line-height: 18px;
      float: left;
      &:before{
        position: absolute;
        top:50%;
        left: -20px;
        content: '';
        display: block;
        width:12px;
        height:12px;
        margin-top: -6px;
        border: 1px solid #223D80;
        box-sizing: content-box;
      }
      &:after{
        position: absolute;
        top:50%;
        left: -17px;
        content: '';
        display: none;
        width:8px;
        height:8px;
        margin-top: -3px;
        background: #223D80;
      }
    }
    .en:after{
        display: block;
    }
    .un:after{
      display: none;
    }
  }
</style>
