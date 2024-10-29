import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccesoService } from '../../services/acceso.service';
import { Router } from '@angular/router';

import {MatCardModule} from '@angular/material/card'
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { Usuario } from '../../interfaces/Usuario';
import {MatSelectModule} from '@angular/material/select';


@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [MatCardModule,MatFormFieldModule,MatInputModule,MatButtonModule,ReactiveFormsModule, MatSelectModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {

  roles= [
    {value: 'CLIENTE', viewValue: 'CLIENTE'},
    {value: 'ESTABLECIMIENTO', viewValue: 'ESTABLECIMIENTO'},
    {value: 'GRUPO', viewValue: 'GRUPO'},
  ];
  
  private accesoService = inject(AccesoService)
  private router = inject(Router)
  public formBuild = inject(FormBuilder)

  public formRegistro: FormGroup = this.formBuild.group({
    nombreUsuario:['', Validators.required],
    password:['',Validators.required],
    rol:['',Validators.required],
    email:['', Validators.required]
  })

  registrarse(){
    if(this.formRegistro.invalid)return;

    const objeto:Usuario={
      nombreUsuario:this.formRegistro.value.nombreUsuario,
      password:this.formRegistro.value.password,
      rol:this.formRegistro.value.rol,
      email:this.formRegistro.value.email
    }

    this.accesoService.registrarse(objeto).subscribe({
      next: (data) => {
        console.log(data); // Verificar respuesta
        this.router.navigate(['']);
      },
      error: (error) => {
        console.log("Error:", error);
        alert("No se pudo registrar");
      }
    });
    
  }

  volver(){
    this.router.navigate([''])
  }
}
