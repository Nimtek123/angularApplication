import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ApiRequestService } from '../../../common/api-request.service';
import { NgxUiLoaderService } from "ngx-ui-loader"; // Import NgxUiLoaderService
import { environment } from '../../../../environments/environment';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from "@angular/material/dialog";
import { ModalComponent } from "../../modal.component";

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
    private apiRequest: ApiRequestService,
    private matDialog: MatDialog
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

    this.apiRequest.apiRequest("login/",  body)
      .subscribe((res: any) => {
        if (res.user.email) {
          localStorage.setItem("id", res.user.id);
          localStorage.setItem("email", res.user.email);
      
          this.router.navigate(['/dashboard']);
        }
        else if (res.error) {
          this.OpenModal(res.error, "Login Error")

          setTimeout(() => {
            this.ngxService.stop(); // stop foreground spinner of the master loader with 'default' taskId
          }, 2000);
        }
      },
        (error: any) => {

          setTimeout(() => {
            this.ngxService.stop(); // stop foreground spinner of the master loader with 'default' taskId
          }, 8000);

          console.log(error);
          this.OpenModal(error.error.error, "Login Error")


        })
  }

  OpenModal(message: any, title: any) {
    this.matDialog.open(ModalComponent, {
      data: { message: message, title: title },
      disableClose: true
    });

  }

}
