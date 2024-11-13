import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ValoracionDeEstablecimientoDTO } from '../interfaces/ValoracionEstablecimiento';

@Injectable({
  providedIn: 'root'
})
export class ValoracionDeEstablecimientoService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/api/usuarios/valoracionEstablecimientos';

  constructor() { }

   // Obtener todas las valoraciones de un establecimiento
   listarValoracionesDeEstablecimientoPorEstablecimientoId(establecimientoId: number): Observable<ValoracionDeEstablecimientoDTO[]> {
    return this.http.get<ValoracionDeEstablecimientoDTO[]>(`${this.baseUrl}/${establecimientoId}`);
  }

  // Obtener una valoración específica de un establecimiento
  obtenerValoracionDeEstablecimientoPorId(establecimientoId: number, valoracionDeEstablecimientoId: number): Observable<ValoracionDeEstablecimientoDTO> {
    return this.http.get<ValoracionDeEstablecimientoDTO>(`${this.baseUrl}/${establecimientoId}/${valoracionDeEstablecimientoId}`);
  }

  // Guardar una nueva valoración
  guardarValoracionDeEstablecimiento(establecimientoId: number, clienteId: number, valoracionDeEstablecimientoDTO: ValoracionDeEstablecimientoDTO): Observable<ValoracionDeEstablecimientoDTO> {
    return this.http.post<ValoracionDeEstablecimientoDTO>(`${this.baseUrl}/${establecimientoId}/${clienteId}`, valoracionDeEstablecimientoDTO);
  }

  // Actualizar una valoración existente
  actualizarValoracionDeEstablecimiento(establecimientoId: number, valoracionDeEstablecimientoId: number, valoracionDeEstablecimientoDTO: ValoracionDeEstablecimientoDTO): Observable<ValoracionDeEstablecimientoDTO> {
    return this.http.put<ValoracionDeEstablecimientoDTO>(`${this.baseUrl}/${establecimientoId}/${valoracionDeEstablecimientoId}`, valoracionDeEstablecimientoDTO);
  }

  // Eliminar una valoración
  eliminarValoracionDeEstablecimiento(establecimientoId: number, valoracionDeEstablecimientoId: number): Observable<string> {
    return this.http.delete<string>(`${this.baseUrl}/${establecimientoId}/${valoracionDeEstablecimientoId}`);
  }
}
