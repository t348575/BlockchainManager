import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import {ElectronService} from 'ngx-electron';
@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.page.html',
  styleUrls: ['./statistics.page.scss'],
})
export class StatisticsPage implements OnInit {
  HighchartsTCP = Highcharts;
  HighchartsHTTP = Highcharts;
  chartTCP;
  chartHTTP;
  updateFlagTCP = true;
  chartConstructorTCP = 'chart';
  chartCallbackTCP;
  chartOptionsTCP = {
    chart: {
      spacingLeft: 10,
      type: 'spline',
      animation: true,
    },
    time: {
      useUTC: false
    },

    title: {
      text: 'TCP transfer rate'
    },
    xAxis: {
      type: 'datetime',
      tickPixelInterval: 100
    },
    credits: {
      enabled: false
    },
    yAxis: {
      title: {
        text: 'Bytes\/s'
      },
      plotLines: [{
        value: 0,
        width: 1,
        color: '#808080'
      }]
    },
    tooltip: {
      headerFormat: '<b>{series.name}</b><br/>',
      pointFormat: '{point.x:%Y-%m-%d %H:%M:%S}<br/>{Math.floor(point.y)}'
    },
    exporting: {
      enabled: false
    },
    series: [{
      name: 'TCP data',
      type: undefined,
      lineColor: Highcharts.getOptions().colors[0],
      data: [{ x: this.electronService.remote.getGlobal('TCPByteCount').secondsArray[0].x * 1000, y: 0}]
    }]
  };
  lastUpdatedTCP: number;
  lastValueTCP: number;
  updateFlagHTTP = true;
  chartConstructorHTTP = 'chart';
  chartCallbackHTTP;
  chartOptionsHTTP = {
    chart: {
      spacingLeft: 10,
      type: 'spline',
      animation: true,
    },
    time: {
      useUTC: false
    },

    title: {
      text: 'HTTP transfer rate'
    },
    xAxis: {
      type: 'datetime',
      tickPixelInterval: 100
    },
    credits: {
      enabled: false
    },
    yAxis: {
      title: {
        text: 'Bytes\/s'
      },
      plotLines: [{
        value: 0,
        width: 1,
        color: '#808080'
      }]
    },
    tooltip: {
      headerFormat: '<b>{series.name}</b><br/>',
      pointFormat: '{point.x:%Y-%m-%d %H:%M:%S}<br/>{Math.floor(point.y)}'
    },
    exporting: {
      enabled: false
    },
    series: [{
      name: 'HTTP data',
      type: undefined,
      lineColor: Highcharts.getOptions().colors[0],
      data: [{ x: this.electronService.remote.getGlobal('HTTPByteCount').secondsArray[0].x * 1000, y: 0}]
    }]
  };
  lastUpdatedHTTP: number;
  lastValueHTTP: number;
  updateChartTCP(chart: any) {
    if (this.electronService.isElectronApp) {
      this.electronService.ipcRenderer.on('update-stats', (event, message) => {
        const TCPByteCount = this.electronService.remote.getGlobal('TCPByteCount');
        const val = TCPByteCount.secondsArray[TCPByteCount.secondsArray.length - 1];
        const series = chart.series[0];
        if (val.x > this.lastUpdatedTCP) {
          series.addPoint([val.x * 1000, val.y], true, false);
          this.lastUpdatedTCP = val.x;
          this.lastValueTCP = val.y;
        } else if (this.lastValueTCP !== 0) {
          series.addPoint([new Date().getTime(), 0], true, true);
          this.lastUpdatedTCP = val.x;
          this.lastValueTCP = 0;
        }
      });
    }
  }
  updateChartHTTP(chart: any) {
    if (this.electronService.isElectronApp) {
      this.electronService.ipcRenderer.on('update-stats', (event, message) => {
        const HTTPByteCount = this.electronService.remote.getGlobal('HTTPByteCount');
        const val = HTTPByteCount.secondsArray[HTTPByteCount.secondsArray.length - 1];
        const series = chart.series[0];
        if (val.x > this.lastUpdatedHTTP) {
          series.addPoint([val.x * 1000, val.y], true, false);
          this.lastUpdatedHTTP = val.x;
          this.lastValueHTTP = val.y;
        } else if (this.lastValueHTTP !== 0) {
          series.addPoint([new Date().getTime(), 0], true, true);
          this.lastUpdatedHTTP = val.x;
          this.lastValueHTTP = 0;
        }
      });
    }
  }
  constructor(private electronService: ElectronService) {
    this.chartCallbackTCP = chart => {
      this.chartTCP = chart;
      this.lastUpdatedTCP = new Date().getTime() / 1000;
      this.lastValueTCP = 0;
      setTimeout(() => this.updateChartTCP(chart), 1000);
    };
    this.chartCallbackHTTP = chart => {
      this.chartHTTP = chart;
      this.lastUpdatedHTTP = new Date().getTime() / 1000;
      this.lastValueHTTP = 0;
      setTimeout(() => this.updateChartHTTP(chart), 1000);
    };
  }

  ngOnInit() {

  }
}
