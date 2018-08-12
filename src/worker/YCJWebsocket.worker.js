import baseUtil from '../util/baseUtil';
import * as webSocket from '../plugins/YCJWebSocket/YCJWebSocket';

import wsDataHandler from '../plugins/dataHandler/ws';

let wsDataSet = {};
const YCJSocket = webSocket.YCJSocket;
const EVENT = webSocket.EVENT;


YCJSocket.on(EVENT.INDEX, (data) => {
  const processedData = wsDataHandler[EVENT.INDEX](data);
  baseUtil.merge(wsDataSet,processedData);
});
YCJSocket.on(EVENT.STOCK, (data) => {
  const processedData = wsDataHandler[EVENT.STOCK](data);
  baseUtil.merge(wsDataSet,processedData);
});
// YCJSocket.on(EVENT.DEAL, (data) => {
//   if (!wsDataSet.deal) {
//     wsDataSet.deal = {};
//   }
//   const processedData = wsDataHandler[EVENT.DEAL](data);
//   const deal = wsDataSet.deal;
//   baseUtil.each(processedData, (item, code) => {
//     if (!deal[code]) {
//       deal[code] = [];
//     }
//     deal[code].push(item);
//   });
// });

YCJSocket.on(EVENT.ENTRUST_QUEUE, (data) => {
  if (!wsDataSet.entrustQueue) {
    wsDataSet.entrustQueue = {};
  }
  const processedData = wsDataHandler[EVENT.ENTRUST_QUEUE](data);
  const entrustQueue = wsDataSet.entrustQueue;
  baseUtil.each(processedData, (item, code) => {
    if (!entrustQueue[code]) {
      entrustQueue[code] = {};
    }
    baseUtil.each(item, (subItem, key) => {
      entrustQueue[code][key] = subItem;
    });
  });
});
// YCJSocket主要是针对股票行情数据的，ColumnSocket是针对内参，选股，咨询这些服务的。这里用YCJSocket监听EVENT.REFERENCE是不合适的
YCJSocket.on(EVENT.REFERENCE);
// YCJSocket.on(EVENT.TRACK);


/**
 * 接手主线程 的消息
 */

self.addEventListener('message', (e) => {
  const data = e.data;
  const method = data.method;
  const payload = data.payload;

  if (!method && !YCJSocket[method]) {
    return
  }
  if (method === 'extra') {
    webSocket[method](...payload);
  } else {
    YCJSocket[method](...payload);
  }

  setTimeout(() => {
    self.postMessage(wsDataSet);
    wsDataSet = {};
  }, 300);
});

/**
 * 节流推送
 */
setInterval(() => {
  self.postMessage(wsDataSet);
  wsDataSet = {};
}, 1000);


