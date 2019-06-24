import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { URLService } from 'src/app/modules/shared/services/urlservice';
import { LoginService } from 'src/app/modules/login/services/login.service';
import {MAT_DIALOG_DATA} from '@angular/material'
import { Inject } from '@angular/core';
import { TaskgraphService } from 'src/app/modules/taskgraph-view/services/taskgraph.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-taskgraph-list-dialog',
  templateUrl: './taskgraph-list-dialog.component.html',
  styleUrls: ['./taskgraph-list-dialog.component.scss']
})
export class TaskgraphListDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<TaskgraphListDialogComponent>,
    private httpClient: HttpClient,
    private urlService: URLService,
    private loginService: LoginService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private taskgraphService: TaskgraphService,
    private router: Router
    ) { }

  private taskgraphs = Array<any>();
  private users = Array<any>();
  public AddTaskGraphName = '';
  public AddTaskGraphDescription = '';
  public AddUserName = '';

  ngOnInit() {
    this.httpClient.get(this.urlService.URLs.graphGetAll + '?UserId=' + this.loginService.userService.Id + '&WorkspaceId=' + this.data.workspaceId, { headers: {'Authorization': 'Bearer ' + this.loginService.userService.Token} })
      .subscribe(data => 
        {
          let dataArr = data as Array<any>;
          dataArr.forEach(element => {
            this.taskgraphs.push({ 
              id: element.id,
              description: element.description,
              name: element.name,
              rootId: element.rootId,
              userId: element.userId,
              workspaceId: element.workspaceId,
              taskSetId: element.taskSetId 
            })
          });
        });

    this.httpClient.get(this.urlService.URLs.workspaceGetDetails + '?UserId=' + this.loginService.userService.Id + '&WorkspaceId=' + this.data.workspaceId, { headers: {'Authorization': 'Bearer ' + this.loginService.userService.Token} })
    .subscribe(data => 
      {
        let dataArr = (data as any).users as Array<any>;
        dataArr.forEach(element => {
          this.users.push({ name: element.name, id: element.id});
        });
      });
  }

  Destroy(param: any)
  {
    this.dialogRef.close(param);
  }

  OnItemSelect(taskgraph: any)
  {
  }

  AddTaskGraph()
  {
    this.httpClient.post(this.urlService.URLs.graphAdd,
      {
        description: this.AddTaskGraphDescription,
        name: this.AddTaskGraphName,
        userId: this.loginService.userService.Id,
        workspaceId: this.data.workspaceId
      },
      {
        headers: 
        {
          'Authorization': 'Bearer ' + this.loginService.userService.Token 
        }
      }
      )
      .subscribe(data => 
        {
          this.Destroy(0);
        });  
  }

  OpenTaskGraph(taskgraph: any)
  {
    this.taskgraphService.taskgraphId = taskgraph.id;
    this.taskgraphService.workspaceId = taskgraph.workspaceId;
    this.taskgraphService.taskSetId = taskgraph.taskSetId;
    this.Destroy(0);
    this.router.navigateByUrl('/view');
  }

  AddUser()
  {
    this.httpClient.post(this.urlService.URLs.workspaceAddUser,
      {
        newUserName: this.AddUserName,
        thisUserId: this.loginService.userService.Id,
        workspaceId: this.data.workspaceId
      },
      {
        headers: 
        {
          'Authorization': 'Bearer ' + this.loginService.userService.Token 
        }
      })
      .subscribe(data => 
      {
        this.Destroy(0);
      });  
  }

  CanDeleteUser(user: any)
  {
    return this.loginService.userService.Id != user.id;
  }

  RemoveUser(user: any)
  {
    // public Guid workspaceId;
    // public string userName;
    // public Guid thisUserId;

    this.httpClient.post(this.urlService.URLs.workspaceRemoveUser,
      {
        userName: user.name,
        thisUserId: this.loginService.userService.Id,
        workspaceId: this.data.workspaceId
      },
      {
        headers: 
        {
          'Authorization': 'Bearer ' + this.loginService.userService.Token 
        }
      })
      .subscribe(data => 
      {
        this.Destroy(0);
      });  
  }
}
