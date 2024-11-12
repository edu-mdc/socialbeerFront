import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ValoracionDeGrupoDTO } from '../interfaces/ValoracionGrupo';

@Injectable({
  providedIn: 'root'
})
export class ValoracionDeGrupoService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/api/usuarios/valoracionGrupos';

  constructor() { }

   // Obtener todas las valoraciones de un grupo
   listarValoracionesDeGrupoPorGrupoId(grupoId: number): Observable<ValoracionDeGrupoDTO[]> {
    return this.http.get<ValoracionDeGrupoDTO[]>(`${this.baseUrl}/${grupoId}`);
  }

  // Obtener una valoración específica de un grupo
  obtenerValoracionDeGrupoPorId(grupoId: number, valoracionDeGrupoId: number): Observable<ValoracionDeGrupoDTO> {
    return this.http.get<ValoracionDeGrupoDTO>(`${this.baseUrl}/${grupoId}/${valoracionDeGrupoId}`);
  }

  // Guardar una nueva valoración
  guardarValoracionDeGrupo(grupoId: number, clienteId: number, valoracionDeGrupoDTO: ValoracionDeGrupoDTO): Observable<ValoracionDeGrupoDTO> {
    return this.http.post<ValoracionDeGrupoDTO>(`${this.baseUrl}/${grupoId}/${clienteId}`, valoracionDeGrupoDTO);
  }

  // Actualizar una valoración existente
  actualizarValoracionDeGrupo(grupoId: number, valoracionDeGrupoId: number, valoracionDeGrupoDTO: ValoracionDeGrupoDTO): Observable<ValoracionDeGrupoDTO> {
    return this.http.put<ValoracionDeGrupoDTO>(`${this.baseUrl}/${grupoId}/${valoracionDeGrupoId}`, valoracionDeGrupoDTO);
  }

  // Eliminar una valoración
  eliminarValoracionDeGrupo(grupoId: number, valoracionDeGrupoId: number): Observable<string> {
    return this.http.delete<string>(`${this.baseUrl}/${grupoId}/${valoracionDeGrupoId}`);
  }
}
