import { Injectable } from "@angular/core";
import { Resolve } from "@angular/router";
import { ProjectPreview } from "../../shared/models/project.model";
import { Store } from "@ngrx/store";
import { selectLoading, selectProjectPreviews } from "./dashboard.reducer";
import * as dashboardActions from "./dashboard.actions";
import { filter, first, switchMap, take, tap } from "rxjs";

@Injectable({providedIn: 'root'})
export class DashboardResolver implements Resolve<boolean> {
    constructor(private store: Store) {}

    resolve() {
        return this.store.select(selectProjectPreviews).pipe(
            take(1),
            tap(projectPreviews => {
                if (!projectPreviews || projectPreviews.length === 0) {
                    this.store.dispatch(dashboardActions.loadProjectPreviews());
                }}),
                switchMap(() =>
                this.store.select(selectLoading).pipe(
                    filter(isLoading => isLoading === false),
                    first()
                )
            )
        );
    }

}
