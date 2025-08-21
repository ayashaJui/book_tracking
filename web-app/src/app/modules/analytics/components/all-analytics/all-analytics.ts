import { Component, OnInit, ViewChild } from '@angular/core';
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
  ChartComponent,
} from 'ng-apexcharts';

import { LayoutService } from '../../../../layout/service/layout.service';
import { Subscription } from 'rxjs';
import { UiService } from '../../../shared/services/ui.service.service';

export type ChartOptions = {
  series: ApexAxisChartSeries | ApexNonAxisChartSeries;
  chart: ApexChart;
  xaxis?: ApexXAxis;
  yaxis?: ApexYAxis;
  labels?: string[];
  dataLabels?: ApexDataLabels;
  plotOptions?: ApexPlotOptions;
  fill?: ApexFill;
  tooltip?: ApexTooltip;
  grid?: ApexGrid;
  legend?: ApexLegend;
  stroke?: ApexStroke;
  colors?: string[];
  markers?: ApexMarkers;
  responsive?: ApexResponsive[];
};

@Component({
  selector: 'app-all-analytics',
  standalone: false,
  templateUrl: './all-analytics.html',
  styleUrl: './all-analytics.scss',
})
export class AllAnalytics implements OnInit {
  subscriptions: Subscription[] = [];

  // Filters
  genres = ['All', 'Fiction', 'Self-Help', 'Classic', 'Biography'];
  authors = [
    'All',
    'J.K. Rowling',
    'Tolkien',
    'Brandon Sanderson',
    'George R.R. Martin',
    'Agatha Christie',
  ];
  selectedGenre = 'All';
  selectedAuthor = 'All';

  // Create dropdown options
  get genreOptions() {
    return this.genres.map((g) => ({ label: g, value: g }));
  }

  get authorOptions() {
    return this.authors.map((a) => ({ label: a, value: a }));
  }

  // KPI Stats with trend indicators
  stats = {
    totalBooks: 45,
    totalPages: 12500,
    avgRating: 4.3,
    totalHours: 310,
    completionRate: 78,
    trends: {
      books: { value: 12, isPositive: true },
      pages: { value: 8, isPositive: true },
      rating: { value: 5, isPositive: true },
      hours: { value: 15, isPositive: true },
      completion: { value: 3, isPositive: false },
    },
  };

  // Sample Book Data
  books = [
    {
      title: 'Book A',
      genre: 'Fiction',
      author: 'J.K. Rowling',
      pages: 400,
      rating: 5,
      spent: 25,
      date: '2025-01-05',
      completed: true,
    },
    {
      title: 'Book B',
      genre: 'Self-Help',
      author: 'Tolkien',
      pages: 300,
      rating: 4,
      spent: 20,
      date: '2025-02-12',
      completed: true,
    },
    {
      title: 'Book C',
      genre: 'Classic',
      author: 'Brandon Sanderson',
      pages: 500,
      rating: 3,
      spent: 30,
      date: '2025-03-10',
      completed: false,
    },
    {
      title: 'Book D',
      genre: 'Fiction',
      author: 'George R.R. Martin',
      pages: 450,
      rating: 4,
      spent: 28,
      date: '2025-04-20',
      completed: true,
    },
    {
      title: 'Book E',
      genre: 'Biography',
      author: 'Agatha Christie',
      pages: 350,
      rating: 4,
      spent: 18,
      date: '2025-05-15',
      completed: true,
    },
  ];

  // Charts
  readingTrendChart!: ChartOptions;
  @ViewChild('readingTrendChartComponent')
  readingTrendChartComponent!: ChartComponent;
  genrePieChart!: ChartOptions;
  @ViewChild('genrePieChartComponent') genrePieChartComponent!: ChartComponent;
  spendingBarChart!: ChartOptions;
  @ViewChild('spendingBarChartComponent')
  spendingBarChartComponent!: ChartComponent;
  ratingDistributionChart!: ChartOptions;
  @ViewChild('ratingDistributionChartComponent')
  ratingDistributionChartComponent!: ChartComponent;
  authorLeaderboardChart!: ChartOptions;
  @ViewChild('authorLeaderboardChartComponent')
  authorLeaderboardChartComponent!: ChartComponent;
  completionRadialChart!: ChartOptions;
  @ViewChild('completionRadialChartComponent')
  completionRadialChartComponent!: ChartComponent;
  // streakHeatmapChart!: ChartOptions;
  // @ViewChild('streakHeatmapChartComponent')
  // streakHeatmapChartComponent!: ChartComponent;

  constructor(
    private layoutService: LayoutService,
    private uiService: UiService
  ) {}

  // Message handling methods
  showSuccessMessage(message: string) {
    // You can implement toast notifications here if available
    console.log('✅ ' + message);
  }

  showInfoMessage(message: string) {
    console.log('ℹ️ ' + message);
  }

  showWarningMessage(message: string) {
    console.log('⚠️ ' + message);
  }

  ngOnInit(): void {
    this.updateDashboard();
  }

  updateDashboard() {
    let filteredBooks = this.books;
    if (this.selectedGenre !== 'All')
      filteredBooks = filteredBooks.filter(
        (b) => b.genre === this.selectedGenre
      );
    if (this.selectedAuthor !== 'All')
      filteredBooks = filteredBooks.filter(
        (b) => b.author === this.selectedAuthor
      );

    this.updateStats(filteredBooks);
    this.updateReadingTrend(filteredBooks);
    this.updateGenrePie(filteredBooks);
    this.updateSpendingBar(filteredBooks);
    this.updateRatingDistribution(filteredBooks);
    this.updateAuthorLeaderboard(filteredBooks);
    this.updateCompletionRate(filteredBooks);
    // this.updateStreakHeatmap(filteredBooks);
  }

  resetFilters() {
    this.selectedGenre = 'All';
    this.selectedAuthor = 'All';
    this.updateDashboard();

    // Show success message
    this.showSuccessMessage('Filters have been reset successfully');
  }

  onGenreClick(event: any) {
    if (
      event &&
      event.dataPointIndex !== undefined &&
      this.genrePieChart.labels
    ) {
      const genre = this.genrePieChart.labels[event.dataPointIndex];
      this.selectedGenre = genre;
      this.updateDashboard();
      this.showInfoMessage(`Filtered by genre: ${genre}`);
    }
  }

  onAuthorClick(event: any) {
    if (
      event &&
      event.dataPointIndex !== undefined &&
      this.authorLeaderboardChart.xaxis?.categories
    ) {
      const author =
        this.authorLeaderboardChart.xaxis.categories[event.dataPointIndex];
      this.selectedAuthor = author as string;
      this.updateDashboard();
      this.showInfoMessage(`Filtered by author: ${author}`);
    }
  }

  exportData() {
    try {
      // Create CSV data from current filtered view
      const filteredBooks = this.getFilteredBooks();

      if (filteredBooks.length === 0) {
        this.showWarningMessage(
          'No data to export. Please adjust your filters.'
        );
        return;
      }

      const csvData = filteredBooks.map((book) => ({
        Title: book.title,
        Genre: book.genre,
        Author: book.author,
        Pages: book.pages,
        Rating: book.rating,
        'Amount Spent': book.spent,
        'Date Read': book.date,
        Status: book.completed ? 'Completed' : 'In Progress',
      }));

      // Add summary statistics
      const summaryData = [
        {
          Title: '--- SUMMARY ---',
          Genre: '',
          Author: '',
          Pages: '',
          Rating: '',
          'Amount Spent': '',
          'Date Read': '',
          Status: '',
        },
        {
          Title: 'Total Books',
          Genre: '',
          Author: '',
          Pages: filteredBooks.length,
          Rating: '',
          'Amount Spent': '',
          'Date Read': '',
          Status: '',
        },
        {
          Title: 'Total Pages',
          Genre: '',
          Author: '',
          Pages: filteredBooks.reduce((a, b) => a + b.pages, 0),
          Rating: '',
          'Amount Spent': '',
          'Date Read': '',
          Status: '',
        },
        {
          Title: 'Total Spent',
          Genre: '',
          Author: '',
          Pages: '',
          Rating: '',
          'Amount Spent': `$${filteredBooks.reduce((a, b) => a + b.spent, 0)}`,
          'Date Read': '',
          Status: '',
        },
        {
          Title: 'Average Rating',
          Genre: '',
          Author: '',
          Pages: '',
          Rating: (
            filteredBooks.reduce((a, b) => a + b.rating, 0) /
            filteredBooks.length
          ).toFixed(1),
          'Amount Spent': '',
          'Date Read': '',
          Status: '',
        },
        {
          Title: 'Completion Rate',
          Genre: '',
          Author: '',
          Pages: '',
          Rating: '',
          'Amount Spent': '',
          'Date Read': '',
          Status: `${Math.round(
            (filteredBooks.filter((b) => b.completed).length /
              filteredBooks.length) *
              100
          )}%`,
        },
      ];

      const allData = [...csvData, ...summaryData];

      // Convert to CSV string
      const headers = Object.keys(allData[0]).join(',');
      const rows = allData.map((row) => Object.values(row).join(','));
      const csvContent = [headers, ...rows].join('\n');

      // Create download
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;

      const filterSuffix =
        this.selectedGenre !== 'All' || this.selectedAuthor !== 'All'
          ? `_filtered_${
              this.selectedGenre !== 'All' ? this.selectedGenre : ''
            }${
              this.selectedAuthor !== 'All'
                ? '_' + this.selectedAuthor.replace(/\s+/g, '')
                : ''
            }`
          : '';

      link.download = `reading-analytics${filterSuffix}_${
        new Date().toISOString().split('T')[0]
      }.csv`;
      link.click();
      window.URL.revokeObjectURL(url);

      this.showSuccessMessage(
        `Analytics data exported successfully! (${filteredBooks.length} books)`
      );
    } catch (error) {
      console.error('Export failed:', error);
      this.showWarningMessage('Export failed. Please try again.');
    }
  }

  // Format number with commas
  formatNumber(num: number): string {
    return new Intl.NumberFormat().format(num);
  }

  // Get trend icon class
  getTrendIcon(isPositive: boolean): string {
    return isPositive
      ? 'pi pi-arrow-up text-green-600'
      : 'pi pi-arrow-down text-red-600';
  }

  // Get trend color class
  getTrendColor(isPositive: boolean): string {
    return isPositive ? 'text-green-600' : 'text-red-600';
  }

  // Calendar Activity Methods for Reading Streak
  getMonthLabels(): string[] {
    return [
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
    ];
  }

  getCurrentStreak(): number {
    // Calculate current reading streak
    const today = new Date();
    let streak = 0;
    let currentDate = new Date(today);

    while (currentDate >= new Date(today.getFullYear(), 0, 1)) {
      const dateStr = currentDate.toISOString().slice(0, 10);
      const hasActivity = this.books.some((book) => book.date === dateStr);

      if (hasActivity) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  }

  getActivityData(): any[][] {
    const year = new Date().getFullYear();
    const startDate = new Date(year, 0, 1);
    const endDate = new Date();

    // Create activity map from books data
    const activityMap = new Map();
    this.books.forEach((book) => {
      const date = book.date;
      if (!activityMap.has(date)) {
        activityMap.set(date, { pages: 0, books: [] });
      }
      const activity = activityMap.get(date);
      activity.pages += book.pages;
      activity.books.push(book.title);
    });

    // Generate 53 weeks of data
    const weeks: any[][] = [];
    let currentDate = new Date(startDate);

    // Start from the first Monday
    while (currentDate.getDay() !== 1) {
      currentDate.setDate(currentDate.getDate() - 1);
    }

    for (let week = 0; week < 53; week++) {
      const weekData: any[] = [];

      for (let day = 0; day < 7; day++) {
        const dateStr = currentDate.toISOString().slice(0, 10);
        const activity = activityMap.get(dateStr);
        const pages = activity ? activity.pages : 0;
        const books = activity ? activity.books : [];

        weekData.push({
          date: new Date(currentDate),
          dateStr,
          activity: this.getActivityLevel(pages),
          pages,
          books,
          tooltip: this.getTooltipText(currentDate, pages, books),
        });

        currentDate.setDate(currentDate.getDate() + 1);
      }

      weeks.push(weekData);
    }

    return weeks;
  }

  getActivityLevel(pages: number): number {
    if (pages === 0) return 0;
    if (pages <= 50) return 1;
    if (pages <= 100) return 2;
    if (pages <= 200) return 3;
    return 4;
  }

  getActivityClass(level: number): string {
    const classes = [
      'bg-slate-100', // No activity
      'bg-emerald-200', // Light activity
      'bg-emerald-400', // Medium activity
      'bg-emerald-600', // Heavy activity
      'bg-emerald-800', // Very heavy activity
    ];
    return classes[level] || classes[0];
  }

  getTooltipText(date: Date, pages: number, books: string[]): string {
    const dateStr = date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });

    if (pages === 0) {
      return `${dateStr}: No reading activity`;
    }

    return `${dateStr}: ${pages} pages\nBooks: ${books.join(', ')}`;
  }

  getActivityStats() {
    const currentYear = new Date().getFullYear();
    const yearBooks = this.books.filter(
      (book) => new Date(book.date).getFullYear() === currentYear
    );

    const activeDays = new Set(yearBooks.map((book) => book.date)).size;
    const totalPages = yearBooks.reduce((sum, book) => sum + book.pages, 0);
    const averagePages =
      activeDays > 0 ? Math.round(totalPages / activeDays) : 0;

    // Calculate best streak
    let bestStreak = 0;
    let currentStreak = 0;
    const dates = Array.from(
      new Set(yearBooks.map((book) => book.date))
    ).sort();

    for (let i = 0; i < dates.length; i++) {
      if (i === 0 || this.isConsecutiveDay(dates[i - 1], dates[i])) {
        currentStreak++;
        bestStreak = Math.max(bestStreak, currentStreak);
      } else {
        currentStreak = 1;
      }
    }

    // This month activity
    const currentMonth = new Date().getMonth();
    const thisMonthBooks = yearBooks.filter(
      (book) => new Date(book.date).getMonth() === currentMonth
    );
    const thisMonthDays = new Set(thisMonthBooks.map((book) => book.date)).size;

    return {
      totalDays: activeDays,
      averagePages,
      bestStreak,
      thisMonth: thisMonthDays,
    };
  }

  private isConsecutiveDay(date1: string, date2: string): boolean {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays === 1;
  }

  onDateClick(date: Date): void {
    const dateStr = date.toISOString().slice(0, 10);
    const dayBooks = this.books.filter((book) => book.date === dateStr);

    if (dayBooks.length > 0) {
      console.log(
        `Books read on ${dateStr}:`,
        dayBooks.map((b) => b.title)
      );
      // You could show a modal or detailed view here
    }
  }

  trackByWeek(index: number): number {
    return index;
  }

  trackByDay(index: number, day: any): string {
    return day.dateStr;
  }

  // ------------------- Chart Updates -------------------
  private updateStats(books: any[]) {
    this.stats.totalBooks = books.length;
    this.stats.totalPages = books.reduce((a, b) => a + b.pages, 0);
    this.stats.avgRating = books.length
      ? +(books.reduce((a, b) => a + b.rating, 0) / books.length).toFixed(1)
      : 0;
    this.stats.totalHours = books.reduce((a, b) => a + b.pages / 40, 0);
    this.stats.completionRate = books.length
      ? Math.round(
          (100 * books.filter((b) => b.completed).length) / books.length
        )
      : 0;
  }

  private updateReadingTrend(books: any[]) {
    const months = [
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
    ];
    const booksPerMonth = Array(12).fill(0);
    const pagesPerMonth = Array(12).fill(0);
    books.forEach((b) => {
      const month = new Date(b.date).getMonth();
      booksPerMonth[month] += 1;
      pagesPerMonth[month] += b.pages;
    });

    this.readingTrendChart = {
      series: [
        { name: 'Books Read', data: booksPerMonth },
        { name: 'Pages Read', data: pagesPerMonth },
      ],
      chart: {
        type: 'line',
        height: 320,
        toolbar: { show: false },
        background: 'transparent',
      },
      xaxis: {
        categories: months,
        labels: {
          style: {
            colors: this.layoutService.isDarkTheme() ? '#f2f3f4' : '#6B7280',
            fontSize: '12px',
            fontWeight: 500,
          },
        },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: {
        labels: {
          style: {
            colors: this.layoutService.isDarkTheme() ? '#f2f3f4' : '#6B7280',
            fontSize: '12px',
          },
        },
      },
      stroke: {
        curve: 'smooth',
        width: 3,
        lineCap: 'round',
      },
      colors: ['#3B82F6', '#10B981'],
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'light',
          type: 'vertical',
          shadeIntensity: 0.1,
          gradientToColors: ['#60A5FA', '#34D399'],
          inverseColors: false,
          opacityFrom: 0.8,
          opacityTo: 0.1,
          stops: [0, 100],
        },
      },
      grid: {
        borderColor: '#F3F4F6',
        strokeDashArray: 3,
        xaxis: { lines: { show: false } },
        yaxis: { lines: { show: true } },
      },
      markers: {
        size: 6,
        colors: ['#3B82F6', '#10B981'],
        strokeColors: '#fff',
        strokeWidth: 2,
        hover: { size: 8 },
      },
      tooltip: {
        shared: true,
        theme: this.layoutService.isDarkTheme() ? 'dark' : 'light',
        style: {
          fontSize: '12px',
          fontFamily: 'Inter, system-ui, sans-serif',
        },
        x: {
          formatter: function (val: any) {
            return months[val - 1];
          },
        },
      },
      legend: {
        labels: {
          colors: this.layoutService.isDarkTheme() ? '#f2f3f4' : '#6B7280',
        },
      },
    };

    this.subscriptions.push(
      this.uiService.colorScheme$.subscribe((colorScheme) => {
        const newColor = colorScheme === 'dark' ? '#f2f3f4' : '#415B61';

        this.readingTrendChartComponent?.updateOptions({
          xaxis: {
            categories: months,
            labels: {
              categories: this.getMonthLabels(),
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

  private updateGenrePie(books: any[]) {
    const genreMap: any = {};
    books.forEach((b) => (genreMap[b.genre] = (genreMap[b.genre] || 0) + 1));
    this.genrePieChart = {
      series: Object.values(genreMap) as number[],
      chart: {
        type: 'pie',
        height: 320,
        toolbar: { show: false },
        background: 'transparent',
      },
      labels: Object.keys(genreMap),
      colors: ['#8B5CF6', '#06B6D4', '#F59E0B', '#EF4444', '#10B981'],
      legend: {
        position: 'bottom',
        fontSize: '13px',
        labels: {
          colors: this.layoutService.isDarkTheme() ? '#f2f3f4' : '#6B7280',
        },
      },
      plotOptions: {
        pie: {
          donut: {
            size: '65%',
            labels: {
              show: true,
              total: {
                show: true,
                fontSize: '20px',
                fontWeight: 600,
                color: '#1F2937',
                label: 'Total Books',
              },
            },
          },
          expandOnClick: true,
        },
      },
      dataLabels: {
        enabled: true,
        style: {
          fontSize: '12px',
          fontWeight: 600,
          colors: ['#FFFFFF'],
        },
        dropShadow: {
          enabled: true,
          top: 1,
          left: 1,
          blur: 1,
          opacity: 0.8,
        },
      },
      tooltip: {
        style: {
          fontSize: '12px',
          fontFamily: 'Inter, system-ui, sans-serif',
        },
        y: {
          formatter: (val) => `${val} books`,
        },
      },
      responsive: [
        {
          breakpoint: 768,
          options: {
            chart: { height: 280 },
            legend: { position: 'bottom' },
          },
        },
      ],
    };

    this.subscriptions.push(
      this.uiService.colorScheme$.subscribe((colorScheme) => {
        const newColor = colorScheme === 'dark' ? '#f2f3f4' : '#415B61';

        this.genrePieChartComponent.updateOptions({
          labels: Object.keys(genreMap),
          legend: {
            labels: {
              colors: newColor,
            },
          },
        });
      })
    );
  }

  private updateSpendingBar(books: any[]) {
    const months = [
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
    ];
    const spendPerMonth = Array(12).fill(0);
    books.forEach(
      (b) => (spendPerMonth[new Date(b.date).getMonth()] += b.spent)
    );
    this.spendingBarChart = {
      series: [{ name: 'Spent ($)', data: spendPerMonth }],
      chart: {
        type: 'bar',
        height: 320,
        toolbar: { show: false },
        background: 'transparent',
      },
      plotOptions: {
        bar: {
          columnWidth: '60%',
          borderRadius: 8,
          dataLabels: {
            position: 'top',
          },
        },
      },
      xaxis: {
        categories: months,
        labels: {
          style: {
            colors: this.layoutService.isDarkTheme() ? '#f2f3f4' : '#6B7280',
          },
        },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: {
        labels: {
          style: {
            colors: this.layoutService.isDarkTheme() ? '#f2f3f4' : '#6B7280',
          },
          formatter: (val) => `$${val}`,
        },
      },
      colors: ['#10B981'],
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'light',
          type: 'vertical',
          shadeIntensity: 0.1,
          gradientToColors: ['#34D399'],
          inverseColors: false,
          opacityFrom: 0.9,
          opacityTo: 0.7,
          stops: [0, 100],
        },
      },
      grid: {
        borderColor: '#F3F4F6',
        strokeDashArray: 3,
        xaxis: { lines: { show: false } },
        yaxis: { lines: { show: true } },
      },
      dataLabels: {
        enabled: true,
        style: {
          fontSize: '12px',
          fontWeight: 600,
          colors: ['#10B981'],
        },
        offsetY: -20,
        formatter: (val) => `$${val}`,
      },
      tooltip: {
        theme: this.layoutService.isDarkTheme() ? 'dark' : 'light',

        y: {
          formatter: (val) => `$${val}`,
        },
      },
    };

    this.subscriptions.push(
      this.uiService.colorScheme$.subscribe((colorScheme) => {
        const newColor = colorScheme === 'dark' ? '#f2f3f4' : '#415B61';

        this.spendingBarChartComponent.updateOptions({
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
              formatter: (val: any) => `$${val}`,
            },
          },
          tooltip: {
            theme: colorScheme,
          },
        });
      })
    );
  }

  private updateRatingDistribution(books: any[]) {
    const ratingCounts = [0, 0, 0, 0, 0];
    books.forEach((b) => {
      ratingCounts[b.rating - 1] += 1;
    });
    this.ratingDistributionChart = {
      series: [{ name: 'Books', data: ratingCounts }],
      chart: { type: 'bar', height: 300, toolbar: { show: false } },
      xaxis: {
        categories: ['1★', '2★', '3★', '4★', '5★'],
        labels: {
          style: {
            colors: this.layoutService.isDarkTheme() ? '#f2f3f4' : '#6B7280',
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: this.layoutService.isDarkTheme() ? '#f2f3f4' : '#6B7280',
          },
          // formatter: (val: any) => `$${val}`,
        },
      },
      plotOptions: { bar: { columnWidth: '50%' } },
      tooltip: { theme: 'dark' },
    };

    this.subscriptions.push(
      this.uiService.colorScheme$.subscribe((colorScheme) => {
        const newColor = colorScheme === 'dark' ? '#f2f3f4' : '#415B61';

        this.ratingDistributionChartComponent.updateOptions({
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
        });
      })
    );
  }

  private updateAuthorLeaderboard(books: any[]) {
    const authorMap: any = {};
    books.forEach(
      (b) => (authorMap[b.author] = (authorMap[b.author] || 0) + 1)
    );
    this.authorLeaderboardChart = {
      series: [
        { name: 'Books Read', data: Object.values(authorMap) as number[] },
      ],
      chart: { type: 'bar', height: 300, toolbar: { show: false } },
      plotOptions: { bar: { horizontal: true } },
      xaxis: {
        categories: Object.keys(authorMap),
        labels: {
          style: {
            colors: this.layoutService.isDarkTheme() ? '#f2f3f4' : '#6B7280',
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: this.layoutService.isDarkTheme() ? '#f2f3f4' : '#6B7280',
          },
        },
      },
      tooltip: { theme: this.layoutService.isDarkTheme() ? 'dark' : 'light' },
    };

    this.subscriptions.push(
      this.uiService.colorScheme$.subscribe((colorScheme) => {
        const newColor = colorScheme === 'dark' ? '#f2f3f4' : '#415B61';

        this.authorLeaderboardChartComponent.updateOptions({
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
        });
      })
    );
  }

  private updateCompletionRate(books: any[]) {
    const completed = books.filter((b) => b.completed).length;
    this.completionRadialChart = {
      series: [books.length ? Math.round((100 * completed) / books.length) : 0],
      chart: { type: 'radialBar', height: 250, toolbar: { show: false } },
      plotOptions: {
        radialBar: {
          hollow: { size: '60%' },
          dataLabels: { value: { fontSize: '20px' } },
        },
      },
      labels: ['Completion Rate'],
      tooltip: { theme: 'dark' },
    };
  }

  // ------------------- Streak Heatmap -------------------
  private updateStreakHeatmap(books: any[]) {
    // Map with date as key, value = { pages, titles }
    const dateMap: any = {};
    books.forEach((b) => {
      const dateStr = new Date(b.date).toISOString().slice(0, 10);
      if (!dateMap[dateStr]) dateMap[dateStr] = { pages: 0, titles: [] };
      dateMap[dateStr].pages += b.pages;
      dateMap[dateStr].titles.push(b.title);
    });

    const startDate = new Date(new Date().getFullYear(), 0, 1); // Jan 1st
    const today = new Date();
    const series: any[] = [];
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    weekdays.forEach((day) => {
      const data: any[] = [];
      let current = new Date(startDate);
      while (current <= today) {
        if (current.getDay() === weekdays.indexOf(day)) {
          const key = current.toISOString().slice(0, 10);
          data.push({
            x: key,
            y: dateMap[key]?.pages || 0,
            books: dateMap[key]?.titles || [],
          });
        }
        current.setDate(current.getDate() + 1);
      }
      series.push({ name: day, data });
    });

    // this.streakHeatmapChart = {
    //   series,
    //   chart: { type: 'heatmap', height: 350, toolbar: { show: false } },
    //   colors: ['#e0f2f1', '#80cbc4', '#26a69a', '#004d40'],
    //   dataLabels: { enabled: false },
    //   tooltip: {
    //     theme: 'dark',
    //     y: {
    //       formatter: (val: any, opts: any) => {
    //         const dataPoint =
    //           opts?.w?.config?.series[opts.seriesIndex]?.data[
    //             opts.dataPointIndex
    //           ];
    //         if (dataPoint && dataPoint.books.length) {
    //           return `${val} pages\nBooks: ${dataPoint.books.join(', ')}`;
    //         }
    //         return `${val} pages`;
    //       },
    //     },
    //   },
    // };
  }

  // Additional methods for the enhanced UI
  getFilteredBooks() {
    let filteredBooks = this.books;
    if (this.selectedGenre !== 'All') {
      filteredBooks = filteredBooks.filter(
        (b) => b.genre === this.selectedGenre
      );
    }
    if (this.selectedAuthor !== 'All') {
      filteredBooks = filteredBooks.filter(
        (b) => b.author === this.selectedAuthor
      );
    }
    return filteredBooks;
  }

  refreshData() {
    try {
      this.showInfoMessage('Refreshing analytics data...');

      // Simulate data refresh (in real app, this would fetch from API)
      setTimeout(() => {
        this.updateDashboard();

        // Update charts
        this.readingTrendChartComponent?.updateSeries(
          this.readingTrendChart.series
        );
        this.genrePieChartComponent?.updateSeries(this.genrePieChart.series);
        this.spendingBarChartComponent?.updateSeries(
          this.spendingBarChart.series
        );
        this.ratingDistributionChartComponent?.updateSeries(
          this.ratingDistributionChart.series
        );
        this.authorLeaderboardChartComponent?.updateSeries(
          this.authorLeaderboardChart.series
        );
        this.completionRadialChartComponent?.updateSeries(
          this.completionRadialChart.series
        );

        this.showSuccessMessage('Analytics data refreshed successfully!');
      }, 500); // Small delay to show loading state
    } catch (error) {
      console.error('Refresh failed:', error);
      this.showWarningMessage('Failed to refresh data. Please try again.');
    }
  }

  exportToExcel() {
    try {
      const filteredBooks = this.getFilteredBooks();

      if (filteredBooks.length === 0) {
        this.showWarningMessage(
          'No data to export to Excel. Please adjust your filters.'
        );
        return;
      }

      // Prepare data with better formatting for Excel
      const excelData = filteredBooks.map((book, index) => ({
        'S.No': index + 1,
        'Book Title': book.title,
        'Author Name': book.author,
        Genre: book.genre,
        Pages: book.pages,
        'Rating (out of 5)': book.rating,
        'Amount Spent ($)': book.spent,
        'Date Read': book.date,
        'Reading Status': book.completed ? 'Completed' : 'In Progress',
        'Reading Hours (Est.)': Math.round((book.pages / 40) * 10) / 10, // Estimated reading time
      }));

      // Add summary sheet data
      const summaryStats = [
        { Metric: 'Total Books Read', Value: filteredBooks.length },
        {
          Metric: 'Total Pages Read',
          Value: filteredBooks.reduce((a, b) => a + b.pages, 0),
        },
        {
          Metric: 'Total Amount Spent',
          Value: `$${filteredBooks.reduce((a, b) => a + b.spent, 0)}`,
        },
        {
          Metric: 'Average Rating',
          Value: (
            filteredBooks.reduce((a, b) => a + b.rating, 0) /
            filteredBooks.length
          ).toFixed(1),
        },
        {
          Metric: 'Books Completed',
          Value: filteredBooks.filter((b) => b.completed).length,
        },
        {
          Metric: 'Books In Progress',
          Value: filteredBooks.filter((b) => !b.completed).length,
        },
        {
          Metric: 'Completion Rate',
          Value: `${Math.round(
            (filteredBooks.filter((b) => b.completed).length /
              filteredBooks.length) *
              100
          )}%`,
        },
        {
          Metric: 'Estimated Reading Hours',
          Value:
            Math.round(
              filteredBooks.reduce((a, b) => a + b.pages / 40, 0) * 10
            ) / 10,
        },
      ];

      // Create workbook with multiple sheets
      const workbookData = {
        'Reading Data': excelData,
        'Summary Statistics': summaryStats,
      };

      // Convert to CSV format (Excel compatible)
      let csvContent = '';

      // Add Reading Data sheet
      csvContent += 'READING DATA\n';
      const headers = Object.keys(excelData[0]);
      csvContent += headers.join(',') + '\n';
      excelData.forEach((row) => {
        csvContent +=
          headers
            .map((header) => {
              const value = row[header as keyof typeof row];
              return typeof value === 'string' && value.includes(',')
                ? `"${value}"`
                : value;
            })
            .join(',') + '\n';
      });

      csvContent += '\n\nSUMMARY STATISTICS\n';
      csvContent += 'Metric,Value\n';
      summaryStats.forEach((stat) => {
        csvContent += `"${stat.Metric}","${stat.Value}"\n`;
      });

      // Add export metadata
      csvContent += '\n\nEXPORT DETAILS\n';
      csvContent += `"Export Date","${new Date().toLocaleDateString()}"\n`;
      csvContent += `"Export Time","${new Date().toLocaleTimeString()}"\n`;
      csvContent += `"Filters Applied","Genre: ${this.selectedGenre}, Author: ${this.selectedAuthor}"\n`;
      csvContent += `"Total Records","${filteredBooks.length}"\n`;

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;

      const filterSuffix =
        this.selectedGenre !== 'All' || this.selectedAuthor !== 'All'
          ? `_filtered_${
              this.selectedGenre !== 'All' ? this.selectedGenre : ''
            }${
              this.selectedAuthor !== 'All'
                ? '_' + this.selectedAuthor.replace(/\s+/g, '')
                : ''
            }`
          : '';

      link.download = `reading-analytics-excel${filterSuffix}_${
        new Date().toISOString().split('T')[0]
      }.csv`;
      link.click();
      window.URL.revokeObjectURL(url);

      this.showSuccessMessage(
        `Excel-compatible data exported successfully! (${filteredBooks.length} books with summary statistics)`
      );
    } catch (error) {
      console.error('Excel export failed:', error);
      this.showWarningMessage('Excel export failed. Please try again.');
    }
  }

  private convertToCSV(data: any[]): string {
    if (!data.length) return '';

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map((row) =>
        headers
          .map((header) => {
            const value = row[header];
            return typeof value === 'string' && value.includes(',')
              ? `"${value}"`
              : value;
          })
          .join(',')
      ),
    ].join('\n');

    return csvContent;
  }

  onGlobalFilter(event: Event, table: any) {
    const target = event.target as HTMLInputElement;
    table.filterGlobal(target.value, 'contains');
  }

  getGenreSeverity(genre: string): string {
    const severityMap: { [key: string]: string } = {
      Fiction: 'info',
      'Self-Help': 'success',
      Classic: 'warning',
      Biography: 'secondary',
      Mystery: 'danger',
      Romance: 'help',
      Science: 'contrast',
    };
    return severityMap[genre] || 'info';
  }

  // Additional utility methods for enhanced functionality

  // Print Analytics Report
  printReport() {
    try {
      const filteredBooks = this.getFilteredBooks();
      if (filteredBooks.length === 0) {
        this.showWarningMessage(
          'No data to print. Please adjust your filters.'
        );
        return;
      }

      // Create a print-friendly version
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        const printContent = this.generatePrintableReport(filteredBooks);
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.print();
        this.showSuccessMessage('Print dialog opened successfully!');
      }
    } catch (error) {
      console.error('Print failed:', error);
      this.showWarningMessage('Print failed. Please try again.');
    }
  }

  private generatePrintableReport(books: any[]): string {
    const totalPages = books.reduce((a, b) => a + b.pages, 0);
    const totalSpent = books.reduce((a, b) => a + b.spent, 0);
    const avgRating = (
      books.reduce((a, b) => a + b.rating, 0) / books.length
    ).toFixed(1);
    const completedBooks = books.filter((b) => b.completed).length;
    const completionRate = Math.round((completedBooks / books.length) * 100);

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Reading Analytics Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px; }
            h2 { color: #555; margin-top: 30px; }
            .summary { background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #007bff; color: white; }
            .filters { background: #e9ecef; padding: 10px; border-radius: 5px; margin: 10px 0; }
            .print-date { color: #666; font-size: 12px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <h1>📚 Reading Analytics Report</h1>
          
          <div class="filters">
            <strong>Applied Filters:</strong> 
            Genre: ${this.selectedGenre} | Author: ${this.selectedAuthor}
          </div>

          <div class="summary">
            <h2>📊 Summary Statistics</h2>
            <p><strong>Total Books:</strong> ${books.length}</p>
            <p><strong>Total Pages:</strong> ${totalPages.toLocaleString()}</p>
            <p><strong>Total Spent:</strong> $${totalSpent}</p>
            <p><strong>Average Rating:</strong> ${avgRating}/5</p>
            <p><strong>Completion Rate:</strong> ${completionRate}% (${completedBooks}/${
      books.length
    })</p>
            <p><strong>Estimated Reading Hours:</strong> ${Math.round(
              totalPages / 40
            )} hours</p>
          </div>

          <h2>📖 Book Details</h2>
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Genre</th>
                <th>Pages</th>
                <th>Rating</th>
                <th>Cost</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${books
                .map(
                  (book) => `
                <tr>
                  <td>${book.title}</td>
                  <td>${book.author}</td>
                  <td>${book.genre}</td>
                  <td>${book.pages}</td>
                  <td>${book.rating}/5</td>
                  <td>$${book.spent}</td>
                  <td>${new Date(book.date).toLocaleDateString()}</td>
                  <td>${book.completed ? 'Completed' : 'In Progress'}</td>
                </tr>
              `
                )
                .join('')}
            </tbody>
          </table>

          <div class="print-date">
            Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}
          </div>
        </body>
      </html>
    `;
  }

  // Share Analytics Summary
  shareAnalytics() {
    try {
      const filteredBooks = this.getFilteredBooks();
      if (filteredBooks.length === 0) {
        this.showWarningMessage(
          'No data to share. Please adjust your filters.'
        );
        return;
      }

      const summary = this.generateShareableSummary(filteredBooks);

      if (navigator.share) {
        // Use Web Share API if available
        navigator
          .share({
            title: 'My Reading Analytics',
            text: summary,
            url: window.location.href,
          })
          .then(() => {
            this.showSuccessMessage('Analytics shared successfully!');
          })
          .catch((error) => {
            console.error('Share failed:', error);
            this.fallbackShare(summary);
          });
      } else {
        this.fallbackShare(summary);
      }
    } catch (error) {
      console.error('Share failed:', error);
      this.showWarningMessage('Share failed. Please try again.');
    }
  }

  private generateShareableSummary(books: any[]): string {
    const totalPages = books.reduce((a, b) => a + b.pages, 0);
    const avgRating = (
      books.reduce((a, b) => a + b.rating, 0) / books.length
    ).toFixed(1);
    const completionRate = Math.round(
      (books.filter((b) => b.completed).length / books.length) * 100
    );

    return `📚 My Reading Analytics Summary

📖 Books Read: ${books.length}
📄 Pages Read: ${totalPages.toLocaleString()}
⭐ Average Rating: ${avgRating}/5
✅ Completion Rate: ${completionRate}%
⏱️ Estimated Hours: ${Math.round(totalPages / 40)}

Top Genre: ${this.getMostReadGenre(books)}
Favorite Author: ${this.getMostReadAuthor(books)}

#ReadingGoals #BookLovers #Analytics`;
  }

  private getMostReadGenre(books: any[]): string {
    const genreCount = books.reduce((acc, book) => {
      acc[book.genre] = (acc[book.genre] || 0) + 1;
      return acc;
    }, {});

    return Object.keys(genreCount).reduce((a, b) =>
      genreCount[a] > genreCount[b] ? a : b
    );
  }

  private getMostReadAuthor(books: any[]): string {
    const authorCount = books.reduce((acc, book) => {
      acc[book.author] = (acc[book.author] || 0) + 1;
      return acc;
    }, {});

    return Object.keys(authorCount).reduce((a, b) =>
      authorCount[a] > authorCount[b] ? a : b
    );
  }

  private fallbackShare(summary: string) {
    // Fallback to clipboard copy
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(summary)
        .then(() => {
          this.showSuccessMessage('Analytics summary copied to clipboard!');
        })
        .catch(() => {
          this.showTextInModal(summary);
        });
    } else {
      this.showTextInModal(summary);
    }
  }

  private showTextInModal(text: string) {
    // Simple alert fallback
    alert('Copy this text to share:\n\n' + text);
    this.showInfoMessage('Text displayed in popup for manual copying.');
  }

  // View detailed book information
  viewBookDetails(book: any) {
    const details = `
📖 Book Details:

Title: ${book.title}
Author: ${book.author}
Genre: ${book.genre}
Pages: ${book.pages}
Rating: ${book.rating}/5 stars
Cost: $${book.spent}
Date Read: ${new Date(book.date).toLocaleDateString()}
Status: ${book.completed ? 'Completed' : 'In Progress'}
Estimated Reading Time: ${Math.round((book.pages / 40) * 10) / 10} hours
    `;

    alert(details);
    this.showInfoMessage(`Viewed details for "${book.title}"`);
  }

  // Advanced filtering methods
  filterByRating(minRating: number) {
    // This could be enhanced to add rating filter to the UI
    const highRatedBooks = this.books.filter(
      (book) => book.rating >= minRating
    );
    console.log(`Books with ${minRating}+ stars:`, highRatedBooks);
    this.showInfoMessage(
      `Found ${highRatedBooks.length} books with ${minRating}+ star rating`
    );
  }

  filterByDateRange(startDate: string, endDate: string) {
    // This could be enhanced to add date range filter to the UI
    const filteredBooks = this.books.filter(
      (book) => book.date >= startDate && book.date <= endDate
    );
    console.log(
      `Books read between ${startDate} and ${endDate}:`,
      filteredBooks
    );
    this.showInfoMessage(
      `Found ${filteredBooks.length} books in selected date range`
    );
  }

  // Quick stats methods
  getQuickInsights() {
    const books = this.getFilteredBooks();
    const insights = {
      fastestRead: books.reduce((prev, curr) =>
        prev.pages < curr.pages ? prev : curr
      ),
      longestBook: books.reduce((prev, curr) =>
        prev.pages > curr.pages ? prev : curr
      ),
      highestRated: books.filter(
        (book) => book.rating === Math.max(...books.map((b) => b.rating))
      ),
      mostExpensive: books.reduce((prev, curr) =>
        prev.spent > curr.spent ? prev : curr
      ),
      recentRead: books.reduce((prev, curr) =>
        new Date(prev.date) > new Date(curr.date) ? prev : curr
      ),
    };

    console.log('Quick Insights:', insights);
    this.showInfoMessage(
      'Quick insights calculated - check console for details'
    );
    return insights;
  }
}
