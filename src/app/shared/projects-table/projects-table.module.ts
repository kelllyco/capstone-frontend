import { NgModule } from '@angular/core';
import { SharedModule } from '../shared.module';
import { ProjectsTableComponent } from './projects-table.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { DatePipe } from '@angular/common';




@NgModule({
  declarations: [ProjectsTableComponent],
  exports: [ProjectsTableComponent],
  imports: [
    SharedModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,

  ],
  providers: [ DatePipe]
})
export class ProjectsTableModule { }
