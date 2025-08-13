import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';

import { Chart, registerables } from 'chart.js';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexStroke,
  ApexTitleSubtitle,
  ApexNonAxisChartSeries,
  ApexResponsive,
  ChartComponent,
} from 'ng-apexcharts';
import { LayoutService } from '../../../../layout/service/layout.service';
import { Subscription } from 'rxjs';
import { UiService } from '../../../shared/services/ui.service.service';

Chart.register(...registerables);

export type LineChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  stroke: ApexStroke;
  yaxis: ApexYAxis;
  title: ApexTitleSubtitle;
  tooltip: any;
  legend?: any;
};

export type BarChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  title: ApexTitleSubtitle;
  tooltip: any;
};

export type PieChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  title: ApexTitleSubtitle;
  legend?: any;
};

@Component({
  selector: 'app-all-spendings',
  standalone: false,
  templateUrl: './all-spendings.html',
  styleUrl: './all-spendings.scss',
})
export class AllSpendings implements OnInit {
  subscriptions: Subscription[] = [];

  // Summary stats
  totalSpent = 2450;
  thisMonth = 320;
  mostExpensive = 'Deluxe Hardcover Set';
  avgPerBook = 25;

  // Monthly Budget & Alert
  monthlyBudget: number = 500; // default budget
  alertMessage: string | null = null;

  // Category breakdown for pie chart
  categoryLabels = ['Fiction', 'Self-help', 'Classic', 'Sci-fi', 'Other'];
  categoryData = [800, 450, 400, 350, 350];
  categoryPieChartOptions!: PieChartOptions;
  @ViewChild('piechart') piechart!: ChartComponent;

  // Historical Comparison (Line chart)
  historicalSpendingThisYear = [
    150, 200, 180, 300, 250, 400, 320, 500, 450, 300, 280, 320,
  ];
  historicalSpendingLastYear = [
    100, 180, 170, 250, 200, 350, 280, 450, 400, 250, 220, 300,
  ];
  historicalLineChartOptions!: LineChartOptions;
  @ViewChild('historicalLineChart') historicalLineChart!: ChartComponent;

  // Top Vendors bar chart
  vendorsLabels = ['Amazon', 'Bookstore A', 'Bookstore B', 'Ebay', 'Others'];
  vendorsData = [1200, 600, 400, 150, 100];
  vendorsBarChartOptions!: BarChartOptions;
  @ViewChild('vendorsBarChart') vendorsBarChart!: ChartComponent;

  constructor(
    private layoutService: LayoutService,
    private uiService: UiService
  ) {}

  ngOnInit() {
    this.checkBudgetAlert();
    const initialColor = this.layoutService.isDarkTheme()
      ? '#f2f3f4'
      : '#415B61';

    this.categoryPieChartOptions = {
      series: this.categoryData,
      chart: {
        type: 'donut',
        height: 300,
      },
      title: {
        text: 'Spending by Category',

        style: {
          color: initialColor,
        },
      },
      labels: this.categoryLabels,
      legend: {
        labels: {
          colors: this.categoryLabels.map(() => initialColor),
        },
      },
    };
    // Historical comparison line chart
    this.historicalLineChartOptions = {
      series: [
        { name: 'This Year', data: this.historicalSpendingThisYear },
        { name: 'Last Year', data: this.historicalSpendingLastYear },
      ],
      chart: {
        height: 350,
        type: 'line',
        toolbar: {
          show: false,
        },
      },
      dataLabels: { enabled: false },
      stroke: { curve: 'smooth' },
      title: {
        text: 'Monthly Spending: This Year vs Last Year',
        style: { color: initialColor },
      },
      xaxis: {
        labels: {
          style: {
            colors: initialColor,
          },
        },
        categories: [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ],
      },
      yaxis: {
        labels: {
          style: {
            colors: initialColor,
          },
        },
      },
      tooltip: {
        enabled: true,
        theme: this.layoutService.isDarkTheme() ? 'dark' : 'light',
      },
      legend: {
        labels: {
          colors: this.categoryLabels.map(() => initialColor),
        },
      },
    };
    // Top Vendors bar chart
    this.vendorsBarChartOptions = {
      series: [
        {
          name: 'Spending',
          data: this.vendorsData,
        },
      ],
      chart: {
        height: 300,
        type: 'bar',
        toolbar: { show: false },
      },
      xaxis: {
        categories: this.vendorsLabels,
        labels: {
          style: {
            colors: initialColor,
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: initialColor,
          },
        },
      },
      title: {
        text: 'Top Vendors / Stores',
        style: {
          color: initialColor,
        },
      },
      tooltip: {
        enabled: true,
        theme: this.layoutService.isDarkTheme() ? 'dark' : 'light',
      },
    };

    this.subscriptions.push(
      this.uiService.colorScheme$.subscribe((colorScheme) => {
        const newColor = colorScheme === 'dark' ? '#f2f3f4' : '#415B61';
        const allColors = this.categoryLabels.map(() => newColor);

        this.piechart?.updateOptions({
          title: {
            style: {
              color: newColor,
            },
          },

          legend: {
            labels: {
              colors: allColors,
            },
          },
        });

        this.historicalLineChart?.updateOptions({
          title: {
            style: {
              color: newColor,
            },
          },
          tooltip: {
            theme: colorScheme,
          },
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

          legend: {
            labels: {
              colors: allColors,
            },
          },
        });

        this.vendorsBarChart?.updateOptions({
          title: {
            style: {
              color: newColor,
            },
          },
          xaxis: {
            labels: {
              style: {
                colors: allColors,
              },
            },
          },
          yaxis: {
            labels: {
              style: {
                colors: allColors,
              },
            },
          },
          tooltip: {
            enabled: true,
            theme: colorScheme,
          },
        });
      })
    );
  }

  checkBudgetAlert() {
    if (this.thisMonth > this.monthlyBudget) {
      this.alertMessage = `⚠️ You have exceeded your monthly budget of $${this.monthlyBudget}!`;
    } else if (this.thisMonth > this.monthlyBudget * 0.8) {
      this.alertMessage = `⚠️ You are nearing your monthly budget of $${this.monthlyBudget}.`;
    } else {
      this.alertMessage = null;
    }
  }

  onBudgetChange() {
    this.checkBudgetAlert();
  }

  // Export spending data to CSV
  exportToCSV() {
    const csvRows = [
      ['Category', 'Amount'],
      ...this.categoryLabels.map((label, i) => [
        label,
        this.categoryData[i].toString(),
      ]),
    ];
    const csvContent = csvRows.map((e) => e.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    const url = URL.createObjectURL(blob);

    a.href = url;
    a.download = 'spending_categories.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
