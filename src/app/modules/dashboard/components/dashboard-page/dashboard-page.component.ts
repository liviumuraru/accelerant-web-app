import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { URLService } from 'src/app/modules/shared/services/urlservice';
import { UserService } from 'src/app/modules/shared/services/user.service';
import { LoginService } from 'src/app/modules/login/services/login.service';
import { MatDialog } from '@angular/material';
import { AddWorkspaceDialogComponent } from '../add-workspace-dialog/add-workspace-dialog.component';
import { TaskgraphListDialogComponent } from '../taskgraph-list-dialog/taskgraph-list-dialog.component';

@Component({
  selector: 'dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss']
})
export class DashboardPageComponent implements OnInit {

  constructor(private httpClient: HttpClient, private urlService: URLService, private userService : UserService, private loginService : LoginService, public dialog: MatDialog) { }

  public addWSname = '';
  public addWSdescription = '';

  public get Workspaces()
  {
    return this.workspaces;
  }

  private workspaces: Array<
    {
      name: string,
      description: string,
      id: string,
      taskGraphIds: [string],
      color: string
    }> = new Array();

  ngOnInit() {
    if(this.loginService.IsAuthenticated)
    {
      this.httpClient.get(this.urlService.URLs.workspaces + '?UserId=' + this.loginService.userService.Id, { headers: {'Authorization': 'Bearer ' + this.loginService.userService.Token} })
      .subscribe(data => 
        {
          this.workspaces.push({ name: '+', description: 'empty', id: 'add', taskGraphIds: [''], color: '#5378b5'});
          let dataArr = data as Array<any>;
          dataArr.forEach(element => {
            this.workspaces.push({ name: element.name, description: element.description, id: element.id, taskGraphIds: element.taskGraphIds , color: 'blue'})
          });
        });
      
      
    }
    else
    {
      console.log('not authenticated');
    }
  }

  OnWorkspaceTileClicked(item: any)
  {
    if(item.id === 'add')
    {
      let dialogRef = this.dialog.open(AddWorkspaceDialogComponent, {
        height: '400px',
        width: '600px'
      });

      dialogRef.afterClosed().subscribe(result => {
        if(result == 0)
          location.reload();
      });
    }
    else
    {
      let dialogRef = this.dialog.open(TaskgraphListDialogComponent, {
        height: '800px',
        width: '800px',
        data:
        {
          workspaceId: item.id
        }
      });
    }
  }

}
