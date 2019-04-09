import { Component, OnInit } from '@angular/core';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';

import { MenuController, IonSlides , ToastController} from '@ionic/angular';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs';
import { AuthServiceService } from '../auth-service.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  todo: FormGroup;

  constructor(public auth: AuthServiceService, public toastCtrl: ToastController,
    public menu: MenuController, private formBuilder: FormBuilder) {
    this.todo = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')])],
      password: ['', Validators.compose([Validators.required,
        Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')])],
      repassword: ['', Validators.compose([Validators.required,
        Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')])]
    });
  }

  ngOnInit() {
  }

  logForm() {
    // send signup request to auth service
    this.auth.emailSignup(this.todo.value.email, this.todo.value.password);
    this.todo.reset();
  }

  ionViewWillEnter() {
    // disable the root left menu when entering the signup page
    this.menu.enable(false);
  }

  ionViewDidLeave() {
    // enable the root left menu when leaving the signup page
    this.menu.enable(true);
  }

  // Show toast message for invalid password input
  async checkPass(){
    if (!this.todo.controls.password.valid ){
      let toast = await this.toastCtrl.create({
        message: 'Password should contain 8 characters including atleast 1 letter number and 1 sybmol',
        duration: 3000,
        position: 'top',
        cssClass: 'custom-class'
      });
      toast.present();
    }
    if ( this.todo.value.password != this.todo.value.repassword){
      let toast = await this.toastCtrl.create({
        message: 'Password do not match',
        duration: 3000,
        position: 'top',
        cssClass: 'custom-class'
      });
      toast.present();
    }
  }

  // Show toast message for invalid email input
  async checkMail(){
    if ( !this.todo.controls.email.valid ){
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
