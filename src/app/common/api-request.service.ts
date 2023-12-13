import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

import { Router } from '@angular/router';

@Injectable()


export class ApiRequestService {
    urlEnvironment = "";
    private apiUrl = 'http://localhost:3000/api/'; // Replace with your backend API URL

    constructor(
        private http: HttpClient,
        private router: Router,
    ) { }

    //APi Connection
    apiRequest(url: string, body: any): Observable<any> {

        // if (!localStorage.getItem("userID")) {
        //     this.router.navigateByUrl("/authentication/login");
        // }
        this.urlEnvironment = environment.apiUrl;

        // let accessToken = localStorage.getItem("access_token");

        // const headers = { 'content-type': 'application/json' }

        //lets return live data
        let postData = this.http.post(this.apiUrl + url, body, {
            'observe': 'body',
        })

        return postData;


    }

    uploadFile(file: File) {
        const formData = new FormData();
        formData.append('file', file);
    
        return this.http.post(this.apiUrl+"upload", formData);
    }

}
