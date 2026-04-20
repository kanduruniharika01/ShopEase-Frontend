import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class Api {
    private baseUrl = 'https://localhost:7010/api'; // Update if needed

    constructor(private http: HttpClient) { }

    register(data: any) {
        return this.http.post(`${this.baseUrl}/auth/register`, data);
    }

    login(payload: any): Observable<any> {
        return this.http.post(`${this.baseUrl}/auth/login`, payload, { responseType: 'text' });
    }

    get(url: string) {
        return this.http.get(this.baseUrl + url);
    }

    post(url: string, body: any) {
        return this.http.post(this.baseUrl + url, body);
    }
    put(url: string, body: any) {
        return this.http.put(this.baseUrl + url, body);
    }
    delete(url: string) {
        return this.http.delete(this.baseUrl + url);
    }

    postText(url: string, body: any) {
        return this.http.post(this.baseUrl + url, body, {
            responseType: 'text'
        });
    }

}
