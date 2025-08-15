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
  selector: 'app-reading-streak',
  standalone: false,
  templateUrl: './reading-streak.html',
  styleUrl: './reading-streak.scss',
})
export class ReadingStreak implements OnInit {
  streakHeatmapChart!: ChartOptions;
  @ViewChild('streakHeatmapChartComponent')
  streakHeatmapChartComponent!: ChartComponent;

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

  ngOnInit(): void {
    let filteredBooks = this.books;

    this.updateStreakHeatmap(filteredBooks);
  }

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
    if (pages <= 25) return 1;
    if (pages <= 50) return 2;
    if (pages <= 100) return 3;
    return 4;
  }

  getActivityClass(level: number): string {
    const classes = [
      'bg-slate-100 dark:bg-slate-800', // No activity
      'bg-emerald-100 dark:bg-emerald-900', // Light activity
      'bg-emerald-200 dark:bg-emerald-700', // Medium activity
      'bg-emerald-300 dark:bg-emerald-600', // High activity
      'bg-emerald-400 dark:bg-emerald-500', // Very high activity
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

  private isConsecutiveDay(date1: string, date2: string): boolean {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays === 1;
  }

  trackByWeek(index: number): number {
    return index;
  }

  trackByDay(index: number, day: any): string {
    return day.dateStr;
  }

  getMonthPosition(monthIndex: number): number {
    const year = new Date().getFullYear();
    const date = new Date(year, monthIndex, 1);
    const startOfYear = new Date(year, 0, 1);
    const weekDiff = Math.floor(
      (date.getTime() - startOfYear.getTime()) / (7 * 24 * 60 * 60 * 1000)
    );
    return weekDiff + 1;
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

    this.streakHeatmapChart = {
      series,
      chart: { type: 'heatmap', height: 350, toolbar: { show: false } },
      colors: ['#e0f2f1', '#80cbc4', '#26a69a', '#004d40'],
      dataLabels: { enabled: false },
      tooltip: {
        theme: 'dark',
        y: {
          formatter: (val: any, opts: any) => {
            const dataPoint =
              opts?.w?.config?.series[opts.seriesIndex]?.data[
                opts.dataPointIndex
              ];
            if (dataPoint && dataPoint.books.length) {
              return `${val} pages\nBooks: ${dataPoint.books.join(', ')}`;
            }
            return `${val} pages`;
          },
        },
      },
    };
  }
}
