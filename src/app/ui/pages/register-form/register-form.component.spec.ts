import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterFormComponent } from './register-form.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { PRODUCT_MOCK } from '../../../shared/test/product.mock';
import { of } from 'rxjs';
import { convertToParamMap } from '@angular/router';
import { NotificationService } from '../../../core/services/notification/notification.service';

describe('RegisterFormComponent', () => {
  let component: RegisterFormComponent;
  let fixture: ComponentFixture<RegisterFormComponent>;
  let notificationService: NotificationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterFormComponent, HttpClientModule, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call initializeForm and subscribeToRouteParams on ngOnInit', () => {
    const initializeFormSpy = jest.spyOn(component as any, '_initializeForm');
    const subscribeToRouteParamsSpy = jest.spyOn(
      component as any,
      '_subscribeToRouteParams'
    );

    component.ngOnInit();

    expect(initializeFormSpy).toHaveBeenCalled();
    expect(subscribeToRouteParamsSpy).toHaveBeenCalled();
  });

  it('should subscribe to route params and handle edition page if product id is present', () => {
    const productId = '1';
    const product = PRODUCT_MOCK;
    const paramMap = of(convertToParamMap({ id: productId }));
    const handleEditionPageSpy = jest.spyOn(
      component as any,
      '_handleEditionPage'
    );

    jest.spyOn(component['route'], 'paramMap', 'get').mockReturnValue(paramMap);
    jest.spyOn(window.history, 'state', 'get').mockReturnValue({ product });

    component['_subscribeToRouteParams']();

    expect(component.isEditionPage).toBe(true);
    expect(handleEditionPageSpy).toHaveBeenCalledWith(product);
  });

  it('should set editedProduct, disable id form control, set registerForm values, and update its validity on _handleEditionPage', () => {
    const product = PRODUCT_MOCK;
    const dateRelease = '2022-01-01';
    const dateRevision = '2022-01-02';
    const onFormatDateSpy = jest
      .spyOn(component as any, '_onFormatDate')
      .mockReturnValueOnce(dateRelease)
      .mockReturnValueOnce(dateRevision);

    component['_handleEditionPage'](product);

    expect(component.editedProduct).toBe(product);
    expect(onFormatDateSpy).toHaveBeenCalledWith(product.date_release);
    expect(onFormatDateSpy).toHaveBeenCalledWith(product.date_revision);
    expect(component.formControls['id'].disabled).toBe(true);
    expect(component.registerForm.value).toEqual({
      name: product.name,
      description: product.description,
      date_release: dateRelease,
      logo: product.logo,
    });
  });

  describe('Set test for isInvalidReleaseDate', () => {
    it('should return true if the control has invalidReleaseDate error', () => {
      const controlName = 'date_release';
      component.registerForm
        .get(controlName)
        ?.setErrors({ invalidReleaseDate: true });

      const result = component.isInvalidReleaseDate(controlName);

      expect(result).toBe(true);
    });

    it('should return false if the control does not have invalidReleaseDate error', () => {
      const controlName = 'date_release';
      component.registerForm
        .get(controlName)
        ?.setErrors({ invalidReleaseDate: null });

      const result = component.isInvalidReleaseDate(controlName);

      expect(result).toBe(false);
    });
  });

  describe('Set test for onSubmit', () => {
    it('should call showInvalidFormAlert and return if the form is invalid', () => {
      const isFormInvalidSpy = jest
        .spyOn(component as any, '_isFormInvalid')
        .mockReturnValue(true);
      const showInvalidFormAlertSpy = jest.spyOn(
        component as any,
        '_showInvalidFormAlert'
      );

      component.onSubmit();

      expect(isFormInvalidSpy).toHaveBeenCalled();
      expect(showInvalidFormAlertSpy).toHaveBeenCalled();
    });

    it('should call closeNotification, onUpdateProduct if the form is valid and isEditionPage is true', () => {
      const isFormInvalidSpy = jest
        .spyOn(component as any, '_isFormInvalid')
        .mockReturnValue(false);
      const closeNotificationSpy = jest.spyOn(
        component as any,
        '_closeNotification'
      );
      const onUpdateProductSpy = jest.spyOn(
        component as any,
        'onUpdateProduct'
      );
      component.isEditionPage = true;

      component.onSubmit();

      expect(isFormInvalidSpy).toHaveBeenCalled();
      expect(closeNotificationSpy).toHaveBeenCalled();
      expect(onUpdateProductSpy).toHaveBeenCalled();
    });

    it('should call closeNotification, validateProductId if the form is valid and isEditionPage is false', () => {
      const isFormInvalidSpy = jest
        .spyOn(component as any, '_isFormInvalid')
        .mockReturnValue(false);
      const closeNotificationSpy = jest.spyOn(
        component as any,
        '_closeNotification'
      );
      const validateProductIdSpy = jest.spyOn(
        component as any,
        '_validateProductId'
      );
      component.isEditionPage = false;

      component.onSubmit();

      expect(isFormInvalidSpy).toHaveBeenCalled();
      expect(closeNotificationSpy).toHaveBeenCalled();
      expect(validateProductIdSpy).toHaveBeenCalled();
    });
  });

  it('should call showError of notificationService with correct message on showProductIdExistsError', () => {
    const notificationService = { showError: jest.fn() };

    const errorMessage = 'El id ya existe';

    fixture.detectChanges();

    component['showProductIdExistsError']();
    fixture.whenStable().then(() => {
      expect(notificationService.showError).toHaveBeenCalledWith(errorMessage);
    });
  });

  it('should call emitClose of notificationService when _closeNotification is called', () => {
    const notificationService = { emitClose: jest.fn() };

    fixture.detectChanges();

    component['_closeNotification']();
    fixture.whenStable().then(() => {
      expect(notificationService.emitClose).toHaveBeenCalled();
    });
  });

  it('should call showError of notificationService with correct message on _showInvalidFormAlert', () => {
    const notificationService = { showError: jest.fn() };

    const errorMessage = 'Formulario inválido';

    fixture.detectChanges();

    component['_showInvalidFormAlert']();
    fixture.whenStable().then(() => {
      expect(notificationService.showError).toHaveBeenCalledWith(errorMessage);
    });
  });
});
