<template>
  <div class="tendency-right">
    <div class="title">
      使用说明
    </div>
    <div class="main">
      <p>简介：模型是利用投资者舆情及交易行为大数据，精准预判市场短期波动，为高抛低吸提供实用参考，当模型发出“买入”信号时，说明模型预判市场接下来有较大概率上涨，投资者此时可放手大胆买入、持股待涨；当模型发出“抛售”信号时，投资者则要防范市场下跌风险，考虑减仓或直接空仓。
      </p>
      <ul>
        <li>
          什么是大盘股？
        </li>
        <p>流通市值在500亿以上的股票。</p>
        <li>
          什么是中小盘？
        </li>
        <p>流通市值在500亿以下的股票。</p>
        <li>
          应对策略有哪几种？
        </li>
        <p>只有逢低买入，持仓和逢高抛售，空仓两种状态。它对应分时图的买入和卖出信号。</p>
      </ul>
      <div class="button-container">
        <div class="button" @click="clickButton">
          了解更多
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import http from '../../plugins/http/http';
  import {
    actions,
  } from '../../model/vuex/actionsType';

  const apiList = http.apiList;

  export default {
    name: '',
    data() {
      return {};
    },
    components: {},
    methods: {
      clickButton() {
        const vm = this;
        http.api[apiList.GET_NEWS_INFO]({
          param: {
            id: '9539656',
          },
          success(data) {
            vm.$store.dispatch(actions.UPDATE_NEWS_DATA, {
              title: data.title,
              desc: data.content,
            });
          },
        });
      },
    },
  };
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/sass/static";
  .tendency-right{
    height: 100%;
    width: 100%;
    padding-left: 10px;
    .title{
      line-height: 70px;
      height: 70px;
      text-align: center;
      font-size: 20px;
      color: #c0c0c0;
      background: $G4;
    }
    .main{
      padding: 30px 6%;
      font-size: 14px;
      color: #fff;
      background: #242424;
      > p {
        text-indent: 2em;
      }
      ul {
        >p {
          color: #c0c0c0;
        }
      }
      li {
        margin-top: 30px;
        color: #f4b95c;
      }
      .button-container{
        .button{
          width: 94px;
          margin: 30px auto 0 auto;
          border-radius: 5px;
          padding: 3px 15px;
          font-size: 16px;
          background: $blue1;
          transition: background 0.3s;
          cursor: pointer;
          &:hover{
            background: $blue2;
          }
        }
      }
    }
  }
</style>
