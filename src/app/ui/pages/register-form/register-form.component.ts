import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CardComponent } from '../../components/card/card.component';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ButtonComponent } from '../../components/button/button.component';
import { ProductService } from '../../../infrastructure/services/product.service';
import { Subscription, mergeMap } from 'rxjs';
import { NotificationService } from '../../../core/services/notification/notification.service';
import { CustomValidators } from '../../../shared/validators/custom.validators';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductModel } from '../../../domain/models/product/product.model';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [
    CardComponent,
    CommonModule,
    ReactiveFormsModule,
    ButtonComponent,
    CardComponent,
  ],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.scss',
})
export class RegisterFormComponent implements OnInit, OnDestroy {
  registerForm!: UntypedFormGroup;

  subscriptions$: Subscription[] = [];

  editedProduct!: ProductModel;
  isEditionPage: boolean = false;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this._initializeForm();
    this._subscribeToRouteParams();
  }

  ngOnDestroy(): void {
    if (this.subscriptions$.length > 0) {
      this.subscriptions$.forEach((subscription) => subscription.unsubscribe());
    }
    this.notificationService.emitClose();
  }

  private _initializeForm(): void {
    this.loadForm();
    this.onSubscripteDateRelease();
  }

  private _subscribeToRouteParams(): void {
    this.subscriptions$.push(
      this.route.paramMap.subscribe((params) => {
        const productId = params.get('id');
        this.isEditionPage = !!productId;

        const navigationState = history.state;
        if (navigationState && navigationState.product) {
          this._handleEditionPage(navigationState.product);
        }
      })
    );
  }

  private _handleEditionPage(product: any): void {
    this.editedProduct = product;
    const dateRelease = this._onFormatDate(this.editedProduct?.date_release);
    const dateRevision = this._onFormatDate(this.editedProduct?.date_revision);

    this.formControls['id'].disable();

    this.registerForm.setValue({
      id: this.editedProduct.id,
      name: this.editedProduct.name,
      description: this.editedProduct.description,
      date_release: dateRelease,
      date_revision: dateRevision,
      logo: this.editedProduct.logo,
    });

    this.registerForm.updateValueAndValidity();
  }

  get formControls() {
    return this.registerForm.controls;
  }

  loadForm() {
    this.registerForm = this.fb.group({
      id: ['', [Validators.required, Validators.minLength(3)]],
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(100),
        ],
      ],
      description: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(200),
        ],
      ],
      logo: ['', [Validators.required]],
      date_release: [
        '',
        [Validators.required, CustomValidators.dateReleaseValidator()],
      ],
      date_revision: [''],
    });
    this.formControls['date_revision'].disable();
  }

 private _onFormatDate(date: Date) {
    const setDate = new Date(date);
    setDate.setFullYear(setDate.getFullYear());
    const formattedDate = setDate.toISOString().split('T')[0];
    return formattedDate;
  }

  onFormatDateControl(controlOrigin: string, controlDestiny: string) {
    const dateRelease = this.registerForm.controls[controlOrigin].value;
    let date = new Date(dateRelease);
    date.setFullYear(date.getFullYear() + 1);

    this.registerForm.controls[controlDestiny].setValue(
      this._onFormatDate(date)
    );
  }

  onSubscripteDateRelease() {
    const s$ = this.registerForm.controls[
      'date_release'
    ].valueChanges.subscribe((date: string) => {
      if (date) {
        this.onFormatDateControl('date_release', 'date_revision');
      }
    });
    this.subscriptions$.push(s$);
  }

  /**
   * Maneja el evento de envío del formulario de registro.
   *
   * @memberof RegisterFormComponent
   */
  onSubmit() {
    if (this.isFormInvalid()) {
      this.showInvalidFormAlert();
      return;
    }
    this.closeNotification();
    if (this.isEditionPage) {
      debugger;
      this.onUpdateProduct();
    } else {
      debugger;
      this.validateProductId();
    }
  }

  /**
   * Verifica si el formulario de registro es inválido.
   *
   * @returns {boolean} Verdadero si el formulario es inválido, falso de lo contrario.
   */
  private isFormInvalid(): boolean {
    return this.registerForm.invalid;
  }

  /**
   * Muestra una alerta indicando que el formulario es inválido.
   */
  private showInvalidFormAlert(): void {
    alert('Formulario inválido');
  }

  /**
   * Cierra la notificación actual.
   */
  private closeNotification(): void {
    this.notificationService.emitClose();
  }

  private validateProductId(): void {
    const productId = this.registerForm.value.id;

    this.productService
      .validateProductId(productId)
      .pipe(
        mergeMap((isProductIdValid) => {
          if (isProductIdValid) {
            this.showProductIdExistsError();
            return [];
          } else {
            return this.createProduct();
          }
        })
      )
      .subscribe({
        next: (response) => {
          this._handleSuccessRequest('Producto creado exitosamente');
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  /**
   * Crea un nuevo producto y maneja las respuestas.
   */
  private createProduct() {
    const productData = {
      ...this.registerForm.value,
      date_revision: this.formControls['date_revision'].value,
      id: this.formControls['id'].value,
    };

    return this.productService.createProduct(productData);
  }

  onUpdateProduct() {
    const formData: ProductModel = {
      ...this.registerForm.value,
      id: this.formControls['id'].value,
      date_revision: this.formControls['date_revision'].value,
    };
    this.productService.updateProduct(formData).subscribe({
      next: (response) => {
        this._handleSuccessRequest('Producto modificado exitosamente');
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  /**
   * Muestra un mensaje de error indicando que el ID del producto ya existe.
   */
  private showProductIdExistsError(): void {
    this.notificationService.showError('El id ya existe');
  }

  /**
   * Maneja el éxito en la creación del producto.
   *
   * @param {*} response La respuesta de la creación del producto.
   */
  private _handleSuccessRequest(message: string): void {
    this.notificationService.showSuccess(message);

    this.resetForm();
  }

  /**
   * Reinicia el formulario de registro y establece el valor de 'date_revision' en vacío.
   */
  resetForm(): void {
    const initialValues = this.isEditionPage
      ? {
          name: null,
          description: null,
          date_release: null,
          date_revision: null,
          logo: null,
        }
      : {
          id: null,
          name: null,
          description: null,
          date_release: null,
          date_revision: null,
          logo: null,
        };

    this.registerForm.patchValue(initialValues);
    this.registerForm.markAsPristine();
    this.registerForm.markAsUntouched();
    this.registerForm.updateValueAndValidity();
    this.cd.detectChanges();
  }

  isInvalid(controlName: string): boolean {
    const control = this.registerForm.controls[controlName];
    const errors = control.errors;

    return !!errors && control.invalid && control.touched;
  }

  isRequiredError(controlName: string): boolean {
    const control = this.registerForm.controls[controlName];
    return control.invalid && control.errors?.['required'] && control.touched;
  }

  isMinLengthError(controlName: string): boolean {
    const control = this.registerForm.controls[controlName];
    return (
      control.invalid &&
      control.errors?.['minlength'] && // Use ['minlength'] to access the index signature
      control.touched &&
      !control.pristine
    );
  }

  isInvalidDate(controlName: string): boolean {
    const control = this.registerForm.controls[controlName];
    return (
      control.invalid && control.errors?.['invalidDate'] && control.touched
    );
  }

  isInvalidReleaseDate(controlName: string): boolean {
    return (
      this.registerForm.get(controlName)?.hasError('invalidReleaseDate') ||
      false
    );
  }
}
