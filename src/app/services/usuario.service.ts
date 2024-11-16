import { inject, Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../interfaces/Usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/api/usuarios';

  constructor() { }

  getUsuario(id: number): Observable<Usuario> {
    // Ya no necesitas incluir el token aquí. El interceptor lo añadirá automáticamente.
    return this.http.get<Usuario>(`${this.baseUrl}/${id}`);
  }

  getUsuarioPorEstablecimientoId(idEstablecimiento: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.baseUrl}/establecimientoId/${idEstablecimiento}`);
  }
}
