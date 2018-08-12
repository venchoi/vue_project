<template>
  <div class="chart" :id="'c'+ chartId"></div>
</template>

<script>
  import evoChart from 'evoChart';

  import StockDetails from './StockDetails';
  import {
    uid,
//    baseUtil,
  } from './../../util';
  import seriesStorage from '../../model/memory/seriesMemory';


  export default {
    components: {
      StockDetails,
    },
    name: '',
    data() {
      return {
        chartId: uid(),
        prevCode: null,
      };
    },
    props: {
      code: {
        type: [String, Number],
        default: null,
      },
    },
    watch: {
      code() {
        if (!this.chart) {
          return;
        }
        this.chart.loading.show();
        seriesStorage.listen('k', this.code, this.seriesHandler);
        seriesStorage.pullData({
          code: this.code,
          type: 'k',
        });
        if (this.prevCode !== this.code) {
          seriesStorage.stopPullData({
            code: this.prevCode,
            type: 'k',
          });
          seriesStorage.unlisten('k', this.prevCode, this.seriesHandler);
          this.prevCode = this.code;
        }
      },
    },
    methods: {
      initChart() {
        const self = this;
        const seriesData = seriesStorage.getData(this.code).k || {};
        let k = seriesData.line || [];
        let vol = seriesData.vol || [];

        if (k.length > 100) {
          k = k.slice(k.length - 100, k.length);
          vol = vol.slice(vol.length - 100, vol.length);
        }
        if (document.querySelectorAll(`#c${this.chartId}`).length < 1) {
          return;
        }
        this.chart = evoChart.create({
          chart: {
            container: `#c${this.chartId}`,
            margin: [10, 10, 10, 10],
            background: '#212121',
            panable: false,
          },
          plugins: {
            crosshair: false,
            axisTag: false,
            hoverPoint: false,
          },
          tooltip: false,
          xAxis: [
            {
              position: evoChart.static.BOTTOM,
              space: 0,
              limit: 0,
              interval: 5,
              inverse: false,
              ticks: false,
              rightLimit: 20,
              offset: 0,
              length: 100,
              label: false,
              splitLine: null,
              style: {
                tick: {
                  length: 0,
                },
                line: {
                  stroke: '#2b2b2b',
                },
                text: {
                  fill: '#e0e0e0',
                },
              },
            },
            {
              position: evoChart.static.BOTTOM,
              grid: {},
              space: 40,
              rightLimit: 20,
              limit: 0,
              interval: 5,
              inverse: false,
              offset: 0,
              length: 100,
              ticks: (max, min) => {
                if (!self.chart) {
                  return [];
                }
                const length = max - min;
                const result = [];
                const series = self.chart.getSeries('k');
                const monthCache = {};
                const yearCache = {};
                let j = 0;
                if (!series) {
                  return result;
                }
                for (j; j < length; j += 1) {
                  const index = min + j;
                  const point = series.points[index];
                  if (point.date) {
                    const date = point.date.split('-');
                    const year = date[0];
                    const month = date[1];
                    if (!yearCache[year]) {
                      result.push({
                        x: index,
                        text: year,
                      });
                      yearCache[year] = 1;
                    } else if (!monthCache[year + month] && month !== '01') {
                      result.push({
                        x: index,
                        text: `${month}月`,
                      });
                      monthCache[year + month] = 1;
                    }
                  }
                }
                return result;
              },
              label(v) {
                const val = parseInt(v, 10);
                const series = self.chart.getSeries('k');
                let point;
                let result = '';
                if (series) {
                  point = series.points[val];
                  if (point) {
                    result = point.date;
                  }
                }
                return result;
              },
              style: {
                tick: {
                  stroke: null,
                },
                line: {
                  stroke: '#2b2b2b',
                },
                text: {
                  fill: '#e0e0e0',
                },
              },
            },
          ],
          yAxis: [
            {
              position: evoChart.static.LEFT,
              grid: {},

              space: 40,
              topLimit: 0,
              bottomLimit: 0,
              inverse: false,
              ticks: 'auto',
              offset: 0,
              length: 70,
              label: value => evoChart.format.num(value, 'cn', 2),
              style: {
                tick: {
                  stroke: null,
                  textFill: '#e0e0e0',
                },
                line: {
                  stroke: '#2b2b2b',
                },
                text: {
                  fill: '#e0e0e0',
                },
              },
            },
            {
              position: evoChart.static.LEFT,
              grid: false,
              space: 40,
              interval: 0,
              inverse: false,
              ticks: false,
              offset: 70,
              length: 30,
              style: {
                tick: {
                  stroke: null,
                },
                line: {
                  stroke: '#2b2b2b',
                },
                text: {
                  fill: '#e0e0e0',
                },
              },
            },
          ],
          series: [
            {
              type: 'histogram', // {"y": "11295", "color": "#54FCFC"}
              name: 'vol',
              id: 'vol',
              data: vol,
              yAxis: 1,
              xAxis: 1,
              style: {
                rect: {
                  fill: '#dfe688',
                  stroke: null,
                  lineWidth: 1,
                },
              },
            },
            {
              type: 'candleStick',
              id: 'k',
              data: k,
              gapSize: 2,
              statusColor: ['#FF3232', '#f5f7fb', '#54FCFC'],
              style: {},
            },
          ],
        });
        this.chart.loading.show();
        this.chart.on('mousedown', () => {
          this.$router.push(`/stock/${this.code}/k`);
        });
        if (k.length > 0) {
          this.chart.loading.hide();
        } else {
          seriesStorage.listen('k', this.code, this.seriesHandler);
          seriesStorage.pullData({
            code: this.code,
            type: 'k',
          });
        }
      },
      refreshTick(data) {
        const chart = this.chart;
        let k = data.line;
        let vol = data.vol;
        if (k.length > 100) {
          k = k.splice(k.length - 100, k.length);
          vol = vol.splice(vol.length - 100, vol.length);
        }
        if (chart) {
          if (k.length > 0) {
            chart.getSeries('k').setSeries({
              points: k,
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
    deactivated() {
      if (this.chart) {
        this.chart.destroy();
        delete this.chart;
        seriesStorage.unlisten('k', this.code, this.seriesHandler);
      }
    },
    destroyed() {
      if (this.chart) {
        this.chart.destroy();
        delete this.chart;
        seriesStorage.unlisten('k', this.code, this.seriesHandler);
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
