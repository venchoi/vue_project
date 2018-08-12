import apiList from './apiList';
import ycjUtil from '../../util/ycjUtil';
import baseUtil from '../../util/baseUtil';

// 新闻链接过滤
const newsFilter = (data) => {
  let content = data.content;
  const reg = {
    newsReg: /<a[^>]*href="[^"]*\/news\/id_[0-9]+.html"[^>]*>[\W\w]+?<\/a>/gi,
    storyReg: /<a[^>]*href="[^"]*\/story\/details\/id_[0-9]+.html"[^>]*>[\W\w]+?<\/a>/gi,
    stockReg: /<a[^>]*href="([^"]*[(sh)(sz)(/)][0-9]{6}[^"]*)"[^>]*>(.*?)<\/a>/gi,
    otherReg: /<a[^>]*href="([^"]*(www\.yuncaijing\.com)[^"]*)"[^>]*>(.*?)<\/a>/gi,
  };
  if (content) {
    baseUtil.each(reg, (item) => {
      content = content.replace(item, (tag) => {
        if (reg.stockReg.test(tag)) {
          reg.stockReg.lastIndex = 0;
          const stkTxt = tag.replace(/(<\/?a.*?>)/g, '');
          const stock = JSON.stringify(stkTxt.match(/[0-9]{6}/gi)).replace(/(\[")?("\])?/g, '');
          /**
           * 其他页面传股票链接时是这样的链接：<a href="http://yunvs.com/600340" target="_blank"><b><u>华夏幸福（600340）</u></b></a>
           * 实时解盘是：<a href="#/stock/600340" target="_blank"><b><u>华夏幸福</u></b></a>
           * 所以实时解盘的内容过滤后stock为'null'，直接return原来的tag就可以。
           * */
          if (stock === null || stock === 'null') {
            return tag;
          }
          const stockCode = ycjUtil.formatCode(stock);
          return `<a href="#/stock/${stockCode}" target="_self">${stkTxt}</a>`;
        }
        const txt = tag.replace(/(<\/?a.*?>)/g, '');
        return `<span>${txt}</span>`;
      });
    });
    baseUtil.merge(data, { content }, true);
  }
};
/**
 *
 * @param data
 * data的格式：
 * {
 *  pre_tiem: 932,
 *  head:["time","price","atkbuy_unit","atksell_unit"]
 *  data: [
 *    ["9:31",20.25,233.23,332.23]
 *    ["9:32",20.25,233.23,332.23]
 *  ]
 * }
 */
// const dealHandler = (data) => {
//   const deal = data.data;
//   // const head = data.head;
//   const preTime = data.pre_time;
//   // const dealItem = {};
//   const result = {
//     pre_time: preTime,
//     data: [],
//   };
//   baseUtil.each(deal, (item) => {
//     result.data.unshift(item);
//   });
//   return result;
// };
const specialHandler = {
  [apiList.LOGIN]() {
  },
  [apiList.GET_NEWS_INFO](data) {
    newsFilter(data);
  },
  [apiList.GET_NEW_LIST](data) {
    newsFilter(data.analysis);
    newsFilter(data.early_read);
    newsFilter(data.report);
  },
  [apiList.GET_REAL_TIME_STARE](data) {
    baseUtil.each(data, (news) => {
      newsFilter(news);
    });
  },
  [apiList.GET_STOCK_NEWS](data) {
    const news1 = data[1];
    const news2 = data[2];
    const news5 = data[5];
    const news6 = data[6];
    baseUtil.each(news1, (item) => {
      baseUtil.each(item, (news) => {
        newsFilter(news);
      });
    });
    baseUtil.each(news2, (item) => {
      baseUtil.each(item, (news) => {
        newsFilter(news);
      });
    });
    baseUtil.each(news5, (item) => {
      newsFilter(item);
    });
    baseUtil.each(news6, (item) => {
      newsFilter(item);
    });
  },
  // [apiList.GET_DEAL_INFO](data) {
  //   dealHandler(data);
  // },
};
export default specialHandler;
