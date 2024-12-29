import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'profile',
        loadComponent: () => import('./basic-elements/basic-elements.component')
      },
      {
        path: 'settings',
        loadComponent: () => import('./settings/settings.component')
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormElementsRoutingModule {}
