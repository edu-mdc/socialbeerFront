import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { appsettings } from '../settings/appsettings';
import { Observable } from 'rxjs';
import { ResponseAcceso } from '../interfaces/ResponseAcceso';
import { Usuario } from '../interfaces/Usuario';
import { Login } from '../interfaces/Login';
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AccesoService {

  private http = inject(HttpClient);
  private baseUrl:string = 'http://localhost:8080/api/auth';

  constructor() { }

  registrarse(objeto: Usuario): Observable<ResponseAcceso> {
    return this.http.post<ResponseAcceso>(`${this.baseUrl}/registrar`, objeto);
  }

  login(objeto: Login): Observable<ResponseAcceso> {
    return this.http.post<ResponseAcceso>(`${this.baseUrl}/iniciarSesion`, objeto);
  }

  logout() {
    // Eliminar token y otros datos de usuario del localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('nombreUsuario');
    localStorage.removeItem('rol');
    localStorage.removeItem('userId');

    // Redireccionar a la página de inicio de sesión u otra página
    
  }
}
