<template>
  <div class="body-content">
    <div class="top-content">
      <div class="tag fl"><span>{{pageTitle}}</span></div>
      <div class="tip fr"><span>*本页面内容仅供参考，据此操作风险自负</span></div>
    </div>
    <div class="center-content">
      <div class="center-left">
        <div class="record-header">{{leftTitle}}</div>
          <div class="list" @scroll="onScroll()" ref="scroll-box">
            <ul class="records-list" v-if="recordsList">
              <li class="record-info-block" v-for="(item, key) in recordsList" ref="'record'+ key" @click="clickItem(item)" :class="{active: item[1] === selectedItem}">
                <p class="date-time">{{item[0]}}</p>
                <div class="records">
                  <div v-for="(record, index) in item[1]" :key="index">
                    <div class="record">
                      <span class="time">{{record.time}}</span>
                      <span class="title" v-html="record.title"></span>
                    </div>
                  </div>
                </div>
              </li>
              <div v-show="loading" class="loading">
                <div class="loader"></div>
                <div class="txt">正在加载中&nbsp;·&nbsp;·&nbsp;·&nbsp;</div>
              </div>
              <div class="no-more" v-show="noMore">已无更多</div>
            </ul>
          </div>
      </div>
      <div class="center-right">
        <div class="right-title">
          <div class="button-wrap">
            <switch-group :switchId="system_code"
                          :config="[{label:'桌面通知', name:`${system_code}_notify`},{label:'声音提示', name:`${system_code}_audio`}]"></switch-group>
          </div>
        </div>
        <div class="record-content">
          <div class="date-title"  v-text="selectedKey+rightTitle"></div>
          <div class="records">
            <div class="view-wrap">
              <div class="view-area">
                <div class="record" v-for="record in selectedItem">
                  <span class="time">{{record.time}}</span>
                  <span class="title" v-html="record.title"></span>
                  <br/>
                  <span class="content" v-html="record.content"></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import http from '../../plugins/http/http';
  import {
    columnSocket,
    EVENT,
  } from '../../plugins/YCJWebSocket/YCJWebSocket';
  import { baseUtil } from '../../util';
  import SwitchGroup from '../../components/base/SwitchGroup';

  export default {
    data() {
      return {
//        od: {}, // 原始数据
        recordsList: [],
        system_code: 'trading',
        lastedRecord: {},
        open: true, // 请求节流
        loading: false,
        noMore: false,
        param: {},
        selectedItem: {},
        selectedKey: '',
        lastId: '',
        tempList: [],
        res: [],
        arr: [],
        initFlag: false,
        lastedParam: {},
        pageTitle: '',
        leftTitle: '操作记录',
        rightTitle: '操作日志',
      };
    },
    created() {
      const vm = this;
      vm.init();
    },
    computed: {
      ...mapState({
        getToken: state => baseUtil.copy(state.moduleUser.token),
        getUid: state => baseUtil.copy(state.moduleUser.uid),
        getConfig: state => baseUtil.copy(state.menuConfig),
      }),
    },
    watch: {
      od() {
        const vm = this;
        baseUtil.each(this.od, (item, key) => {
          vm.res.push(key);
          baseUtil.each(item, (order) => {
            vm.arr.push(order);
          });
          vm.res.push(vm.arr);
          vm.recordsList.push(vm.res);
          vm.arr = [];
          vm.res = [];
        });
//        this.recordsList = this.od;
      },
      recordsList() {},
      selectedItem() {},
      selectedKey() {},
    },
    methods: {
      /**
       * 获取历史操作记录和日志
       * @param {number} uid - 用户id
       * @param {string} token - 用户token
       * @param {string} platform_id - 平台id
       * @param {number} id - 记录id，第一次为0，后面为上次最小记录id
       * @param {function} callback - 处理response的成功回调方法
       * */
      getRecordsList(param, callback) {
        const vm = this;
        const httpList = http.apiList;
        const httpData = {
          ...param,
        };
        http.api[httpList.GET_RECORDS_LIST]({
          success(response) {
            if (response) {
              // 将对象转换成三维数组
              baseUtil.each(response, (item, key) => {
                vm.res.push(key);
                baseUtil.each(item, (order) => {
                  vm.arr.push(order);
                });
                vm.res.push(vm.arr);
                vm.recordsList.push(vm.res);
                vm.arr = [];
                vm.res = [];
              });
              // 获取最后返回的数据的最后一天的最后一个记录的id
              // 最后一天
              const lastItem = vm.recordsList[vm.recordsList.length - 1];
              const lastItemRecords = lastItem[1];
//              vm.lastId = lastItemRecords.pk;
              vm.param.id = baseUtil.getLast(lastItemRecords).pk;
              if (vm.initFlag) {
                vm.selectedKey = vm.recordsList[0][0];
                vm.selectedItem = vm.recordsList[0][1];
                vm.initFlag = false;
              }
              vm.open = true;
              if (response.length === 0) {
                vm.open = false;
                vm.noMore = true;
                vm.loading = false;
              }
            }
            if (typeof callback === 'function') {
              callback(response);
            }
          },
          param: httpData,
        });
      },
      onScroll() {
        const vm = this;
        const scrollHeight = vm.$refs['scroll-box'].scrollHeight;
        const scrollTop = vm.$refs['scroll-box'].scrollTop;
        const clientHeight = vm.$refs['scroll-box'].clientHeight;
        // 接近底部加载更多
        if (clientHeight + scrollTop >= 0.9 * scrollHeight && vm.open) {
          vm.loading = true;
          vm.open = false;
          vm.getRecordsList(vm.param, () => {});
        }
      },
      clickItem(item) {
        const vm = this;
        vm.selectedItem = item[1];
        vm.selectedKey = item[0];
      },
      getLastedRecord(lastedParam) {
        const vm = this;
        let flag = false;
        const httpList = http.apiList;
        http.api[httpList.GET_LASTED_RECORD]({
          param: lastedParam,
          success(response) {
            baseUtil.each(response, (value, key) => {
              const recordType = value[0].type ? value[0].type : undefined;
              baseUtil.each(vm.recordsList, (item) => {
                if (item[0] === key && recordType === '1') {
                  item[1].unshift(value[0]);
                  flag = true;
                }
              });
              // 如果不存在，则插入整个返回的对象
              if (!flag && recordType === '1') {
                vm.res.push(key);
                vm.res.push(value);
                vm.recordsList.unshift(vm.res);
                vm.res = [];
              }
            });
          },
        });
      },
      init() {
        const vm = this;
        vm.initFlag = true;
        vm.param = {
          uid: vm.getUid,
          token: vm.getToken,
          id: 0,
        };
        // 获取历史操作记录和日志
        vm.getRecordsList(vm.param, () => {});
        if (columnSocket) {
          columnSocket.on(EVENT.FIRMTRACKING, (data) => {
            vm.lastedParam.id = data.id;
            vm.lastedParam.token = vm.getToken;
            vm.lastedParam.uid = vm.getUid;
            vm.getLastedRecord(vm.lastedParam);
          });
        }
        baseUtil.each(this.getConfig, (item) => {
          if (item.system_code === this.$route.path.replace(/\//g, '')) {
            vm.pageTitle = item.name;
          }
        });
        if (vm.pageTitle === '视频解盘') {
          vm.leftTitle = '解盘回放';
          vm.rightTitle = '视频解盘';
        } else if (vm.pageTitle === '教学视频') {
          vm.leftTitle = '回放目录';
          vm.rightTitle = '教学视频';
        }
      },
    },
    components: {
      SwitchGroup,
    },
  };
</script>

<style lang="scss" rel="stylesheet/scss">
  * {
    padding: 0;
    margin: 0;
  }
  .fr {
    float: right;
  }
  .fl {
    float: left;
  }
  .body-content {
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: flex-start;
    width: 100%;
    height: 100%;
    .top-content {
      padding-top: 9px;
      border-bottom: solid 1px rgba(33, 33, 33, 1);
      width: 100%;
      .tag {
        border-bottom: 46px solid rgba(77, 77, 77, 1);
        border-right: 21px solid transparent;
        border-radius: 0 20px 0 0;
        width: 119px;
        height: 0;
        font-size: 16px;
        line-height: 36px;
        letter-spacing: 0;
        color: #fff;
        text-align: center;
      }
      .tip {
        width: 250px;
        height: 46px; /* 与tag同高（tag的border的高度） */
        padding: 24px 20px 10px 0;
        span {
          letter-spacing: 0;
          color: #838383;
        }
      }
    }
    .center-content {
      display: flex;
      flex-flow: row nowrap;
      justify-content: flex-start;
      align-items: flex-start;
      width: 100%;
      height: 100%;
      .center-left {
        border-right: solid 1px rgba(36, 36, 36, 1);
        height: 100%;
        min-width: 28%;
        max-width: 28%;
        .record-header {
          height: 56px;
          text-align: center;
          vertical-align: middle;
          background-color: rgba(55, 55, 55, 1);
          font-size: 20px;
          line-height: 56px;
          letter-spacing: 0.5px;
          color: #fff;
        }
        .list {
          width: 100%;
          height: calc(100% - 56px);
          overflow-y: scroll;
          vertical-align: middle;
          background-color: rgba(43, 43, 43, 1);
          .records-list {
            float: left;
            width: 100%;
            height: 100%;
            .record-info-block {
              display: flex;
              flex-flow: row nowrap;
              justify-content: center;
              width: 100%;
              border-bottom: solid 1px rgba(36, 36, 36, 1);
              overflow: hidden;
              cursor: pointer;
              &.active {
                background-color: rgba(36, 36, 36, 1);
              }
              .date-time {
                margin: auto 0 auto 0;
                padding-left: 25px;
                padding-right: 25px;
                max-width: 121px;
                min-width: 121px;
                font-size: 14px;
                line-height: 1;
                text-align: center;
                letter-spacing: 0.4px;
                color: #fff;
              }
              .records {
                padding: 10px 0 10px 0;
                margin-right: 30px;
                max-width: calc(100% - 140px);
                min-width: calc(100% - 140px);
                overflow-x: hidden;
                border-left: solid 1px rgba(36, 36, 36, 1);
                &:first-child {
                  position: relative;
                }
                .record {
                  display: flex;
                  flex-flow: row nowrap;
                  justify-content: flex-start;
                  align-items: flex-start;
                  width: 100%;
                  .time {
                    margin-top: 12px;
                    margin-bottom: 12px;
                    padding-left: 19px;
                    width: 54px;
                    line-height: 150%;
                    font-size: 14px;
                    vertical-align: middle;
                    letter-spacing: 0.4px;
                    color: #fff;
                  }
                  .title {
                    margin-top: 12px;
                    margin-bottom: 12px;
                    padding-left: 30px;
                    line-height: 150%;
                    overflow: hidden;
                    font-size: 14px;
                    vertical-align: middle;
                    letter-spacing: 0.4px;
                    color: #c0c0c0;
                    a{
                      color: #ffcc66!important;
                      text-decoration: none!important;
                      font-size: 14px!important;
                      b{
                        u{
                          text-decoration: none!important;
                          font-size: 14px!important;
                        }
                      }
                      span{
                        color: #ffcc66!important;
                        text-decoration: none!important;
                      }
                    }
                  }
                }
              }
            }
            .loading, .no-more {
              float: left;
              width: 100%;
              height: 54px;
              line-height: 54px;
              text-align: center;
              position: relative;
              .txt{
                position: absolute;
                left: 60%;
                top: 50%;
                transform: translate(-50%, -50%);
              }
            }
          }
        }
      }
      .center-right {
        height: 100%;
        min-width: 72%;
        max-width: 72%;
        .right-title {
          display: flex;
          justify-content: flex-end;
          width: 100%;
          background-color: rgba(55, 55, 55, 1);
          .button-wrap {
            margin-right: 20px;
            height: 56px;
          }
        }
        .record-content {
          display: flex;
          flex-flow: column nowrap;
          justify-content: flex-start;
          align-items: flex-start;
          margin-top: 30px;
          margin-bottom: 28px;
          width: 100%;
          height: calc(100% - 92px);
          overflow-y: scroll;
          .date-title {
            margin: auto;
            height: 95px;
            width: 50%;
            font-size: 36px;
            text-align: center;
            line-height: 95px;
            color:#c0c0c0;
          }
          .records {
            padding: 0 60px 40px 60px;
            width: 100%;
            height: calc(100% - 95px);
            .view-wrap {
              padding: 19px;
              height: 100%;
              width: 100%;
              .view-area {
                height: 100%;
                width: 100%;
                .record {
                  .time, .title {
                    font-size: 14px;
                    line-height: 24px;
                    letter-spacing: 0.4px;
                    color: #f5ba53;
                    a{
                      color: #ffcc66!important;
                      text-decoration: none!important;
                      font-size: 14px!important;
                      b{
                        u{
                          text-decoration: none!important;
                          font-size: 14px!important;
                        }
                      }
                      span{
                        color: #ffcc66!important;
                        text-decoration: none!important;
                      }
                    }
                  }
                  .content {
                    color:#c0c0c0;
                    font-size: 14px;
                    a{
                      color: #ffcc66!important;
                      text-decoration: none!important;
                      font-size: 14px!important;
                      b{
                        u{
                          text-decoration: none!important;
                          font-size: 14px!important;
                        }
                      }
                      span{
                        color: #ffcc66!important;
                        text-decoration: none!important;
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
</style>
