import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {

  visibility$=new BehaviorSubject<boolean>(false);
 spinnerVisibility$=this.visibility$.asObservable()
  constructor() {

  }

  show():void {
    this.visibility$.next(true);
  }

  hide():void {
    this.visibility$.next(false);
  }


}
