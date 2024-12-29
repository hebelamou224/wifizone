import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'wifizones',
        loadComponent: () => import('./wifizones/wifizones.component')
      },
      {
        path: 'users',
        loadComponent: () => import('./users/admin-user.component')
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
