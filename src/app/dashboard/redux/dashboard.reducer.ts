import { createFeatureSelector, createReducer, createSelector, on, select } from "@ngrx/store";
import { ProjectPreview } from "../../shared/models/project.model";
import * as dashboardActions from "./dashboard.actions";


export interface DashboardState {
    projectPreviews: ProjectPreview[];
    loading: boolean
}

export const initialState: DashboardState = {
    projectPreviews: [],
    loading: true
};

export const dashboardReducer = createReducer(
    initialState,

    on(dashboardActions.projectPreviewsLoaded, (state, action) => {
        return {
            ...state,
            projectPreviews: action.projectPreviews,
            loading: false,
        }
    })
);

export const selectDashboardState = createFeatureSelector<DashboardState>('dashboardStore');

export const selectProjectPreviews = createSelector(
    selectDashboardState,
    (state: DashboardState) => state.projectPreviews
);

export const selectLoading = createSelector(
    selectDashboardState,
    (state: DashboardState) => state.loading
);