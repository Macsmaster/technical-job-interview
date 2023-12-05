import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsListComponent } from './products-list.component';
import { PRODUCT_MOCK } from '../../../shared/test/product.mock';
import { ProductModel } from '../../../domain/models/product/product.model';
import { FormsModule } from '@angular/forms';

describe('ProductsListComponent', () => {
  let component: ProductsListComponent;
  let fixture: ComponentFixture<ProductsListComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsListComponent, FormsModule]
    })
    .compileComponents();
    fixture = TestBed.createComponent(ProductsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => fixture.destroy());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should track items by index', () => {
    const component = fixture.componentInstance;
    const items = [1,2,8,5,6,4,9];


    const result = component.trackByFn(0, items[0]);

    expect(result).toBe(0);
  });

  it('should emit the correct action when onDropdownAction is called', () => {
    const product: ProductModel = PRODUCT_MOCK;
    const option = 'edit';
    const emitSpy = jest.spyOn(component.onMakeDropdownAction, 'emit');

    component.onDropdownAction(product, option);

    expect(emitSpy).toHaveBeenCalledWith({ product, option });
  });

  it('Should set the contrary value of showDropdown when openDropdown is called', () => {
    component.showDropdown = true;
    component.openDropdown()
    expect(component.showDropdown).toBeFalsy();
  });

  it('should emit the correct action when doPageSizeChangeAction is called', () => {
    const sizeArray: number = 25;
    component.pageSize = sizeArray;
    const emitSpy = jest.spyOn(component.doPageSizeChangeAction, 'emit');

    component.onPageSizeChange();

    expect(emitSpy).toHaveBeenCalledWith(sizeArray);
  });

  describe('#getInitials', () => {
    it('should return the first two initials of a name', () => {
      const result = component.getInitials('John Doe');
      expect(result).toBe('JD');
    });

    it('should return the first letter of a single word name', () => {
      const result = component.getInitials('John');
      expect(result).toBe('J');
    });

    it('should return an empty string for an empty name', () => {
      const result = component.getInitials('');
      expect(result).toBe('');
    });

    it('should handle names with more than two words', () => {
      const result = component.getInitials('John Doe Smith');
      expect(result).toBe('JD');
    });

    it('should handle names with leading or trailing spaces', () => {
      const result = component.getInitials(' John Doe ');
      expect(result).toBe('JD');
    });


  });


});
