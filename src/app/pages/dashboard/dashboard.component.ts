import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ApiRequestService } from '../../../app/common/api-request.service';
import { NgxUiLoaderService } from "ngx-ui-loader"; // Import NgxUiLoaderService
import { environment } from '../../../environments/environment';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';


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


  constructor(
    private fb: FormBuilder,
    private ngxService: NgxUiLoaderService,
    private http: HttpClient,
    private router: Router,
    private apiRequestService: ApiRequestService,
  ) {

  }

  onValueChange(file: File[]) {
    console.log('File changed!');
  }
  ngOnInit(): void {
    this.fileUpload.valueChanges.subscribe((files: File[]) =>
      console.log(this.fileUpload.value, this.fileUpload.valid)
    );
  }
  
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0] as File;
  }

  uploadFile() {
    if (this.selectedFile) {
      this.apiRequestService.uploadFile(this.selectedFile).subscribe((response) => {
        // Handle the response
      });
    }
  }


  formSubmit() {

    if (this.fileUpload.status === 'VALID') {
      this.ngxService.start();
      setTimeout(() => {
        this.ngxService.stop(); // stop foreground spinner of the master loader with 'default' taskId
      }, 5000);

      // var body = { "payload": { ...this.fileUpload.value } };
      // const defaultOptions = {
      //   autohide: true,
      //   delay: 10000,
      // };

      this.uploadFile();

    }

  }
}
