import { Component, Input, OnInit } from '@angular/core';
import { Timeline } from 'src/app/models/charts.models';

@Component({
  selector: 'app-stacked-column-chart',
  templateUrl: './stacked-column-chart.component.html',
  styleUrls: ['./stacked-column-chart.component.scss']
})
export class StackedColumnChartComponent implements OnInit {
  @Input() timeline: Timeline;
  @Input() categories: Array<any>;
  @Input() feed: string;
  @Input() chartWidth: number;
  chartHeight = 150;
  data: any;
  options: any;

  ngOnInit(): void {
    let count = 1;

    const datasets = this.timeline?.series.map((value) => {
      let backgroundColor= '';
      let borderColor = '';

      if (count === 1) {
        backgroundColor= '#42A5F5';
        borderColor = '#1E88E5';
      } else if (count === 2) {
        backgroundColor= 'orange';
        borderColor = 'orange';
      } else {
        backgroundColor= 'green';
        borderColor = 'green';
      }

      count = count + 1;

      return {
        label: value?.name,
        backgroundColor,
        borderColor,
        data: value?.data
      }
    });

    this.data = {
      labels: this.timeline?.categories,
      datasets
    }

    this.options = {
      responsive: false,
      maintainAspectRatio: false,
      scales: {
        xAxes: [{
          stacked: true
        }],
        yAxes: [{
          stacked: true
        }]
      }
    };
  }

  getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

}
