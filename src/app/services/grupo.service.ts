import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Grupo } from '../interfaces/Grupo';

@Injectable({
  providedIn: 'root'
})
export class GrupoService {

  private http = inject(HttpClient);
  private baseUrl: string = 'http://localhost:8080/api';
  constructor() { }

  // Obtener todos los grupos con paginación
  getGrupos(pageNo: number = 0, pageSize: number = 6, sortBy: string = 'id', sortDir: string = 'asc'): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/usuarios/grupos?pageNo=${pageNo}&pageSize=${pageSize}&sortBy=${sortBy}&sortDir=${sortDir}`);
  }

  // Obtener un grupo por su ID
  getGrupoById(grupoId: number): Observable<Grupo> {
    return this.http.get<Grupo>(`${this.baseUrl}/usuarios/grupos/${grupoId}`);
  }

  // Crear un nuevo grupo asociado a un usuario
  createGrupo(usuarioId: number, grupoData: Grupo): Observable<Grupo> {
    return this.http.post<Grupo>(`${this.baseUrl}/usuarios/grupos/${usuarioId}`, grupoData);
  }

  // Actualizar un grupo existente por su ID
  updateGrupo(grupoId: number, grupoData: Grupo): Observable<Grupo> {
    return this.http.put<Grupo>(`${this.baseUrl}/usuarios/grupos/${grupoId}`, grupoData);
  }

  // Eliminar un grupo por su ID
  eliminarGrupo(grupoId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/usuarios/grupos/${grupoId}`, { responseType: 'text' });
  }
}
