import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectProject, selectProjectSubtotal, selectProjectTotal } from '../redux/project.reducer';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, combineLatest, map, take } from 'rxjs';
import { Project, ProjectOverview, ProjectStateItem } from '../../shared/models/project.model';
import * as projectActions from '../redux/project.actions';

@Component({
  selector: 'app-modification',
  templateUrl: './modification.component.html',
  styleUrl: './modification.component.css'
})

export class ModificationComponent {

  projectDetails: Project = {} as Project;
  projectOverview: ProjectOverview = {} as ProjectOverview;
  allUnclicked = true;

  projectTotal$: Observable<number>;
  projectSubtotal$: Observable<number>;
  profitAndOverhead$: Observable<number>;

  projectNo: string;

  types = ["currency", "percent"];

  changes: { [key: string]: any } = {};
  

  constructor(private store: Store, private route: ActivatedRoute, private router: Router) {
    this.projectNo = this.route.snapshot.params["id"];

    this.store.select(selectProject(this.projectNo)).pipe(
      take(1),
    ).subscribe(project => {
      this.projectDetails = JSON.parse(JSON.stringify(project.ProjectDetails));
      this.projectOverview = project.ProjectOverview;
    });

    this.projectTotal$ = this.store.select(selectProjectTotal(this.projectNo));
    this.projectSubtotal$ = this.store.select(selectProjectSubtotal(this.projectNo));

    this.profitAndOverhead$ = combineLatest([this.projectTotal$, this.projectSubtotal$]).pipe(
      map(([total, subtotal]) => total - subtotal)
    );
  }

  updateAllUnclicked() {
    this.allUnclicked = Object.values(this.projectDetails!).map(category => category.clicked).every(value => value === false);
  };

  keepOriginalOrder = (a: any, b: any): number => {
    const keys = Object.keys(this.projectDetails!);
    return keys.indexOf(a.key) - keys.indexOf(b.key);
  };

  saveAndExit() {
    this.saveBid();
    this.navDashboard();
  }

  finalizeBid() {
    this.projectTotal$.pipe(take(1)).subscribe(
      total => this.changes["cost"] = total
    );
    this.profitAndOverhead$.pipe(take(1)).subscribe(
      profitAndOverhead => {
        this.changes["profitAndOverhead"] = profitAndOverhead;
      }
    );
    this.store.dispatch(projectActions.updatedProjectDetails({ projectNo: this.projectNo, changes: this.changes }));
    this.changes = {};
    setTimeout(() => {
      this.store.dispatch(projectActions.bidFinalized({ project: {ProjectDetails: this.projectDetails, ProjectOverview: this.projectOverview }, status: "Tracking" }));
    }, 2000);  
  }

  navDashboard() {
    this.router.navigate(['/dashboard']);
  }

  saveBid() {
    this.projectTotal$.pipe(take(1)).subscribe(
      total => this.changes["cost"] = total
    );
    this.store.dispatch(projectActions.updatedProjectDetails({ projectNo: this.projectNo, changes: this.changes }));
    this.changes = {};
  }

  toCamelCase(input: string) {
    if (input === "Heating and HVAC") {
      return "heatingAndHVAC";
    }
    return input.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
  }

  editOverviewValue(feature: string, value: number) {
    this.store.dispatch(projectActions.updateOverviewValue({ projectNo: this.projectNo, feature, value }));
    const camelFeature = this.toCamelCase(feature);
    this.changes[camelFeature] = value;
  }

  editFeatureValue(category: string, feature: string, value: number) {
    const categoryData = this.projectDetails![category as keyof Project];
    this.store.dispatch(projectActions.updatedFeatureValue({ projectNo: this.projectNo, category, feature, value }));
    if (feature in categoryData.features) {
      const camelFeature = this.toCamelCase(feature);
      this.changes[camelFeature] = value;
    }
  }
}
