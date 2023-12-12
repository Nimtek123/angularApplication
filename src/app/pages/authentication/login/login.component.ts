import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
// import { ApiRequestService } from '../../../common/api-request.service';
import { NgxUiLoaderService } from "ngx-ui-loader"; // Import NgxUiLoaderService
import { environment } from '../../../../environments/environment';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class AppSideLoginComponent {

  urlEnvironment = "";
  
  loginForm: any = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4)]],
  });

  constructor(
    private fb: FormBuilder,
    private ngxService: NgxUiLoaderService,
    private http: HttpClient,
    private router: Router,
    // private apiRequest: ApiRequestService,
  ) {

  }

  ngOnInit() {

  }

  formSubmit() {

    if (this.loginForm.status === 'VALID') {
      this.ngxService.start();
      setTimeout(() => {
        this.ngxService.stop(); // stop foreground spinner of the master loader with 'default' taskId
      }, 5000);

      var body = { "payload": { ...this.loginForm.value } };
      const defaultOptions = {
        autohide: true,
        delay: 10000,
      };

      this.authLogin(body);


    }

    for (const key in this.loginForm.controls) {
      const control = this.loginForm.controls[key];
      control.markAllAsTouched();
    }
  }

  async authLogin(body: any) {
    const defaultOptions = {
      autohide: true,
      delay: 10000,
    };

    this.router.navigate(['/dashboard']);

    return;
    this.apiRequest("auth/login/",  body)
      .subscribe((res: any) => {
        if (res.data.userID) {
          localStorage.setItem("userID", res.data.userID);
          localStorage.setItem("email", res.data.email);
      
          this.router.navigate(['/auth/register']);

          //this.toastService.show("Authentication Successful", "You have been successfully authenticated.", { headerClasses: 'bg-success text-light', ...defaultOptions });

        }
        else {
          setTimeout(() => {
            this.ngxService.stop(); // stop foreground spinner of the master loader with 'default' taskId
          }, 8000);
          //this.toastService.show("Login Error", "There was an error login you in.", { headerClasses: 'bg-danger text-light', ...defaultOptions });
        }
      },
        (error: any) => {

          setTimeout(() => {
            this.ngxService.stop(); // stop foreground spinner of the master loader with 'default' taskId
          }, 8000);

          console.log(error);
          let message = "";
          for (var i = 0; i < error.error.data.length; i++) {
            message += error.error.data[i] + "\n";
          }
          //this.toastService.show("Login Error", message, { headerClasses: 'bg-danger text-light', ...defaultOptions });

        })
  }

  apiRequest(url: string, body: any): Observable<any> {

    if (!localStorage.getItem("userID")) {
        this.router.navigateByUrl("/authentication/login");
    }
    this.urlEnvironment = environment.apiUrl;

    // let accessToken = localStorage.getItem("access_token");

    const headers = { 'content-type': 'application/json' }

    //lets return live data
    let postData = this.http.post(this.urlEnvironment + url, body, {
        'headers': headers,
        'observe': 'body',
    })

    return postData;


}

}
