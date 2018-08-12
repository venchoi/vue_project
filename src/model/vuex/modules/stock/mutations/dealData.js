import Vue from 'vue';

import baseUtil from '../../../../../util/baseUtil';
import { DEAL_DATA_ADD, DEAL_DATA_UPDATE, DEAL_DATA_INIT } from './mutationType';
import defaultValue from '../defaultState';

export default {
  /**
   * 资金数据初始化
   * @param state
   * @param code
   */
  [DEAL_DATA_INIT](state, code) {
    if (!state.dealData[code]) {
      Vue.set(state.dealData, code, defaultValue.dealData());
    }
  },
  /**
   * 添加资金数据
   * @param state
   * @param data.code - 股票代码
   * @param data.data - 股票对应的详细资金交易数据
   * e.g:
   * payload: {
   *  code: '',
   *  data: {
   *    baseList: [],
   *    buyer: [],
   *    seller: [],
   *  },
   * }
   */
  [DEAL_DATA_ADD](state, data) {
    Vue.set(state.dealData, data.code, data.data);
  },
  /**
   * 更新资金交易数据
   * @param {object} data - 处理的数据包
   * @param {object} data.data.base_list - 基础列表数据
   * @param {array} data.data.buyer - 买方单
   * @param {array} data.data.seller - 卖方单
   *
   */
  // [DEAL_DATA_UPDATE](state, data) {
  //   baseUtil.each(data, (item, code) => { // 股票层级
  //     baseUtil.each(item, (dealItem) => {
  //       const dataPacket = dealItem;
  //       const dealData = state.dealData[code]; // vuex 中的 交易数据
  //       const baseList = dealData.baseList; // vuex 中的 交易信息列表
  //       const buyer = dealData.buyer; // vuex 中的 买家列表
  //       const seller = dealData.seller; // vuex 中的 卖家列表
  //       const dataBuyer = dataPacket.buyer; // 新数据的 买家列表
  //       const dataSeller = dataPacket.seller; // 新数据的 卖家列表
  //
  //       const totalNum = 350; // 最多显示350单数据
  //
  //       baseList.unshift(dataPacket.baseList);
  //       if (dataBuyer.connect) { // 是否连接
  //         /**
  //          * 判断更新之前的第0单是不是对象，如果是对象，表示第0单跟第1单是连接的。那么将新插入的一单添加到更新之前第0单中，
  //          */
  //         if (baseUtil.isObject(buyer[0])) {
  //           buyer[0].state = dataBuyer.state;
  //           buyer[0].length += 1;
  //           buyer[0].amount = dataBuyer.amount;
  //         } else {
  //           /**
  //            * 如果不是对象，表示第0单，是独立的一单，没跟第1单连接，这时需要将第0单设置成对象的数据结构，并令其长度为2
  //            */
  //           Vue.set(buyer, 0, {
  //             state: dataBuyer.state,
  //             amount: dataBuyer.amount,
  //             length: 2,
  //           });
  //         }
  //       } else { // 如果需要新插入的一单交易是独立的，不跟上一单连接的，那么直接在买家列表的头部插入新的一单
  //         buyer.unshift(dataBuyer.state);
  //       }
  //       // 卖方列表操作同买方列表的操作
  //       if (dataSeller.connect) {
  //         if (baseUtil.isObject(seller[0])) {
  //           seller[0].state = dataSeller.state;
  //           seller[0].length += 1;
  //           seller[0].amount = dataSeller.amount;
  //         } else {
  //           Vue.set(seller, 0, {
  //             state: dataSeller.state,
  //             amount: dataSeller.amount,
  //             length: 2,
  //           });
  //         }
  //       } else {
  //         seller.unshift(dataSeller.state);
  //       }
  //       // 如果交易信息列表的长度大于350条，则删除队尾的数据
  //       if (baseList.length > totalNum) {
  //         const buyerLength = buyer.length - 1;
  //         const sellerLength = seller.length - 1;
  //         baseList.splice(baseList.length - 1);
  //         // 删除队尾的数据时，注意最后一单是不是跟队尾前一单是连接的，是的话，删除买方列表队尾的整个对象
  //         if (baseUtil.isObject(buyer[buyerLength]) && buyer[buyerLength].length > 1) {
  //           buyer[buyerLength].length -= 1;
  //         } else {
  //           buyer.splice(buyerLength);
  //         }
  //         // 同买方操作
  //         if (baseUtil.isObject(seller[sellerLength]) && seller[sellerLength].length > 1) {
  //           seller[sellerLength].length -= 1;
  //         } else {
  //           seller.splice(sellerLength);
  //         }
  //       }
  //     });
  //   });
  //   // baseUtil.merge(baseList, dataPacket.base_list, true);
  //   // dealData.buyer = dataPacket.buyer.concat(dealData.buyer);
  //   // dealData.seller = dataPacket.seller.concat(dealData.seller);
  // },
  [DEAL_DATA_UPDATE](state, data) {
    baseUtil.each(data, (item, code) => { // 股票层级
      if (!state.dealData[code]) {
        Vue.set(state.dealData, code, defaultValue.dealData());
      }
      const deal = baseUtil.copy(state.dealData[code]);
      if (item.data.length) {
        baseUtil.each(item.data, (itemData) => {
          deal.data.unshift(itemData);
        });
      }
      // 有可能某分钟没有数据，这种情况下，仍保留原来的pre_time
      // 只有当返回的pre_time不为空时，才更新deal.pre_time
      if (item.pre_time !== null && item.pre_time !== 'null') {
        deal.pre_time = item.pre_time;
      }
      baseUtil.merge(state.dealData[code], deal, true);
    });
  },
};
