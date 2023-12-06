import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertComponent } from './alert.component';

describe('AlertComponent', () => {
  let component: AlertComponent;
  let fixture: ComponentFixture<AlertComponent>;
  let notificationServiceMock: any;

  beforeEach(async () => {
    notificationServiceMock = {
      emitClose: jest.fn(),
    };
    await TestBed.configureTestingModule({
      imports: [AlertComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return ✔️ for type "success"', () => {
    component.type = 'success';

    const result = component.getIcon();

    expect(result).toBe('✔️');
  });

  it('should return ❌ for type other than "success"', () => {
    component.type = 'error';

    const result = component.getIcon();

    expect(result).toBe('❌');
  });

  it('should call emitClose method of notificationService', () => {
    fixture.detectChanges();
    component.closeAlert();
    fixture.whenStable().then(() => {
      expect(notificationServiceMock.emitClose).toHaveBeenCalled();
    });
  });
});
