import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { LoginBoxComponent } from './components/login-box/login-box.component';
import { LoginComponent } from './components/login/login.component';
import { SharedModule } from '../shared/shared.module';
import { MatButtonModule } from '@angular/material';

@NgModule({
  declarations: [LoginComponent, LoginBoxComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    SharedModule,
    MatButtonModule
  ],
  exports: [
    LoginBoxComponent,
    LoginComponent
  ]
})
export class LoginModule { }
