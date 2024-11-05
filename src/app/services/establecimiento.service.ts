import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Establecimiento } from '../interfaces/Establecimiento';

@Injectable({
  providedIn: 'root'
})
export class EstablecimientoService {

  private http = inject(HttpClient);
  private baseUrl: string = 'http://localhost:8080/api';

  constructor() { }

  // Obtener todos los establecimientos con paginación
  getEstablecimientos(pageNo: number = 0, pageSize: number = 6, sortBy: string = 'id', sortDir: string = 'asc'): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/usuarios/establecimientos?pageNo=${pageNo}&pageSize=${pageSize}&sortBy=${sortBy}&sortDir=${sortDir}`);
  }

  

  getEstablecimientoByUserId(userId: number): Observable<Establecimiento> {
    return this.http.get<Establecimiento>(`${this.baseUrl}/usuarios/establecimientos/usuario/${userId}`);
  }

  // Obtener un establecimiento por su ID
  getEstablecimientoById(establecimientoId: number): Observable<Establecimiento> {
    return this.http.get<Establecimiento>(`${this.baseUrl}/usuarios/establecimientos/${establecimientoId}`);
  }

  // Crear un nuevo establecimiento asociado a un usuario
  createEstablecimiento(usuarioId: number, establecimientoData: Establecimiento): Observable<Establecimiento> {
    return this.http.post<Establecimiento>(`${this.baseUrl}/usuarios/establecimientos/${usuarioId}`, establecimientoData);
  }

  // Actualizar un establecimiento existente por su ID
  updateEstablecimiento(userId: number, establecimientoData: Establecimiento): Observable<Establecimiento> {
    return this.http.put<Establecimiento>(`${this.baseUrl}/usuarios/establecimientos/${userId}`, establecimientoData);
  }

  // Eliminar un establecimiento por su ID
  eliminarEstablecimiento(establecimientoId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/usuarios/establecimientos/${establecimientoId}`, { responseType: 'text' });
  }
}
