import { Component, OnInit } from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {AsyncPipe} from '@angular/common';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { CommonModule } from '@angular/common'; 
import { provinciasEspana } from '../../settings/provincias';
import { GrupoService } from '../../services/grupo.service';
import { EstablecimientoService } from '../../services/establecimiento.service';
import { Establecimiento } from '../../interfaces/Establecimiento';

@Component({
  selector: 'app-filtros',
  standalone: true,
  imports: [CommonModule,MatIconModule,MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatToolbarModule,FormsModule,MatAutocompleteModule,ReactiveFormsModule,AsyncPipe ],
  templateUrl: './filtros.component.html',
  styleUrl: './filtros.component.css'
})
export class FiltrosComponent implements OnInit{
 
  provinciasEspana: string[] = [];

  myControl = new FormControl('');
  establecimientos:Establecimiento [] = [];
  filteredOptions: Observable<string[]> | undefined;

  

constructor(private grupoServicio: GrupoService, private establecimientoService: EstablecimientoService	){}
  

ngOnInit(): void {
    
    this.provinciasEspana = provinciasEspana;
    // this.obtenerTodosLosEstablecimientos();
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || ''))
    );
  
  }

  obtenerTodosLosGrupos():void{
    this.grupoServicio.getGrupos()
  }

  // obtenerTodosLosEstablecimientos(): void {
  //   this.establecimientoService.getTodosLosEstablecimientos().subscribe({
  //     next: (response) => {
  //       this.establecimientos = response;

  //       // Verifica que `this.establecimientos` es un array antes de usar `forEach`
       
  //         this.establecimientos.forEach((establecimiento, index) => {
  //           console.log("Establecimientos biscados  " + (index + 1) + ": " + establecimiento.establecimiento);
  //         });
       
  //     },
  //     error: (error) => {
  //       console.error('Error al obtener los establecimientos:', error);
  //     }
  //   });
  // }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.establecimientos
      .map(est => est.establecimiento) // Obtener los nombres de los establecimientos
      .filter(name => name.toLowerCase().includes(filterValue)); // Filtrar por el nombre
  }


}
