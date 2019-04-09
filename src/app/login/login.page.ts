import { Component, OnInit } from '@angular/core';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { MenuController, IonSlides  , ToastController} from '@ionic/angular';
import { AuthServiceService } from '../auth-service.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  todo: FormGroup;


  constructor(private alertCtrl: AlertController,public auth: AuthServiceService,
    public toastCtrl: ToastController,public menu: MenuController,private formBuilder: FormBuilder) {
    this.todo = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')])],
      password: ['', Validators.required],
    });
  }

  ionViewWillEnter() {
  // disable when entering login page
    this.menu.enable(false);
  }

  ionViewDidLeave() {
    // enable the root left menu when leaving the Login page
    this.menu.enable(true);
  }

  ngOnInit() {
  }

  // create alert to confirm resend password
  async forgotPassword(){
    const alert = await this.alertCtrl.create({
    header: 'Confirm',
    message: 'Do you wish to request Password Reset',
    buttons: [
              {
                text: 'No',
                role: 'cancel',
                cssClass: 'secondary',
                handler: (blah) => {
                  console.log('Confirm Cancel: blah');
                }
              },
              {
                text: 'Yes',
                handler: () => {
                  this.sendForgotPassword();
                }
              }
            ]
    });
    await alert.present();
  }

  sendForgotPassword(){
    this.auth.forgotpassword(this.todo.value.email)
  }

  // Login request sent to auth service
  logForm(){
    this.auth.emailLogin(this.todo.value.email, this.todo.value.password);
    this.todo.reset();
  }

  // Toast message for incorrect email
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
