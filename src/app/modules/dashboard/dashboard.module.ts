import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardPageComponent } from './components/dashboard-page/dashboard-page.component';
import { SharedModule } from '../shared/shared.module';
import { MatExpansionModule, MatGridListModule, MatFormField, MatFormFieldModule, MatDialogModule, MatButtonModule, MatInputModule, MatListModule, MatIconModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AddWorkspaceDialogComponent } from './components/add-workspace-dialog/add-workspace-dialog.component';
import { FormsModule } from '@angular/forms';
import { TaskgraphListDialogComponent } from './components/taskgraph-list-dialog/taskgraph-list-dialog.component';

@NgModule({
  declarations: [DashboardPageComponent, AddWorkspaceDialogComponent, TaskgraphListDialogComponent],
  imports: [
    CommonModule,
    SharedModule,
    MatExpansionModule,
    MatGridListModule,
    BrowserAnimationsModule,
    FormsModule,
    MatFormFieldModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatListModule,
    MatIconModule,
    MatFormFieldModule
  ],
  exports:
  [
    DashboardPageComponent,
    AddWorkspaceDialogComponent
  ],
  entryComponents: [AddWorkspaceDialogComponent, TaskgraphListDialogComponent],
})
export class DashboardModule { }
