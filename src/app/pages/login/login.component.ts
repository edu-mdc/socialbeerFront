import { Component, inject } from '@angular/core';
import { AccesoService } from '../../services/acceso.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Login } from '../../interfaces/Login';

import {MatCardModule} from '@angular/material/card'
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatCardModule,MatFormFieldModule,MatInputModule,MatButtonModule,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  
  private accesoService = inject(AccesoService);
  private router = inject(Router);
  public formBuild = inject(FormBuilder);



  public formLogin: FormGroup = this.formBuild.group({
    nombreUsuario: ['', Validators.required],
    password: ['', Validators.required]
  });

  iniciarSesion() {
    if (this.formLogin.invalid) return;

    const objeto: Login = {
      nombreUsuario: this.formLogin.value.nombreUsuario,
      password: this.formLogin.value.password
    };

    this.accesoService.login(objeto).subscribe({
      next: (data) => {
        if (data && data.tokenDeAcceso && data.rol && data.userId && data.nombreUsuario) {
          // Guarda el token con el prefijo 'Bearer'
          localStorage.setItem("token", `${data.tipoDeToken} ${data.tokenDeAcceso}`);
          localStorage.setItem("rol", data.rol);
          localStorage.setItem("userId", data.userId.toString());
          localStorage.setItem("nombreUsuario", data.nombreUsuario);
        
          // Redirigir según el rol
          if (data.rol === 'ROLE_CLIENTE') {
            this.router.navigate(['cliente']);
          } else if (data.rol === 'ROLE_ESTABLECIMIENTO') {
            this.router.navigate(['establecimiento']);
          } else if (data.rol === 'ROLE_GRUPO') {
            this.router.navigate(['grupo']);
          } else {
            this.router.navigate(['inicio']);
          }
        } else {
          alert("Credenciales incorrectas");
        }
      },
      error: (error) => {
        console.log("Error al iniciar sesión: ", error);
        alert("Ocurrió un error, por favor revisa las credenciales.");
      }
    });
    
  }

  registrarse() {
    this.router.navigate(['registro']);
  }
  }

 

