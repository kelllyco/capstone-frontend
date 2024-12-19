import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectComponent } from './project.component';
import { ModificationModule } from './modification/modification.module';
import { TrackingModule } from './tracking/tracking.module';
import { Router, RouterModule, Routes } from '@angular/router';
import { ModificationComponent } from './modification/modification.component';
import { TrackingComponent } from './tracking/tracking.component';
import { projectResolver } from './redux/project.resolver';


const routes: Routes = [

  {
    path: '',
    resolve: { projects: projectResolver },
    runGuardsAndResolvers: 'always',
    children: [
      {
        path: 'modification', component: ModificationComponent 
      },
      {
        path: 'tracking', component: TrackingComponent
      }
    ]
  }
];
@NgModule({
  declarations: [ProjectComponent],
  imports: [
    CommonModule,
    ModificationModule,
    TrackingModule,
    RouterModule.forChild(routes),
  ],
  exports: [ProjectComponent]
})
export class ProjectModule { }
