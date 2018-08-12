import {
  EVENT,
} from '../YCJWebSocket/YCJWebSocket';
import {
  baseUtil,
} from '../../util';

const priceHandler = price => price / 10000;

const handler = {};

/** 股指快照
 * 若返回的数据是数组格式，则取数组的最后一个作为处理对象，否则处理返回的所有数据
 * 将后台返回的数据转换成：以股票代码作为key值，开盘、收盘等数据作为股票代码的值的对象格式。使view组件在渲染数据时可以直接将返回的数据进行渲染。
 */
handler[EVENT.INDEX] = (data) => {
  let handlerData;
  if (baseUtil.isArray(data)) {
    handlerData = data[data.length - 1];
  } else {
    handlerData = data;
  }
  const baseInfo = {};
  baseInfo.code = handlerData.foxxcode;
  baseInfo.name = handlerData.name;
  if (handlerData.close) {
    baseInfo.close = priceHandler(handlerData.close);
    baseInfo.preClose = priceHandler(handlerData.preclose);
    baseInfo.open = priceHandler(handlerData.dopen);
    baseInfo.high = priceHandler(handlerData.dhigh);
    baseInfo.low = priceHandler(handlerData.dlow);
    baseInfo.vol = parseInt(handlerData.vol / 100, 10);
    baseInfo.money = handlerData.money;
  }
  return {
    baseInfo: {
      [handlerData.foxxcode]: baseInfo,
    },
  };
};

handler[EVENT.STOCK] = (data) => {
  let handlerData;
  if (baseUtil.isArray(data)) {
    handlerData = baseUtil.getLast(data);
  } else {
    handlerData = data;
  }
  const baseInfo = {};
  const handicap = {
    sellStage: [],
    buyStage: [],
  };
  let i = 1;
  baseInfo.code = handlerData.foxxcode;
  baseInfo.name = handlerData.name;
  if (data.close) {
    baseInfo.close = priceHandler(handlerData.close);
    baseInfo.preClose = priceHandler(handlerData.preclose);
    baseInfo.open = priceHandler(handlerData.dopen);
    baseInfo.high = priceHandler(handlerData.dhigh);
    baseInfo.low = priceHandler(handlerData.dlow);
    baseInfo.vol = parseInt(handlerData.vol / 100, 10);
    baseInfo.money = handlerData.money;
  }
  /**
   * 保存买卖队列的数据，卖队列是从5到1保存，买队列是从1到5保存
   * 价格是sell0 ~ sell10,buy0 ~ buy10,对应的成交量是sell0_count ~ sell10_count,buy0_count ~ buy10_count
   * 这里原来是循环10次，买卖队列是level2，现在只保留5档，但后台接口传过来仍然是10档的
   * 以后如果需要改成level2，只需要再这里将5改成10，将被循环的代码里的6改成11
   * 并且defaultState.js中创建买卖队列时，是创建一个长度为5的数组，而不是10。
   * 不然在v-for遍历数组的时候，它会首先渲染10个item，数据加载成功后才渲染成5个item。就会出现闪出空数据的bug
   */
  for (i; i <= 5; i += 1) {
    handicap.sellStage.push({
      price: priceHandler(handlerData[`sell${6 - i}`]),
      vol: parseInt(handlerData[`sell${6 - i}_count`] / 100, 10),
    });
    handicap.buyStage.push({
      price: priceHandler(handlerData[`buy${i}`]),
      vol: parseInt(handlerData[`buy${i}_count`] / 100, 10),
    });
  }
  return {
    baseInfo: {
      [handlerData.foxxcode]: baseInfo,
    },
    handicap: {
      [handlerData.foxxcode]: handicap,
    },
  };
};

handler[EVENT.ENTRUST_QUEUE] = (data) => {
  const sellFri = {
    entrust: 0,
    vol: 0,
    queue: [],
  };
  const buyFri = {
    entrust: 0,
    vol: 0,
    queue: [],
  };
  const BUY = 66;
  const SELL = 65;
  const ABlength = data.ABItems;
  const side = data.Side;
  const queue = [];
  const result = {};
  let vol = 0;
  let i = 0;
  let cols = 0;
  let rows = 0;
  for (i; i < ABlength; i += 1) {
    if (i > 43) {
      break;
    }
    if (cols > 4) {
      cols = 0;
      rows += 1;
    }
    cols += 1;
    if (!queue[rows]) {
      queue[rows] = [];
    }
    if (side === SELL) {
      vol += data.ABVolume[i];
      queue[rows].push(parseInt(data.ABVolume[i] / 100, 10));
    } else {
      vol += data.ABVolume[i];
      queue[rows].push(parseInt(data.ABVolume[i] / 100, 10));
    }
  }
  if (ABlength > 42) {
    queue[rows].push('...');
  }
  if (side === BUY) {
    buyFri.vol = vol / 100;
    buyFri.queue = queue;
    buyFri.entrust = ABlength;
    result.buyFri = buyFri;
  } else if (side === SELL) {
    sellFri.vol = vol / 100;
    sellFri.queue = queue.reverse();
    sellFri.entrust = ABlength;
    result.sellFri = sellFri;
  }
  return {
    [data.foxxcode]: result,
  };
};

handler[EVENT.DEAL] = (data) => {
  const result = {
    baseList: {},
    buyer: null,
    seller: null,
  };
  const buyBig = data.big_buy;
  const buyConnect = data.buy_connect;
  const sellBig = data.big_sell;
  const sellConnect = data.sell_connect;

  result.baseList.time = data.time;
  result.baseList.money = data.money;
  result.baseList.connect = data.time_connect;
  result.baseList.price = data.price;
  result.baseList.amount = data.turnover;
  result.baseList.bigDeal = data.big_single;

  result.buyer = {
    state: buyBig,
    connect: buyConnect,
    amount: buyBig,
  };

  result.seller = {
    state: sellBig,
    connect: sellConnect,
    amount: sellBig,
  };

  return {
    [data.foxxcode]: result,
  };
};

export default handler;
