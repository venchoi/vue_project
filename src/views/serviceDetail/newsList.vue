<template>
  <div class="data-list-wrap" ref="newsbox">
    <div class="table-row" v-for="item in newsList" @click="getNew($event, item)">
      <div class="four text_hide">{{transfromDate(item.inputtime)}}</div>
      <div class="four text_hide">{{item.from}}</div>
      <div class="two text_hide">{{item.title}}</div>
    </div>
    <div class="empty" v-if="!newsList || newsList.length === 0">--暂未发现相关新闻--</div>
  </div>
</template>

<script>
  import Format from '../../util/format';

  export default {
    name: 'newsList',
    data() {
      return {
      };
    },
    props: {
      newsList: Array,
    },
    components: {
    },
    methods: {
      transfromDate(str) {
        if ((typeof str) !== 'string' || !str) {
          return str;
        }
        const today = Format.date(new Date(), 'MM-dd');
        let dateStr = Format.date(new Date(Number(str) * 1000), 'MM-dd hh:mm');
        dateStr = dateStr.replace(today, '今天');
        return dateStr;
      },
      getNew($event, item) {
        this.$emit('clickNew', item);
      },
    },
    computed: {
    },
    created() {
    },
  };
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/sass/static";
  *{
    padding: 0;
    margin: 0;
  }
  .text_hide {
    overflow: hidden;
    -ms-text-overflow: ellipsis;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .data-list-wrap {
    position: relative;
    flex: 1;
    width: 100%;
    max-height:100%;
    overflow-y: auto;
    .table-row {
      position: relative;
      width: 100%;
      height: 36px;
      display: -webkit-flex;
      display: flex;
      justify-content: center;
      align-items: center;
      border-bottom: 1px solid $G4;
      cursor: pointer;
      &:hover {
        background: #373737;
      }
      div {
        height: 36px;
        line-height: 36px;
        text-align: center;
      }
      .four {
        position: relative;
        flex: 1;
        max-width: 25%;
        min-width: 25%;
      }
      .two {
        position: relative;
        flex: 1;
        max-width: 50%;
        min-width: 50%;
        text-align: left;
      }
    }
    .empty {
      position: absolute;
      display: block;
      top: 50px;
      left: 0;
      width: 100%;
      height: 16px;
      line-height: 16px;
      text-align: center;
      font-size: 16px;
      color: #838383;
    }
  }
</style>
