import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

interface Book {
  id?: number;
  title: string;
  author: string;
  genres: string[];
  pages?: number;
  status?: string;
  cover?: string;
  dateAdded?: string;
  price?: number;
  source?: string;
  seriesId?: number;
  seriesName?: string;
}

@Component({
  selector: 'app-add-book',
  standalone: false,
  templateUrl: './add-book.html',
  styleUrl: './add-book.scss',
})
export class AddBook {
  newBook: Book = {
    title: '',
    author: '',
    genres: [],
    status: undefined,
    pages: undefined,
    price: undefined,
    source: '',
    seriesName: '',
  };

  statusOptions = [
    { label: 'Want to Read', value: 'Want to Read' },
    { label: 'Reading', value: 'Reading' },
    { label: 'Read', value: 'Read' },
    { label: 'On Hold', value: 'On Hold' },
  ];

  genreOptions = [
    { label: 'Fantasy', value: 'Fantasy' },
    { label: 'Science Fiction', value: 'Science Fiction' },
    { label: 'Mystery', value: 'Mystery' },
    { label: 'Romance', value: 'Romance' },
    { label: 'Thriller', value: 'Thriller' },
    { label: 'Horror', value: 'Horror' },
    { label: 'Self-help', value: 'Self-help' },
    { label: 'History', value: 'History' },
    { label: 'Non-Fiction', value: 'Non-Fiction' },
    { label: 'Biography', value: 'Biography' },
    { label: 'Science', value: 'Science' },
    { label: 'Philosophy', value: 'Philosophy' },
    { label: 'Poetry', value: 'Poetry' },
    { label: 'Drama', value: 'Drama' },
    { label: 'Young Adult', value: 'Young Adult' },
    { label: 'Children', value: 'Children' },
    // add more as needed
  ];

  constructor(private location: Location, private router: Router) {}

  addBook() {
    console.log('Book added:', this.newBook);
    // TODO: send newBook to backend API or store locally

    // Show success message and navigate back
    // You can add a toast notification here
    this.goBack();
  }

  goBack() {
    this.location.back();
  }

  onCoverUpload(event: any) {
    // handle file upload
    const file = event.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.newBook.cover = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
}
