import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { appsettings } from '../settings/appsettings';
import { Cliente } from '../interfaces/Cliente';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private http = inject(HttpClient);
  private baseUrl: string = 'http://localhost:8080/api';

  constructor() { }

  getClienteByUserId(userId: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.baseUrl}/usuarios/clientes/usuario/${userId}`);
  }
  

  updateCliente(userId: number, clienteData: Cliente): Observable<Cliente> {
    // El interceptor agregará el token en los encabezados automáticamente.
    return this.http.put<Cliente>(`${this.baseUrl}/usuarios/clientes/${userId}`, clienteData);
  }

  eliminarCliente(clienteId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/usuarios/clientes/${clienteId}`, { responseType: 'text' });
  }
}
