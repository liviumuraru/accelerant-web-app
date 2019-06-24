import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { TaskgraphListDialogComponent } from 'src/app/modules/dashboard/components/taskgraph-list-dialog/taskgraph-list-dialog.component';
import { URLService } from 'src/app/modules/shared/services/urlservice';
import { LoginService } from 'src/app/modules/login/services/login.service';
import { TaskgraphService } from '../../services/taskgraph.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-task-node-details-popup',
  templateUrl: './task-node-details-popup.component.html',
  styleUrls: ['./task-node-details-popup.component.scss']
})
export class TaskNodeDetailsPopupComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<TaskgraphListDialogComponent>,
    private httpClient: HttpClient,
    private urlService: URLService,
    private loginService: LoginService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private taskgraphService: TaskgraphService,
    private router: Router) { }

  public asignee: any;
  public name = '';
  public description = '';
  public status = -1;
  public users = new Array<any>();
  public id: any;

  public statuses = 
  [
    {
      value: 0,
      viewValue: 'Blocked'
    },
    {
      value: 1,
      viewValue: 'Assignable'
    },
    {
      value: 2,
      viewValue: 'In progress'
    },
    {
      value: 3,
      viewValue: 'Completed'
    },
  ]

  @Output()
  public UpdateNodeEventEmitter = new EventEmitter<any>();

  ngOnInit() {
    
    this.name = this.data.name;
    this.description = this.data.description;
    this.status = this.data.status;
    this.users.push({ id: null, name: 'None'});
    this.data.users.forEach(element => {
      this.users.push(element);
    });
    this.id = this.data.id;
    if(this.data.asignee != undefined && this.data.asignee != null)
    {
      this.asignee = this.data.asignee;
    }
    else
    {
      this.asignee = null;
    }
  }

  Destroy(param: any)
  {
    this.dialogRef.close(param);
  }

  Update()
  {    
    this.taskgraphService.UpdateTask(this.loginService.userService.Id, this.id, this.taskgraphService.taskgraphId, this.name, this.description, this.asignee, this.status)
    .subscribe(data => {});

    this.Destroy(1);
  }
}
