import { Component, OnInit } from '@angular/core';
import { FiltrosComponent } from "../../pages/filtros/filtros.component";
import { MostrarComponent } from "../../pages/mostrar/mostrar.component";
import { GrupoComponent } from '../../pages/grupo/grupo.component';
import { GrupoService } from '../../services/grupo.service';
import { Grupo } from '../../interfaces/Grupo';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vista-grupo',
  standalone: true,
  imports: [FiltrosComponent,MostrarComponent, GrupoComponent, MatProgressSpinnerModule],
  templateUrl: './vista-grupo.component.html',
  styleUrl: './vista-grupo.component.css'
})
export class VistaGrupoComponent implements OnInit{
  userId:string | null = null;
  grupo: Grupo | null = null;
  spinner: boolean = false;

  constructor(private grupoService: GrupoService, private router: Router){}

ngOnInit(): void {
  this.userId = localStorage.getItem('userId');
  if (this.userId) {
    this.obtenerGrupo(Number(this.userId));
  }
}

obtenerGrupo(userId: number): void {
  this.grupoService.getGrupoByUserId(userId).subscribe({
    next: (response) => {
      console.log('Grupos:', response);
      this.grupo = response;
    },
    error: (error) => console.error('Error al obtener los grupos', error)
  });
}

  verFicha():void{
    // Evitar que el evento de click siga hacia otros elementos
    this.spinner = true;
    setTimeout(() => {
      this.router.navigate(['/fichaGrupo', this.grupo?.id]).then(() => {
        this.spinner = false;
      });
    }, 1000); 


  }
}
