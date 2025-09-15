import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { AllAuthorsComponent } from './components/all-authors/all-authors';
import { AddAuthorComponent } from './components/add-author/add-author';
import { AuthorDetailsComponent } from './components/author-details/author-details';

const routes: Routes = [
  {
    path: '',
    component: AllAuthorsComponent,
    data: { breadcrumb: 'All Authors' }
  },
  {
    path: 'add',
    component: AddAuthorComponent,
    data: { breadcrumb: 'Add Author' }
  },
  {
    path: ':id',
    component: AuthorDetailsComponent,
    data: { breadcrumb: 'Author Details' }
  },
  {
    path: 'edit/:id',
    component: AddAuthorComponent, // Reuse add component for editing
    data: { breadcrumb: 'Edit Author' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthorsRoutingModule { }
