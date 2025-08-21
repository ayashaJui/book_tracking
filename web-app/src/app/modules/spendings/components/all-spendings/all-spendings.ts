import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';

import { Chart, registerables } from 'chart.js';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexYAxis,
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
  title?: ApexTitleSubtitle;
  tooltip: any;
  legend?: any;
  grid?: any;
  responsive?: ApexResponsive[];
};

export type BarChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  title?: ApexTitleSubtitle;
  tooltip: any;
  responsive?: ApexResponsive[];
};

export type PieChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  title?: ApexTitleSubtitle;
  legend?: any;
  responsive?: ApexResponsive[];
};

@Component({
  selector: 'app-all-spendings',
  standalone: false,
  templateUrl: './all-spendings.html',
  styleUrl: './all-spendings.scss',
})
export class AllSpendings implements OnInit {
  subscriptions: Subscription[] = [];

  // Make Math available in template
  Math = Math;

  // Detailed Report Modal
  showDetailedReport = false;
  detailedReportData: any[] = [];

  // Summary stats
  totalSpent = 2450;
  thisMonth = 320;
  mostExpensive = 'Deluxe Hardcover Set';
  avgPerBook = 25;

  // Budget & view
  monthlyBudget: number = 200;
  isYearly: boolean = false;
  alertMessage: string | null = null;
  vendorFilter: string = 'all';

  // Filter states
  categoryFilter: string = 'all';
  showAllCategories: boolean = true;
  showAllVendors: boolean = true;

  // Pie: categories
  categoryLabels = ['Fiction', 'Self-help', 'Classic', 'Sci-fi', 'Other'];
  categoryData = [800, 450, 400, 350, 350];
  categoryPieChartOptions!: PieChartOptions;
  @ViewChild('piechart') piechart!: ChartComponent;

  // Line: historical (this vs last year)
  historicalSpendingThisYear = [
    150, 200, 180, 300, 250, 400, 320, 500, 450, 300, 280, 320,
  ];
  historicalSpendingLastYear = [
    100, 180, 170, 250, 200, 350, 280, 450, 400, 250, 220, 300,
  ];
  historicalLineChartOptions!: LineChartOptions;
  @ViewChild('historicalLineChart') historicalLineChart!: ChartComponent;

  yearlyLineChartOptions!: LineChartOptions;

  // Bar: vendors
  vendorsLabels = ['Amazon', 'Bookstore A', 'Bookstore B', 'Ebay', 'Others'];
  vendorsData = [1200, 600, 400, 150, 100];
  vendorsBarChartOptions!: BarChartOptions;
  @ViewChild('vendorsBarChart') vendorsBarChart!: ChartComponent;

  constructor(
    private layoutService: LayoutService,
    private uiService: UiService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.checkBudgetAlert();

    const initialColor = this.layoutService.isDarkTheme()
      ? '#f2f3f4'
      : '#415B61';

    // Pie
    this.categoryPieChartOptions = {
      series: this.categoryData,
      chart: { type: 'donut', height: 300 },
      labels: this.categoryLabels,
      legend: {
        labels: { colors: this.categoryLabels.map(() => initialColor) },
        position: 'bottom',
      },
    };

    // Line
    this.historicalLineChartOptions = {
      series: [
        { name: 'This Year', data: this.historicalSpendingThisYear },
        { name: 'Last Year', data: this.historicalSpendingLastYear },
      ],
      chart: {
        height: 320,
        type: 'line',
        toolbar: { show: false },
        background: 'transparent',
        fontFamily: 'inherit',
      },
      dataLabels: { enabled: false },
      stroke: {
        curve: 'smooth',
        width: 3,
        colors: ['#10b981', '#6366f1'],
      },
      xaxis: {
        labels: {
          style: { colors: initialColor, fontSize: '12px' },
          offsetY: 5,
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
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: {
        labels: {
          style: { colors: initialColor, fontSize: '12px' },
          formatter: (value: number) => `$${value}`,
        },
      },
      grid: {
        borderColor: this.layoutService.isDarkTheme() ? '#374151' : '#e5e7eb',
        strokeDashArray: 3,
        xaxis: { lines: { show: false } },
        yaxis: { lines: { show: true } },
      },
      tooltip: {
        enabled: true,
        theme: this.layoutService.isDarkTheme() ? 'dark' : 'light',
        y: {
          formatter: (value: number) => `$${value.toLocaleString()}`,
        },
      },
      legend: {
        position: 'top',
        horizontalAlign: 'right',
        labels: {
          colors: [initialColor, initialColor],
          useSeriesColors: false,
        },
        markers: {
          width: 8,
          height: 8,
        },
      },
    };

    this.yearlyLineChartOptions = {
      series: [
        {
          name: 'Current Year (2025)',
          data: [
            2200, 2800, 3100, 3600, 3200, 4100, 3800, 4800, 4300, 3500, 3200,
            3700,
          ], // 2025 monthly totals
          color: '#10b981',
        },
        {
          name: 'Previous Year (2024)',
          data: [
            1800, 2400, 2700, 3000, 2600, 3500, 3200, 4200, 3900, 2900, 2600,
            3300,
          ], // 2024 monthly totals
          color: '#6366f1',
        },
      ],
      chart: {
        type: 'line',
        height: 350,
        toolbar: { show: false },
        background: 'transparent',
        fontFamily: 'Inter, sans-serif',
      },
      xaxis: {
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
        labels: {
          style: {
            colors: '#6b7280',
            fontSize: '12px',
          },
        },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: {
        title: {
          text: 'Amount ($)',
          style: { color: '#6b7280' },
        },
        labels: {
          style: { colors: '#6b7280' },
          formatter: function (value: any) {
            return '$' + value.toLocaleString();
          },
        },
      },
      dataLabels: { enabled: false },
      stroke: {
        curve: 'smooth',
        width: 3,
      },
      legend: {
        position: 'top',
        horizontalAlign: 'right',
        labels: { colors: '#6b7280' },
      },
      tooltip: {
        enabled: true,
        theme: 'light',
        y: {
          formatter: function (value: any) {
            return '$' + value.toLocaleString();
          },
        },
      },
      grid: {
        borderColor: '#e5e7eb',
        strokeDashArray: 3,
        xaxis: { lines: { show: false } },
        yaxis: { lines: { show: true } },
      },
    };

    // Bar
    this.vendorsBarChartOptions = {
      series: [{ name: 'Spending', data: this.vendorsData }],
      chart: {
        height: 300,
        type: 'bar',
        toolbar: { show: false },
        background: 'transparent',
      },
      xaxis: {
        categories: this.vendorsLabels,
        labels: {
          style: { colors: this.vendorsLabels.map(() => initialColor) },
        },
      },
      yaxis: {
        labels: {
          style: { colors: initialColor },
          formatter: (value: any) => `$${value}`,
        },
      },
      tooltip: {
        enabled: true,
        theme: this.layoutService.isDarkTheme() ? 'dark' : 'light',
        y: {
          formatter: (value: any) => `$${value.toLocaleString()}`,
        },
      },
    };

    // React to theme changes
    this.subscriptions.push(
      this.uiService.colorScheme$.subscribe((colorScheme) => {
        const newColor = colorScheme === 'dark' ? '#f2f3f4' : '#415B61';

        // Pie updates
        this.piechart?.updateOptions({
          legend: {
            labels: { colors: this.categoryLabels.map(() => newColor) },
          },
        } as any);

        // Line updates
        this.historicalLineChart?.updateOptions({
          tooltip: { theme: colorScheme },
          xaxis: {
            labels: { style: { colors: newColor } },
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
          yaxis: { labels: { style: { colors: newColor } } },
          legend: {
            labels: { colors: ['This Year', 'Last Year'].map(() => newColor) },
          },
        } as any);

        // Bar updates
        this.vendorsBarChart?.updateOptions({
          xaxis: {
            labels: {
              style: { colors: this.vendorsLabels.map(() => newColor) },
            },
          },
          yaxis: { labels: { style: { colors: newColor } } },
          tooltip: { enabled: true, theme: colorScheme },
        } as any);
      })
    );
  }

  get budgetUsage() {
    return this.monthlyBudget
      ? Math.min((this.thisMonth / this.monthlyBudget) * 100, 100)
      : 0;
  }

  checkBudgetAlert() {
    if (this.monthlyBudget && this.thisMonth > this.monthlyBudget) {
      this.alertMessage = `⚠️ You have exceeded your monthly budget of $${this.monthlyBudget}!`;
    } else if (
      this.monthlyBudget &&
      this.thisMonth > this.monthlyBudget * 0.8
    ) {
      this.alertMessage = `⚠️ You are nearing your monthly budget of $${this.monthlyBudget}.`;
    } else {
      this.alertMessage = null;
    }
  }

  // Hook this via (ngModelChange) on the input
  onBudgetChange() {
    this.checkBudgetAlert();
  }

  getRemainingBudget(): number {
    return Math.max(0, this.monthlyBudget - this.thisMonth);
  }

  getAverageMonthlySpent(): number {
    if (this.detailedReportData.length === 0) return 0;
    const total = this.detailedReportData.reduce(
      (sum, item) => sum + item.totalSpent,
      0
    );
    return Math.round(total / this.detailedReportData.length);
  }

  getTotalTransactions(): number {
    return this.detailedReportData.reduce(
      (sum, item) => sum + item.transactions,
      0
    );
  }

  getPeakMonth(): string {
    if (this.detailedReportData.length === 0) return 'N/A';
    const peak = this.detailedReportData.reduce((max, item) =>
      item.totalSpent > max.totalSpent ? item : max
    );
    return peak.month.split(' ')[0] || 'N/A';
  }

  exportToCSV() {
    const rows = [
      ['Category', 'Amount'],
      ...this.categoryLabels.map((label, i) => [
        label,
        this.categoryData[i].toString(),
      ]),
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'spending_categories.csv';
    a.click();
    URL.revokeObjectURL(url);

    this.messageService.add({
      severity: 'success',
      summary: 'Export Complete',
      detail: 'CSV file downloaded successfully!',
    });
  }

  refreshData() {
    this.messageService.add({
      severity: 'info',
      summary: 'Refreshing Data',
      detail: 'Updating analytics data...',
    });

    // Simulate API call to refresh data
    setTimeout(() => {
      // Update stats with simulated new data
      this.totalSpent = this.totalSpent + Math.floor(Math.random() * 100) - 50;
      this.thisMonth = this.thisMonth + Math.floor(Math.random() * 50) - 25;
      this.avgPerBook = Math.round(this.totalSpent / 100); // Simulate avg calculation

      // Update chart data
      this.categoryData = this.categoryData.map((val) =>
        Math.max(0, val + Math.floor(Math.random() * 100) - 50)
      );
      this.vendorsData = this.vendorsData.map((val) =>
        Math.max(0, val + Math.floor(Math.random() * 100) - 50)
      );

      // Update charts
      this.updateCategoryChart();
      this.vendorsBarChart?.updateSeries([
        {
          name: 'Spending',
          data: this.vendorsData,
        },
      ]);

      // Re-check budget after data refresh
      this.checkBudgetAlert();

      this.messageService.add({
        severity: 'success',
        summary: 'Data Updated',
        detail: 'Analytics data refreshed successfully!',
      });
    }, 1000);
  }

  openDetailedReport() {
    // Generate detailed report data
    this.detailedReportData = [
      {
        month: 'January 2025',
        totalSpent: 450,
        transactions: 18,
        avgPerBook: 25,
        topCategory: 'Fiction',
        topVendor: 'Amazon',
      },
      {
        month: 'February 2025',
        totalSpent: 320,
        transactions: 12,
        avgPerBook: 27,
        topCategory: 'Self-help',
        topVendor: 'Bookstore A',
      },
      {
        month: 'March 2025',
        totalSpent: 280,
        transactions: 10,
        avgPerBook: 28,
        topCategory: 'Classic',
        topVendor: 'Amazon',
      },
      {
        month: 'April 2025',
        totalSpent: 390,
        transactions: 15,
        avgPerBook: 26,
        topCategory: 'Sci-fi',
        topVendor: 'Ebay',
      },
      {
        month: 'May 2025',
        totalSpent: 520,
        transactions: 20,
        avgPerBook: 26,
        topCategory: 'Fiction',
        topVendor: 'Amazon',
      },
      {
        month: 'June 2025',
        totalSpent: 190,
        transactions: 8,
        avgPerBook: 24,
        topCategory: 'Other',
        topVendor: 'Bookstore B',
      },
    ];

    this.showDetailedReport = true;
    this.messageService.add({
      severity: 'info',
      summary: 'Detailed Report',
      detail: 'Loading comprehensive spending analysis...',
    });
  }

  closeDetailedReport() {
    this.showDetailedReport = false;
  }

  exportDetailedReport() {
    const headers = [
      'Month',
      'Total Spent',
      'Transactions',
      'Avg Per Book',
      'Top Category',
      'Top Vendor',
    ];
    const rows = this.detailedReportData.map((row) => [
      row.month,
      `$${row.totalSpent}`,
      row.transactions.toString(),
      `$${row.avgPerBook}`,
      row.topCategory,
      row.topVendor,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.join(','))
      .join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'detailed_spending_report.csv';
    a.click();
    URL.revokeObjectURL(url);

    this.messageService.add({
      severity: 'success',
      summary: 'Export Complete',
      detail: 'Detailed report exported successfully!',
    });
  }

  shareAnalytics() {
    const analyticsData = {
      totalSpent: this.totalSpent,
      thisMonth: this.thisMonth,
      avgPerBook: this.avgPerBook,
      topCategory: this.getTopCategory(),
      topVendor: this.getTopVendor(),
      budgetUsage: this.budgetUsage,
      spendingTrend: this.getSpendingTrend(),
      lastUpdated: this.getLastUpdated(),
    };

    // Create a shareable text summary
    const shareText = `My Book Spending Analytics:
💰 Total Spent: $${this.totalSpent.toLocaleString()}
📅 This Month: $${this.thisMonth.toLocaleString()}
📚 Avg per Book: $${this.avgPerBook}
🏆 Top Category: ${this.getTopCategory()}
🛒 Top Vendor: ${this.getTopVendor()}
📊 Budget Usage: ${this.budgetUsage.toFixed(1)}%
📈 Trend: ${this.getSpendingTrend()}`;

    // Try to use Web Share API if available, otherwise copy to clipboard
    if (navigator.share) {
      navigator
        .share({
          title: 'My Book Spending Analytics',
          text: shareText,
        })
        .then(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Analytics Shared',
            detail: 'Analytics data shared successfully!',
          });
        })
        .catch(() => {
          this.copyToClipboard(shareText);
        });
    } else {
      this.copyToClipboard(shareText);
    }
  }

  private copyToClipboard(text: string) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Copied to Clipboard',
          detail: 'Analytics data copied to clipboard!',
        });
      })
      .catch(() => {
        this.messageService.add({
          severity: 'warn',
          summary: 'Copy Failed',
          detail: 'Unable to copy to clipboard. Please try again.',
        });
      });
  }

  getCurrentPeriod(): string {
    const now = new Date();
    if (this.isYearly) {
      return now.getFullYear().toString();
    } else {
      return now.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      });
    }
  }

  getHighestSpending(): number {
    if (this.isYearly) {
      return Math.max(
        ...(this.yearlyLineChartOptions.series[0].data as number[])
      );
    } else {
      return Math.max(...this.historicalSpendingThisYear);
    }
  }

  getSpendingTrend(): string {
    const currentData = this.isYearly
      ? (this.yearlyLineChartOptions.series[0].data as number[])
      : this.historicalSpendingThisYear;

    if (currentData.length < 2) return 'Stable';

    const recent = currentData.slice(-3).reduce((a, b) => a + b, 0) / 3;
    const earlier = currentData.slice(-6, -3).reduce((a, b) => a + b, 0) / 3;

    if (recent > earlier * 1.1) return 'Increasing';
    if (recent < earlier * 0.9) return 'Decreasing';
    return 'Stable';
  }

  getPercentageChange(): string {
    const currentData = this.isYearly
      ? (this.yearlyLineChartOptions.series[0].data as number[])
      : this.historicalSpendingThisYear;
    const previousData = this.isYearly
      ? (this.yearlyLineChartOptions.series[1].data as number[])
      : this.historicalSpendingLastYear;

    if (currentData.length === 0 || previousData.length === 0) return '0';

    const currentTotal = currentData.reduce((a, b) => a + b, 0);
    const previousTotal = previousData.reduce((a, b) => a + b, 0);

    if (previousTotal === 0) return '0';

    const change = ((currentTotal - previousTotal) / previousTotal) * 100;
    return change > 0 ? `+${change.toFixed(1)}` : change.toFixed(1);
  }

  getTopCategory(): string {
    const maxIndex = this.categoryData.indexOf(Math.max(...this.categoryData));
    return this.categoryLabels[maxIndex] || 'N/A';
  }

  getCategoryDiversity(): number {
    const total = this.categoryData.reduce((a, b) => a + b, 0);
    if (total === 0) return 0;

    // Calculate entropy-based diversity index
    const proportions = this.categoryData.map((val) => val / total);
    const entropy = proportions.reduce((acc, p) => {
      return p > 0 ? acc - p * Math.log2(p) : acc;
    }, 0);

    const maxEntropy = Math.log2(this.categoryData.length);
    return Math.round((entropy / maxEntropy) * 100);
  }

  getTopVendor(): string {
    const maxIndex = this.vendorsData.indexOf(Math.max(...this.vendorsData));
    return this.vendorsLabels[maxIndex] || 'N/A';
  }

  getAvgPerVendor(): number {
    const total = this.vendorsData.reduce((a, b) => a + b, 0);
    return Math.round(total / this.vendorsData.length);
  }

  getLastUpdated(): string {
    return new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  // Filter methods
  filterCategories(): void {
    this.showAllCategories = !this.showAllCategories;
    if (this.showAllCategories) {
      this.categoryFilter = 'all';
      this.updateCategoryChart();
    } else {
      this.categoryFilter = 'top3';
      this.updateCategoryChart();
    }
  }

  sortCategories(): void {
    // Create sorted indices
    const sortedIndices = this.categoryData
      .map((value, index) => ({ value, index }))
      .sort((a, b) => b.value - a.value)
      .map((item) => item.index);

    // Reorder arrays based on sorted indices
    const sortedLabels = sortedIndices.map((i) => this.categoryLabels[i]);
    const sortedData = sortedIndices.map((i) => this.categoryData[i]);

    this.categoryLabels = sortedLabels;
    this.categoryData = sortedData;

    this.updateCategoryChart();

    this.messageService.add({
      severity: 'success',
      summary: 'Categories Sorted',
      detail: 'Categories sorted by spending amount',
    });
  }

  switchToBarChart(): void {
    // Toggle chart type for category chart
    this.categoryPieChartOptions.chart.type =
      this.categoryPieChartOptions.chart.type === 'donut' ? 'bar' : 'donut';

    this.updateCategoryChart();

    this.messageService.add({
      severity: 'info',
      summary: 'Chart Type Changed',
      detail: `Switched to ${this.categoryPieChartOptions.chart.type} chart`,
    });
  }

  exportCategoryChart(): void {
    // Create CSV data for category chart
    const csvData = this.categoryLabels
      .map((label, index) => `${label},${this.categoryData[index]}`)
      .join('\n');

    const fullCsv = 'Category,Amount\n' + csvData;
    const blob = new Blob([fullCsv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'category_spending_chart.csv';
    a.click();
    URL.revokeObjectURL(url);

    this.messageService.add({
      severity: 'success',
      summary: 'Chart Exported',
      detail: 'Category chart data exported successfully!',
    });
  }

  exportVendorChart(): void {
    // Create CSV data for vendor chart
    const csvData = this.vendorsLabels
      .map((label, index) => `${label},${this.vendorsData[index]}`)
      .join('\n');

    const fullCsv = 'Vendor,Amount\n' + csvData;
    const blob = new Blob([fullCsv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'vendor_spending_chart.csv';
    a.click();
    URL.revokeObjectURL(url);

    this.messageService.add({
      severity: 'success',
      summary: 'Chart Exported',
      detail: 'Vendor chart data exported successfully!',
    });
  }

  printReport(): void {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      this.messageService.add({
        severity: 'error',
        summary: 'Print Failed',
        detail: 'Unable to open print window. Please check popup settings.',
      });
      return;
    }

    const reportHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Spending Analytics Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .stats { display: flex; justify-content: space-around; margin: 20px 0; }
          .stat-card { text-align: center; padding: 15px; border: 1px solid #ddd; border-radius: 8px; }
          .section { margin: 20px 0; }
          table { width: 100%; border-collapse: collapse; margin: 10px 0; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          @media print { body { margin: 0; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Book Spending Analytics Report</h1>
          <p>Generated on ${new Date().toLocaleDateString()}</p>
        </div>
        
        <div class="stats">
          <div class="stat-card">
            <h3>Total Spent</h3>
            <p>$${this.totalSpent.toLocaleString()}</p>
          </div>
          <div class="stat-card">
            <h3>This Month</h3>
            <p>$${this.thisMonth.toLocaleString()}</p>
          </div>
          <div class="stat-card">
            <h3>Avg Per Book</h3>
            <p>$${this.avgPerBook}</p>
          </div>
          <div class="stat-card">
            <h3>Budget Usage</h3>
            <p>${this.budgetUsage.toFixed(1)}%</p>
          </div>
        </div>

        <div class="section">
          <h2>Category Breakdown</h2>
          <table>
            <thead>
              <tr><th>Category</th><th>Amount</th><th>Percentage</th></tr>
            </thead>
            <tbody>
              ${this.categoryLabels
                .map((label, index) => {
                  const percentage = (
                    (this.categoryData[index] / this.totalSpent) *
                    100
                  ).toFixed(1);
                  return `<tr><td>${label}</td><td>$${this.categoryData[
                    index
                  ].toLocaleString()}</td><td>${percentage}%</td></tr>`;
                })
                .join('')}
            </tbody>
          </table>
        </div>

        <div class="section">
          <h2>Vendor Performance</h2>
          <table>
            <thead>
              <tr><th>Vendor</th><th>Amount</th><th>Percentage</th></tr>
            </thead>
            <tbody>
              ${this.vendorsLabels
                .map((label, index) => {
                  const total = this.vendorsData.reduce((a, b) => a + b, 0);
                  const percentage = (
                    (this.vendorsData[index] / total) *
                    100
                  ).toFixed(1);
                  return `<tr><td>${label}</td><td>$${this.vendorsData[
                    index
                  ].toLocaleString()}</td><td>${percentage}%</td></tr>`;
                })
                .join('')}
            </tbody>
          </table>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(reportHtml);
    printWindow.document.close();
    printWindow.print();

    this.messageService.add({
      severity: 'success',
      summary: 'Print Ready',
      detail: 'Report opened in print window!',
    });
  }

  resetFilters(): void {
    this.categoryFilter = 'all';
    this.vendorFilter = 'all';
    this.showAllCategories = true;
    this.showAllVendors = true;
    this.isYearly = false;

    // Reset charts to original data
    this.updateCategoryChart();
    this.filterVendors();

    this.messageService.add({
      severity: 'info',
      summary: 'Filters Reset',
      detail: 'All filters have been reset to default values.',
    });
  }

  toggleChartType(): void {
    // Toggle between donut and bar chart for categories
    this.categoryPieChartOptions.chart.type =
      this.categoryPieChartOptions.chart.type === 'donut' ? 'bar' : 'donut';

    this.updateCategoryChart();

    this.messageService.add({
      severity: 'info',
      summary: 'Chart Type Changed',
      detail: `Switched to ${this.categoryPieChartOptions.chart.type} chart view`,
    });
  }

  private updateCategoryChart(): void {
    let displayData = this.categoryData;
    let displayLabels = this.categoryLabels;

    if (this.categoryFilter === 'top3') {
      displayData = this.categoryData.slice(0, 3);
      displayLabels = this.categoryLabels.slice(0, 3);
    }

    this.piechart?.updateSeries(displayData);
    this.piechart?.updateOptions({
      labels: displayLabels,
    });
  }

  filterVendors(): void {
    let filteredData = [...this.vendorsData];
    let filteredLabels = [...this.vendorsLabels];

    switch (this.vendorFilter) {
      case 'top5':
        filteredData = this.vendorsData.slice(0, 5);
        filteredLabels = this.vendorsLabels.slice(0, 5);
        break;
      case '6months':
        // Simulate 6 months filter by reducing data
        filteredData = this.vendorsData.map((val) => Math.round(val * 0.6));
        break;
      default:
        // 'all' - no filtering
        break;
    }

    this.vendorsBarChart?.updateSeries([
      {
        name: 'Spending',
        data: filteredData,
      },
    ]);

    this.vendorsBarChart?.updateOptions({
      xaxis: {
        categories: filteredLabels,
      },
    });

    this.messageService.add({
      severity: 'info',
      summary: 'Vendors Filtered',
      detail: `Showing ${this.vendorFilter} vendors`,
    });
  }

  refreshChartData(): void {
    // Simulate data refresh with random variations
    this.categoryData = this.categoryData.map((val) =>
      Math.max(50, val + Math.floor(Math.random() * 200) - 100)
    );
    this.vendorsData = this.vendorsData.map((val) =>
      Math.max(50, val + Math.floor(Math.random() * 200) - 100)
    );

    // Update historical data
    this.historicalSpendingThisYear = this.historicalSpendingThisYear.map(
      (val) => Math.max(100, val + Math.floor(Math.random() * 100) - 50)
    );

    // Update all charts
    this.updateCategoryChart();
    this.vendorsBarChart?.updateSeries([
      {
        name: 'Spending',
        data: this.vendorsData,
      },
    ]);
    this.historicalLineChart?.updateSeries([
      { name: 'This Year', data: this.historicalSpendingThisYear },
      { name: 'Last Year', data: this.historicalSpendingLastYear },
    ]);

    this.messageService.add({
      severity: 'success',
      summary: 'Charts Refreshed',
      detail: 'All chart data updated successfully!',
    });
  }

  viewVendorDetails(): void {
    const vendorDetails = this.vendorsLabels
      .map((label, index) => ({
        name: label,
        spending: this.vendorsData[index],
        percentage: (
          (this.vendorsData[index] /
            this.vendorsData.reduce((a, b) => a + b, 0)) *
          100
        ).toFixed(1),
        rank: index + 1,
      }))
      .sort((a, b) => b.spending - a.spending);

    let detailsMessage = 'Vendor Performance Details:\n\n';
    vendorDetails.forEach((vendor, index) => {
      detailsMessage += `${index + 1}. ${
        vendor.name
      }: $${vendor.spending.toLocaleString()} (${vendor.percentage}%)\n`;
    });

    this.messageService.add({
      severity: 'info',
      summary: 'Vendor Details',
      detail: detailsMessage,
      life: 8000,
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  // Additional utility methods
  setBudgetGoal(): void {
    this.messageService.add({
      severity: 'info',
      summary: 'Budget Goal',
      detail: 'Budget goal feature coming soon!',
    });
  }

  viewCategoryDetails(categoryName?: string): void {
    const category = categoryName || this.getTopCategory();
    const index = this.categoryLabels.indexOf(category);

    if (index !== -1) {
      const amount = this.categoryData[index];
      const percentage = ((amount / this.totalSpent) * 100).toFixed(1);

      this.messageService.add({
        severity: 'info',
        summary: `${category} Details`,
        detail: `Amount: $${amount.toLocaleString()} (${percentage}% of total spending)`,
        life: 5000,
      });
    }
  }

  compareWithPrevious(): void {
    const currentTotal = this.historicalSpendingThisYear.reduce(
      (a, b) => a + b,
      0
    );
    const previousTotal = this.historicalSpendingLastYear.reduce(
      (a, b) => a + b,
      0
    );
    const change = currentTotal - previousTotal;
    const changePercent = ((change / previousTotal) * 100).toFixed(1);

    const comparisonMessage =
      change >= 0
        ? `Spending increased by $${change.toLocaleString()} (${changePercent}%) compared to last year`
        : `Spending decreased by $${Math.abs(
            change
          ).toLocaleString()} (${Math.abs(
            parseFloat(changePercent)
          )}%) compared to last year`;

    this.messageService.add({
      severity: change >= 0 ? 'warn' : 'success',
      summary: 'Year-over-Year Comparison',
      detail: comparisonMessage,
      life: 8000,
    });
  }

  setSpendingAlert(): void {
    this.messageService.add({
      severity: 'info',
      summary: 'Spending Alerts',
      detail: 'Custom spending alert feature coming soon!',
    });
  }

  exportAllData(): void {
    const allData = {
      summary: {
        totalSpent: this.totalSpent,
        thisMonth: this.thisMonth,
        avgPerBook: this.avgPerBook,
        mostExpensive: this.mostExpensive,
        budgetUsage: this.budgetUsage,
      },
      categories: this.categoryLabels.map((label, index) => ({
        name: label,
        amount: this.categoryData[index],
      })),
      vendors: this.vendorsLabels.map((label, index) => ({
        name: label,
        amount: this.vendorsData[index],
      })),
      historicalData: {
        thisYear: this.historicalSpendingThisYear,
        lastYear: this.historicalSpendingLastYear,
      },
      detailedReport: this.detailedReportData,
    };

    const dataStr = JSON.stringify(allData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'complete_spending_analytics.json';
    a.click();
    URL.revokeObjectURL(url);

    this.messageService.add({
      severity: 'success',
      summary: 'Complete Export',
      detail: 'All analytics data exported successfully!',
    });
  }
}
