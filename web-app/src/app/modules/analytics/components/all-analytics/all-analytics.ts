import { Component } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexStroke,
  ApexFill,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis,
  ApexGrid,
  ApexMarkers,
  ApexLegend,
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexPlotOptions,
} from 'ng-apexcharts';

type LineChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  stroke: ApexStroke;
  fill: ApexFill;
  tooltip: ApexTooltip;
  xaxis: ApexXAxis;
  yaxis?: ApexYAxis;
  grid?: ApexGrid;
  markers?: ApexMarkers;
  legend?: ApexLegend;
  colors?: string[];
};

type BarChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  plotOptions: ApexPlotOptions;
  dataLabels: ApexDataLabels;
  xaxis: ApexXAxis;
  yaxis?: ApexYAxis;
  tooltip?: ApexTooltip;
  grid?: ApexGrid;
  colors?: string[];
};

type PieChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  legend: ApexLegend;
  responsive: ApexResponsive[];
  tooltip?: ApexTooltip;
};

type HeatmapChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  plotOptions: ApexPlotOptions;
  dataLabels: ApexDataLabels;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  colors: string[];
  tooltip: ApexTooltip;
  grid?: ApexGrid;
};

@Component({
  selector: 'app-all-analytics',
  standalone: false,
  templateUrl: './all-analytics.html',
  styleUrl: './all-analytics.scss',
})
export class AllAnalytics {
  // Filters
  timeRanges = [
    { label: 'Last 30 Days', value: '30d' },
    { label: 'Last 6 Months', value: '6m' },
    { label: 'Last Year', value: '1y' },
  ];
  genres = [
    { label: 'All Genres', value: '' },
    { label: 'Fiction', value: 'fiction' },
    { label: 'Self-Help', value: 'self-help' },
    { label: 'Classic', value: 'classic' },
    { label: 'Biography', value: 'biography' },
  ];

  selectedRange = '30d';
  selectedGenre = '';

  // KPI stats
  stats = {
    totalBooks: 45,
    totalPages: 12500,
    avgRating: 4.3,
    totalHours: 310,
  };

  // Top authors (table)
  topAuthors = [
    { name: 'Agatha Christie', books: 5 },
    { name: 'J. K. Rowling', books: 4 },
    { name: 'George Orwell', books: 3 },
    { name: 'Brandon Sanderson', books: 3 },
    { name: 'Yuval Noah Harari', books: 2 },
  ];

  // Charts
  readingTrendChart!: LineChartOptions;
  genrePieChart!: PieChartOptions;
  spendingBarChart!: BarChartOptions;
  heatmapChart!: HeatmapChartOptions;

  ngOnInit(): void {
    this.initReadingTrend();
    this.initGenrePie();
    this.initSpendingBar();
    this.initHeatmap();
  }

  // --- Chart initializers ---

  private initReadingTrend() {
    this.readingTrendChart = {
      series: [
        { name: 'Books Read', data: [3, 4, 5, 6, 4, 7, 8, 9, 6, 5, 7, 8] },
        {
          name: 'Pages Read',
          data: [
            900, 1100, 1250, 1500, 1050, 1700, 1850, 2100, 1400, 1350, 1600,
            1950,
          ],
        },
      ],
      chart: { type: 'line', height: 340, toolbar: { show: false } },
      dataLabels: { enabled: false },
      stroke: { curve: 'smooth', width: 3 },
      fill: { type: 'solid', opacity: 0.15 },
      markers: { size: 3 },
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
      },
      yaxis: { labels: { formatter: (val) => `${Math.round(val)}` } },
      grid: { strokeDashArray: 4 },
      tooltip: {
        shared: true,
        y: {
          formatter: (val, opts) =>
            opts.seriesIndex === 0 ? `${val} books` : `${val} pages`,
        },
      },
      colors: ['#3B82F6', '#10B981'],
      legend: { position: 'top', horizontalAlign: 'left' },
    };
  }

  private initGenrePie() {
    this.genrePieChart = {
      series: [30, 18, 22, 12, 18],
      chart: { type: 'pie', height: 340 },
      labels: ['Fiction', 'Self-Help', 'Classic', 'Biography', 'Science'],
      legend: { position: 'right' },
      responsive: [
        {
          breakpoint: 768,
          options: { chart: { height: 300 }, legend: { position: 'bottom' } },
        },
      ],
      tooltip: { y: { formatter: (val) => `${val} %` } },
    };
  }

  private initSpendingBar() {
    this.spendingBarChart = {
      series: [
        {
          name: 'Spent (USD)',
          data: [120, 85, 150, 95, 140, 110, 170, 130, 90, 160, 145, 180],
        },
      ],
      chart: { type: 'bar', height: 340, toolbar: { show: false } },
      plotOptions: { bar: { columnWidth: '45%', borderRadius: 6 } },
      dataLabels: { enabled: false },
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
      },
      yaxis: { labels: { formatter: (val) => `$${Math.round(val)}` } },
      grid: { strokeDashArray: 4 },
      tooltip: { y: { formatter: (val) => `$${val}` } },
      colors: ['#6366F1'],
    };
  }

  private initHeatmap() {
    // 12 columns (weeks) x 7 rows (Mon-Sun)
    const weeks = 12;
    const categories = Array.from({ length: weeks }, (_, i) => `W${i + 1}`);

    this.heatmapChart = {
      series: [
        { name: 'Mon', data: this.generateHeatRow(weeks) },
        { name: 'Tue', data: this.generateHeatRow(weeks) },
        { name: 'Wed', data: this.generateHeatRow(weeks) },
        { name: 'Thu', data: this.generateHeatRow(weeks) },
        { name: 'Fri', data: this.generateHeatRow(weeks) },
        { name: 'Sat', data: this.generateHeatRow(weeks) },
        { name: 'Sun', data: this.generateHeatRow(weeks) },
      ],
      chart: { type: 'heatmap', height: 360, toolbar: { show: false } },
      plotOptions: {
        heatmap: {
          shadeIntensity: 0.5,
          colorScale: {
            ranges: [
              { from: 0, to: 0, name: 'No Reading', color: '#E5E7EB' }, // gray-200
              { from: 1, to: 10, name: 'Low', color: '#D1FAE5' }, // green-100
              { from: 11, to: 30, name: 'Medium', color: '#6EE7B7' }, // green-300
              { from: 31, to: 60, name: 'High', color: '#10B981' }, // green-500
              { from: 61, to: 999, name: 'Very High', color: '#047857' }, // green-700
            ],
          },
        },
      },
      dataLabels: { enabled: false },
      xaxis: { type: 'category', categories },
      yaxis: { reversed: true },
      colors: ['#10B981'],
      tooltip: { y: { formatter: (val) => `${val} mins read` } },
      grid: { padding: { right: 8 } },
    };
  }

  // --- Helpers ---

  private generateHeatRow(cols: number): number[] {
    // Simulate reading minutes per day: 0–90
    return Array.from({ length: cols }, () => Math.floor(Math.random() * 91));
  }

  exportData() {
    // Hook up to your export service or build CSV on the fly
    console.log('Exporting analytics data...');
  }

  // Example: re-generate data when filters change (wire to (onChange) of dropdowns)
  onFilterChange() {
    this.initReadingTrend();
    this.initGenrePie();
    this.initSpendingBar();
    this.initHeatmap();
  }
}
