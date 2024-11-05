import { Component } from '@angular/core';
import { FiltrosComponent } from "../../pages/filtros/filtros.component";
import { MostrarComponent } from "../../pages/mostrar/mostrar.component";
import { GrupoComponent } from '../../pages/grupo/grupo.component';

@Component({
  selector: 'app-vista-grupo',
  standalone: true,
  imports: [FiltrosComponent,MostrarComponent, GrupoComponent],
  templateUrl: './vista-grupo.component.html',
  styleUrl: './vista-grupo.component.css'
})
export class VistaGrupoComponent {

}
