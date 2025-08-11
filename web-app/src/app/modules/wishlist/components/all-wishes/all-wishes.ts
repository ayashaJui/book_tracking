import { Component } from '@angular/core';

interface WishlistBook {
  title: string;
  author: string;
  price: number;
  dateAdded: Date;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Not Purchased' | 'Purchased' | 'On Hold';
  notes?: string;
}

@Component({
  selector: 'app-all-wishes',
  standalone: false,
  templateUrl: './all-wishes.html',
  styleUrl: './all-wishes.scss',
})
export class AllWishes {
  monthlyBudget = 200;

  wishlist: WishlistBook[] = [
    {
      title: 'Clean Code',
      author: 'Robert C. Martin',
      price: 30,
      dateAdded: new Date(),
      priority: 'High',
      status: 'Not Purchased',
      notes: 'Must read soon!'
    },
    {
      title: 'The Pragmatic Programmer',
      author: 'Andrew Hunt',
      price: 25,
      dateAdded: new Date(),
      priority: 'Medium',
      status: 'On Hold'
    },
    {
      title: 'Refactoring',
      author: 'Martin Fowler',
      price: 45,
      dateAdded: new Date(),
      priority: 'Low',
      status: 'Purchased'
    }
  ];

  get totalPrice(): number {
    return this.wishlist.reduce((sum, book) => sum + (book.price || 0), 0);
  }

  get budgetProgress(): number {
    return Math.min((this.totalPrice / this.monthlyBudget) * 100, 100);
  }

  getPrioritySeverity(priority: string) {
    // PrimeNG Badge accepted severities: "info" | "success" | "warn" | "danger" | "secondary" | "contrast"
    switch (priority) {
      case 'High':
        return 'danger';
      case 'Medium':
        return 'warn';
      case 'Low':
        return 'success';
      default:
        return 'info';
    }
  }

  getStatusSeverity(status: string) {
    switch (status) {
      case 'Not Purchased':
        return 'secondary';
      case 'Purchased':
        return 'success';
      case 'On Hold':
        return 'warn';
      default:
        return 'info';
    }
  }

   
}
