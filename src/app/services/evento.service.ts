import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Evento } from '../interfaces/Evento';

@Injectable({
  providedIn: 'root'
})
export class EventoService {

  private http = inject(HttpClient);
  private baseUrl: string = 'http://localhost:8080/api';  // Cambia esto según tu configuración

  constructor() { }

  // Obtener todos los eventos con paginación
  getEventos(pageNo: number = 0, pageSize: number = 6, sortBy: string = 'id', sortDir: string = 'asc'): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/usuarios/eventos?pageNo=${pageNo}&pageSize=${pageSize}&sortBy=${sortBy}&sortDir=${sortDir}`);
  }

  getTodosLosEventos(): Observable<Evento[]> {
    return this.http.get<Evento[]>(`${this.baseUrl}/usuarios/eventos/todos`);
  }

  // Obtener eventos por grupo (opcional si lo necesitas)
  getEventosPorGrupo(grupoId: number): Observable<Evento[]> {
    return this.http.get<Evento[]>(`${this.baseUrl}/usuarios/eventos/grupo/${grupoId}`);
  }

  // Obtener eventos por establecimiento (opcional si lo necesitas)
  getEventosPorEstablecimiento(establecimientoId: number): Observable<Evento[]> {
    return this.http.get<Evento[]>(`${this.baseUrl}/usuarios/eventos/establecimiento/${establecimientoId}`);
  }

  // Obtener un evento por su ID
  getEventoById(eventoId: number): Observable<Evento> {
    return this.http.get<Evento>(`${this.baseUrl}/usuarios/eventos/evento/${eventoId}`);
  }

  // Crear un nuevo evento asociado a un grupo y un establecimiento
  createEvento(establecimientoId: number, grupoId: number, eventoData: Evento): Observable<Evento> {
    return this.http.post<Evento>(`${this.baseUrl}/usuarios/eventos/${establecimientoId}/${grupoId}`, eventoData);
  }

  // Actualizar un evento existente por su ID
  updateEvento(eventoId: number, eventoData: Evento): Observable<Evento> {
    return this.http.put<Evento>(`${this.baseUrl}/usuarios/eventos/evento/${eventoId}`, eventoData);
  }

  // Eliminar un evento por su ID
  eliminarEvento(eventoId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/usuarios/eventos/evento/${eventoId}`, { responseType: 'text' });
  }

  verificarDisponibilidad(grupoId: number, establecimientoId: number, fechaEvento: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/usuarios/eventos/verificar?grupoId=${grupoId}&establecimientoId=${establecimientoId}&fechaEvento=${fechaEvento}`);
  }
}
