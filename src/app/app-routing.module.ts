import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { projectResolver } from './project/redux/project.resolver';
import { DashboardResolver } from './dashboard/redux/dashboard.resolver';

const routes: Routes = [
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
    resolve: {dashboard: DashboardResolver}
  },
  {
    path: 'bid-creation',
    loadChildren: () => import('./bid-creation/bid-creation.module').then(m => m.BidCreationModule)
  },
  {
    path: 'project/:id',
    loadChildren: () => import('./project/project.module').then(m => m.ProjectModule),
  },
  { path: '**', redirectTo: 'dashboard', pathMatch: 'full' }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
