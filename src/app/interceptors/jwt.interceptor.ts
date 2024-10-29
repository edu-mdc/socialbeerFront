import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let token = localStorage.getItem('token'); // Obtén el token del localStorage

    if (token && !token.startsWith('Bearer ')) {
      token = `Bearer ${token}`;  // Asegúrate de que el token tenga el prefijo 'Bearer'
    }

    if (token) {
      // Clona la solicitud y añade el token en el encabezado 'Authorization'
      const cloned = req.clone({
        headers: req.headers.set('Authorization', token)
      });

      return next.handle(cloned);
    }

    return next.handle(req); // Si no hay token, sigue con la solicitud original
  }
}
