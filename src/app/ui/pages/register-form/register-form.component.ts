import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
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

  subscriptons: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadForm();
    this.onSubscripteDateRelease();

  }

  ngOnDestroy(): void {
    if (this.subscriptons.length > 0) {
      this.subscriptons.forEach((subscription) => subscription.unsubscribe());
    }
    this.notificationService.emitClose();
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
  }

  onSubscripteDateRelease() {
    const s$ = this.registerForm.controls[
      'date_release'
    ].valueChanges.subscribe((date: string) => {
      if (date) {
        const dateRelease = this.registerForm.controls['date_release'].value;
        let dateRevision = new Date(dateRelease);
        dateRevision.setFullYear(dateRevision.getFullYear() + 1);

        this.registerForm.controls['date_revision'].setValue(
          dateRevision.toISOString().split('T')[0]
        );
      }
    });
    this.subscriptons.push(s$);
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
  this.validateProductId();
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

/**
 * Valida la existencia de un ID de producto y crea el producto si no existe.
 */
// private validateProductId(): void {
//   const productId = this.registerForm.value.id;

//   this.productService.validateProductId(productId).subscribe((isProductIdValid) => {
//     debugger
//     if (isProductIdValid) {
//       this.showProductIdExistsError();
//     } else {
//       this.createProduct();
//     }
//   });
// }

private validateProductId(): void {
  const productId = this.registerForm.value.id;

  this.productService.validateProductId(productId).pipe(
    mergeMap((isProductIdValid) => {
      if (isProductIdValid) {
        this.showProductIdExistsError();
        return [];
      } else {
        return this.productService.createProduct({ ...this.registerForm.value, date_revision: this.formControls['date_revision'].value });
      }
    })
  ).subscribe({
    next: (response) => {
      this.handleProductCreationSuccess(response);
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
 * Crea un nuevo producto y maneja las respuestas.
 */
private createProduct(): void {
  const productData = { ...this.registerForm.value, date_revision: this.formControls['date_revision'].value };

  this.subscriptons.push(
    this.productService.createProduct(productData).subscribe({
      next: (response) => {
        this.handleProductCreationSuccess(response);
      },
      error: (error) => {
        console.log(error);
      },
    })
  );
}

/**
 * Maneja el éxito en la creación del producto.
 *
 * @param {*} response La respuesta de la creación del producto.
 */
private handleProductCreationSuccess(response: any): void {
  console.log(response, 'response');
  this.notificationService.showSuccess('Producto creado correctamente');

  this.resetForm();
}

/**
 * Reinicia el formulario de registro y establece el valor de 'date_revision' en vacío.
 */
private resetForm(): void {
  this.registerForm.reset();

  this.formControls['date_revision'].setValue('');
}

  /**
   *
   *
   * @memberof RegisterFormComponent
   */
  onReset() {
    this.registerForm.reset();
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
    return control.invalid && control.errors?.['invalidDate'] && control.touched;
  }

  isInvalidReleaseDate(controlName: string): boolean {
    return (
      this.registerForm.get(controlName)?.hasError('invalidReleaseDate') ||
      false
    );
  }
}
