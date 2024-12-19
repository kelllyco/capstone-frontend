import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectPreview } from '../shared/models/project.model';
import { Observable, filter, map, take, tap } from 'rxjs';
import { selectLoading, selectProjectPreviews } from './redux/dashboard.reducer';
import { Store } from '@ngrx/store';
import * as dashboardActions from './redux/dashboard.actions';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {
  constructor(private router: Router, private store: Store) {}

  project_previews$: Observable<ProjectPreview[]> = this.store.select(selectProjectPreviews);
  loading$ = this.store.select(selectLoading);

  navCreateProject() {
    setTimeout(() => {
    this.router.navigate(['/bid-creation']);
    }, 0);
  }

  refreshProjectPreviews() {
    this.store.dispatch(dashboardActions.loadProjectPreviews());
  }

  navProject(projectPreview: ProjectPreview) {
    this.router.navigate([`/project/${projectPreview["Project Number"]}/${projectPreview["Status"].toLowerCase()}`]);
  }

  numHighRiskOverruns() {
    return this.project_previews$.pipe(
      map(projects => projects.filter(project => project["Risk of Overrun"] >= 5).length),
    );
  }

  numOpenProjects() {
    return this.project_previews$.pipe(
      map(projects => projects.filter(projects => projects["Status"] != 'Complete').length),
    );
  }

  numLateProjects() {
    return this.project_previews$.pipe(
      map(projects => projects.filter(project => new Date(project["Date Due"]) < new Date() && project["Status"] != "Complete").length),
    );
  }
}

