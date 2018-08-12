import {
  MENU_CONFIG_SET,
} from '../mutations/mutationType';
import {
  stockActions,
} from '../actionsType';
import http from '../../../plugins/http/http';
import {
  columnSocket,
  EVENT,
} from '../../../plugins/YCJWebSocket/YCJWebSocket';
import { ycjVoice } from '../../../plugins/base/audio';
import notifyMsg from '../../../plugins/base/notify';
import baseUtil from '../../../util/baseUtil';
import * as storage from '../../../model/storage';

const apiList = http.apiList;
/**
 * 大势交易点信息弹框控制信息：以原记录中最大的时间为依据
 * 通过getLatestTime计算得到；
 * 注意：在实时解盘中，不可以用时间判断，因为实时解盘中的时间数据是直接设置到15点的。
 */
let tradeDataCache = null; // 大势交易点信息弹框控制信息
/**
 * 求大势交易点信息中的时间最大值，将时间字符串转换为时间戳比较
 * 获取时间戳：Date.parse(new Date('2017-09-21 13:09')) / 1000
 * @param pointData 大势交易点信息数组
 * @returns {number} 返回时间最大值
 */
function getLatestTime(pointData) {
  let latestTime = 0;
  let currentTime = 0;
  pointData.forEach((value) => {
    currentTime = Date.parse(new Date(value[1])) / 1000;
    if (latestTime < currentTime) {
      latestTime = currentTime;
    }
  });
  return latestTime;
}
/**
 * 判断大势策略信息
 * @param showData - 交易点信息
 */
function getTitle(showData) {
  const viewPoint = [
    '创业板指数应对策略更新：逢高抛售，空仓',
    '创业板指数应对策略更新：逢低买入，持仓',
    '上证指数应对策略更新：逢高抛售，空仓',
    '上证指数应对策略更新：逢低买入，持仓',
  ];
  let strategy = '';
  if (showData[0] === '13' && showData[2] === '0') {
    strategy = viewPoint[0];
  } else if (showData[0] === '13' && showData[2] === '1') {
    strategy = viewPoint[1];
  } else if (showData[0] === '14' && showData[2] === '0') {
    strategy = viewPoint[2];
  } else {
    strategy = viewPoint[3];
  }
  return strategy;
}

export default function livePusher() {
  return (store) => {
    store.subscribe((mutation) => {
      const type = mutation.type;
      if (type === MENU_CONFIG_SET) {
        const menuList = mutation.payload;
        // 获取用户权限，遍历触发相应的推送
        baseUtil.each(menuList, (item) => {
          switch (item.system_code) {
            case 'live':
              /*
              * 实时解盘推送初始化权限判断，是否是本地
              * */
              columnSocket.live(`live_${window.location.hostname}`);
              // 在本地测试时使用的配置
              // columnSocket.live('live_vip.cp.test.yuncaijing.com');
              columnSocket.on(EVENT.LIVE, () => {
                const buttonStatus = storage.switchGroup.read(); // 获取推送开关配置
                if (buttonStatus && buttonStatus.live) {
                  const notify = buttonStatus.live.live_notify;
                  const audio = buttonStatus.live.live_audio;
                  if (audio) {
                    ycjVoice.play();
                  }
                  if (notify) {
                    notifyMsg('实时解盘有更新');
                  }
                } else {
                  notifyMsg('实时解盘有更新');
                  ycjVoice.play();
                }
              });
              break;
            case 'reference':
              /**
               * 内参页面推送通知
               */
              columnSocket.reference();
              columnSocket.on(EVENT.REFERENCE, (data) => {
                if (data.op_id === 1) {
                  if (!data.title) {
                    return;
                  }
                  const title = data.title;
                  const id = data.news_id;
                  http.api[apiList.GET_NEWS_INFO]({
                    param: {
                      id,
                    },
                    success(response) {
                      let content = response.description;
                      if (content.length > 49) {
                        content = content.substr(0, 49).concat('...');
                      }
                      const url = `${window.location.href.split('#')[0]}#/reference`;
                      notifyMsg(title, content, url);
                    },
                  });
                }
              });
              break;
            case 'consult':
              columnSocket.chat();
              break;
            case 'tendency':
              /**
               * 大势页面推送通知
               */
              columnSocket.tendency();
              columnSocket.on(EVENT.TENDENCY, () => {
                http.api[apiList.GET_TRADE_POINT]({
                  success(pointData) {
                    /**
                     * 判断推送开关配置。默认为开。
                     */
                    const buttonStatus = storage.switchGroup.read(); // 获取推送开关配置
                    let notify = true;
                    let audio = true;
                    if (buttonStatus && buttonStatus.tendency) {
                      notify = buttonStatus.tendency.tendency_notify;
                      audio = buttonStatus.tendency.tendency_audio;
                    }
                    let title = '';
                    let currentTime = 0;
                    const url = `${window.location.href.split('#')[0]}#/tendency`;
                    /**
                     * 获取交易点数据后，首先计算当前状态中时间最大值；
                     * 然后遍历数组，判断大于记录时间的信息推送；
                     * 并将获取数据写入state中；
                     */
                    // 获取交易点数据后，首先计算当前状态中时间最大值；
                    tradeDataCache = getLatestTime(store.state.moduleStock.tradePoint.data);
                    // 然后遍历数组，判断大于记录时间的信息推送；
                    pointData.data.forEach((value) => {
                      currentTime = Date.parse(new Date(value[1])) / 1000; // 取时间
                      if (tradeDataCache < currentTime) {
                        if (audio) {
                          ycjVoice.play();
                        }
                        if (notify) {
                          title = getTitle(value);
                          notifyMsg(title, '', url);
                        }
                      }
                    });
                    // 并将获取数据写入state中；
                    store.dispatch(stockActions.UPDATE_TRADE_DATA, pointData);
                  },
                });
              });
              break;
            case 'trading':
              /**
               * 实盘追踪页面推送通知
               * 注意：1.case值要和系统一致
               * 2.测试时firmTracking 参数为'firm_tracking_vip.cp.test.yuncaijing.com'，在switch外测试
               * 3.目前要求显示推送信息对应内容，需要根据推送信息中consult_id从后台获取，
               * 所以先判断弹窗按钮是否开启，开启才向后台请求详细内容。
               * 问题：每次推送会推送两条信息，所以要判定两个信息是否重复？
               */
              columnSocket.firmTracking(`firm_tracking_${window.location.hostname}`);
              columnSocket.on(EVENT.FIRMTRACKING, (cmdData) => {
                /**
                 * 判断推送开关配置。默认为开。
                 * 仿照live判断，但根据trading的代码情况进行了判断调整。
                 * 弹窗开启，才获取推送信息详情。
                 */
                const buttonStatus = storage.switchGroup.read(); // 获取推送开关配置
                let notify = true;
                let audio = true;
                if (buttonStatus && buttonStatus.trading) {
                  notify = buttonStatus.trading.trading_notify;
                  audio = buttonStatus.trading.trading_audio;
                }
                if (audio) {
                  ycjVoice.play();
                }
                if (notify) {
                  // 设置弹窗开启，才获取推送信息详情
                  const token = store.state.moduleUser.token;
                  const uid = store.state.moduleUser.uid;
                  const id = cmdData.id;
                  const url = `${window.location.href.split('#')[0]}#/trading`;
                  let title = '';
                  http.api[apiList.GET_LASTED_RECORD]({
                    param: {
                      uid,
                      token,
                      id,
                    },
                    success(data) {
                      const newslist = data;
                      /**
                       * 根据后台数据结构：
                       * "data": {
                     *       "10月24日": [
                     *          {
                     *              "pk": "43",//记录id
                     *              "time": " 15:18",//时间
                     *              "title": "bb",//操作记录
                     *              "content": "ddd"，//操作日志
                     *          }
                     *      ]
                     *    }
                       *  baseUtil.each：遍历对象结构。
                       *  所以要进行两重循环遍历。
                       *  对应展示这个数据的HTML结构也是有两层遍历展示v-for。
                       */
                      baseUtil.each(newslist, (newsitem) => {
                        baseUtil.each(newsitem, (itemDetail) => {
                          title = `${itemDetail.title}`;
                        });
                      });
                      // 推送时去掉标签，只显示文本
                      title = title.replace(/<.*?>/ig, '');
                      notifyMsg(title, '', url);
                    },
                  });
                }
              });
              break;
            default:
              break;
          }
        });
      }
    });
  };
}
