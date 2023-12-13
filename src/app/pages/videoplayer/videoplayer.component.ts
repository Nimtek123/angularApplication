import { Component, ViewEncapsulation, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ApiRequestService } from '../../common/api-request.service';
import { NgxUiLoaderService } from "ngx-ui-loader"; // Import NgxUiLoaderService
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';


export interface productsData {
  id: number;
  filename: string;
  originalname: string;
  size: string;
}

const ELEMENT_DATA: productsData[] = [
  
];

@Component({
  selector: 'app-videoplayer',
  templateUrl: './videoplayer.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class AppVideoplayerComponent {

  displayedColumns: string[] = ['filename', 'originalname', 'size',];
  dataSource = ELEMENT_DATA;
  activeFile = "";

  constructor(
    private fb: FormBuilder,
    private ngxService: NgxUiLoaderService,
    private http: HttpClient,
    private router: Router,
    private apiRequest: ApiRequestService,
  ) {

  }

  ngOnInit() {
    this.getFiles();
  }

  async getFiles() {
    const defaultOptions = {
      autohide: true,
      delay: 10000,
    };
    let body: any = {}

    this.apiRequest.apiRequest("files",  body)
      .subscribe((res: any) => {
        if (res) {
            console.log(res)
          this.dataSource = res;
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

  activeVideo(fileName: any){
    this.activeFile = "http://localhost:3000/uploads/"+fileName

    console.log(this.activeFile)
  }
}
