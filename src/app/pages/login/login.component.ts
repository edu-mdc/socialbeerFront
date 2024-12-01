import { Component, inject , OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatCardModule,CommonModule, MatFormFieldModule,FormsModule, MatInputModule, MatButtonModule, ReactiveFormsModule, MatProgressSpinnerModule, MenuComponent, FooterComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{

  spinner: boolean=false;

  private accesoService = inject(AccesoService);
  private router = inject(Router);
  public formBuild = inject(FormBuilder);

  currentSlide = 0;
  slides = [
    { image: '../../../assets/imagenes/bar-1.jpg', title: 'Título 1' },
    { image: '../../../assets/imagenes/bar-2.jpg', title: 'Título 2' },
    { image: '../../../assets/imagenes/bar-3.jpg', title: 'Título 3' },
    { image: '../../../assets/imagenes/bar-4.jpg', title: 'Título 4' },
    { image: '../../../assets/imagenes/bar-5.jpg', title: 'Título 5' },
    { image: '../../../assets/imagenes/bar-6.jpg', title: 'Título 6' },
  ];

  slides2 = [
    { image: '../../../assets/imagenes/grupo1.jpg', title: 'Título 1' },
    { image: '../../../assets/imagenes/grupo2.jpg', title: 'Título 2' },
    { image: '../../../assets/imagenes/grupo3.jpg', title: 'Título 3' },
    { image: '../../../assets/imagenes/grupo4.jpg', title: 'Título 4' },
    { image: '../../../assets/imagenes/grupo5.jpg', title: 'Título 5' },
    { image: '../../../assets/imagenes/grupo6.jpg', title: 'Título 6' },
  ];
  
  private slideInterval: any;

  ngOnInit() {
    // Inicia el cambio automático de diapositivas cada 3 segundos (3000 ms)
    this.slideInterval = setInterval(() => {
      this.nextSlide();
    }, 3000);
  }

  ngOnDestroy() {
    // Limpia el intervalo cuando el componente se destruye
    clearInterval(this.slideInterval);
  }

  prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }

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
          setTimeout(() => {
            this.spinner = false;
            this.router.navigate(['inicio']);
        }, 700);
        }
      },
      error: (error) => {
        console.log("Error al iniciar sesión: ", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Credenciales incorrectas",
        });
        setTimeout(() => {
          this.spinner = false;
          this.router.navigate(['']);
      }, 700);
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

 

