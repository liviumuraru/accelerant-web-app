import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { URLService } from 'src/app/modules/shared/services/urlservice';
import { LoginService } from 'src/app/modules/login/services/login.service';

@Component({
  selector: 'app-add-workspace-dialog',
  templateUrl: './add-workspace-dialog.component.html',
  styleUrls: ['./add-workspace-dialog.component.scss']
})
export class AddWorkspaceDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<AddWorkspaceDialogComponent>,
              private httpClient: HttpClient,
              private urlService: URLService,
              private loginService: LoginService,
              ) { }

  public name: string;
  public description: string;

  ngOnInit() {
  }

  Destroy(param: any)
  {
    this.dialogRef.close(param);
  }

  CreateWorkspace()
  {
    this.httpClient.post(this.urlService.URLs.workspaceAdd,
    {
      description: this.description,
      name: this.name,
      userId: this.loginService.userService.Id
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

}
