import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllPublishersComponent } from './components/all-publishers/all-publishers';
import { AddPublisherComponent } from './components/add-publisher/add-publisher';
import { PublisherDetailsComponent } from './components/publisher-details/publisher-details';

const routes: Routes = [
  {
    path: '',
    component: AllPublishersComponent
  },
  {
    path: 'add',
    component: AddPublisherComponent
  },
  {
    path: 'edit/:id',
    component: AddPublisherComponent
  },
  {
    path: 'details/:id',
    component: PublisherDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublishersRoutingModule { }
