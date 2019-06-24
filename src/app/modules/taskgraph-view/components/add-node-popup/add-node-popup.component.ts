import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-add-node-popup',
  templateUrl: './add-node-popup.component.html',
  styleUrls: ['./add-node-popup.component.scss']
})
export class AddNodePopupComponent implements OnInit {

    constructor(public dialogRef: MatDialogRef<AddNodePopupComponent>,
      private httpClient: HttpClient,
      ) { }

    public name: string;
    public description: string;
    public status: number = 1;
    public completionTime: number = 0;
    @Output()
    public CreateNodeEventEmitter = new EventEmitter<any>();

    public statuses = 
    [
      {
        value: 0,
        viewValue: 'Blocked'
      },
      {
        value: 1,
        viewValue: 'Assignable'
      }
    ]

    ngOnInit() {
    }

    Destroy(param: any)
    {
      this.dialogRef.close(param);
    }

    OnCreate()
    {
      this.CreateNodeEventEmitter.emit({name: this.name, description: this.description, status: this.status, completionTime: this.completionTime});
      this.Destroy(0);
    }

}
