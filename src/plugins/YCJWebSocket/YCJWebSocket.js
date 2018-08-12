import {
  baseUtil,
} from '../../util/index';
import EasyWebSocket from '../base/EasyWebSocket';
import Event from '../Event';

const quotationsAdress = 'ws:/push.yuncaijing.com:9988';
const columnAdress = 'ws:/push.yuncaijing.com:9989';
const quotations = new EasyWebSocket(quotationsAdress);
const column = new EasyWebSocket(columnAdress);

const CMD = {
  INDEX: 201, // 股指快照
  CANCEL_INDEX: 202,
  STOCK: 301, // 快照 基本信息 + 盘口
  CANCEL_STOCK: 302,
  // DEAL: 401, // 资金数据
  CANCEL_DEAL: 402,
  REFERENCE: 1001, // 内参事件
  CONSULT: 600, // 客户端咨询事件
  STOCK_INDEX_SERVICE: 602, // 选股首页股票池
  LIVE: 606, // 实时解盘
  TENDENCY: 607, // 大势
  FIRMTRACKING: 609, // 实盘追踪
};

const EVENT = {
  INDEX: 801, // 股指快照
  STOCK: 802, // 快照 基本信息 + 盘口
  // DEAL: 803, // 资金数据
  ENTRUST_QUEUE: 804, // 委托队列
  REFERENCE: 2001, // 内参事件
  CONSULT: 2006, // 客户端咨询事件
  STOCK_INDEX_SERVICE: 2008, // 选股首页股票池更新
  LIVE: 2009, // 实时解盘
  TENDENCY: 2010, // 大势
  FIRMTRACKING: 2011, // 实盘追踪
};

const extraParam = {};
/**
 * 将服务代码和后台需要的附加信息组合为发送请求时数据格式
 * @param type - 服务CM代码，如 live,tendency
 * @param code - 附加信息，后台提供
 * @returns {{}} - 返回发送请求的数据格式
 */
const sender = (type, code) => {
  const msg = {
    ...extraParam,
  };
  if (type) {
    msg.cmd = type;
  }
  if (code) {
    msg.cmdData = code;
  }
  return msg;
};
/**
 * YCJWebSocket 类
 * 基类： Event
 * 提供方法： init():初始化。
 * subscribe():订阅函数；将请求添加到订阅队列，并建立webSocket连接。
 * unSubscribe():取消订阅；从订阅队列中删除请求，停止连接。
 * resubscribe():重新订阅；为订阅队列中所有请求建立连接。
 */
class YCJWebSocket extends Event {
  constructor() {
    super();
    this.subscriptionList = {};
    this.init();
  }

  init() {
    quotations.on('message', (data) => {
      this.messageHandler(data);
    });
    quotations.on('error', () => this.resubscribe());
  }

  closeWs() {
    quotations.close();
    return this;
  }

  multiSubscribe(type, codes) {
    baseUtil.each(codes, (code) => {
      this.subscribe(code, type);
    });
  }

  subscribe(code, cmdType = 'base') {
    let cmd;

    if (cmdType === 'index') {
      cmd = CMD.INDEX;
    } else if (cmdType === 'base') {
      cmd = CMD.STOCK;
    } else if (cmdType === 'deal') {
      cmd = CMD.DEAL;
    }

    if (!this.subscriptionList[code]) {
      this.subscriptionList[code] = [];
    }
    if (this.subscriptionList[code].indexOf(cmd) < 0) {
      this.subscriptionList[code].push(cmd);
      quotations.send(sender(cmd, code));
    }
  }
  unSubscribe(code, cmdType = 'base') {
    if (!code) {
      return this;
    }
    const cmdList = this.subscriptionList[code];
    let cancelCode;
    let cancelCMDIndex;

    if (!cmdList) {
      return this;
    }
    if (cmdType === 'index') {
      cancelCode = CMD.CANCEL_INDEX;
    } else if (cmdType === 'base') {
      cancelCode = CMD.CANCEL_STOCK;
    } else if (cmdType === 'deal') {
      cancelCode = CMD.CANCEL_DEAL;
    }
    baseUtil.each(cmdList, (cmd, key) => {
      let cmdFri;
      let cancelFri;
      if (typeof cmd === 'number') {
        cmdFri = cmd.toString().charAt(0);
      } else if (typeof cmd === 'string') {
        cmdFri = cmd.charAt(0);
      }
      if (typeof cmd === 'number') {
        cancelFri = cancelCode.toString().charAt(0);
      } else if (typeof cmd === 'string') {
        cancelFri = cancelCode.charAt(0);
      }
      if (cmdFri === cancelFri) {
        quotations.send(sender(cancelCode, code));
        cancelCMDIndex = key;
      }
    });
    if (typeof cancelCMDIndex === 'number') { // bug fix
      cmdList.splice(cancelCMDIndex, 1);
    }
    return this;
  }

  resubscribe() {
    baseUtil.each(this.subscriptionList, (cmdList, code) => {
      baseUtil.each(cmdList, (cmd) => {
        quotations.send(sender(cmd, code));
      });
    });
  }

  clear() {
    quotations.reconnect();
    return this;
  }
  messageHandler(data) {
    const trigger = (strData) => {
      let handlerData;
      const type = strData.cmd;
      try {
        handlerData = JSON.parse(strData.cmdData);
      } catch (error) {
        handlerData = strData.cmdData;
      }
      this.trigger(type, handlerData);
    };

    if (baseUtil.isArray(data)) {
      const cmdType = data[0].cmd;
      switch (cmdType) {
        case EVENT.DEAL:
          baseUtil.each(data, d => trigger(d));
          break;
        case EVENT.ENTRUST_QUEUE: {
          let buy;
          let sell;
          const regBuy = /"Side":66/;
          const regSell = /"Side":65/;
          baseUtil.each(data, (d) => {
            if (regBuy.test(d.cmdData)) {
              buy = d;
            }
            if (regSell.test(d.cmdData)) {
              sell = d;
            }
          });
          trigger(buy);
          trigger(sell);
          break;
        }
        default: {
          const indexData = baseUtil.getLast(data);
          trigger(indexData);
          break;
        }
      }
    } else {
      trigger(data);
    }
  }
}
/**
 * ColumnSocket 类
 * 基类： Event
 * 为相应服务推送建立连接。
 */
class ColumnSocket extends Event {
  constructor() {
    super();
    this.liveOn = false;      // 实时解盘
    this.seriveOnMarker = {}; // 选股首页股票池
    this.chatOn = false;      // 问股
    this.referenceOn = false; // 内参
    this.tendencyOn = false;  // 大势
    this.firmtrackOn = false; // 实盘追踪
    return this;
  }

  /**
   * 客户端咨询事件
   * 无附加信息
   */
  chat() {
    if (this.chatOn) {
      return this;
    }
    this.chatOn = true;
    column.send(sender(CMD.CONSULT));
    column.on('message', (data) => {
      let handlerData;
      const type = data.cmd;
      try {
        handlerData = JSON.parse(data.cmdData);
      } catch (error) {
        handlerData = data.cmdData;
      }
      this.trigger(type, handlerData);
    });
    return this;
  }
  /**
   * 选股
   * cmdData附加信息：systemCode
   * systemCode - 服务代码
   */
  service(systemCode) {
    if (this.seriveOnMarker[systemCode]) {
      return this;
    }
    this.seriveOnMarker[systemCode] = true;
    const msg = sender(CMD.STOCK_INDEX_SERVICE, systemCode);
    column.send(msg);
    return this;
  }
  /**
   * 实时解盘
   * cmdData附加信息：systemCode
   */
  live(systemCode) {
    if (this.liveOn) {
      return;
    }
    column.send(sender(CMD.LIVE, systemCode));
    this.liveOn = true;
  }
  /**
   * 内参
   * 无附加信息
   */
  reference() {
    if (this.referenceOn) {
      return;
    }
    column.send(sender(CMD.REFERENCE));
    this.referenceOn = true;
  }
  /**
   * 大势
   * cmdData附加信息：navigator_push
   * 是否附加信息由前端后端商议决定
   */
  tendency() {
    if (this.tendencyOn) {
      return;
    }
    column.send(sender(CMD.TENDENCY, 'navigator_push'));
    this.tendencyOn = true;
  }
  /**
   * 实盘追踪
   * cmdData附加信息，systemCode从livePushHandler传入参数
   * 是否附加信息由前端后端商议决定
   */
  firmTracking(systemCode) {
    if (this.firmtrackOn) {
      return;
    }
    column.send(sender(CMD.FIRMTRACKING, systemCode));
    this.firmtrackOn = true;
  }
  closeWs() {
    column.close();
    return this;
  }
}

export {
  CMD,
  EVENT,
};
export const extra = obj => baseUtil.merge(extraParam, obj, true); // 添加额外传参数
export const YCJSocket = quotations ? new YCJWebSocket() : quotations;
export const columnSocket = new ColumnSocket();
