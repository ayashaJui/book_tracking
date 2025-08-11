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
    path: 'reading-logs',
    loadChildren: () =>
      import('./modules/reading-logs/reading-logs-module').then(
        (m) => m.ReadingLogsModule
      ),
  },

  {
    path: 'books',
    loadChildren: () =>
      import('./modules/books/books-module').then((m) => m.BooksModule),
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
