import { Component } from '@angular/core';
import { ClienteComponent } from "../../pages/cliente/cliente.component";
import { FiltrosComponent } from "../../pages/filtros/filtros.component";
import { MostrarComponent } from "../../pages/mostrar/mostrar.component";

@Component({
  selector: 'app-vista-cliente',
  standalone: true,
  imports: [ClienteComponent, FiltrosComponent, MostrarComponent],
  templateUrl: './vista-cliente.component.html',
  styleUrl: './vista-cliente.component.css'
})
export class VistaClienteComponent {

}
