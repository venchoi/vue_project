<template>
  <div class="news-list">
    <div class="news-head">
      <div class="title">
        <span v-text="headName"></span>
        <!--<i v-if="count" v-text="count"></i>-->
      </div>
    </div>
    <div class="item">
        <ul class="list">
          <li v-for="(item, index) in list" @click="clickItem(item.id, index)" :class="{active: index === selectItem}"><p v-text="item.title"></p></li>
        </ul>
    </div>
  </div>
</template>

<script>

export default {
  name: 'NewsList',
  data() {
    return {
      count: '',
      selectItem: 0,
      list: [],
    };
  },
  props: {
    newsList: {
      type: Array,
      require: true,
    },
    headName: {
      type: String,
      require: false,
    },
  },
  components: {
  },
  methods: {
    clickItem(id, index) {
      const vm = this;
      this.$emit('itemClick', id);
      vm.selectItem = index;
    },
  },
  computed: {
  },
  watch: {
    newsList() {
      const vm = this;
      vm.list = vm.newsList;
      vm.count = vm.newsList.length;
    },
  },
  created() {
    const vm = this;
    vm.list = vm.newsList;
    vm.count = vm.newsList.length;
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/sass/static";
  *{
    padding: 0;
    margin: 0;
  }
  .news-list{
    width: 100%;
    height: 100%;
    .news-head{
      width: 100%;
      height: 56px;
      background: #373737;
      position: relative;
      .title{
        position: absolute;
        top:50%;
        left: 50%;
        transform: translate(-50%, -50%);
        >span{
          font-size: 20px;
          color: #fff;
        }
        >i{
          position: absolute;
          right:-10px;
          transform: translateX(100%);
          top:7.5px;
          font-size: 12px;
          color: #fff;
          background: #f03426;
          padding:0 7px 1px 6px;
          border-radius: 3px;
          &:before{
            content: '';
            display: block;
            position: absolute;
            width: 0;
            height: 0;
            border-top: 3px solid transparent;
            border-right: 6px solid #f03426;
            border-bottom: 3px solid transparent;
            left:-5px;
            top:50%;
            transform: translateY(-50%);
          }
        }
      }
    }
    .item{
      width:100%;
      height: calc(100% - 56px);
      overflow-y: scroll;
      &::-webkit-scrollbar {
        width: 0;
        height: 8px;
      }
      &:hover{
        &::-webkit-scrollbar {
          width: 3px;
        }
      }
      .list{
        width:100%;
        li{
          width:100%;
          height: 56px;
          background: #2b2b2b;
          color: #c0c0c0;
          padding:0 20px;
          display: flex;
          align-items: center;
          border-bottom: 1px solid #242424;
          cursor: pointer;
          >p{
            width: 100%;
            line-height: 1.4;
            font-size: 14px;
            text-align: left;
            word-break: break-all;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
          }
          &:hover{
            background: #242424;
          }
        }
        .active{
          background: #242424;
        }
      }
    }
  }
</style>
