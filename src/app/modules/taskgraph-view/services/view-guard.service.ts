import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { TaskgraphService } from './taskgraph.service';

@Injectable({
  providedIn: 'root'
})
export class ViewGuardService implements CanActivate{

  constructor(private router : Router, private taskGraphService: TaskgraphService) { }

  canActivate(): boolean {
    if (this.taskGraphService.workspaceId != undefined && this.taskGraphService.workspaceId != '' &&
        this.taskGraphService.taskgraphId != undefined && this.taskGraphService.taskgraphId != '') 
    {
      return true;
    }

    this.router.navigateByUrl('/dashboard');
    return false;
  }
}
