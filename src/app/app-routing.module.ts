import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './modules/login/components/login/login.component';
import { DashboardPageComponent } from './modules/dashboard/components/dashboard-page/dashboard-page.component';
import { AuthenticationGuardService } from './modules/login/services/authentication-guard.service';
import { TaskgraphViewPageComponent } from './modules/taskgraph-view/components/taskgraph-view-page/taskgraph-view-page.component';
import { ViewGuardService } from './modules/taskgraph-view/services/view-guard.service';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent
  },
  {
    path: 'dashboard',
    component: DashboardPageComponent,
    canActivate: [AuthenticationGuardService] 
  },
  {
    path: 'view',
    component: TaskgraphViewPageComponent,
    canActivate: [AuthenticationGuardService, ViewGuardService] 
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
