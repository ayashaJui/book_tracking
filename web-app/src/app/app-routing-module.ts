import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './modules/shared/components/not-found/not-found';

const routes: Routes = [
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./modules/dashboard/dashboard-module').then(
        (m) => m.DashboardModule
      ),
  },

  {
    path: 'books',
    loadChildren: () =>
      import('./modules/books/books-module').then((m) => m.BooksModule),
  },

  {
    path: 'authors',
    loadChildren: () =>
      import('./modules/authors/authors-module').then((m) => m.AuthorsModule),
  },

  {
    path: 'reading-logs',
    loadChildren: () =>
      import('./modules/reading-logs/reading-logs-module').then(
        (m) => m.ReadingLogsModule
      ),
  },
  {
    path: 'wishlist',
    loadChildren: () =>
      import('./modules/wishlist/wishlist-module').then(
        (m) => m.WishlistModule
      ),
  },
  {
    path: 'series',
    loadChildren: () =>
      import('./modules/series/series-module').then((m) => m.SeriesModule),
  },

  {
    path: 'quotes',
    loadChildren: () =>
      import('./modules/quotes/quotes-module').then((m) => m.QuotesModule),
  },

  {
    path: 'reviews',
    loadChildren: () =>
      import('./modules/reviews/reviews-module').then((m) => m.ReviewsModule),
  },

  {
    path: 'spendings',
    loadChildren: () =>
      import('./modules/spendings/spendings-module').then(
        (m) => m.SpendingsModule
      ),
  },

  {
    path: 'analytics',
    loadChildren: () =>
      import('./modules/analytics/analytics-module').then(
        (m) => m.AnalyticsModule
      ),
  },

  {
    path: 'profile',
    loadChildren: () =>
      import('./modules/profile/profile-module').then((m) => m.ProfileModule),
  },

  {
    path: 'settings',
    loadChildren: () =>
      import('./modules/settings/settings-module').then(
        (m) => m.SettingsModule
      ),
  },

  { path: 'not-found', component: NotFoundComponent },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'not-found', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
