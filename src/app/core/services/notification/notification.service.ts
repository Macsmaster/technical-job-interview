import { Injectable, ComponentRef, ApplicationRef, Injector, ComponentFactoryResolver } from '@angular/core';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { Subject } from 'rxjs';
import { DEFAULT_ALERT_DURATION } from '../../../ui/pages/constants/magic-numbers.const';

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

  /**
   *
   *
   * @param {string} message
   * @param {number} [duration=8000]
   * @memberof NotificationService
   */
  showSuccess(message: string, duration: number = DEFAULT_ALERT_DURATION): void {
    this.showAlert('success', 'Éxito', message, duration);
  }

  /**
   *
   *
   * @param {string} message
   * @param {number} [duration=8000]
   * @memberof NotificationService
   */
  showError(message: string, duration: number = DEFAULT_ALERT_DURATION): void {
    this.showAlert('error', 'Error', message, duration);
  }

  /**
   *
   *
   * @private
   * @param {('success' | 'error')} type
   * @param {string} title
   * @param {string} text
   * @param {number} duration
   * @memberof NotificationService
   */
  private showAlert(type: 'success' | 'error', title: string, text: string, duration: number): void {
    if (this.activeComponentRef) {
      this.destroyActiveAlert();
    }

    const factory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);

    this.activeComponentRef = factory.create(this.injector);

    this.activeComponentRef.instance.title = title;
    this.activeComponentRef.instance.text = text;
    this.activeComponentRef.instance.type = type;

    this.appRef.attachView(this.activeComponentRef.hostView);

    const domElement = (this.activeComponentRef.hostView as any).rootNodes[0] as HTMLElement;

    document.body.appendChild(domElement);


    setTimeout(() => {
      this.destroyActiveAlert();
    }, duration);
  }

  /**
   *
   *
   * @memberof NotificationService
   */
  emitClose(): void {
    this.alertSubject.next();
    this.destroyActiveAlert();
  }

  /**
   *
   *
   * @private
   * @memberof NotificationService
   */
  private destroyActiveAlert(): void {
    if (this.activeComponentRef) {
      document.body.removeChild((this.activeComponentRef.hostView as any).rootNodes[0] as HTMLElement);
      this.appRef.detachView(this.activeComponentRef.hostView);
      this.activeComponentRef.destroy();
      this.activeComponentRef = null;
    }
  }
}
