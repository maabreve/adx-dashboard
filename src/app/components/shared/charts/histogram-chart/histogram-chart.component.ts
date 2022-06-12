import { Component, Input, OnInit, ViewChild } from '@angular/core';
@Component({
  selector: 'app-histogram-chart',
  templateUrl: './histogram-chart.component.html',
  styleUrls: ['./histogram-chart.component.scss']
})
export class HistogramChartComponent implements OnInit {
  @Input() data: Array<any>;
  @Input() categories: Array<any>;
  @Input() title: string;

  data2: any;
  options: any;

  ngOnInit(): void {
    // console.log('histogram chart compoent, data and categories  ', this.title, this.data, this.categories)
    this.data2 = {
      id: this.title,
      labels: this.categories,
      datasets: [
        {
          label: 'Amount',
          backgroundColor: '#42A5F5',
          borderColor: '#1E88E5',
          data: this.data,
          barThickness: 10,
        }
      ]
    };

    this.options = {
      legend: {
        display: false,
        labels: {
            fontColor: 'rgb(255, 99, 132)'
        }
      },
      title: {
        display: true,
        text: this.title,
        fontSize: 16,
        fontColor: '#ffffff'
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#ffffff',
            beginAtZero: true,
            // stepSize: 1,
          }
        }],
        xAxes: [{
          ticks: {
            fontColor: '#ffffff',
            beginAtZero: true,
            // stepSize: 1,
          }
        }]
      }
    };
  }

  selectData(event: any): void {
    console.log('Histogram selectData method', event)
  }
}
