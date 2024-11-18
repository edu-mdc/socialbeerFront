import { Component, inject } from '@angular/core';
import { AccesoService } from '../../services/acceso.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Login } from '../../interfaces/Login';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatCardModule} from '@angular/material/card'
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { MenuComponent } from "../menu/menu.component";
import { FooterComponent } from "../footer/footer.component";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule, MatProgressSpinnerModule, MenuComponent, FooterComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  spinner: boolean=false;

  private accesoService = inject(AccesoService);
  private router = inject(Router);
  public formBuild = inject(FormBuilder);



  public formLogin: FormGroup = this.formBuild.group({
    nombreUsuario: ['', Validators.required],
    password: ['', Validators.required]
  });

  iniciarSesion() {
    if (this.formLogin.invalid) return;
    this.spinner=true;


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
            setTimeout(() => {
              this.spinner = false;
              this.router.navigate(['cliente']);
          }, 700);
           
          } else if (data.rol === 'ROLE_ESTABLECIMIENTO') {
            setTimeout(() => {
              this.spinner = false;
              this.router.navigate(['establecimiento']);
          }, 700);
           
          } else if (data.rol === 'ROLE_GRUPO') {
            setTimeout(() => {
              this.spinner = false;
              this.router.navigate(['grupo']);
          }, 700);
            
          } else {
            setTimeout(() => {
              this.spinner = false;
              this.router.navigate(['inicio']);
          }, 700);
           
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

    this.spinner = true;

    setTimeout(() => {
      this.spinner = false;
  
    this.router.navigate(['registro']);
  }, 1000);
  }
  }

 

