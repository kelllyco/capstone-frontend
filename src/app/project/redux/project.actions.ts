import { createAction, props } from "@ngrx/store";
import { ProjectStateItem } from "../../shared/models/project.model";
import { ProjectRiskHistoryAPI } from "../../shared/models/api.models";

export const loadProjectDetails = createAction(
    "[Project] Load Project Details",
    props<{ projectId: string }>()
);

export const loadProjectDetailsSuccess = createAction(
    "[Project] Load Project Details Success",
    props<{ project: ProjectStateItem }>()
);

export const loadProjectDetailsFailure = createAction(
    "[Project] Load Project Details Failure",
    props<{ error: string }>()
);

export const bidFinalized = createAction(
    "[Project] Bid Finalized",
    props<{ project: ProjectStateItem, status: "Tracking" }>()
);

export const bidFinalizedUpdateStatusSuccess = createAction(
    "[Project] Bid Finalized Update Status Success",
    props<{ projectNo: string, status: "Tracking"}>()
);

export const bidFinalizedUpdateStatusFailure = createAction(
    "[Project] Bid Finalized Update Status Failure",
    props<{ error: string }>()
);

export const updatedProjectDetails = createAction(
    "[Project] Updated Project Details",
    props<{ projectNo: string, changes: any }>()
);

export const updatedProjectDetailsSuccess = createAction(
    "[Project] Updated Project Details Success"
);

export const updatedProjectDetailsFailure = createAction(
    "[Project] Updated Project Details Failure",
    props<{ error: string }>()
);

export const updatedFeatureValue = createAction(
    "[Project] Updated Feature Value",
    props<{ projectNo: string, category: string, feature: string, value: number }>(),
);

export const updateOverviewValue = createAction(
    "[Project] Update Overview Value",
    props<{ projectNo: string, feature: string, value: number }>(),
);

export const loadHistAndRiskData = createAction(
    "[Project] Load Historical and Risk Data",
    props<{ projectNo: string }>()
);

export const loadHistAndRiskDataSuccess = createAction(
    "[Project] Load Historical and Risk Data Success",
    props<{ historyAndRisk: ProjectRiskHistoryAPI }>()
);

export const loadHistAndRiskDataFailure = createAction(
    "[Project] Load Historical and Risk Data Failure",
    props<{ error: string }>()
);

export const projectCompleted = createAction(
    "[Project] Project Completed",
    props<{ projectNo: string }>()
);

export const projectCompletedSuccess = createAction(
    "[Project] Project Completed Success"
);

export const projectCompletedFailure = createAction(
    "[Project] Project Completed Failure",
    props<{ error: string }>()
);