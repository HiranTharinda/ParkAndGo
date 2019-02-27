import { Component, OnInit } from '@angular/core';
import { MenuController, IonSlides , ToastController} from '@ionic/angular';
import { AuthServiceService } from '../auth-service.service';

@Component({
  selector: 'app-waiting-verification',
  templateUrl: './waiting-verification.page.html',
  styleUrls: ['./waiting-verification.page.scss'],
})
export class WaitingVerificationPage implements OnInit {

  constructor(public auth: AuthServiceService, public toastCtrl: ToastController,public menu: MenuController) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.menu.enable(false);
  }

  ionViewDidLeave() {
    // enable the root left menu when leaving the tutorial page
    this.menu.enable(true);
  }

  backtoLogin(){
    this.auth.signOut();
  }

}
