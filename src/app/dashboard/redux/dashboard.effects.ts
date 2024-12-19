import { Injectable } from "@angular/core";
import * as dashboardActions from "./dashboard.actions";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { map, mergeMap } from "rxjs";
import { ProjectsHttpService } from "../../services/projects.service";
import { ProjectPreview } from "../../shared/models/project.model";
import { ProjectPreviewArrayAPI } from "../../shared/models/api.models";

@Injectable({providedIn: 'root'})
export class DashboardEffects {
    loadProjectPreviews$ = createEffect(() => this.actions$.pipe(
        ofType(dashboardActions.loadProjectPreviews),
        mergeMap(() => this.projectHttp.getAllPreviews().pipe(
            map((projectPreviewsAPI: ProjectPreviewArrayAPI) => {
                const projectPreviews: ProjectPreview[] = projectPreviewsAPI.projects.map(apiPreview => ({
                    "Project Number": apiPreview.projectNo,
                    "User ID": apiPreview.userId,
                    "Project Name": apiPreview.projectName,
                    "Cost": apiPreview.cost,
                    "Date Due": apiPreview.dateDue,
                    "Zip Code": apiPreview.zipcode,
                    "Status": apiPreview.status,
                    "Square Feet": apiPreview.sqft,
                    "Project Type": apiPreview.projectType,
                    "Complexity": apiPreview.complexity,
                    "Risk of Overrun": apiPreview.riskOfOverrun,
                }));
                return dashboardActions.projectPreviewsLoaded({ projectPreviews });
            }))),
    ));

    constructor(private actions$: Actions, private projectHttp: ProjectsHttpService) {}
}