import { TestBed } from '@angular/core/testing';

import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;
  let showAlertSpy: jest.SpyInstance

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationService);
    showAlertSpy = jest.spyOn(service, 'showSuccess');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
