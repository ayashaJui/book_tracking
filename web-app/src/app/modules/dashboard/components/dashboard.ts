import { Component, ViewChild } from '@angular/core';

import {
  ApexAxisChartSeries,
  ApexTitleSubtitle,
  ApexDataLabels,
  ApexChart,
  ChartComponent,
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexLegend,
  ApexPlotOptions,
  ApexXAxis,
  ApexYAxis,
  ApexFill,
  ApexTooltip,
} from 'ng-apexcharts';
import { LayoutService } from '../../../layout/service/layout.service';
import { UiService } from '../../shared/services/ui.service.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  dataLabels: ApexDataLabels;
  fill: ApexFill;
  legend: any;
  tooltip: any;
};

export type PieChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  colors: string[];
  legend: ApexLegend;
  responsive: ApexResponsive[];
};

export type BarChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  colors?: string[];
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  tooltip: any;
};

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  subscription: Subscription[] = [];

  @ViewChild('chart') chart!: ChartComponent;
  public chartOptions!: ChartOptions;
  @ViewChild('genrePieChart') genrePieChart!: ChartComponent;
  public genreChartOptions!: PieChartOptions;
  @ViewChild('monthlyReadingChart') monthlyReadingChart!: ChartComponent;
  public monthlyReadingChartOptions!: BarChartOptions;

  ratingValue: number = 4.5;
  events: any[] = [];

  constructor(
    private layoutService: LayoutService,
    private uiService: UiService,
    private router: Router
  ) {}

  ngOnInit() {
    this.initializeHeatmapChart();
    this.initializeGenreChart();
    this.initializeMonthlyReadingChart();
    this.initializeEvents();
  }

  initializeHeatmapChart() {
    this.chartOptions = {
      series: this.generateSeriesData(),
      chart: {
        height: 350,
        type: 'heatmap',
        toolbar: {
          show: false,
        },
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
        labels: {
          style: {
            colors: this.layoutService.isDarkTheme() ? '#f2f3f4' : '#4b5563',
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: this.layoutService.isDarkTheme() ? '#f2f3f4' : '#4b5563',
          },
        },
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
        theme: this.layoutService.isDarkTheme() ? 'dark' : 'light',
      },
      legend: {
        show: true,
        labels: {
          colors: this.layoutService.isDarkTheme() ? '#f2f3f4' : '#4b5563',
        },
      },
    };

    this.subscription.push(
      this.uiService.colorScheme$.subscribe((colorScheme) => {
        const newColor = colorScheme === 'dark' ? '#f2f3f4' : '#4b5563';

        this.chart.updateOptions({
          xaxis: {
            labels: {
              style: {
                colors: newColor,
              },
            },
          },
          yaxis: {
            labels: {
              style: {
                colors: newColor,
              },
            },
          },
          tooltip: {
            theme: colorScheme,
          },
          legend: {
            labels: {
              colors: newColor,
            },
          },
        });
      })
    );
  }

  initializeGenreChart() {
    this.genreChartOptions = {
      series: [40, 25, 20, 15],
      chart: {
        type: 'pie',
        width: 380,
      },
      labels: ['Fiction', 'Non-Fiction', 'Mystery', 'Other'],
      colors: ['#3b82f6', '#34d399', '#a78bfa', '#fcd34d'],
      legend: {
        position: 'bottom',
        labels: {
          colors: this.layoutService.isDarkTheme() ? '#f2f3f4' : '#4b5563',
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
    };

    this.subscription.push(
      this.uiService.colorScheme$.subscribe((colorScheme) => {
        const newColor = colorScheme === 'dark' ? '#f2f3f4' : '#4b5563';

        this.genrePieChart.updateOptions({
          legend: {
            labels: {
              colors: newColor,
            },
          },
        });
      })
    );
  }

  initializeMonthlyReadingChart() {
    this.monthlyReadingChartOptions = {
      series: [
        {
          name: 'Reading Time (min)',
          data: [7, 13, 6],
        },
      ],
      chart: {
        type: 'bar',
        height: 350,
        toolbar: {
          show: false,
        },
      },
      xaxis: {
        title: {
          text: 'Months',
          style: {
            color: this.layoutService.isDarkTheme() ? '#f2f3f4' : '#4b5563',
          },
        },
        categories: ['Jan', 'Feb', 'Mar'],
        labels: {
          style: {
            colors: this.layoutService.isDarkTheme() ? '#f2f3f4' : '#4b5563',
          },
        },
      },
      yaxis: {
        title: {
          text: 'Minutes',
          style: {
            color: this.layoutService.isDarkTheme() ? '#f2f3f4' : '#4b5563',
          },
        },
        labels: {
          style: {
            colors: this.layoutService.isDarkTheme() ? '#fff' : '#415B61',
          },
        },
      },
      colors: ['#60a5fa'],
      dataLabels: {
        enabled: false,
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          horizontal: false,
        },
      },
      tooltip: {
        theme: this.layoutService.isDarkTheme() ? 'dark' : 'light',
      },
    };

    this.subscription.push(
      this.uiService.colorScheme$.subscribe((colorScheme) => {
        const newColor = colorScheme === 'dark' ? '#f2f3f4' : '#4b5563';

        this.monthlyReadingChart.updateOptions({
          yaxis: {
            title: {
              style: {
                color: newColor,
              },
              text: 'Minutes',
            },
            labels: {
              style: {
                colors: newColor,
              },
            },
          },
          xaxis: {
            title: {
              style: {
                color: newColor,
              },
            },
            labels: {
              style: {
                colors: newColor,
              },
            },
          },

          tooltip: {
            theme: colorScheme,
          },
        });
      })
    );
  }

  initializeEvents() {
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

  // Dynamic methods for updating chart data
  updateGenreData(newData: number[], newLabels: string[]) {
    this.genreChartOptions.series = newData;
    this.genreChartOptions.labels = newLabels;
  }

  updateMonthlyReadingData(newData: number[], newCategories: string[]) {
    this.monthlyReadingChartOptions.series = [
      {
        name: 'Reading Time (min)',
        data: newData,
      },
    ];
    this.monthlyReadingChartOptions.xaxis = {
      categories: newCategories,
    };
  }

  addNewBook() {
    this.router.navigate(['/books/add-book']);
  }

  addNewQuote() {
    this.router.navigate(['/quotes/add']);
  }

  viewWishlist() {
    this.router.navigate(['/wishlist']);
  }

  updateProgress() {
    this.router.navigate(['/reading-logs']);
  }
}
