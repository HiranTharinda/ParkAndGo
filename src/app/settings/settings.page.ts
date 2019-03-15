import { Component, OnInit } from '@angular/core';
import { LocalstorageService } from '../localstorage.service';
import { FcmService } from '../fcm.service';
import { AuthServiceService } from '../auth-service.service';

interface Settings{
  favno: boolean;
  currno : boolean;
  favshow: boolean;
  currshow : boolean;
  favrad : number;
  currrad : number;
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
  user : any;
  constructor(private auth : AuthServiceService,public storage : LocalstorageService , public fcm : FcmService) {
    this.Load();
    this.auth.user.subscribe( val => {
      this.user = val;
    });
  }

  ngOnInit() {
  }

  Save(){
    var mailsplitarray = this.user.email.split('@');
    var mailsplit = mailsplitarray[mailsplitarray.length -1]
    this.storage.set('favno',this.favno);
    this.storage.set('currno',this.currno);
    this.storage.set('currshow',this.currshow);
    this.storage.set('favshow',this.favshow);
    this.storage.set('currrad',this.currrad);
    this.storage.set('favrad',this.favrad);
    if(this.currno){
      this.fcm.ManualSub(mailsplit);
    }else{
      this.fcm.Manualunsub(mailsplit);
    }
  }

  Load(){
    this.storage.provide().then(res => {
      this.favno = res.favno;
      this.currno = res.currno;
      this.currrad = res.currrad;
      this.favrad = res.favrad;
      this.currshow = res.currshow;
      this.favshow = res.favshow;
    });

  }

}
