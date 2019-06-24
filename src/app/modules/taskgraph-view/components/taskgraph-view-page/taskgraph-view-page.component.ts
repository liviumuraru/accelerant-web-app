import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URLService } from 'src/app/modules/shared/services/urlservice';
import { LoginService } from 'src/app/modules/login/services/login.service';
import { TaskgraphService } from '../../services/taskgraph.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-taskgraph-view-page',
  templateUrl: './taskgraph-view-page.component.html',
  styleUrls: ['./taskgraph-view-page.component.scss']
})
export class TaskgraphViewPageComponent implements OnInit {

  node_name: string;

    layout = {
                name: 'dagre',
                rankDir: 'LR',
                directed: true,
                padding: 0
            };

    constructor(private httpClient: HttpClient, private urlService: URLService, private loginService: LoginService, private taskGraphService: TaskgraphService,
      private router: Router) {
    }

    nodeChange(event) {
        this.node_name = event;
    }

    ngOnInit()
    {
      
    }

    Return()
    {
      this.router.navigateByUrl('/dashboard');
    }
}
