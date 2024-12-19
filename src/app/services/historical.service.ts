import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { ProjectRiskHistoryAPI } from "../shared/models/api.models";
import { ProjectsHttpService } from "./projects.service";
import { catchError, switchMap, throwError } from "rxjs";

@Injectable({providedIn: 'root'})

export class HistoricalHttpService {    
    private apiUrl = environment.apiUrl + "/historical";
    private isProd = environment.production;
    constructor(private http: HttpClient, private projectsHttp: ProjectsHttpService) {}

    uploadHistoricalData(dateAndJson: {date: Date, JSON: any[]}, projectNo: string) {
        if (this.isProd) {        
            return this.projectsHttp.getAccessToken().pipe(
                switchMap(accessToken => {
                    const headers = new HttpHeaders({
                        'Authorization': `Bearer ${accessToken}` // Attach token to headers
                    });
                    console.log('Making request to upload hist data with headers:', headers); // Debugging
                    return this.http.post(this.apiUrl + "/updateHistProj/" + projectNo, dateAndJson, { headers });
                }),
                catchError(error => {
                    console.error('Error fetching project previews', error);
                    return throwError(() => error);
                })
            );
        }
        else {
            return this.http.post(this.apiUrl + "/updateHistProj/" + projectNo, dateAndJson);
        }
    }


    getHistoricalAndRiskData(projectNo: string) {
        if (this.isProd) {
            return this.projectsHttp.getAccessToken().pipe(
                switchMap(accessToken => {
                    const headers = new HttpHeaders({
                        'Authorization': `Bearer ${accessToken}` // Attach token to headers
                    });
                    console.log('Making request to get hist and risk data with headers:', headers); // Debugging
                    return this.http.get<ProjectRiskHistoryAPI>(this.apiUrl + "/getAllHistPostings/" + projectNo, {headers});
                }),
                catchError(error => {
                    console.error('Error fetching project previews', error);
                    return throwError(() => error);
                })
            );
        }
        else {
            return this.http.get<ProjectRiskHistoryAPI>(this.apiUrl + "/getAllHistPostings/" + projectNo);
        } 
    }

    finishProject(projectNo: string) {
        if (this.isProd) {
            return this.projectsHttp.getAccessToken().pipe(
                switchMap(accessToken => {
                    const headers = new HttpHeaders({
                        'Authorization': `Bearer ${accessToken}` // Attach token to headers
                    });
                    console.log('Making request to finish project with headers:', headers); // Debugging
                    return this.http.get(this.apiUrl + "/update-status/" + projectNo, {headers});
                }),
                catchError(error => {
                    console.error('Error fetching project previews', error);
                    return throwError(() => error);
                })
            );
        }
        else {
            return this.http.get(this.apiUrl + "/update-status/" + projectNo);
        }
    }
}