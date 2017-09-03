import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { PagePage } from './../etc/pages/page/page';


import { AdvertisementCreateEditPage } from './pages/advertisement-create-edit/advertisement-create-edit';
import { AdvertisementListPage } from './pages/advertisement-list/advertisement-list';


import { WidgetsModule } from './../../widgets/widgets.module';




/**
 * layout can be 'wide', 'column', 'two-column'
 */
const appRoutes: Routes = [
    { path: 'advertisement-guide-page', component: PagePage, data: { filename: 'advertisement-guide-page', section: 'advertisement', layout: 'column' } },


    /// advertisement
    { path: 'advertisement/create', component: AdvertisementCreateEditPage },
    { path: 'advertisement/edit/:id', component: AdvertisementCreateEditPage },
    { path: 'advertisement/list', component: AdvertisementListPage },
];

@NgModule({
    declarations: [
        AdvertisementCreateEditPage,
        AdvertisementListPage,
    ],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild( appRoutes ),
        WidgetsModule
    ]
})
export class AdvertisementModule { }
