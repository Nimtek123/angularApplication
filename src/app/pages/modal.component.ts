import { Component, Input, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "modal",
  template: `
    <div style="width:20rem; padding: 24px 24px 0;">
      <h2 mat-dialog-title style="padding: 24px; border-bottom: 1px solid #ddd">{{title}}</h2>
      <div mat-dialog-content style="padding: 24px;"> {{ message }}</div>
      <div mat-dialog-actions align="end">
        <span>
        <button mat-flat-button color="primary" style="color: #fff; background:#5d87ff; height: 36px; padding: 5px" (click)="CloseDialog()" class="w-100">
            Close
          </button>
          
        </span>
      </div>
    </div>
  `
})
export class ModalComponent {
    title: string;
    message: string;
  constructor(
    private _mdr: MatDialogRef<ModalComponent>,
    @Inject(MAT_DIALOG_DATA) data: any
  ) {
    this.message = data.message;
    this.title = data.title;

  }
  CloseDialog() {
    this._mdr.close(false)
  }
}
