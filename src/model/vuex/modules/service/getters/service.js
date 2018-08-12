export const getServiceInfo = (state) => {
  const serviceInfo = state.serviceInfo;
  return (systemCode) => {
    if (serviceInfo[systemCode]) {
      return serviceInfo[systemCode];
    }
    return {
      historyList: [],
      todayList: [],
    };
  };
};

export const getIndexStockList = (state) => {
  const indexInfo = state.serviceIndex;
  if (indexInfo) {
    const stockList = [];
    for (let i = 0; i < indexInfo.length; i += 1) {
      if (indexInfo[i].system_code === 'stockpool') {
        stockList.push(...indexInfo[i].list);
      }
    }
    return stockList;
  }
  return [];
};

export const getIndexFundList = (state) => {
  const indexInfo = state.serviceIndex;
  if (indexInfo) {
    const fundList = [];
    for (let i = 0; i < indexInfo.length; i += 1) {
      if (indexInfo[i].system_code !== 'stockpool') {
        fundList.push(...indexInfo[i].list);
      }
    }
    return fundList;
  }
  return [];
};

export const getServiceIndex = (state) => {
  const indexInfo = state.serviceIndex;
  if (indexInfo) {
    return indexInfo;
  }
  return {};
};

export const getNewItem = (state) => {
  const newItems = state.newItems;
  return (systemCode) => {
    if (newItems[systemCode]) {
      return newItems[systemCode];
    }
    return {};
  };
};
