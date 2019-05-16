import { TestBed, fakeAsync, tick, flushMicrotasks } from '@angular/core/testing';
import {BehaviorSubject} from 'rxjs';
import { LocalstorageService } from './localstorage.service';
import { DbService } from './db.service';
import { Storage } from '@ionic/storage';

const storageMock = {
  set:(id: string , value:string) => new Promise((resolve,reject) => {resolve()}) ,
  get:(id: string ) => new Promise((resolve,reject) => {resolve('defaultvalue')}) ,
}

const storageMock2 = {
  set:(id: string , value:string) => new Promise((resolve,reject) => {resolve()}) ,
  get:(id: string ) => new Promise((resolve,reject) => {resolve(null)}) ,
}

const dbservicemock = {
  providesetttings:() => ({
    valueChanges:() => new BehaviorSubject({ foo: 'bar' })
  }),
  savesettings:() => 'saved'
}
describe('LocalstorageService', () => {

  let service : LocalstorageService;
  let storage : Storage;
  let db : DbService;
  let spy1 : jasmine.Spy;
  let spy2 : jasmine.Spy;

  beforeEach(() => TestBed.configureTestingModule({
    providers :[{provide:DbService, useValue : dbservicemock},
    {provide:Storage, useValue : storageMock}]
  }).compileComponents());


  beforeEach(() => {
    service = TestBed.get(LocalstorageService);
    storage = TestBed.get(Storage);
    db = TestBed.get(DbService);
    spy1 = spyOn(db, 'providesetttings').and.returnValue({
      valueChanges:() => new BehaviorSubject({ foo: 'bar' })
    });
    spy2 = spyOn(storage,'get')
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load from db if not in storage', fakeAsync(()=> {
      spy2.and.returnValue(new Promise((resolve,reject) => {resolve(null)}))
      service.provide();
      flushMicrotasks();
      expect(spy1).toHaveBeenCalled();
      expect(spy2.calls.all().length).toBe(1);
  }));

  it('should not load from db if in storage', fakeAsync(()=> {
      spy2.and.returnValue(new Promise((resolve,reject) => {resolve('defaultvalue')}))
      service.provide();
      flushMicrotasks();
      expect(spy1).not.toHaveBeenCalled();
      expect(spy2.calls.all().length).toBe(6);
  }));

  it('should clear settings and call save to db in Db service', fakeAsync(()=> {
    
  }));
});
