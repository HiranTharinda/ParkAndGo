import { TestBed } from '@angular/core/testing';
import {BehaviorSubject} from 'rxjs';
import { LocalstorageService } from './localstorage.service';
import { DbService } from './db.service';
import { Storage } from '@ionic/storage';

const storageMock = {
  set:(id: string , value:string) => new Promise((resolve,reject) => {resolve()}) ,
  get:(id: string ) => new Promise((resolve,reject) => {resolve()}) ,
}
const dbservicemock = {
  providesettings:() => ({
    valueChanges:() => new BehaviorSubject({ foo: 'bar' })
  }),
  savesettings:() => 'saved'
}
describe('LocalstorageService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers :[{provide:DbService, useValue : dbservicemock},
    {provide:Storage, useValue : storageMock}]
  }));

  it('should be created', () => {
    const service: LocalstorageService = TestBed.get(LocalstorageService);
    expect(service).toBeTruthy();
  });
});
