import { Component, OnInit } from '@angular/core';
import { LocalstorageService } from '../localstorage.service';
import { FcmService } from '../fcm.service';
import { AuthServiceService } from '../auth-service.service';
import { AlertController } from '@ionic/angular';

// fav = private locations , curr = public locations
// no = notifications allowed, show = displayed on map, radius = radius from center marker
// ie favno = notifications allowed for private locations
interface Settings {
  favno: boolean;
  currno: boolean;
  favshow: boolean;
  currshow: boolean;
  favrad: number;
  currrad: number;
}


@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  favno = true;
  currno = true;
  currshow = true;
  favshow = true;
  currrad = 5;
  favrad = 5;
  user: any;

  constructor(private alertCtrl: AlertController, private auth: AuthServiceService,
    public storage: LocalstorageService , public fcm: FcmService) {
    this.Load();
    this.auth.user.subscribe( val => {
      this.user = val;
    });
  }

  ngOnInit() {
  }

  // Alert message to confirm changing password
  async forgotPassword() {
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
                }, {
                text: 'Yes',
                handler: () => {
                  this.sendForgotPassword();
                }
                }
    ]
    });
    await alert.present();
  }

  sendForgotPassword() {
    this.auth.forgotpassword(this.user.email)
  }

  // Save settings in local storage
  saves(){
    var mailsplitarray = this.user.email.split('@');
    var mailsplit = mailsplitarray[mailsplitarray.length -1]
    this.storage.set('favno', this.favno);
    this.storage.set('currno', this.currno);
    this.storage.set('currshow', this.currshow);
    this.storage.set('favshow', this.favshow);
    this.storage.set('currrad', this.currrad);
    this.storage.set('favrad', this.favrad);
    if (this.currno) {
      this.fcm.ManualSubPublic(mailsplit);
    } else {
      this.fcm.ManualunsubPublic(mailsplit);
    }
    if (this.favno) {
      this.fcm.ManualSubPriv(mailsplit);
    } else {
      this.fcm.ManualunsubPriv(mailsplit);
    }
  }

  Load() {
    this.storage.provide().then(res => {
      this.favno = res.favno;
      this.currno = res.currno;
      this.currrad = res.currrad;
      this.favrad = res.favrad;
      this.currshow = res.currshow;
      this.favshow = res.favshow;
    });

  }

  // Confirm saving of settings
  async Save() {
      const alert = await this.alertCtrl.create({
      header: 'Confirm',
      message: 'Do you wish to save these settings',
      buttons: [
                  {
                  text: 'No',
                  role: 'cancel',
                  cssClass: 'secondary',
                  handler: (blah) => {
                    console.log('Confirm Cancel: blah');
                  }
                  }, {
                  text: 'Yes',
                  handler: () => {
                    this.saves();
                  }
                  }
      ]
      });
      await alert.present();
    }
}
