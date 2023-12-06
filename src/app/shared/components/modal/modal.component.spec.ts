import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalComponent } from './modal.component';

describe('ModalComponent', () => {
  let component: ModalComponent;
  let fixture: ComponentFixture<ModalComponent>;
  let mockEvent: Partial<Event>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit primaryBtnAction event with the correct event parameter', () => {
    const eventParameter = 'someEventData';
    const emitSpy = jest.spyOn(component.primaryBtnAction, 'emit');
    component.onPrimaryButtonClick(eventParameter);
    expect(emitSpy).toHaveBeenCalledWith(eventParameter);

    emitSpy.mockRestore();
  });

  it('should emit secondaryBtnAction event with the correct event parameter', () => {
    const eventParameter = 'someEventData';
    const emitSpy = jest.spyOn(component.secondaryBtnAction, 'emit');
    component.closeModal(eventParameter);
    expect(emitSpy).toHaveBeenCalledWith(eventParameter);
    emitSpy.mockRestore();
  });

  it('should call stopPropagation on the provided event', () => {
    mockEvent = {
      stopPropagation: jest.fn(),
    };
    component.preventClosing(mockEvent as Event);
    expect(mockEvent.stopPropagation).toHaveBeenCalled();
  });
});
