import { Injectable } from "@angular/core";
import { createEffect, Actions, ofType } from "@ngrx/effects";
import * as projectActions from "./project.actions";
import { ProjectsHttpService } from "../../services/projects.service";
import { Observable, catchError, concatMap, delay, map, mergeMap, of, tap } from "rxjs";
import { Project, ProjectOverview } from "../../shared/models/project.model";
import { ProjectAPI } from "../../shared/models/api.models";
import { Store } from "@ngrx/store";
import { Router } from "@angular/router";
import { HistoricalHttpService } from "../../services/historical.service";


@Injectable({providedIn: 'root'})
export class ProjectEffects {
    constructor(private actions$: Actions, private projectHttp: ProjectsHttpService, private historicalHttp: HistoricalHttpService, private store: Store, private router: Router) {}

    loadProjectDetails$ = createEffect(() => this.actions$.pipe(
        ofType(projectActions.loadProjectDetails),
        mergeMap(action => this.projectHttp.getProjectDetails(action.projectId).pipe(
            map(projectAPI => {
                let projectOverview: ProjectOverview = {
                    "Project Number": projectAPI.projectNo,
                    "Project Description": projectAPI.projectDescription,
                    "User ID": projectAPI.userId,
                    "Project Name": projectAPI.projectName,
                    "Cost": projectAPI.cost,
                    "Date Due": projectAPI.dateDue,
                    "Zip Code": projectAPI.zipcode,
                    "Status": projectAPI.status,
                    "Square Feet": projectAPI.sqft,
                    "Project Type": projectAPI.projectType,
                    "Complexity": projectAPI.complexity,
                    "Risk of Overrun": projectAPI.riskOfOverrun,
                    "Client Name": projectAPI.clientName,
                    "Client Email": projectAPI.clientEmail,
                    "Start Date": projectAPI.startDate,
                    "Address Line 1": projectAPI.addressLine1,
                    "Address Line 2": projectAPI.addressLine2,
                    "City": projectAPI.city,
                    "State": projectAPI.state,
                    "Sub Total": 0,
                    "Profit": projectAPI.profit,
                    "Overhead": projectAPI.overhead,
                }
                const projectDetails: Project = {
                "Site Work & Prep": {
                    clicked: false,
                    features: {
                        "Permits and Fees": projectAPI.permitsAndFees,
                        "Excavation and Dirtwork": projectAPI.excavationAndDirtwork,
                        "Surveys": projectAPI.surveys,
                        "Plans and Engineering": projectAPI.plansAndEngineering,
                        "Design Work": projectAPI.designWork,
                        "Bid Prep": projectAPI.bidPrep ?? null,
                        "Pre Construction Services": projectAPI.preConstructionServices ?? null,
                        "Lot Property Taxes": projectAPI.lotPropertyTaxes ?? null,
                    },
                    sum: 0,
                },
                "Foundation & Structural": {
                    clicked: false,
                    features: {
                        "Foundation": projectAPI.foundation,
                        "Framing": projectAPI.framing,
                        "Concrete": projectAPI.concrete,
                    },
                    sum: 0,
                },
                "Exterior": {
                    clicked: false,
                    features: {
                        "Roofing": projectAPI.roofing,
                        "Gutters and Downspouts": projectAPI.guttersAndDownspouts,
                        "Windows and Sliders": projectAPI.windowsAndSliders,
                        "Siding": projectAPI.siding,
                        "Masonry": projectAPI.masonry,
                        "Garage Doors": projectAPI.garageDoors,
                        "Exterior Doors": projectAPI.exteriorDoors,
                        "Decking": projectAPI.decking,
                    },
                    sum: 0,
                },
                "Interior": {
                    clicked: false,
                    features: {
                        "Drywall Tape and Texture": projectAPI.drywallTapeAndTexture,
                        "Interior Trim and Doors": projectAPI.interiorTrimAndDoors,
                        "Interior Finish": projectAPI.interiorFinish,
                        "Insulation": projectAPI.insulation,
                        "Cabinets": projectAPI.cabinets,
                        "Countertops": projectAPI.countertops,
                        "Flooring Vinyl": projectAPI.flooringVinyl,
                        "Flooring Hardwood": projectAPI.flooringHardwood,
                        "Flooring Carpet": projectAPI.flooringCarpet,
                        "Tile": projectAPI.tile,
                        "Mirrors and Shower Doors": projectAPI.mirrorsAndShowerDoors,
                    },
                    sum: 0,
                },
                "MEP": {
                    clicked: false,
                    features: {
                        "Plumbing Rough In": projectAPI.plumbingRoughIn,
                        "Electrical Rough In": projectAPI.electricalRoughIn,
                        "Heating and HVAC": projectAPI.heatingAndHVAC,
                        "Plumbing Finish": projectAPI.plumbingFinish,
                        "Electrical Finish": projectAPI.electricalFinish ?? null,
                        "Electrical Light Fixtures": projectAPI.electricalLightFixtures,
                        "Water": projectAPI.water ?? null,
                        "Utilities": projectAPI.utilities,
                        "Sewer and Septic": projectAPI.sewerAndSeptic,
                    },
                    sum: 0,
                },
                "Finishing": {
                    clicked: false,
                    features: {
                        "Paint Exterior": projectAPI.paintExterior,
                        "Paint Interior": projectAPI.paintInterior,
                        "Fireplace and Stove": projectAPI.fireplaceAndStove,
                        "Hardware": projectAPI.hardware,
                        "Appliances": projectAPI.appliances,
                        "BBQ Island": projectAPI.bbqIsland ?? null,
                    },
                    sum: 0,
                },
                "Landscaping": {
                    clicked: false,
                    features: {
                        "Landscape": projectAPI.landscape,
                    },
                    sum: 0,
                },
                "Risk Management": {
                    clicked: false,
                    features: {
                        "Risk Insurance": projectAPI.riskInsurance ?? null,
                        "Loan Interest": projectAPI.loanInterest,
                        "Warranty Work": projectAPI.warrantyWork,
                        // "Profit and Overhead": projectAPI.profitAndOverhead,
                        "Supervision": projectAPI.supervision,
                        "Use Tax": projectAPI.useTax ?? null,
                    },
                    sum: 0,
                },
                "Final Inspection & Closeout": {
                    clicked: false,
                    features: {
                        "Cleanup and Dump Fees": projectAPI.cleanupAndDumpFees,
                        "Contingency": projectAPI.contingency,
                        "Small Tools and Consumables": projectAPI.smallToolsAndConsumables,
                        "Rental Equipment": projectAPI.rentalEquipment,
                        "Restroom Facility": projectAPI.restroomFacility,
                    },
                    sum: 0,
                }
                };

                for (let category in projectDetails) {
                    projectDetails[category].sum = Object.values(projectDetails[category].features).reduce((acc, val) => (acc || 0) + (val || 0), 0) || 0;
                    projectOverview["Sub Total"] += projectDetails[category].sum;
                }
                projectOverview["Cost"] = projectOverview["Sub Total"] + (projectOverview["Sub Total"] * projectOverview["Profit"]) + (projectOverview["Sub Total"] * projectOverview["Overhead"]);

                return projectActions.loadProjectDetailsSuccess({ project: { ProjectOverview: projectOverview, ProjectDetails: projectDetails } });
            }),
            catchError(error => of(projectActions.loadProjectDetailsFailure({ error })))
        )),
    ));

    loadHistoricalAndRiskData$ = createEffect(() => this.actions$.pipe(
        ofType(projectActions.loadHistAndRiskData),
        concatMap(action => this.historicalHttp.getHistoricalAndRiskData(action.projectNo).pipe(
        map((res) => projectActions.loadHistAndRiskDataSuccess({historyAndRisk: res})),
        catchError(error => of(projectActions.loadHistAndRiskDataFailure({ error })))
        )),
      ));

    bidFinalizedUpdateStatus$ = createEffect(() => this.actions$.pipe(
        ofType(projectActions.bidFinalized),
        concatMap(action => this.projectHttp.updateProjectStatus(action.project.ProjectOverview["Project Number"].toString(), action.status).pipe(
            map(() => projectActions.bidFinalizedUpdateStatusSuccess({projectNo: action.project.ProjectOverview["Project Number"].toString(), status: "Tracking"})),
            catchError(error => of(projectActions.bidFinalizedUpdateStatusFailure({ error })))
        )),
    ));

    navigateToTracking$ = createEffect(() => this.actions$.pipe(
        ofType(projectActions.bidFinalizedUpdateStatusSuccess),
        tap(action => this.router.navigate([`/project/${action.projectNo}/tracking`])),
    ), { dispatch: false });

    updateProjectDetails$ = createEffect(() => this.actions$.pipe(
        ofType(projectActions.updatedProjectDetails),
        concatMap(action => this.projectHttp.updateProjectDetails(action.projectNo, action.changes).pipe(
            map(() => projectActions.updatedProjectDetailsSuccess()),
            catchError(error => of(projectActions.updatedProjectDetailsFailure({ error })))
        )),
    ));

    completeProject$ = createEffect(() => this.actions$.pipe(
        ofType(projectActions.projectCompleted),
        concatMap(action => this.historicalHttp.finishProject(action.projectNo).pipe(
            map(() => projectActions.projectCompletedSuccess()),
            catchError(error => of(projectActions.projectCompletedFailure({ error })))
        )),
    ));

}