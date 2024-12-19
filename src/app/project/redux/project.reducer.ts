import { createFeatureSelector, createReducer, createSelector, on, select } from "@ngrx/store"
import * as projectActions from "./project.actions"
import { Project, ProjectStateItem } from "../../shared/models/project.model";
import { ProjectRiskHistoryAPI } from "../../shared/models/api.models";

export interface ProjectState {
    projects: ProjectStateItem[];
    historyAndRisk: ProjectRiskHistoryAPI[];
}

export const initialState: ProjectState = {
    projects: [],
    historyAndRisk: [],
}

export const selectProjectState = createFeatureSelector<ProjectState>('projectStore');

export const selectProject = (projectId: string) => createSelector(
    selectProjectState,
    (state: ProjectState) => {
        const project = state.projects.find(project => project.ProjectOverview["Project Number"].toString() === projectId)
    
        if(!project) {
            return initialState.projects[0];
        }
        return project;
    }
);

export const selectProjectDetails = (projectId: string) => createSelector(
    selectProject(projectId),
    (project) => {
        return project.ProjectDetails;
    }
);

export const selectProjectStatus = (projectId: string) => createSelector(
    selectProject(projectId),
    (project) => {
        return project?.ProjectOverview.Status;
    }
);

export const selectProjectSubtotal = (projectId: string) => createSelector(
    selectProject(projectId),
    (project) => {
        return project.ProjectOverview["Sub Total"];
    }
);

export const selectProjectTotal = (projectId: string) => createSelector(
    selectProject(projectId),
    (project) => {
        return project.ProjectOverview.Cost;
    }
);

export const selectProjectProfit = (projectId: string) => createSelector(
    selectProject(projectId),
    (project) => {
        return project.ProjectOverview.Profit;
    }
);

export const selectProjectOverhead = (projectId: string) => createSelector(
    selectProject(projectId),
    (project) => {
        return project.ProjectOverview.Overhead;
    }
);

export const selectProjectSpending = (projectId: string) => createSelector(
    selectProjectHistoryAndRisk(projectId),
    (historyAndRisk) => {
        return historyAndRisk.recentNumbers;
    }
)

export const selectProjectRisks = (projectId: string) => createSelector(
    selectProjectHistoryAndRisk(projectId),
    (historyAndRisk) => {
      if (!historyAndRisk?.combinedData) {
        return {};
      }

      return Object.entries(historyAndRisk.combinedData).reduce((acc, [key, value]) => {
        if (value.useravg === -1) {
          return acc;
        }
        acc[key] = value.useravg - value.projectavg;
        return acc;
      }, {} as { [key: string]: number });
    }
  );

export const selectProjectHistoryAndRisk = (projectId: string) => createSelector(
    selectProjectState,
    (state: ProjectState) => {
        const historyAndRisk = state.historyAndRisk.find(historyAndRisk => historyAndRisk.projectId.toString() === projectId);

        if (!historyAndRisk) {
            return initialState.historyAndRisk[0];
        }

        return historyAndRisk;
    }
);

export const projectReducer = createReducer(
    initialState,

    on(projectActions.loadProjectDetailsSuccess, (state, action) => {
        const subtotal = calculateSubtotal(action.project.ProjectDetails);
        const newProject = {
            ...action.project,
            ProjectOverview: {
                ...action.project.ProjectOverview,
                "Sub Total": subtotal,
                "Cost": subtotal + (subtotal * action.project.ProjectOverview["Profit"]) + (subtotal * action.project.ProjectOverview["Overhead"]),
                }
        }
        return {
            ...state,
            projects: [...state.projects, newProject],
        };
    }),

    on(projectActions.loadHistAndRiskDataSuccess, (state, action) => {
        const existingIndex = state.historyAndRisk.findIndex(
            (historyAndRisk) => historyAndRisk.projectId === action.historyAndRisk.projectId
        );

        if (existingIndex === -1) {
            return {
                ...state,
                historyAndRisk: [...state.historyAndRisk, action.historyAndRisk],
            };
        }

        return {
            ...state,
            historyAndRisk: state.historyAndRisk.map((historyAndRisk) =>
                historyAndRisk.projectId === action.historyAndRisk.projectId ? action.historyAndRisk : historyAndRisk )
        };
    }),

    on(projectActions.bidFinalizedUpdateStatusSuccess, (state, action) => {
        return {
            ...state,
            projects: state.projects.map(project => {
                if (project.ProjectOverview["Project Number"].toString() === action.projectNo) {
                    return {
                        ...project,
                        ProjectOverview: {
                            ...project.ProjectOverview,
                            Status: action.status,
                        }
                    }
                }
                return project;
            })
        }
    }),

    on(projectActions.updatedFeatureValue, (state, action) => {
        return {
            ...state,
            projects: state.projects.map(project => {
                if (project.ProjectOverview["Project Number"].toString() === action.projectNo) {
                    let updatedProjectDetails = {
                        ...project.ProjectDetails,
                        [action.category]: {
                            ...project.ProjectDetails[action.category],
                                features: {
                                    ...project.ProjectDetails[action.category].features,
                                    [action.feature]: action.value,
                                }
                        }
                    };

                    updatedProjectDetails = {
                        ...updatedProjectDetails,
                        [action.category]: {
                            ...updatedProjectDetails[action.category],
                            sum: Object.values(updatedProjectDetails[action.category].features).reduce((acc, val) => (acc || 0) + (val || 0), 0) || 0,
                        }
                    };
                    
                    const updatedSubtotal = calculateSubtotal(updatedProjectDetails);

                    return {
                        ...project,
                        ProjectDetails: updatedProjectDetails,
                        ProjectOverview: {
                            ...project.ProjectOverview,
                            "Sub Total": updatedSubtotal,
                            "Cost": updatedSubtotal + (updatedSubtotal * project.ProjectOverview["Profit"]) + (updatedSubtotal * project.ProjectOverview["Overhead"]),
                        }
                    }
                }
                return project;
            })
        }
    }),

    on(projectActions.updateOverviewValue, (state, action) => {
        return {
            ...state,
            projects: state.projects.map(project => {
                if (project.ProjectOverview["Project Number"].toString() === action.projectNo) {
                    const feature = action.feature;
                    let profit = project.ProjectOverview["Profit"];
                    let overhead = project.ProjectOverview["Overhead"];
                    if (feature === "Profit") {
                        profit = action.value;
                    }
                    if (feature === "Overhead") {
                        overhead = action.value;
                    }
                    return {
                        ...project,
                        ProjectOverview: {
                            ...project.ProjectOverview,
                            [action.feature]: action.value,
                            "Cost": project.ProjectOverview["Sub Total"] + (project.ProjectOverview["Sub Total"] * profit) + (project.ProjectOverview["Sub Total"] * overhead),
                        }
                    }
                }
                return project;
            })
        }
    }),
    on(projectActions.projectCompleted, (state, action) => {
        return {
            ...state,
            projects: state.projects.map(project => {
                if (project.ProjectOverview["Project Number"].toString() === action.projectNo) {
                    return {
                        ...project,
                        ProjectOverview: {
                            ...project.ProjectOverview,
                            Status: "Complete",
                        }
                    }
                }
                return project;
            })
        }
    }),
);

function calculateSubtotal(projectDetails: Project) {
    let subtotal = 0;
    for (let category in projectDetails) {
        subtotal += Object.values(projectDetails[category].features).reduce((acc, val) => (acc || 0) + (val || 0), 0) || 0;
    }
    return subtotal;
}

