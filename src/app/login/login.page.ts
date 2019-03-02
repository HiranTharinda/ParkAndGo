import { Component, OnInit } from '@angular/core';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';

import { MenuController, IonSlides  , ToastController} from '@ionic/angular';
import { AuthServiceService } from '../auth-service.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  private todo : FormGroup;


  constructor(public auth: AuthServiceService, public toastCtrl: ToastController,public menu: MenuController,private formBuilder: FormBuilder) {
    this.todo = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')])],
      password: ['', Validators.required],
    });
  }

  ionViewWillEnter() {


  this.menu.enable(false);
}

ionViewDidLeave() {
  // enable the root left menu when leaving the tutorial page
  this.menu.enable(true);
}

  ngOnInit() {
  }

  logForm(){
    this.auth.emailLogin(this.todo.value.email, this.todo.value.password);
    this.todo.reset();
  }


  async checkMail(){
    if( !this.todo.controls.email.valid ){
      let toast = await this.toastCtrl.create({
        message: 'Invalid Email',
        duration: 3000,
        position: 'top',
        cssClass: 'custom-class'
      });
      toast.present();
    }
  }

}
