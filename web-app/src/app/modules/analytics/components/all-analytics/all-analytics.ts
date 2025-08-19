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
    }
  }

  exportData() {
    // Create CSV data from current filtered view
    const csvData = this.getFilteredBooks().map((book) => ({
      Title: book.title,
      Genre: book.genre,
      Author: book.author,
      Pages: book.pages,
      Rating: book.rating,
      Spent: book.spent,
      Date: book.date,
      Completed: book.completed ? 'Yes' : 'No',
    }));

    // Convert to CSV string
    const headers = Object.keys(csvData[0]).join(',');
    const rows = csvData.map((row) => Object.values(row).join(','));
    const csvContent = [headers, ...rows].join('\n');

    // Create download
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `reading-analytics-${
      new Date().toISOString().split('T')[0]
    }.csv`;
    link.click();
    window.URL.revokeObjectURL(url);

    console.log('Analytics data exported successfully');
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
    this.updateDashboard();
    // You can add toast message here if needed
    console.log('Data refreshed successfully');
  }

  exportToExcel() {
    const data = this.getFilteredBooks();
    const csv = this.convertToCSV(data);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `reading-analytics-${
      new Date().toISOString().split('T')[0]
    }.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
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
}
