import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URLService } from '../../shared/services/urlservice';
import { LoginService } from '../../login/services/login.service';
import * as signalR from "@aspnet/signalr";

@Injectable({
  providedIn: 'root'
})
export class TaskgraphService implements OnDestroy {

  constructor(private httpClient: HttpClient, private urlService: URLService, private loginService: LoginService) 
  {
  }

  ngOnDestroy()
  {
    if(this.hubConnection.state == signalR.HubConnectionState.Connected)
    {
      this.hubConnection.stop();
    }
  }

  public workspaceId: string;
  public taskgraphId: string;
  public taskSetId: string;
  public hubConnection: signalR.HubConnection

  public startConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
                            .withUrl(this.urlService.URLs.graphWebsocketsHub + "?taskGraphId=" + this.taskgraphId)
                            .build();
 
    this.hubConnection
      .start()
      .then(() => console.log('Connection started'))
      .catch(err => console.log('Error while starting connection: ' + err));
  }

  public addTaskNodeStatusUpdateActionHandler(callback: (taskData: any) => void)
  {
    this.hubConnection.on("update_task_node_status", (data) => 
    {
      callback(data);
    })
  }
 
  public addTaskNodeAdditionActionHandler(callback: (taskData: any) => void){
    this.hubConnection.on('add_task_node', (data) => {
      callback(data);
    });
  }

  public addTaskNodeDeletionActionHandler(callback: (taskData: any) => void){
    this.hubConnection.on('delete_task_node', (data) => {
      callback(data);
    });
  }

  public addTaskNodeLinkageActionHandler(callback: (taskData: any) => void){
    this.hubConnection.on('link_task_node', (data) => {
      callback(data);
    });
  }

  public addTaskNodeUpdateActionHandler(callback: (taskData: any) => void){
    this.hubConnection.on('update_task_node', (data) => {
      callback(data);
    });
  }

  public addTaskNodeAssignationActionHandler(callback: (taskData: any) => void){
    this.hubConnection.on('assign_task_node', (data) => {
      callback(data);
    });
  }

  public addTaskNodeMarkRootActionHandler(callback: (taskData: any) => void){
    this.hubConnection.on('set_root_node', (data) => {
      callback(data);
    });
  }

  public GetTaskNodes()
  {
    return this.httpClient.get(this.urlService.URLs.graphGetNodes + '?UserId=' + this.loginService.userService.Id + '&TaskGraphId=' + this.taskgraphId, { headers: {'Authorization': 'Bearer ' + this.loginService.userService.Token} });
  }

  public GetTaskEdges()
  {
    return this.httpClient.get(this.urlService.URLs.graphGetEdges + '?UserId=' + this.loginService.userService.Id + '&TaskGraphId=' + this.taskgraphId, { headers: {'Authorization': 'Bearer ' + this.loginService.userService.Token} });
  }

  public AddNode(name: string, description: string, status: number, completionTime: number)
  {
    return this.httpClient.post(this.urlService.URLs.graphAddNode , 
      { 
        workspaceId: this.workspaceId,
        taskGraphId: this.taskgraphId, 
        taskData: 
        { 
          name: name,
          description: description, 
          currentStatus: status,
          estimatedCompletionTime: completionTime
        } 
      }, { headers: {'Authorization': 'Bearer ' + this.loginService.userService.Token} });
  }

  public LinkNodes(sourceId: string, targetId: string)
  {
    return this.httpClient.post(this.urlService.URLs.graphLinkNodes , { taskGraphId: this.taskgraphId, parentId: sourceId, childId: targetId }, { headers: {'Authorization': 'Bearer ' + this.loginService.userService.Token} });
  }

  public AssignNode(userId: string, nodeId: string, taskGraphId: string)
  {
    return this.httpClient.post(this.urlService.URLs.graphAssignNode , { SelfUserId: userId, NewUserId: userId, TaskId: nodeId, TaskGraphId: taskGraphId }, { headers: {'Authorization': 'Bearer ' + this.loginService.userService.Token} });
  }

  public DeleteTask(userId: string, taskId: string, taskGraphId: string)
  {
    return this.httpClient.post(this.urlService.URLs.graphDeleteNode , { userId: userId, taskId: taskId, taskGraphId: taskGraphId }, { headers: {'Authorization': 'Bearer ' + this.loginService.userService.Token} });
  }

  public UpdateTask(userId: string, taskId: string, taskGraphId: string, name: string, description: string, assignedUser: string, status: number)
  {
    //     public Guid taskId;
    //     public Guid userId;
    //     public Guid taskGraphId;
    //     public string name;
    //     public string description;
    //     public Guid assignedUser;
    //     public Status status;
    return this.httpClient.patch(this.urlService.URLs.graphUpdateNode , 
      { 
        userId: userId,
        taskId: taskId, 
        taskGraphId: taskGraphId,
        name: name,
        description: description,
        assignedUser: assignedUser,
        status: status
      }, 
      { headers: {'Authorization': 'Bearer ' + this.loginService.userService.Token} });
  }

  public SetRoot(taskId: string)
  {
    // public Guid userId;
    //     public Guid TaskId;
    //     public Guid TaskGraphId;
    return this.httpClient.post(this.urlService.URLs.graphSetRoot , { userId: this.loginService.userService.Id, taskId: taskId, taskGraphId: this.taskgraphId }, { headers: {'Authorization': 'Bearer ' + this.loginService.userService.Token} });
  }
}
