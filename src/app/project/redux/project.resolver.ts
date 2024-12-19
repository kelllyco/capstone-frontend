import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Project, ProjectStateItem } from "../../shared/models/project.model";
import { Injectable } from "@angular/core";
import { Observable, filter, first, map, of, switchMap, tap } from "rxjs";
import { selectProject } from "./project.reducer";
import { Store } from "@ngrx/store";
import * as projectActions from "./project.actions";
import { Actions, ofType } from "@ngrx/effects";

@Injectable({providedIn: 'root'})
export class projectResolver implements Resolve<ProjectStateItem> {
    constructor(private store: Store, private actions$: Actions){}

    resolve(route: ActivatedRouteSnapshot) {
        const projectId = route.params["id"];
        return this.store.select(selectProject(projectId)).pipe(
            switchMap((project) => {
                if (project) {
                    if (project.ProjectOverview.Status === 'Tracking') {
                        this.store.dispatch(projectActions.loadHistAndRiskData({ projectNo: projectId }));
                        return this.actions$.pipe(
                            ofType(projectActions.loadHistAndRiskDataSuccess),
                            filter((action) => action.historyAndRisk.projectId.toString() === projectId),
                            first(), 
                            map(() => project)
                        );
                    }
                    return of(project);
                } else {

                    this.store.dispatch(projectActions.loadProjectDetails({ projectId }));
                    return this.store.select(selectProject(projectId)).pipe(
                        filter((loadedProject) => !!loadedProject), 
                        first(),
                        switchMap((loadedProject) => {
                            if (loadedProject.ProjectOverview.Status === 'Tracking') {
                                this.store.dispatch(projectActions.loadHistAndRiskData({ projectNo: projectId }));
                                return this.actions$.pipe(
                                    ofType(projectActions.loadHistAndRiskDataSuccess),
                                    filter((action) => action.historyAndRisk.projectId.toString() === projectId),
                                    first(),
                                    map(() => loadedProject) 
                                );
                            }
                            return of(loadedProject);
                        })
                    );
                }
            })
        );

            }
    }


     
