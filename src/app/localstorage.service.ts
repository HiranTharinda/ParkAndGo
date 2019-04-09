import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Observable, of} from 'rxjs';
import {  take } from 'rxjs/operators'
import { DbService } from './db.service';

interface Settings{
  favno: boolean;
  currno : boolean;
  favshow: boolean;
  currshow : boolean;
  favrad : number;
  currrad : number;
}


@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {

  constructor(private db : DbService, private storage : Storage) { }

  set(name, value){
    this.storage.set(name, value)
  }

  provide(): Promise<any> {
    var promise = new Promise((resolve, reject) => {
      this.storage.get("favno").then(res1 => {
        console.log(res1);
        if (res1 == null) {
          // If one is not available assume that all not available and load from db
          this.loadfromdb().subscribe( res => {
            console.log(res);
            // Load default settings
            var usersettings : Settings = {favno:true,currno:true,currshow:true,favshow:true,currrad:5,favrad:5};
            // If db responds with none store default settings
            if(res == null){
              this.storage.set('favno',true);
              this.storage.set('currno',true);
              this.storage.set('currshow',true);
              this.storage.set('favshow',true);
              this.storage.set('currrad',5);
              this.storage.set('favrad',5);
            } else {
              // If exists rewrite data and save in db
              usersettings['favno']= res.favno;
              usersettings['currno']=res.currno;
              usersettings['currshow']=res.currshow;
              usersettings['favshow']=res.favshow;
              usersettings['currrad']=res.currrad;
              usersettings['favrad']=res.favrad;
              this.storage.set('favno',res.favno);
              this.storage.set('currno',res.currno);
              this.storage.set('currshow',res.currshow);
              this.storage.set('favshow',res.favshow);
              this.storage.set('currrad',res.currrad);
              this.storage.set('favrad',res.favrad);
            }
            resolve(usersettings);
          });
        }else{
          // If info already in local storage get from localstorage
          // Get default settings and rewrite
          var res : Settings  = {favno:true,currno:false,currshow:true,favshow:true,currrad:5,favrad:5};
          res['favno'] = res1;
          this.storage.get("currno").then(res2=>{
              res['currno'] = res2;
              this.storage.get("currrad").then(res3=>{
                  res['currrad'] = res3;
                  this.storage.get("favrad").then(res4=>{
                      res['favrad'] = res4;
                      this.storage.get("currshow").then(res5=>{
                          res['currshow'] = res5;
                          this.storage.get("favshow").then(res6=>{
                              res['favshow'] = res6;
                              resolve(res);
                          });
                      });
                  });
              });
          });
        }
      });
    });
    return promise;
  }

  // When signing out store to db and remove local storage
  savetodb() {
    // Load default value incase user has already deleted local storage from device settings
    var res: Settings  = {favno: true, currno: true, currshow: true, favshow: true, currrad: 5, favrad: 5};
    // Get from local storage
    this.storage.get("favno").then(res1 => {
      if (res1) {
        res["favno"]=res1
      }
      this.storage.get("currno").then(res2 => {
          if (res2){
            res['currno'] = res2;
          }
          this.storage.get("currrad").then(res3 => {
              if (res3) {
                res['currrad'] = res3;
              }
              this.storage.get("favrad").then(res4 => {
                  if (res4) {
                      res['favrad'] = res4;
                  }
                  this.storage.get("currshow").then(res5 => {
                      if (res4) {
                          res['currshow'] = res5;
                      }

                      this.storage.get("favshow").then(res6 => {
                          if (res5) {
                              res['favshow'] = res6;
                          }
                          console.log(res);
                          this.db.savesettings(res);
                          this.storage.clear();
                      });
                  });
              });
          });
      });
    });
  }

  // If settings are not in localstorage take from db
  loadfromdb() {
    return this.db.providesetttings().valueChanges().pipe(take(1));
  }
}
