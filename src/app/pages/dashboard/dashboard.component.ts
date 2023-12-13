import { Component,     
  ViewChild,
  TemplateRef} from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ApiRequestService } from '../../../app/common/api-request.service';
import { NgxUiLoaderService } from "ngx-ui-loader"; // Import NgxUiLoaderService
import { environment } from '../../../environments/environment';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from "@angular/material/dialog";
import { ModalComponent } from "../modal.component";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
})
export class AppDashboardComponent {
  

  fileUpload: any = this.fb.group({
    fileInput: ['', [Validators.required]],
  });

  private apiUrl = 'http://localhost:3000/api/'; // Replace with your backend API URL


  displayedColumns: string[] = ['assigned', 'name', 'priority', 'budget'];
  selectedFile: File | null = null;

  message = "";

  constructor(
    private fb: FormBuilder,
    private ngxService: NgxUiLoaderService,
    private http: HttpClient,
    private router: Router,
    private apiRequestService: ApiRequestService,
    private matDialog: MatDialog
  ) {

  }

  onValueChange(file: File[]) {
    console.log('File changed!');
  }

  
  ngOnInit(): void {
    if (!localStorage.getItem("id")) {
      this.router.navigateByUrl("/authentication/login");
      return
    }


    this.fileUpload.valueChanges.subscribe((files: File[]) =>
      console.log(this.fileUpload.value, this.fileUpload.valid)
    );
  }
  
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0] as File;
  }

  uploadFile() {
    this.ngxService.start();
    setTimeout(() => {
        this.ngxService.stop(); // stop foreground spinner of the master loader with 'default' taskId
    }, 2000);

    if (this.selectedFile) {
      this.apiRequestService.uploadFile(this.selectedFile).subscribe((response: any) => {
        // Handle the response
        console.log(response)
        this.OpenModal(response.message, "File Upload")

        setTimeout(()=>{
          this.router.navigateByUrl("/dashboard/videoplayer");
        },3000)

      });
    }
  }


  formSubmit() {

    if (this.fileUpload.status === 'VALID') {
      this.ngxService.start();
      setTimeout(() => {
        this.ngxService.stop(); // stop foreground spinner of the master loader with 'default' taskId
      }, 5000);

      this.uploadFile();

    }

  }

  OpenModal(message: any, title: any) {
    this.matDialog.open(ModalComponent, {
      data: { message: message, title: title },
      disableClose: true
    });

  }

  
}
