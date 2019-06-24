import { Component, OnInit, ViewChild, ViewContainerRef, AfterViewInit, ComponentRef } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { LoginBoxComponent } from '../login-box/login-box.component';
import { UserService } from 'src/app/modules/shared/services/user.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, AfterViewInit {

  ngAfterViewInit(): void {
  }

  constructor(private loginService: LoginService, private userService: UserService, private router: Router, private toastr: ToastrService) { }

  @ViewChild(LoginBoxComponent, { static: false }) loginBoxComponent: LoginBoxComponent;

  ngOnInit() {
  }

  public Login(event: MouseEvent): void
  {
    this.loginService.login({ username: this.loginBoxComponent.username, password: this.loginBoxComponent.password }).subscribe(res => 
      {
        this.router.navigateByUrl('/dashboard');
      }, error => this.toastr.error("Could not login. Check your password and try again. Also check your internet connection."));
  }

  public Register(event: MouseEvent): void
  {
    this.loginService.register({ username: this.loginBoxComponent.username, password: this.loginBoxComponent.password }).subscribe(res => 
    {
      this.router.navigateByUrl('');
    }, error => this.toastr.error("Could not register a new user. Try a different username."));
  }
}
