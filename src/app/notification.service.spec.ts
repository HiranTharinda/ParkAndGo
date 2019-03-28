import { TestBed } from '@angular/core/testing';
import { NotificationService } from './notification.service';

const localstorageMock = {
  provide:() =>({
      then: () => {
        return {currad:"5"}
      }
  })
}


describe('NotificationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NotificationService = TestBed.get(NotificationService);
    expect(service).toBeTruthy();
  });
});
