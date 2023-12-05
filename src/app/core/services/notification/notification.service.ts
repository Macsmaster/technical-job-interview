import { Injectable, ComponentRef, ApplicationRef, Injector, ComponentFactoryResolver } from '@angular/core';
import { AlertComponent } from '../../../shared/components/alert/alert/alert.component';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private alertSubject = new Subject<void>();
  activeAlert$ = this.alertSubject.asObservable();

  private activeComponentRef: ComponentRef<AlertComponent> | null = null;

  constructor(
    private appRef: ApplicationRef,
    private injector: Injector,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {}

  showSuccess(message: string, duration: number = 8000): void {
    this.showAlert('success', 'Éxito', message, duration);
  }

  showError(message: string, duration: number = 8000): void {
    this.showAlert('error', 'Error', message, duration);
  }

  private showAlert(type: 'success' | 'error', title: string, text: string, duration: number): void {
    // Check if there's an active alert, and destroy it
    if (this.activeComponentRef) {
      this.destroyActiveAlert();
    }

    // Resolve the component factory
    const factory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);

    // Create a component instance
    this.activeComponentRef = factory.create(this.injector);

    // Set the input properties
    this.activeComponentRef.instance.title = title;
    this.activeComponentRef.instance.text = text;
    this.activeComponentRef.instance.type = type;

    // Attach the component to the Angular application
    this.appRef.attachView(this.activeComponentRef.hostView);

    // Get the root element of the component
    const domElement = (this.activeComponentRef.hostView as any).rootNodes[0] as HTMLElement;

    // Append the component to the body
    document.body.appendChild(domElement);


    setTimeout(() => {
      this.destroyActiveAlert();
    }, duration);
  }

  emitClose(): void {
    this.alertSubject.next();
    this.destroyActiveAlert();
  }

  private destroyActiveAlert(): void {
    if (this.activeComponentRef) {
      document.body.removeChild((this.activeComponentRef.hostView as any).rootNodes[0] as HTMLElement);
      this.appRef.detachView(this.activeComponentRef.hostView);
      this.activeComponentRef.destroy();
      this.activeComponentRef = null;
    }
  }
}
