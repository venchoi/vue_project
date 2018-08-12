<template>
  <div class="earn-info-wrap fl clear">
    <p>总收益：<stock-details :value='all_earn' :boundary='0' :prefix="false" modal='normal' unit="%"></stock-details></p>
    <p>月：<stock-details :value='mounth_earn' :boundary='0' :prefix="false" modal='normal' unit="%"></stock-details></p>
    <p>日：<stock-details :value='day_earn' :boundary='0' :prefix="false" modal='normal' unit="%"></stock-details></p>
  </div>
</template>

<script>
  import StockDetails from '../../components/stockBase/StockDetails';

  export default {
    name: 'EarnInfo',
    data() {
      return {
      };
    },
    components: {
      StockDetails,
    },
    props: {
      all_earn: String,
      mounth_earn: String,
      day_earn: String,
    },
    watch: {
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
  .fl {
    float: left;
  }
  .fcolor {
    color: #F5BA53;
  }
  .text_hide {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .earn-info-wrap {
    position: relative;
    height: 40px;
    line-height: 40px;
    top: -5px;
    background: $G3;
    padding: 0 20px;
    border-radius: 40px;
    margin-left:40px;
    p {
      position: relative;
      float: left;
      height:40px;
      line-heght:40px;
      font-size: 12px;
      color: #C0C0C0;
      padding-right: 10px;
      margin-right: 10px;
      span {
        font-weight: bold;
        font-size: 13px;
      }
    }
    p:after {
      content: '';
      position: absolute;
      display: block;
      top: 12px;
      right: 0;
      width: 1px;
      height: 14px;
      background: #373737;
    }
    p:last-child {
      padding-right: 0;
      margin-right: 0;
    }
    p:last-child:after {
      content: '';
      background: $G3;
    }
  }
  @media only screen and (max-width: 1430px) {
    .earn-info-wrap {
      padding: 0 10px;
      margin-left:10px;
    }
  }
</style>
