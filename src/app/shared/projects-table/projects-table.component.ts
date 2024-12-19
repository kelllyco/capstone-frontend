import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ProjectPreview } from '../models/project.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { DatePipe } from '@angular/common';



@Component({
  selector: 'app-projects-table',
  templateUrl: './projects-table.component.html',
  styleUrl: './projects-table.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ProjectsTableComponent implements AfterViewInit{
  @Input() set inProjectPreviews(value: ProjectPreview[] | null) {
    if (value) {
      this.dataSource = new MatTableDataSource(value);
    }
  }
  @Output() projectClick = new EventEmitter<ProjectPreview>();
  @Output() createProjectClick = new EventEmitter<void>();
  @Output() refreshProjectsClick = new EventEmitter<void>();
  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;
  @ViewChild(MatSort) sort: MatSort | null = null;

  displayedColumns = ["Project Number", 'Project Name', 'Risk of Overrun', 'Cost', 'Date Due', 'Zip Code', 'Status'];
  dataSource: any = null;

  today: Date | string = new Date();

  constructor(private datePipe: DatePipe) {
    this.today = this.datePipe.transform(this.today, 'yyyy-MM-ddTHH:mm:ss.SSSZ')!;
  }

  exclamation = faCircleExclamation;

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onCreateClick() {
    this.createProjectClick.emit();
  }

  onRefreshClick() {
    this.refreshProjectsClick.emit();
  }

  onRowClick(row: ProjectPreview) {
    this.projectClick.emit(row);
  }

}
