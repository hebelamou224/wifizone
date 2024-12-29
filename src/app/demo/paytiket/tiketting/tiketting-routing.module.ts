import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'profile',
        loadComponent: () => import('./profile/tiketting-profile.component')
      },
      {
        path: 'wifizone',
        loadComponent: () => import('./wifizone/tiketting-wifizone.component')
      },
      {
        path: 'tikets',
        loadComponent: () => import('./tikets/tiketting-tiket.component')
      },
      {
        path: 'recette',
        loadComponent: () => import('./recette/tiketting-recette.component')
      },
      {
        path: 'tabs-pills',
        loadComponent: () => import('./basic-tabs-pills/basic-tabs-pills.component')
      },
      {
        path: 'typography',
        loadComponent: () => import('./basic-typography/basic-typography.component')
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TiketingRoutingModule {}
