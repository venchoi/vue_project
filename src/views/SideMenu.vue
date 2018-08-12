<template>
  <div id="side-menu">
    <div class="item" v-for="item in items" @click="linkTo(item)" :class="{ active: item.link === activeItem }">
      <div>
        <icon-font :iconName="item.icon.name" :size="item.icon.size" v-if="!item.logo"></icon-font>
        <img :src="item.logo" v-else/>
      </div>
      <div class="name">
        {{item.name}}
      </div>
    </div>
  </div>
</template>

<script>
  import {
    mapState,
  } from 'vuex';
  import IconFont from '../components/base/IconFont';
  import { actions } from '../model/vuex/actionsType';
  import {
    baseUtil,
  } from '../util';
  //    consult移动到footer组件显示，不在侧边栏
  const systemCodeMapToItem = {
    myStock: {
      name: '自选',
      link: '/mystock',
      logo: null,
      icon: {
        name: 'user',
        size: '35px',
      },
    },
    service: {
      name: '选股',
      link: '/service',
      logo: null,
      icon: {
        name: 'cloud',
        size: '27px',
      },
    },
    market: {
      name: '行情',
      link: '/market',
      logo: null,
      icon: {
        name: 'area-chart',
        size: '27px',
      },
    },
    reference: {
      name: '内参',
      link: '/reference',
      logo: null,
      icon: {
        name: 'newspaper-o',
        size: '27px',
      },
    },
    trading: {
      name: '实盘追踪',
      link: '/trading',
      logo: null,
      icon: {
        name: 'user',
        size: '27px',
      },
    },
    live: {
      name: '实时解盘',
      logo: null,
      link: '/live',
      icon: {
        name: 'question-circle-o',
        size: '27px',
      },
    },
    premium: {
      name: '私募内参',
      logo: null,
      link: '/premium',
      icon: {
        name: 'question-circle-o',
        size: '27px',
      },
    },
    subject: {
      name: '热门题材',
      logo: null,
      link: '/subject',
      icon: {
        name: 'question-circle-o',
        size: '27px',
      },
    },
    tendency: {
      name: '大势',
      link: '/tendency',
      logo: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA+tpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDE0IDc5LjE1Njc5NywgMjAxNC8wOC8yMC0wOTo1MzowMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxNCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDE3LTA5LTI2VDEwOjEyOjA0KzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAxNy0wOS0yNlQxMDoyNzoyMiswODowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAxNy0wOS0yNlQxMDoyNzoyMiswODowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6M0EyMENCNkRBMjYyMTFFNzkyQ0NDNkUyRTk3ODNDODciIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6M0EyMENCNkVBMjYyMTFFNzkyQ0NDNkUyRTk3ODNDODciPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDozQTIwQ0I2QkEyNjIxMUU3OTJDQ0M2RTJFOTc4M0M4NyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDozQTIwQ0I2Q0EyNjIxMUU3OTJDQ0M2RTJFOTc4M0M4NyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PkpdNFwAAAKRSURBVHja7Jg9axRBGICzMTF+RJOATWyiEEUErUJEQY2VEZsEIoqNlQRRVKwEwbQRFE8RVFCsTEpFwQ8QUQs1ougPEEwRJBA0RiziV9bnhfdgMpndnbs9b6/YgYe5m3ln5+G9nd2ZC8IwrKvlUl9X4yUXzAWzLg0wbrVtDoLge7VFeJoEVN3QD30wiUePCHZklVWkGql2qZDQbnS/L2aw2plqpurVTO2FlojQV8UBdmn9j3J9MBv6le4sFslbmPCImy3+xFUV5KYXua3wISH0HbG/M3nMMPEUVQ98jAl7mfVz8CB0xvS/Nm/cVIuE+JVwDq5Dh0f8EY8F0l4RQWJXwJgxdgI6S5S7BwXj+7g9qCxB4pbBU8d4p2SM3GLtP61to6kF5aLwMOYnmieZJGfE9UNXKkH6F8Fda8wcTLskfeXiJvQWVLnbjjEisQmmrPYvqeRKEZTdhq5Uu5wyYlySkXIyF7RVSvCSI/aMI64LZjzktsA1uJxakLZhR9yw9bgZgNXG5DMecvKL7E4laCx/s1wx+pfDkE4mWV6r7RvhhmTZkttmyPUmvhrDhQfjNt6X3/RiJ6gKVv9NOEyMDF3K55OwBn5Ck+5ECvR/ciRjp77mpNwh5lHZZxLZuznkRmBQ5SQrR1VONgBn4Q0sEWn618fIjfrIJW0W9lvf78MhLvyXyRpUbh18hQua9VswppLHidvgkBsh9lklTnVPjM+PYYAL/9HDzSDI5CJ1kfZp3UrNqeQLkPPGMeIPWHLPS9qeJdyDsrlcBQ8kc8UVS3UefmjmPkec0ERqh3l7lCpX7quuHvbM2xJFP9j3wVXYnuYgU7VDU/7XRxbFtUhkw/irlgVr7s+jIL8Hc8FcMLr8E2AA4ZdbIXqkZE0AAAAASUVORK5CYII=',
      icon: {
        name: 'question-circle-o',
        size: '27px',
      },
    },
    video_edu: {
      name: '视频教学',
      link: '/video_edu',
      logo: null,
      icon: {
        name: 'user',
        size: '27px',
      },
    },
  };
  export default {
    name: 'sideMenu',
    data() {
      return {
        activeItem: '/service',
        router: this.$router,
      };
    },
    components: {
      'icon-font': IconFont,
    },
    computed: {
      ...mapState({
        items(state) {
          const menu = state.menuConfig;
          const config = [];
          baseUtil.each(menu, (item) => {
            const menuItem = systemCodeMapToItem[item.system_code];
            if (!menuItem) {
              return;
            }
            const i = item;
            if (menuItem.logo) {
              delete i.logo;
            }
            if (menuItem) {
              config.push(baseUtil.merge(menuItem, item, true));
            }
          });
          return config;
        },
      }),
    },
    methods: {
      linkTo: function linkTo(item) {
        const link = item.link;
        if (item.system_code === 'consult') {
          this.$store.dispatch(actions.SHOW_CHAT);
          return;
        }
        if (!link) {
          return;
        }
        this.$router.push(link);
      },
    },
    watch: {
      $route() {
        this.activeItem = `/${this.$route.fullPath.split('/')[1].split('-')[0]}`;
      },
    },
    created() {
      if (this.$route.fullPath !== '/') {
        this.activeItem = this.$route.fullPath;
      }
    },
  };
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import "../assets/sass/static";
  /*::-webkit-scrollbar {// 隐藏滚动条*/
    /*display: none;*/
  /*}*/
  #side-menu {
    position: absolute;
    left: 0;
    top: 0;
    width: $sideMenuWidth;
    height: 100%;
    background-color: #223d80;
    z-index: 999;
    color: #fff;
    overflow-y: auto;
    .item {
      padding: 10px 0;
      text-align: center;
      font-size: 16px;
      cursor: pointer;
      &:hover,
      &.active {
        background: rgba(0, 0, 0, 0.3);
      }
      img{
        width: 45px;
        height: 45px;
      }
      .name {
        position: relative;
        height: 24px;
        line-height: 24px;
        text-align: center;
        font-size: 16px;
        margin: 0 auto;
        max-width: 64px;
        text-overflow: clip;
        white-space: nowrap;
        overflow: hidden;
      }
    }
  }
</style>
