import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskgraphViewComponent } from './components/taskgraph-view/taskgraph-view.component';
import { TaskgraphViewPageComponent } from './components/taskgraph-view-page/taskgraph-view-page.component';
import { AddNodePopupComponent } from './components/add-node-popup/add-node-popup.component';
import { MatFormFieldModule, MatDialogModule, MatInputModule, MatButtonModule, MatSelectModule, MatOptionModule, MatIconModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { TaskNodeDetailsPopupComponent } from './components/task-node-details-popup/task-node-details-popup.component';

@NgModule({
  declarations: [TaskgraphViewComponent, TaskgraphViewPageComponent, AddNodePopupComponent, TaskNodeDetailsPopupComponent],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatDialogModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatOptionModule,
    MatIconModule,
  ],
  exports:
  [
    TaskgraphViewPageComponent,
  ],
  entryComponents: [AddNodePopupComponent, TaskNodeDetailsPopupComponent],
})
export class TaskgraphViewModule { }
