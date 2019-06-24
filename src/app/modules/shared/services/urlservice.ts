import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class URLService {

  constructor() { }

  public AccelerantBaseURL = 'https://accelerantwebapi.azurewebsites.net';

  public URLs = 
  {
    login: this.AccelerantBaseURL + '/users/authenticate',
    register: this.AccelerantBaseURL + '/users/add',
    workspaces: this.AccelerantBaseURL + '/workspace/all',
    workspaceGetDetails: this.AccelerantBaseURL + '/workspace',
    workspaceAdd: this.AccelerantBaseURL + '/workspace/add',
    workspaceAddUser: this.AccelerantBaseURL + '/workspace/users/add',
    workspaceRemoveUser: this.AccelerantBaseURL + '/workspace/users/remove',
    graphGetAll: this.AccelerantBaseURL + '/graph/all',
    graphAdd: this.AccelerantBaseURL + '/graph/add',
    graphGetNodes: this.AccelerantBaseURL + '/graph/nodes',
    graphGetEdges: this.AccelerantBaseURL + '/graph/edges',
    graphAddNode: this.AccelerantBaseURL + '/node/add',
    graphAssignNode: this.AccelerantBaseURL + '/node/assign',
    graphDeleteNode: this.AccelerantBaseURL + '/node/delete',
    graphLinkNodes: this.AccelerantBaseURL + '/node/link',
    graphWebsocketsHub: this.AccelerantBaseURL + '/realtime/graph',
    graphUpdateNode: this.AccelerantBaseURL + '/node/update',
    graphSetRoot: this.AccelerantBaseURL + '/node/markroot'
  }
}
