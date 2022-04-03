import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import * as Chartjs from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels'

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit, AfterViewInit {

  @Input() data: any;
  @Input() chartType: any;
  @Input() options = {};
  @ViewChild('chart') chart: any;

  constructor() {
    Chart.register(...registerables)
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    let plugins = [];
    let pie = this.data.labels.length < 5;

    if (pie) {
      plugins.push(ChartDataLabels);
    }

    let options = {
      ...this.options,
      plugins: {
        legend: {
          display: pie ? true : false,
        },
        datalabels: {
          color: '#212121',
          style: {
            textOutline: 'none'
          },
          textStrokeWidth: 0.2,
          formatter: (val) => {
            // Return 2 decimal places if the value is a decimal, if not return the value
            return val != 0 ? val % 1 ? parseFloat(val).toFixed(1) + '%' : val : '';
          }
        }
      },
      scales: {
        xAxes:
        {
          ticks: {
            // autoSkip: false,
            maxRotation: 90,
            minRotation: 90,
            fontSize: 6
          },
        }
      }
    };

    if(pie){
      delete options.scales;
    }

    let ctx = this.chart.nativeElement.getContext('2d');
    const myChart = new Chart(ctx, {
      data: this.data,
      type: this.chartType,
      options,
      plugins
    });
  }

}
