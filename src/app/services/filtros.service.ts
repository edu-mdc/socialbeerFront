import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FiltrosService {
  private filtrosSubject = new BehaviorSubject<any>({});
  filtros$ = this.filtrosSubject.asObservable();
  constructor() { }

  setFiltros(filtros: any) {
    this.filtrosSubject.next(filtros);
  }
}
