import {Component, OnInit } from '@angular/core';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { CommonModule } from '@angular/common'; 
import { provinciasEspana } from '../../settings/provincias';
@Component({
  selector: 'app-filtros',
  standalone: true,
  imports: [CommonModule,MatIconModule,MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatToolbarModule],
  templateUrl: './filtros.component.html',
  styleUrl: './filtros.component.css'
})
export class FiltrosComponent implements OnInit{
provincias: string []=[];
filtros:string []= [];

  ngOnInit(): void {
this.provincias = provinciasEspana;
  }


  enviarFiltros(){

  }
  
  limpiarFiltros(){
    
  }
}
