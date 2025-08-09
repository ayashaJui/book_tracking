import { Component, ViewChild } from '@angular/core';

import {
  ApexAxisChartSeries,
  ApexTitleSubtitle,
  ApexDataLabels,
  ApexChart,
  ChartComponent,
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  fill: ApexFill;
  tooltip: ApexTooltip;
  legend: ApexLegend;
};

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  @ViewChild('chart') chart!: ChartComponent;
  public chartOptions!: ChartOptions;

  ratingValue: number = 4.5;
  events: any[] = [];

  genreChartData = {
    labels: ['Fiction', 'Non-Fiction', 'Mystery', 'Other'],
    datasets: [
      {
        data: [40, 25, 20, 15],
        backgroundColor: ['#3b82f6', '#34d399', '#a78bfa', '#fcd34d'],
      },
    ],
  };

  monthlyReadingChartData = {
    labels: ['Jan', 'Feb', 'Mar'],
    datasets: [
      {
        label: 'Reading Time (min)',
        data: [7, 13, 6],
        backgroundColor: '#60a5fa',
      },
    ],
  };

  constructor() {}

  ngOnInit() {
    this.chartOptions = {
      series: this.generateSeriesData(),
      chart: {
        height: 350,
        type: 'heatmap',
      },
      plotOptions: {
        heatmap: {
          shadeIntensity: 0.5,
          radius: 5,
          useFillColorAsStroke: false,
          colorScale: {
            ranges: [
              { from: 0, to: 0, name: 'None', color: '#f3f4f6' },
              { from: 1, to: 2, name: 'Low', color: '#cbd5e1' },
              { from: 3, to: 5, name: 'Medium', color: '#60a5fa' },
              { from: 6, to: 10, name: 'High', color: '#2563eb' },
            ],
          },
        },
      },
      xaxis: {
        categories: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
      },
      dataLabels: {
        enabled: false,
      },
      fill: {
        type: 'solid',
      },
      tooltip: {
        enabled: true,
        y: {
          formatter: (val: number) => `${val} mins`,
        },
      },
      legend: {
        show: true,
      },
    };

    this.events = [
      {
        status: 'Ordered',
        date: '15/10/2020 10:30',
        icon: 'pi pi-shopping-cart',
        color: '#9C27B0',
        image: 'game-controller.jpg',
      },
      {
        status: 'Processing',
        date: '15/10/2020 14:00',
        icon: 'pi pi-cog',
        color: '#673AB7',
      },
      {
        status: 'Shipped',
        date: '15/10/2020 16:15',
        icon: 'pi pi-shopping-cart',
        color: '#FF9800',
      },
      {
        status: 'Delivered',
        date: '16/10/2020 10:00',
        icon: 'pi pi-check',
        color: '#607D8B',
      },
    ];
  }

  generateSeriesData(): ApexAxisChartSeries {
    const data = [];

    for (let i = 0; i < 4; i++) {
      data.push({
        name: `Week ${i + 1}`,
        data: Array.from({ length: 7 }, () => ({
          x: '',
          y: Math.floor(Math.random() * 10), // Random reading time
        })),
      });
    }

    return data;
  }
}
