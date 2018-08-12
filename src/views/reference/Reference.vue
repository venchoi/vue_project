<template>
  <div class="news-page-wrap">
    <div class="top">
      <div class="icon"></div>
      <p>{{currentTime}}</p>
    </div>
    <div class="content">
      <div class="left">
        <left-list></left-list>
      </div>
      <div class="right">
        <right-tick></right-tick>
      </div>
    </div>
  </div>
</template>

<script>
import format from '../../util/format';
import LeftList from './LeftList';
import RightTick from './RightTIck';

export default {
  name: 'reference',
  data() {
    return {
      currentTime: '',
      timeLoop: true,
    };
  },
  components: {
    LeftList,
    RightTick,
  },
  methods: {
    transform() {
      const vm = this;
      if (!vm.timeLoop) {
        return;
      }
      vm.currentTime = format.date(new Date(), 'MM月dd日 hh:mm:ss');
      setTimeout(vm.transform, 1000);
    },
  },
  computed: {
  },
  created() {
    const vm = this;
    vm.timeLoop = true;
    vm.transform();
  },
  activated() {
    this.timeLoop = true;
    this.transform();
  },
  deactivated() {
    this.timeLoop = false;
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
  .news-page-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
    .top {
      position: relative;
      flex:1;
      width: 100%;
      max-height: 40px;
      min-height:40px;
      p {
        position: relative;
        width:100%;
        height: 40px;
        line-height: 40px;
        font-size: 14px;
        color: #c0c0c0;
        text-align: left;
        font-weight: bold;
        padding-left: 38px;
      }
      .icon {
        position: absolute;
        top: 11px;
        left: 10px;
        width: 18px;
        height: 18px;
        background: url("../../assets/image/time.png") no-repeat center center;
        background-size:cover;
      }
    }
    .content {
      position: relative;
      flex:1;
      width:100%;
      max-height:100%;
      display: flex;
      flex-flow:row nowrap;
      justify-content: center;
      align-items: center;
      .left {
        position: relative;
        flex: 1;
        height:100%;
        max-width: 64%;
        min-width:64%;
        .news-page {
          position: relative;
          width: 100%;
          padding-left:10px;
          height: 100%;
          background: $background;
          overflow-y: auto;
          .new-list {
            width: 100%;
            min-height: 100%;
            margin: 0 auto;
            background: $G4;
            >ul>li {
              position: relative;
              display: block;
              width: 100%;
              border-bottom: 1px solid $G3;
              padding: 16px 20px 12px 0;
              .new-time {
                position: absolute;
                top:0;
                left:0;
                bottom:0;
                display: block;
                width: 120px;
                min-width: 90px;
                background: #373737;
                span {
                  position: absolute;
                  top:50%;
                  left:0;
                  margin-top: -7px;
                  display: block;
                  width: 100%;
                  height: 14px;
                  line-height: 14px;
                  font-size: 14px;
                  color: #c0c0c0;
                  text-align: center;
                }
              }
              .new-info-block {
                .new-text {
                  position: relative;
                  width:100%;
                  padding-left:140px;
                  overflow: hidden;
                  color: #c0c0c0;
                  line-height: 22px;
                  font-size: 14px;
                  font-weight:normal;
                  .new-title {
                    font-weight: bold;
                    cursor: pointer;
                  }
                  .red {
                    color: #f03426;
                  }
                  .new-title:hover {
                    text-decoration: underline;
                  }
                  .fist-news {
                    position: relative;
                    top: -2px;
                    display: inline-block;
                    height: 18px;
                    line-height: 18px;
                    background: red;
                    padding: 0 2px;
                  }
                }
              }
              .stock-info-block {
                position: relative;
                width: 100%;
                margin-top: 10px;
                padding-left: 140px;
                .relative-stock {
                  display: inline-block;
                  float: left;
                  height: 20px;
                  line-height: 20px;
                  font-size: 14px;
                  min-width: 60px;
                  text-align: left;
                  color: #bebebe;
                }
                .stock-list {
                  overflow: hidden;
                  .stock-item {
                    position: relative;
                    display: inline-block;
                    width: 20%;
                    height: 20px;
                    line-height: 20px;
                    padding-left:10px;
                    margin: 0 0 4px 0;
                    float: left;
                    cursor: pointer;
                    .stock-name {
                      position: relative;
                      display: inline-block;
                      height: 20px;
                      line-height: 20px;
                      font-size: 12px;
                      color: #ffcc66;
                    }
                    .stock-change {
                      position: absolute;
                      top:0;
                      right: 10px;
                      display: inline-block;
                      font-size: 12px;
                      height: 20px;
                      line-height: 20px;
                      color: green;
                    }
                    .des {
                      color: red;
                    }
                  }
                  .stock-item:hover .stock-name {
                    text-decoration: underline;
                  }
                  .stock-item:after {
                    content: '';
                    position: absolute;
                    right: 0;
                    top: 0;
                    width: 1px;
                    height: 20px;
                    background: $G2;
                  }
                  .stock-item:last-child:after {
                    content: '';
                    background: $G4;
                  }
                  .no-right-border:after {
                    content: '';
                    background: $G4;
                  }
                  .no-left-padding {
                    padding-left:0;
                  }
                }
              }
            }
            ul li:last-child {
              border-bottom: 1px solid $G4;
            }
          }
        }
      }
      .right {
        position: relative;
        flex: 1;
        height:100%;
        max-width: 36%;
        min-width:36%;
        display: flex;
        flex-flow: column nowrap;
        justify-content: center;
      }
    }
  }
  @media only screen and (max-width: 1780px) {
    .stock-item {
      width: 25% !important;
    }
  }
  @media only screen and (max-width: 1500px) {
    .stock-item {
      width: 33.3% !important;
    }
  }
</style>
