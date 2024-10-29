import { Component, OnInit, inject  } from '@angular/core';
import { ClienteComponent } from "../cliente/cliente.component";
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { Evento } from '../../interfaces/Evento';
import { Grupo } from '../../interfaces/Grupo';
import { EventoService } from '../../services/evento.service';
import { GrupoService } from '../../services/grupo.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-ficha-grupo',
  standalone: true,
  imports: [ClienteComponent, MatButtonModule, MatCardModule],
  templateUrl: './ficha-grupo.component.html',
  styleUrl: './ficha-grupo.component.css'
})
export class FichaGrupoComponent implements OnInit{

  eventos: Evento[] = [];
  grupo: Grupo | null = null;
  grupoId: number = 0; // Guardaremos el id del grupo

  private eventoService = inject(EventoService); // Inyectamos el servicio de eventos
  private grupoService = inject(GrupoService);
  private route = inject(ActivatedRoute); // Inyectamos ActivatedRoute para obtener el grupoId

  ngOnInit(): void {
    // Obtener el grupoId de la URL
    this.grupoId = +this.route.snapshot.paramMap.get('id')!; // Extraemos el id de la URL

    // Llamamos al servicio para obtener los eventos del grupo
    this.eventoService.getEventosPorGrupo(this.grupoId).subscribe({
      next: (eventos: Evento[]) => {
        this.eventos = eventos;
      },
      error: (error) => {
        console.error('Error al obtener los eventos del grupo:', error);
      }
    });

    this.grupoService.getGrupoById(this.grupoId).subscribe({
      next: (grupo: Grupo) => {
        this.grupo = grupo;
      },
      error: (error) => {
        console.error('Error al obtener los detalles del grupo:', error);
      }
    });
  }
}
