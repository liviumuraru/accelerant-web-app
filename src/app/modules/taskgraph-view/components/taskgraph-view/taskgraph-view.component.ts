import {Component, OnChanges, Renderer, ElementRef, Input, Output, EventEmitter} from '@angular/core';
import { TaskgraphService } from '../../services/taskgraph.service';
import * as cxtmenu from "cytoscape-cxtmenu";
import { MatDialog } from '@angular/material';
import { AddNodePopupComponent } from '../add-node-popup/add-node-popup.component';
import * as $ from 'jquery/dist/jquery.min.js';
import contextMenus from 'cytoscape-context-menus';
import { LoginService } from 'src/app/modules/login/services/login.service';
import { TaskNodeDetailsPopupComponent } from '../task-node-details-popup/task-node-details-popup.component';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { URLService } from 'src/app/modules/shared/services/urlservice';

declare var cytoscape: any;
cytoscape.use(contextMenus, $);

@Component({
    selector: 'taskgraph-view',
    templateUrl: 'taskgraph-view.component.html',
    styleUrls: ['taskgraph-view.component.scss']
})


export class TaskgraphViewComponent implements OnChanges {

    private elements = { nodes: [], edges: [] };
    private ready = false;
    private selected: any;
    private cy: any;
    private radialCxtMenuOptions: any;
    private radialCxtMenu: any;
    @Input() public style: any;
    @Input() public layout: any;
    @Input() public zoom: any;
    private users = new Array<any>();

    private AddNodeEvent: any;

    public get Elements()
    {
        return this.elements;
    }

    public GetNodeColorCode(statusNum)
    {
        switch(statusNum)
        {
            case 0:
                return '#9b1111';
            case 1:
                return '#cc8657';
            case 2:
                return '#bfb920';
            case 3:
                return '#57bf1f';
        }
    }

    @Output() select: EventEmitter<any> = new EventEmitter<any>();

    public constructor(private renderer : Renderer, private el: ElementRef, private taskGraphService: TaskgraphService,
         public dialog: MatDialog, private loginService: LoginService,
         private httpClient: HttpClient, private urlService: URLService,
         private toastr: ToastrService) {

        taskGraphService.startConnection();

        this.taskGraphService.addTaskNodeAdditionActionHandler(this.AddTaskNodeCallback.bind(this));
        this.taskGraphService.addTaskNodeAssignationActionHandler(this.AssignTaskNodeCallback.bind(this));
        this.taskGraphService.addTaskNodeDeletionActionHandler(this.DeleteTaskNodeCallback.bind(this));
        this.taskGraphService.addTaskNodeLinkageActionHandler(this.LinkTaskNodeCallback.bind(this));
        this.taskGraphService.addTaskNodeStatusUpdateActionHandler(this.UpdateTaskNodeStatusCallback.bind(this));
        this.taskGraphService.addTaskNodeUpdateActionHandler(this.UpdateTaskNodeCallback.bind(this));
        this.taskGraphService.addTaskNodeMarkRootActionHandler(this.SetRootCallback.bind(this));

        let self = this;
        this.radialCxtMenuOptions = 
        {
            menuRadius: 100,
            selector: 'node',
            commands: [
                {
                    fillColor: 'rgba(200, 200, 200, 0.75)',
                    content: 'Delete',
                    contentStyle: {},
                    select: function(ele)
                    {
                        self.DeleteTask(ele);
                    },
                    enabled: true
                },
                {
                    fillColor: 'rgba(200, 200, 200, 0.75)',
                    content: 'Link',
                    contentStyle: {},
                    select: function(ele)
                    {
                        if(self.selected != null && ele !== null && ele.isNode && ele.isNode() && self.selected.id() != ele.id())
                        {
                            self.OnAddEdge(self.selected.id(), ele.id());
                        }
                    },
                    enabled: true
                },
                {
                    fillColor: 'rgba(200, 200, 200, 0.75)',
                    content: 'Details',
                    contentStyle: {},
                    select: function(ele)
                    {
                        self.OpenDetailsPanel(ele)
                    },
                    enabled: true
                },
                {
                    fillColor: 'rgba(200, 200, 200, 0.75)',
                    content: 'Mark as root',
                    contentStyle: {},
                    select: function(ele)
                    {
                        self.SetRoot(ele);
                    },
                    enabled: true
                },
            ],
            fillColor: 'rgba(0, 0, 0, 0.75)',
            activeFillColor: 'rgba(1, 105, 217, 0.75)',
            activePadding: 20, // additional size in pixels for the active command
            indicatorSize: 24, // the size in pixels of the pointer to the active command
            separatorWidth: 3, // the empty spacing in pixels between successive commands
            spotlightPadding: 4, // extra spacing in pixels between the element and the spotlight
            minSpotlightRadius: 18, // the minimum radius in pixels of the spotlight
            maxSpotlightRadius: 28, // the maximum radius in pixels of the spotlight
            openMenuEvents: 'cxttap', // space-separated cytoscape events that will open the menu; only `cxttapstart` and/or `taphold` work here
            itemColor: 'white', // the colour of text in the command's content
            itemTextShadowColor: 'transparent', // the text shadow colour of the command's content
            zIndex: 9999, // the z-index of the ui div
            atMouse: false // draw menu at mouse position
        }

        this.httpClient.get(this.urlService.URLs.workspaceGetDetails + '?UserId=' + this.loginService.userService.Id + '&WorkspaceId=' + this.taskGraphService.workspaceId, { headers: {'Authorization': 'Bearer ' + this.loginService.userService.Token} })
        .subscribe(data => 
        {
            let dataArr = (data as any).users as Array<any>;
            dataArr.forEach(element => {
            this.users.push({ name: element.name, id: element.id});
            });
        });

        taskGraphService.GetTaskNodes().subscribe(data => 
            {
                let dataArr = data as Array<any>;
                dataArr.forEach(element => {
                    
                        var data = {
                            id: element.data.id,
                            name: element.data.name,
                            description: element.data.description,
                            asignee: element.assignedUser,
                            status: element.data.currentStatus,
                            weight: 100,
                            colorCode: this.GetNodeColorCode(element.data.currentStatus),
                            shapeType: 'ellipse',
                            isRoot: element.isRoot || false
                        }
                        if(data.isRoot)
                        {
                            data.shapeType = 'square';
                        }
                        this.elements.nodes.push({ data: data })
                    
                });

                taskGraphService.GetTaskEdges().subscribe(data => 
                {
                    let dataArr = data as Array<any>;
                    dataArr.forEach(element => {
                        this.elements.edges.push({ data: {
                            source: element.item1,
                            target: element.item2,
                            strength: 10,
                            colorCode: 'orange'
                            }
                        })
                        });

                    this.ready = true;
                    this.render();
                });
            });

        this.layout = this.layout || {
                name: 'grid',
                directed: true,
                padding: 0
            };

        this.zoom = this.zoom || {
                min: 0.1,
                max: 1.5
            };

        this.style = cytoscape.stylesheet()
            .selector('node')
            .css({
                'shape': 'data(shapeType)',
                'width': 'mapData(weight, 40, 80, 20, 60)',
                'content': 'data(name)',
                'text-valign': 'center',
                'text-outline-width': 1,
                'text-outline-color': 'data(colorCode)',
                'background-color': 'data(colorCode)',
                'color': '#fff',
                'font-size': 10
            })
            .selector('node[isRoot="true"]')
            .css(
                {
                    'shape': 'square'
                }
            )
            .selector('node[isRoot="false"]')
            .css(
                {
                    'shape': 'ellipse'
                }
            )
            .selector(':selected')
            .css({
                'border-width': 1,
                'border-color': 'black'
            })
            .selector('edge')
            .css({
                'curve-style': 'bezier',
                'opacity': 0.666,
                'width': 'mapData(strength, 70, 100, 2, 6)',
                'target-arrow-shape': 'triangle',
                'line-color': 'data(colorCode)',
                'source-arrow-color': 'data(colorCode)',
                'target-arrow-color': 'data(colorCode)'
            })
            .selector('edge.questionable')
            .css({
                'line-style': 'dotted',
                'target-arrow-shape': 'diamond'
            })
            .selector('.faded')
            .css({
                'opacity': 0.25,
                'text-opacity': 0
            });
    }

    public ngOnChanges(): any {
        if(this.ready)
            this.render();
    }

    public SetRoot(elt: any)
    {
        this.taskGraphService.SetRoot(elt.id()).subscribe(data => {}, error => this.toastr.error('It\'s status is Blocked.', 'Cannot set root.'));
    }

    public SetRootCallback(data)
    {
        var crtRootIdx = this.elements.nodes.findIndex(x => x.data.isRoot === true || x.data.isRoot === "true");
        this.elements.nodes[crtRootIdx].data.isRoot = false;
        var oldRoot = this.cy.$id(this.elements.nodes[crtRootIdx].data.id);
        oldRoot.data('isRoot', 'false');
        var newRootIdx = this.elements.nodes.findIndex(x => x.data.id == data.taskId);
        this.elements.nodes[newRootIdx].data.isRoot = true;
        var node = this.cy.$id(data.taskId);
        node.data('isRoot', 'true');
    }

    public AddTaskNodeCallback(data)
    {
        var buildObj = {
            id: data.data.id,
            name: data.data.name,
            weight: 100,
            asignee: data.assignedUser,
            status: data.data.currentStatus,
            description: data.data.description,
            colorCode: this.GetNodeColorCode(data.data.currentStatus),
            isRoot: data.isRoot,
            shapeType: 'ellipse',
        }
        this.elements.nodes.push({ data: buildObj
        });
        
        var addObj: any = 
        {
            group: "nodes",
            data: buildObj
            
        };

        if(this.AddNodeEvent != undefined)
        {
            addObj.renderedPosition = {
                x: this.AddNodeEvent.renderedPosition.x,
                y: this.AddNodeEvent.renderedPosition.y,
            }
        }

        this.cy.add(addObj);
        
    }

    public DeleteTaskNodeCallback(data)
    {
        var filteredEdges = this.elements.edges.filter((x, idx, arr) => 
        {
            return x.source != data && x.target != data ;
        });

        var filteredNodes = this.elements.nodes.filter((x, idx, arr) =>
        {
            return x.id != data;
        });

        this.elements.edges = filteredEdges;
        this.elements.nodes = filteredNodes;

        this.cy.remove('edge[source=\'' + data + '\']');
        this.cy.remove('edge[target=\'' + data + '\']');
        this.cy.remove('#' + data);
    }

    public LinkTaskNodeCallback(data)
    {
        this.cy.add({
            group: 'edges',
            data:
            {
                source: data.parentId,
                target: data.childId,
                strength: 10,
                colorCode: 'orange'
            }
        })
        this.elements.edges.push(
            {
                data: {
                    source: data.parentId,
                    target: data.childId,
                    strength: 10,
                    colorCode: 'orange'
                    }
                }
            );
    }

    public AssignTaskNodeCallback(data)
    {
        
    }

    public UpdateTaskNodeStatusCallback(data)
    {
        
    }

    public render() {
        let cy_contianer = this.renderer.selectRootElement("#cy");
        let localselect = this.select;
        let localSelectObject = this.selected;
        var doubleClickDelayMs = 350;
        var previousTapStamp;
        var self = this;
        this.cy = cytoscape({
                container : cy_contianer,
                layout: this.layout,
                minZoom: this.zoom.min,
                maxZoom: this.zoom.max,
                style: this.style,
                elements: this.elements,
            });
        let cy = this.cy;
        this.radialCxtMenu = cy.cxtmenu( this.radialCxtMenuOptions );

        cy.on('tap', 'node', function(e) {
            var node = e.target;
            self.selected = e.target;
            localSelectObject = e.target;
            localselect.emit(node.data('name'));
        });

        cy.on('tap', function(e) {
            var currentTapStamp = e.timeStamp;
            var msFromLastTap = currentTapStamp - previousTapStamp;

            if (msFromLastTap < doubleClickDelayMs) {
                e.target.trigger('doubleTap', e);
            }
            previousTapStamp = currentTapStamp;
        });

        cy.on('doubleTap', function(e, originalTapEvent) {
            if(originalTapEvent.target === cy)
            {
                self.OnAddNode(e, originalTapEvent);
            }
        });

        cy.on('tap', function(e) {
            if (e.target === cy) {
                localSelectObject = null;
            }
        });

        this.selected = localSelectObject;
    }

    OnAddEdge(sourceId: string, targetId: string)
    {
        this.taskGraphService.LinkNodes(sourceId, targetId).subscribe(data => 
            {}, error => this.toastr.error('This happened because linking the nodes would introduce a cycle or the link already exists, or maybe the status rules were not correctly respected', 'Could not link nodes!')
        );
    }

    OnAddNode(lastEvent: any, firstEvent: any)
    {
        let dialogRef = this.dialog.open(AddNodePopupComponent, {
            height: '590px',
            width: '600px'
        });
        this.AddNodeEvent = firstEvent;

        dialogRef.componentInstance.CreateNodeEventEmitter.subscribe(data =>
        {
            this.taskGraphService.AddNode(data.name, data.description, data.status, data.completionTime).subscribe(apiData =>
            {
                
            });
            
        });

        dialogRef.afterClosed().subscribe(result => {

        });
    }

    OnUpdateTaskStatus(node: any)
    {

    }

    AssignTask(node: any)
    {
        this.taskGraphService.AssignNode(this.loginService.userService.Id, node.id(), this.taskGraphService.taskgraphId)
        .subscribe
        (data => {})
    }

    DeleteTask(node: any)
    {
        this.taskGraphService.DeleteTask(this.loginService.userService.Id, node.id(), this.taskGraphService.taskgraphId)
        .subscribe(data => 
            {
                
            });
    }

    OpenDetailsPanel(node: any)
    {
        let nodeData = this.elements.nodes.find(x => x.data.id === node.id()).data;

        let dialogRef = this.dialog.open(TaskNodeDetailsPopupComponent, {
            height: '601px',
            width: '600px',
            data:
            {
                name: nodeData.name,
                description: nodeData.description,
                status: nodeData.status,
                asignee: nodeData.asignee,
                users: this.users,
                id: node.id()
            }
        });

        dialogRef.componentInstance.UpdateNodeEventEmitter.subscribe(data =>
        {
            
        });

        dialogRef.afterClosed().subscribe(result => {

        });
    }

    UpdateTaskNodeCallback(data: any)
    {
        var idx = this.elements.nodes.findIndex(x => x.data.id == data.data.id);
        this.elements.nodes[idx].data.status = data.data.currentStatus;
        this.elements.nodes[idx].data.description = data.data.description;
        this.elements.nodes[idx].data.name = data.data.name;
        this.elements.nodes[idx].data.asignee = data.assignedUser;

        var node = this.cy.$id(data.data.id);
        node.data('name', data.data.name);
        node.data('colorCode', this.GetNodeColorCode(data.data.currentStatus));
    }

}


// id: element.data.id,
//                             name: element.data.name,
//                             description: element.data.description,
//                             asignee: element.assignedUser,
//                             status: element.data.currentStatus,
//                             weight: 100,
//                             colorCode: this.GetNodeColorCode(element.data.currentStatus),
//                             shapeType: 'ellipse',
//                             isRoot: element.isRoot || false