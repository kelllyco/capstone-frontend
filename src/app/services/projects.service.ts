import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError, switchMap } from "rxjs/operators";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AddProjectInputsAPI, AddProjectResponseAPI, ProjectAPI, ProjectPreviewAPI, ProjectPreviewArrayAPI } from "../shared/models/api.models";
import { environment } from "../../environments/environment";

@Injectable({providedIn: 'root'})
export class ProjectsHttpService {
    private apiUrl = environment.apiUrl + "/projects";
    private isProd = environment.production;
    constructor(private http: HttpClient) {}

    getAccessToken(): Observable<string> {
        return this.http.get<any>('/.auth/me').pipe(
            catchError(error => {
                console.error('Error fetching token from /.auth/me', error);
                return throwError(() => new Error('Error fetching token'));
            }),
            switchMap(response => {
                const accessToken = response[0]?.access_token;
                const expiresOn = response[0]?.expires_on;
    
                if (accessToken && expiresOn) {
                    const expirationDate = new Date(expiresOn);
                    const now = new Date();
    
                    // Check if the token is expired
                    if (now >= expirationDate) {
                        console.log('Access token expired, attempting to refresh...');
                        // Call the refresh endpoint if expired
                        return this.http.get<any>('/.auth/refresh').pipe(
                            switchMap(refreshResponse => {
                                const newAccessToken = refreshResponse[0]?.access_token;
                                if (newAccessToken) {
                                    console.log('Refreshed access token:', newAccessToken);
                                    return [newAccessToken];
                                } else {
                                    throw new Error('Unable to refresh token');
                                }
                            }),
                            catchError(refreshError => {
                                console.error('Error refreshing token', refreshError);
                                return throwError(() => new Error('Error refreshing token'));
                            })
                        );
                    } else {
                        console.log('Access token retrieved from /.auth/me:', accessToken);
                        return [accessToken]; // Return current token if not expired
                    }
                } else {
                    throw new Error('Access token or expiration date not found in /.auth/me response');
                }
            })
        );
    }

    logout() {
        return this.http.get<any>('/.auth/logout');
    }

    getAllPreviews(): Observable<ProjectPreviewArrayAPI> {
        if (this.isProd) {
            return this.getAccessToken().pipe(
                switchMap(accessToken => {
                    const headers = new HttpHeaders({
                        'Authorization': `Bearer ${accessToken}` // Attach token to headers
                    });
                    console.log('Making request to get-all-preview with headers:', headers); // Debugging
                    return this.http.get<ProjectPreviewArrayAPI>(`${this.apiUrl}/get-all-preview`, { headers });
                }),
                catchError(error => {
                    console.error('Error fetching project previews', error);
                    return throwError(() => error);
                })
            );
        }
        else {
            return this.http.get<ProjectPreviewArrayAPI>(this.apiUrl + "/get-all-preview");
        }

    }

    getProjectDetails(projectNo: string) {
        if (this.isProd) {
            return this.getAccessToken().pipe(
                switchMap(accessToken => {
                    const headers = new HttpHeaders({
                        'Authorization': `Bearer ${accessToken}` // Attach token to headers
                    });
                    console.log('Making request to get-details with headers:', headers); // Debugging
                    return this.http.get<ProjectAPI>(this.apiUrl + "/get-details/" + projectNo, { headers });
                }),
                catchError(error => {
                    console.error('Error fetching project details', error);
                    return throwError(() => error);
                })
            );
        }
        else {
            return this.http.get<ProjectAPI>(this.apiUrl + "/get-details/" + projectNo);
        }

    }

    addProject(inputs: AddProjectInputsAPI) {
        if (this.isProd) {
            return this.getAccessToken().pipe(
                switchMap(accessToken => {
                    const headers = new HttpHeaders({
                        'Authorization': `Bearer ${accessToken}` // Attach token to headers
                    });
                    console.log('Making request to add-project with headers:', headers); // Debugging
                    return this.http.post<AddProjectResponseAPI>(this.apiUrl + "/add-project", inputs, { headers });
                }),
                catchError(error => {
                    console.error('Error adding project', error);
                    return throwError(() => error);
                })
            );
        }
        else {
            return this.http.post<AddProjectResponseAPI>(this.apiUrl + "/add-project", inputs);
        }
    }

    updateProjectStatus(projectNo: string, status: string) {
        if (this.isProd) {
            return this.getAccessToken().pipe(
                switchMap(accessToken => {
                    const headers = new HttpHeaders({
                        'Authorization': `Bearer ${accessToken}` // Attach token to headers
                    });
                    console.log('Making request to update-status with headers:', headers); // Debugging
                    return this.http.post(this.apiUrl + "/update-status/" + projectNo, { "status": status }, { headers });
                }),
                catchError(error => {
                    console.error('Error adding project', error);
                    return throwError(() => error);
                })
            );
        }
        else {
            return this.http.post(this.apiUrl + "/update-status/" + projectNo, { "status": status });
        }

    }

    updateProjectDetails(projectNo: string, changes: any) {
        if (this.isProd) {
            return this.getAccessToken().pipe(
                switchMap(accessToken => {
                    const headers = new HttpHeaders({
                        'Authorization': `Bearer ${accessToken}` // Attach token to headers
                    });
                    console.log('Making request to update-details with headers:', headers); // Debugging
                    return this.http.post(this.apiUrl + "/update-details/" + projectNo, changes, { headers });            
                }),
                catchError(error => {
                    console.error('Error adding project', error);
                    return throwError(() => error);
                })
            );
        }
        else {
            return this.http.post(this.apiUrl + "/update-details/" + projectNo, changes);
        }
    }
}