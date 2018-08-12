<template>
  <div class="notify-list" v-show="true">
    <transition-group name="fade">
      <div class="item" v-for="(item, index) in noticeList" v-if="item.show" :key="index">
        <div class="close-bar">
          <span class="close" @click="hide(index)">
            <span class="thick">
            </span>
          </span>
        </div>
        <div class="logo">
          <img v-if="item.logo" :src="item.logo" >
        </div>
        <div class="body">
          <p class="title" v-text="item.title"></p>
          <p class="desc" v-text="item.content"></p>
        </div>
        <div class="host">
          {{hostname}}
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script>
  import {
    mapState,
  } from 'vuex';

  export default {
    name: 'analognotice',
    data() {
      return {
        hostname: window.location.hostname,
      };
    },
    computed: {
      ...mapState({
        noticeList: state => state.noticeList,
      }),
    },
    methods: {
      hide(index) {
        this.noticeList[index].show = false;
      },
    },
    components: {},
  };
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/sass/static";
  .notify-list{
    width: 360px;
    min-height:0;
    background-color: transparent;
    position: fixed;
    right: 14px;
    bottom: 28px;
    z-index:1;
    .item{
      min-height: 80px;
      width: 100%;
      background-color: #fff;
      color: rgb(30,30,30);
      margin-bottom: 8px;
      overflow: hidden;
      font-size: 14px;
      position: relative;
      .logo{
        width: 80px;
        height: 80px;
        float: left;
        >img{
          display: block;
          width: 55px;
          margin:0 auto;
          position: relative;
          top:50%;
          transform: translateY(-54%);
        }
      }
      .body{
        width: 280px;
        float: left;
        padding:10px;
        >p{
          line-height: 16px;
          overflow : hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          word-break: break-all;
        }
        .title{
          margin-bottom: 10px;
          -webkit-line-clamp: 2;
          padding-right: 30px;
        }
        .desc{
          -webkit-line-clamp: 5;
          padding-right: 15px;
        }
      }
      .host{
        width: 280px;
        float: right;
        padding:0 0 5px 10px;
        color: rgb(127,127,127);
      }
      .close-bar{
        color: rgb(45,45,45);
        height: 0;
        background: #fff;
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
        .close{
          position: absolute;
          top:7px;
          right: 10px;
          transition: transform 0.3s;
          width: 10px;
          height: 10px;
          cursor: pointer;
          .thick {
            width: 10px;
            height: 10px;
            display: block;
            position: relative;
            &:before, &:after{
              position: absolute;
              height: 4px;
              margin-top: -2px;
              content: '';
              background: rgb(45,45,45);
            }
            &:before{
              transform: rotate(45deg);
              height: 2px;
              width: 100%;
              top: 50%;
              left: 0;
              margin-top: -1px;
            }
            &:after{
              transform: rotate(-45deg);
              height: 2px;
              width: 100%;
              top: 50%;
              left: 0;
              margin-top: -1px;
            }
          }
        }
      }
    }
  }
  .fade-enter-active,.fade-leave-active{
    transition: all .3s ease-out;
  }
  /* 进入开始 */
  .fade-enter{
    //transform: scale(1);
    opacity: 1;
  }
  /* 出去终点 */
  .fade-leave-active{
    //transform: scale(0.5);
    opacity: 0;
  }
</style>
