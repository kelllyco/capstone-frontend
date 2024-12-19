import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Project, ProjectOverview, ProjectStateItem } from '../../shared/models/project.model';
import { selectProject, selectProjectDetails, selectProjectOverhead, selectProjectProfit, selectProjectRisks, selectProjectSpending, selectProjectStatus, selectProjectSubtotal, selectProjectTotal } from '../redux/project.reducer';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable, combineLatest, map, take } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ProjectSpendingAPI } from '../../shared/models/api.models';
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-totals',
  templateUrl: './totals.component.html',
  styleUrl: './totals.component.css'
})
export class TotalsComponent {

  risks$: Observable<{[key: string]: number}>;
  projectNo = this.route.snapshot.params["id"];
  projectSubtotal$: Observable<number>;
  projectTotal$: Observable<number>;
  projectDetails$: Observable<Project>;
  projectProfitPercent$: Observable<number>;
  projectOverheadPercent$: Observable<number>;
  projectSpending$: Observable<ProjectSpendingAPI>;
  overallSpending$: Observable<number>;
  projectStatus$: Observable<string>;
  projectProfit$: Observable<number>;
  projectOverhead$: Observable<number>;

  warning= faCircleExclamation;

  constructor(private store: Store, private route: ActivatedRoute) {
    this.projectSubtotal$ = this.store.select(selectProjectSubtotal(this.projectNo));
    this.projectTotal$ = this.store.select(selectProjectTotal(this.projectNo));
    this.projectDetails$ = this.store.select(selectProjectDetails(this.projectNo));
    this.projectProfitPercent$ = this.store.select(selectProjectProfit(this.projectNo));
    this.projectOverheadPercent$ = this.store.select(selectProjectOverhead(this.projectNo));
    this.projectSpending$ = this.store.select(selectProjectSpending(this.projectNo));
    this.risks$ = this.store.select(selectProjectRisks(this.projectNo));
    this.projectStatus$ = this.store.select(selectProjectStatus(this.projectNo));


    this.overallSpending$ = this.projectSpending$.pipe(
      map((spending) => {
        if (spending["Overall"] === undefined) {
          return  Object.values(spending).reduce((sum, value) => sum + value, 0);
        }
        return spending["Overall"];
      })
    );

    this.projectProfit$ = combineLatest([this.projectSubtotal$, this.projectProfitPercent$]).pipe(
      map(([subtotal, profitPercent]) => subtotal * profitPercent)
    );
    this.projectOverhead$ = combineLatest([this.projectSubtotal$, this.projectOverheadPercent$]).pipe(
      map(([subtotal, overheadPercent]) => subtotal * overheadPercent)
    );
  }

  formatCategories(cat: string): string {
    return cat.replace(/&/g, 'And').replace(/\s+/g, '');
  }
  

}


