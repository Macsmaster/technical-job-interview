import { Component, OnDestroy, OnInit } from '@angular/core';
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
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [CardComponent, CommonModule, ReactiveFormsModule, ButtonComponent, CardComponent],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.scss',
})
export class RegisterFormComponent implements OnInit, OnDestroy {
  registerForm!: UntypedFormGroup;

  subscriptons: Subscription[] = [];

  constructor(private fb: FormBuilder, private productService: ProductService) {}
  ngOnInit(): void {
    this.loadForm();
    this.onSubscripteDateRelease();
  }

  ngOnDestroy(): void {
      if(this.subscriptons.length > 0) {
        this.subscriptons.forEach(subscription => subscription.unsubscribe());
      }
  }

  get formControls() {
    return this.registerForm.controls;
  }

  loadForm() {
    this.registerForm = this.fb.group({
      id: ['', [Validators.required, Validators.minLength(3)]],
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]],
      logo: ['', [Validators.required]],
      date_release: ['', [Validators.required]],
      date_revision: ['', [Validators.required]],
    });
  }

  onSubscripteDateRelease() {
   const s$ = this.registerForm.controls['date_release'].valueChanges.subscribe((date:string) => {
      if(date) {
        const dateRelease = this.registerForm.controls['date_release'].value;
        let dateRevision = new Date(dateRelease);
        dateRevision.setFullYear(dateRevision.getFullYear() + 1);

        this.registerForm.controls['date_revision'].setValue(dateRevision.toISOString().split('T')[0]);
      }
    });
    this.subscriptons.push(s$);
  }

  /**
   *
   *
   * @memberof RegisterFormComponent
   */
  onSubmit() {
    if(this.registerForm.invalid) {
      alert('Formulario inválido');
    }
    this.subscriptons.push( this.productService.createProduct(this.registerForm.value).subscribe(console.log));
    this.registerForm.reset();
  }

  /**
   *
   *
   * @memberof RegisterFormComponent
   */
  onReset() {
    this.registerForm.reset();
  }
}
