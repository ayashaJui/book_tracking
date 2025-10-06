import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllCollections } from './components/all-collections/all-collections';
import { CollectionDetails } from './components/collection-details/collection-details';

const routes: Routes = [
    {
        path: '',
        component: AllCollections,
        data: { title: 'Reading Collections' }
    },
    {
        path: ':id',
        component: CollectionDetails,
        data: { title: 'Collection Details' }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CollectionsRoutingModule { }