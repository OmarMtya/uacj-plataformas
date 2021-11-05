import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Desarrollo, Rubro } from '../interfaces/rubro.interface';

@Injectable({
  providedIn: 'root'
})
export class DesarrolloInstitucionalService {

  constructor() { }

  getRequest(rubro: Rubro<Desarrollo>, ) {
    return `${environment.server}`;
  }
}
