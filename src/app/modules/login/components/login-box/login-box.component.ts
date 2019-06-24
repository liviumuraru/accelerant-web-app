import { Component, OnInit, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'login-box',
  templateUrl: './login-box.component.html',
  styleUrls: ['./login-box.component.scss']
})
export class LoginBoxComponent implements OnInit {

  constructor() { }

  @Output()
  public LoginTriggerEmmiter: EventEmitter<any> = new EventEmitter();

  @Output()
  public RegisterTriggerEmmiter: EventEmitter<any> = new EventEmitter();

  public password: string;
  public username: string;

  ngOnInit() {
  }

  login()
  {
    this.LoginTriggerEmmiter.emit('click');
  }

  register()
  {
    this.RegisterTriggerEmmiter.emit('click');
  }

}
