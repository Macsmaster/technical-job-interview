import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterFormComponent } from './register-form.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { PRODUCT_MOCK } from '../../../shared/test/product.mock';
import { of } from 'rxjs';
import { convertToParamMap } from '@angular/router';

describe('RegisterFormComponent', () => {
  let component: RegisterFormComponent;
  let fixture: ComponentFixture<RegisterFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterFormComponent, HttpClientModule, RouterTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call initializeForm and subscribeToRouteParams on ngOnInit', () => {
    const initializeFormSpy = jest.spyOn(component as any, '_initializeForm');
    const subscribeToRouteParamsSpy = jest.spyOn(component as any, '_subscribeToRouteParams');

    component.ngOnInit();

    expect(initializeFormSpy).toHaveBeenCalled();
    expect(subscribeToRouteParamsSpy).toHaveBeenCalled();
  });

  it('should subscribe to route params and handle edition page if product id is present', () => {
    const productId = '1';
    const product = PRODUCT_MOCK;
    const paramMap = of(convertToParamMap({ id: productId }));
    const handleEditionPageSpy = jest.spyOn(component as any, '_handleEditionPage');

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
    const onFormatDateSpy = jest.spyOn(component as any, '_onFormatDate').mockReturnValueOnce(dateRelease).mockReturnValueOnce(dateRevision);

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
      component.registerForm.get(controlName)?.setErrors({ invalidReleaseDate: true });

      const result = component.isInvalidReleaseDate(controlName);

      expect(result).toBe(true);
    });

    it('should return false if the control does not have invalidReleaseDate error', () => {
      const controlName = 'date_release';
      component.registerForm.get(controlName)?.setErrors({ invalidReleaseDate: null });

      const result = component.isInvalidReleaseDate(controlName);

      expect(result).toBe(false);
    });
  })
});
