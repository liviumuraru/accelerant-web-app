import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { MatIconModule, MatButtonModule, MatRippleModule, MatToolbarModule } from "@angular/material";

@NgModule({
  declarations: [ HeaderComponent ],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatRippleModule,
    MatToolbarModule
  ],
  exports: [ HeaderComponent ]
})
export class SharedModule { }
