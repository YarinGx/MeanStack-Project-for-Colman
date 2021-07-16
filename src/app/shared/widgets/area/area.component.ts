import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-widget-area',
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.css']
})
export class AreaComponent implements OnInit {

  chartOptions!: Highcharts.Options;
  Highcharts = Highcharts;
  value = 100;

  constructor() {


  }

  ngOnInit() {

    this.chartOptions= {
      chart: {
        type: 'area'
      },
      title: {
        text: 'Historic and Estimated Worldwide Population Growth by Region'
      },
      subtitle: {
        text: 'Source: Wikipedia.org'
      },
      tooltip: {
        split: true,
        valueSuffix: ' millions'
      },
      plotOptions: {
        area: {
          stacking: 'normal',
          lineColor: '#666666',
          lineWidth: 1,
          marker: {
            lineWidth: 1,
            lineColor: '#666666'
          }
        }
      },
      credits: {enabled: false},
      exporting: {enabled: true},
      series: [{
        name: 'Asia',
        type: 'line',
        data: [502, 635, 809, 947, 1402, 3634, 5268]
      }, {
        name: 'Africa',
        type: 'line',
        data: [106, 107, 111, 133, 221, 767, 1766]
      }, {
        name: 'Europe',
        type: 'line',
        data: [163, 203, 276, 408, 547, 729, 628]
      }, {
        name: 'America',
        type: 'line',
        data: [18, 31, 54, 156, 339, 818, 1201]
      }, {
        name: 'Oceania',
        type: 'line',
        data: [2, 2, 2, 6, 13, 30, 46]
      }]
    };
    setTimeout(() => {
      window.dispatchEvent(
        new Event('resize')
      )
    }, 300);

  }


}
