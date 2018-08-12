<template>
  <div class="stock-chart">
    <div class="chart-tag">
      <tags :items="stockTags" type="event" :tagEvent="tagEvent" ref="tags">
        <div slot="panel_0" class="chart">
          <tick-chart :code="code" ref="tickChart"></tick-chart>
        </div>
        <div slot="panel_1" class="chart">
          <k-chart :code="code" ref="kChart"></k-chart>
        </div>
        <div slot="panel_2" class="chart">
          <ten-days-tick-chart :code="code" ref="tenDaysTickChart" v-if="tenDaysShow"></ten-days-tick-chart>
        </div>
      </tags>
    </div>

  </div>


</template>

<script>
  import {
    mapState,
  } from 'vuex';
  import Tags from '../../components/base/Tags';
  import {
    baseUtil,
    ycjUtil,
  } from '../../util/index';
  import TickChart from './TickChart';
  import KChart from './KChart';
  import TenDaysTickChart from './TenDaysTickChart';

  export default {
    name: 'StockChart',
    data() {
      return {
        stockTags: [],
        tenDaysShow: false, // 个股才有十日分时
        hasMulti: false, // 是否有波段收割者的权限
      };
    },
    props: {
      code: {
        type: [Number, String],
        default: null,
      },
    },
    computed: {
      ...mapState({
        menuConfig: state => state.menuConfig,
      }),
    },
    created() {
      baseUtil.each(this.menuConfig, (item) => {
        if (item.system_code === 'multi') {
          this.hasMulti = true;
        }
      });
      if (!ycjUtil.isIndex(this.code) && this.hasMulti) {
        this.stockTags = ['分时', 'K线', '十日分时'];
        this.tenDaysShow = true;
      } else {
        this.stockTags = ['分时', 'K线'];
        this.tenDaysShow = false;
      }
    },
    watch: {

      menuConfig() {
        baseUtil.each(this.menuConfig, (item) => {
          if (item.system_code === 'multi') {
            this.hasMulti = true;
          }
        });
        if (this.hasMulti && !ycjUtil.isIndex(this.code)) {
          this.stockTags = ['分时', 'K线', '十日分时'];
          this.tenDaysShow = true;
        } else {
          this.stockTags = ['分时', 'K线'];
          this.tenDaysShow = false;
        }
      },
      code() {
        if (this.hasMulti && !ycjUtil.isIndex(this.code)) {
          this.stockTags = ['分时', 'K线', '十日分时'];
          this.tenDaysShow = true;
        } else {
          this.stockTags = ['分时', 'K线'];
          this.tenDaysShow = false;
        }
      },
      $route() {
        this.routerChange();
      },
    },
    components: {
      TickChart,
      KChart,
      Tags,
      TenDaysTickChart,
    },
    methods: {
      tagEvent(nowActive, active) {
        if (nowActive === active) {
          return;
        }
        const tags = this.stockTags;
        const type = tags[active];
        switch (type) {
          case '分时':
            setTimeout(() => {
              this.$refs.tickChart.resize();
            }, 0);
            break;
          case 'K线':
            setTimeout(() => {
              this.$refs.kChart.resize();
            }, 0);
            break;
          case '十日分时':
            setTimeout(() => {
              this.$refs.tenDaysTickChart.resize();
            }, 0);
            break;
          default:
            break;
        }
      },
      routerChange() {
        const type = this.$route.params.type;
        if (type === 'k') {
          this.$refs.tags.setActive(1);
        } else if (type === 'tenDaysTick') {
          this.$refs.tags.setActive(2);
        } else {
          this.$refs.tags.setActive(0);
        }
      },
    },
    mounted() {
      this.routerChange();
    },
  };
</script>

<style lang='scss' rel='stylesheet/scss'>
  .stock-chart {
    width: 100%;
    height: 100%;
    .chart-tag {
      height: 100%;
      .tag-body {
        height: calc(100% - 36px);
        .tag-panel {
          height: 100%;
        }
      }
      .chart {
        width: 100%;
        height: 100%;
      }
    }

  }
</style>
