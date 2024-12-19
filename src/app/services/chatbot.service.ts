import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { of } from "rxjs";
import { environment } from "../../environments/environment";

@Injectable({ providedIn: 'root' })

export class ChatbotHttpService {
    private apiUrl = environment.chatbotUrl;

    constructor(private http: HttpClient) { }

    chat(message: string) {
        message += " be consise";
        return this.http.post<{response: string}>(this.apiUrl + "/chat", { query: message });
    }
}