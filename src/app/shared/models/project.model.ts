export interface ProjectPreview {
    "Project Number": number;
    "User ID": number;
    "Project Name": string;
    "Cost": number;
    "Date Due": string;
    "Zip Code": number;
    "Status": string;
    "Square Feet": number;
    "Project Type": string;
    "Complexity": number;
    "Risk of Overrun": number;
  }

export interface ProjectOverview extends ProjectPreview {
  "Project Description": string;
  "Client Name": string;
  "Client Email": string;
  "Start Date": string;
  "Address Line 1": string;
  "Address Line 2": string | null;
  "City": string;
  "State": string;
  "Sub Total": number;
  "Profit": number;
  "Overhead": number;
}

export interface ProjectDetails {
  [key: string]: number | null;
}

export interface Project {
  [key: string]: {
    clicked: boolean;
    features: Partial<ProjectDetails>;
    sum: number;
  };
}

export interface ProjectStateItem {
  ProjectOverview: ProjectOverview;
  ProjectDetails: Project;
}