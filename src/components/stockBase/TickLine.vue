<template>
    <div class="chart" :id="'c'+ chartId"></div>
</template>

<script>
  import evoChart from 'evoChart';
  import {
    uid,
//    baseUtil,
    ycjUtil,
  } from './../../util';
  import seriesStorage from '../../model/memory/seriesMemory';

  export default {
    name: 'TickLine',
    data() {
      return {
        isInit: false,
        chartId: uid(),
        prevCode: this.code,
      };
    },
    props: {
      code: {
        type: [String, Number],
        default: null,
      },
    },
    methods: {
      initChart() {
        const seriesData = seriesStorage.getData(this.code).tick || {};
        const tick = seriesData.line || []; // 分时图的240+1个点的指数信息
        const vol = seriesData.vol || []; // 成交量
        const preClose = seriesData.preClose || 0;
        if (document.querySelectorAll(`#c${this.chartId}`).length < 1) {
          return;
        }
        this.chart = evoChart.create({ // 初始化，独立于Vue
          chart: {
            container: `#c${this.chartId}`, // 容器，绑定页面显示位置
            margin: [10, 10, 10, 10], // 上下边距
            background: '#212121', // 背景颜色
            panable: false, // 是否可以拖动
          },
          plugins: {
            crosshair: false,
            axisTag: false,
            hoverPoint: false, // 开启事件插件，上面两个由此控制
          },
          tooltip: false, // 没有图标上方显示的鼠标所在处详细信息
          xAxis: [ // X轴配置
           // 分时图折线图
            {
              position: evoChart.static.BOTTOM, // X轴位置，X轴只有上下，bottom、top
              space: 0, // 像素单位，0是最小值，position位置的空间
              max: 'auto', // 坐标显示区间最大值，超过区间不会显示
              min: 'auto', // 坐标显示区间最小值
              limit: 0,
              interval: 5,
              inverse: false, // 反转
              ticks: [],
              rightLimit: 20, // 折线图右边空间
              offset: 0, // 平移比例，x只能水平，y只能垂直
              length: 100, // 坐标轴占绘图区域的比例
              label: () => null, // 下标() => null可将输入转化其他
              splitLine: null, // 红绿颜色分割
              grid: { // 网格线，可设奇偶mid
                style: {
                  stroke: '#2b2b2b', // 颜色
                  lineDash: null,
                },
              },
              style: { // 通用样式
                tick: { // 刻度
                  stroke: null,
                  textFill: null,
                },
                line: {
                  stroke: '#3b3b3b',
                },
                text: {
                  fill: '#e0e0e0',
                },

              },
            },
          // 成交量柱状图
            {
              position: evoChart.static.BOTTOM,
              title: {
                text: '',
                offset: 0,
                style: {},
              },
              space: 20,
              max: 'auto',
              min: 'auto',
              rightLimit: 20,
              limit: 0,
              interval: 5,
              inverse: false,
              ticks: () => [0, 60, 120, 180, 240], // x轴刻度，每一项进行下面label函数
              label: function label(v) {
                const vv = Math.round(v);
                const min = 60 * 1000;
                const hour = 60 * 60 * 1000;
                let result;

                result = evoChart.format.date(new Date((1.5 * hour) + (vv * min)), 'hh:mm');
                if (vv === 120) {
                  result = '11:30/13:00';
                } else if (vv >= 121) {
                  result = evoChart.format.date(new Date((3 * hour) + ((vv) * min)), 'hh:mm');
                }
                return result;
              },
              style: {
                tick: { // x轴刻度的样式
                  lineWidth: 0, // 宽度为0
                  stroke: '#e0e0e0', // 线段颜色
                  textFill: '#e0e0e0', // 文字填充颜色
                },
                line: {
                  stroke: '#3b3b3b', // x轴刻度线颜色
                },
                text: {
                  fill: '#e0e0e0', // x轴刻度文字填充颜色
                },
              },
            },
          ],
          yAxis: [
            // 分时图折线图
            {
              position: evoChart.static.LEFT, // Y轴位置，Y轴只有左右，left/right
              grid: { // 网格线
                style: {
                  stroke: '#2b2b2b',
                  lineDash: null,
                },
              },
              space: 35,
              topLimit: 0,
              bottomLimit: 10,
              interval: 0,
              inverse: false,
              ticks: 'tick', // 有默认参数，可以直接写数组[1，2，3]，每一项进行下面label函数
              splitLine: preClose, // 红绿颜色分割
              statusColor: ['#FF3232', '#f5f7fb', '#00E600'], // 分割线颜色配置分别为红白绿
              offset: 0,
              length: 70,
              label: (value) => {
                let fixed = 0;
                let result = '';
                if (!ycjUtil.isIndex(this.code)) {
                  fixed = 2;
                }
                if (typeof value === 'number') {
                  result = value.toFixed(fixed);
                }
                return result;
              },
              style: { // y轴刻度样式
                tick: {
                  stroke: '#e0e0e0',
                  textFill: '#e0e0e0',
                  lineWidth: 0,
                },
                line: {
                  stroke: '#2b2b2b',
                },
                text: {
                  fill: '#fff',

                },
              },
            },
            // 成交量柱状图
            {
              position: evoChart.static.LEFT,

              grid: {
                style: {
                  stroke: '#2b2b2b',
                  lineDash: null,
                },
                particular: { // 给第四条线加样式
                  4: {
                    stroke: null,
                    fill: null,
                  },
                },
              },
              space: 35,
              max: 'auto',
              min: 'auto',
              topLimit: 0,
              interval: 0,
              inverse: false,
              ticks: (max, min) => [(max + min) / 2], // 这里取中线位置
              offset: 70,
              length: 30,
              style: {
                tick: {
                  lineWidth: 0,
                  stroke: '#e0e0e0',
                },
                line: {
                  stroke: '#2b2b2b',
                },
                text: {
                  fill: null,
                },
              },
            },
            // 右侧y轴
            {
              position: evoChart.static.RIGHT,
              title: {
                text: '',
                offset: 0,
                style: {},
              },
              grid: false,
              space: 20,
              topLimit: 25,
              bottomLimit: 0,
              interval: 0,
              inverse: false,
              ticks: 'tick',
              splitLine: 0,
              statusColor: ['#FF3232', '#f5f7fb', '#00E600'],
              offset: 0,
              length: 70,
              label: (value) => {
                let result = `${value.toFixed(2)}%`;
                result = result.replace('-', '');
                return result;
              },
              style: {
                tick: {
                  stroke: '#e0e0e0',
                  textFill: '#e0e0e0',
                  lineWidth: 0,
                },
                line: {
                  stroke: '#2b2b2b',
                },
                text: {
                  fill: '#fff',
                  x: -5,
                },
              },
            },
          ],
          series: [ // 线段对象
            {
              type: 'tickLine', // 折线图
              data: tick, // 线段类型，可以传入数组
              name: 'tick',
              id: 'tick',
              coAxis: { // 辅助坐标
                type: 'y', // 选择x/y轴
                index: 2, // 选择在哪个y轴上展示
                pointField: 'ratio', // 选取显示字段
              },
              style: {
                circle: { // 线上的圆点样式
                  lineWidth: 0,
                },
                line: { // 线段设置
                  stroke: '#fff',
                  lineWidth: 1.5,
                  smooth: 0.5, // 锐化样式
                },
              },
            },
            {
              type: 'histogram', // 柱状图
              data: vol,
              id: 'vol',
              name: 'vol',
              gapSize: 1,
              yAxis: 1,
              xAxis: 1,
              splitLine: 0,
              statusColor: ['#dfe688', '#f5f7fb', '#14D55F'],
              style: {
                rect: {
                  stroke: '#dfe688',
                  fill: '#dfe688',
                  lineWidth: 1,
                },
              },
            },
          ],
        });

        this.chart.on('mousedown', () => {
          this.$router.push(`/stock/${this.code}`);
        });
        this.chart.loading.show();

        if (tick.length > 0) {
          this.chart.loading.hide();
          this.isInit = true;
        }
        seriesStorage.listen('tick', this.code, this.seriesHandler);
        seriesStorage.pullData({
          code: this.code,
          type: 'tick',
        });
      },
      refreshTick(data) {
        const chart = this.chart;
        const tick = data.line;
        const vol = data.vol;
        const preClose = data.preClose;
        const y = '_yAxis';
        if (chart) {
          if (preClose !== 0 && !this.isInit) {
            this.isInit = true;
            chart.getSeries('tick')[y].splitLine = preClose;
            chart.getSeries('tick')[y].max = 'auto';
            chart.getSeries('tick')[y].min = 'auto';
          }
          if (tick.length > 0) {
            chart.getSeries('tick').setSeries({
              points: tick,
              displayRange: 'latest',
            });
          }
          if (vol.length > 0) {
            chart.getSeries('vol').setSeries({
              points: vol,
              displayRange: 'latest',
            });
          }
          chart.loading.hide();
          chart.refresh();
        }
      },
      seriesHandler(e) {
        const data = e.data;
        this.refreshTick(data);
      },
    },
    watch: {
      code() {
        const chart = this.chart;
        if (!chart) {
          return;
        }
        chart.loading.show();
        this.isInit = false;
        seriesStorage.listen('tick', this.code, this.seriesHandler);
        seriesStorage.pullData({
          code: this.code,
          type: 'tick',
        });
        if (this.prevCode !== this.code) {
          seriesStorage.stopPullData({
            code: this.prevCode,
            type: 'tick',
          });
          seriesStorage.unlisten('tick', this.prevCode, this.seriesHandler);
          this.prevCode = this.code;
        }
      },
    },
    mounted() {
      if (!this.chart) {
        this.initChart();
      }
    },
    activated() {
      if (!this.chart) {
        this.initChart();
      }
    },
    destroyed() {
      if (this.chart) {
        this.chart.destroy();
        delete this.chart;
        seriesStorage.unlisten('tick', this.code, this.seriesHandler);
      }
    },
    deactivated() {
      if (this.chart) {
        this.chart.destroy();
        delete this.chart;
        seriesStorage.unlisten('tick', this.code, this.seriesHandler);
      }
    },
  };
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .chart {
    width: 100%;
    height: 100%;
  }
</style>
