import { Component, OnInit } from '@angular/core';

import { Chart, registerables } from 'chart.js';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexStroke,
  ApexTitleSubtitle,
  ApexNonAxisChartSeries,
  ApexResponsive
} from 'ng-apexcharts';

Chart.register(...registerables);

export type LineChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
};

export type BarChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
};

export type PieChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  responsive: ApexResponsive[];
};

@Component({
  selector: 'app-all-spendings',
  standalone: false,
  templateUrl: './all-spendings.html',
  styleUrl: './all-spendings.scss',
})
export class AllSpendings implements OnInit {
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
  categoryPieChartOptions: PieChartOptions;

  // Historical Comparison (Line chart)
  historicalSpendingThisYear = [150, 200, 180, 300, 250, 400, 320, 500, 450, 300, 280, 320];
  historicalSpendingLastYear = [100, 180, 170, 250, 200, 350, 280, 450, 400, 250, 220, 300];
  historicalLineChartOptions: LineChartOptions;

  // Top Vendors bar chart
  vendorsLabels = ['Amazon', 'Bookstore A', 'Bookstore B', 'Ebay', 'Others'];
  vendorsData = [1200, 600, 400, 150, 100];
  vendorsBarChartOptions: BarChartOptions;

  constructor() {
    // Initialize Pie Chart options
    this.categoryPieChartOptions = {
      series: this.categoryData,
      chart: {
        type: 'donut',
        height: 300
      },
      labels: this.categoryLabels,
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: { width: 250 },
            legend: { position: 'bottom' }
          }
        }
      ]
    };

    // Historical comparison line chart
    this.historicalLineChartOptions = {
      series: [
        { name: 'This Year', data: this.historicalSpendingThisYear },
        { name: 'Last Year', data: this.historicalSpendingLastYear }
      ],
      chart: {
        height: 350,
        type: 'line'
      },
      dataLabels: { enabled: false },
      stroke: { curve: 'smooth' },
      title: { text: 'Monthly Spending: This Year vs Last Year' },
      xaxis: {
        categories: [
          'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ]
      }
    };

    // Top Vendors bar chart
    this.vendorsBarChartOptions = {
      series: [{
        name: 'Spending',
        data: this.vendorsData
      }],
      chart: {
        height: 300,
        type: 'bar'
      },
      xaxis: {
        categories: this.vendorsLabels
      },
      title: {
        text: 'Top Vendors / Stores'
      }
    };
  }

  ngOnInit() {
    this.checkBudgetAlert();
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
      ...this.categoryLabels.map((label, i) => [label, this.categoryData[i].toString()])
    ];
    const csvContent = csvRows.map(e => e.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    const url = URL.createObjectURL(blob);

    a.href = url;
    a.download = 'spending_categories.csv';
    a.click();
    URL.revokeObjectURL(url);
  }
}
