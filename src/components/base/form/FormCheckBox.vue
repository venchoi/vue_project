<template>
  <div class="checkbox-group" >
    <input type="checkbox" :id="name" v-model="boxStatus">
    <label :for="name" v-text="label" :class="isChecked"></label>
  </div>
</template>

<script>
  import {
    baseUtil,
  } from '../../../util';

  export default {
    name: 'AutoLogin',
    data() {
      return {
        binding: null,
        boxStatus: true,
      };
    },
    props: {
      name: String,
      label: String,
      type: {
        type: [String, Function], // (postData)=>{}
        default: 'mark',
      },
    },
    computed: {
      isChecked() {
        return this.boxStatus ? 'checked' : 'unchecked';
      },
    },
    created() {
      const storageData = this.$storage.read(this.name);
      this.binding = this.$parent.postData;
      if (storageData) {
        this.$parent.$emit('updatePostData', storageData.data);
        this.boxStatus = storageData.status;
      }
    },
    watch: {
      boxStatus() {
        if (!this.boxStatus) {
          this.$storage.application.save(this.name, {
            status: this.boxStatus,
          });
        } else {
          this.boxStatusHandler();
        }
      },
      binding: {
        handler() {
          if (this.boxStatus) {
            this.boxStatusHandler();
          }
        },
        deep: true,
      },
    },
    methods: {
      boxStatusHandler() {
        let data;
        if (typeof this.type === 'function') {
          data = this.type(baseUtil.copy(this.binding));
        } else if (this.type === 'mark') {
          data = this.binding;
        }
        this.$storage.application.save(this.name, {
          status: this.boxStatus,
          data,
        });
      },
    },
  };
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../../assets/sass/static";
  .checkbox-group {
    width: 100%;
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
    .checked:after{
      display: block;
    }
    .unchecked:after{
      display: none;
    }
  }
</style>
