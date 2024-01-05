import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';

interface MenuItem {
  texto: string;
  ruta: string
}

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet],
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent {

  templateMenu: MenuItem[] = [

    {
     texto: 'Entradas',
     ruta: 'list-entries'
    },    
     {
      texto: 'Salidas de almacén',
      ruta: 'list-exit-register'
     },    
    {
      texto: 'Asignación de materiales a vehiculos',
      ruta: 'list-assignment-materials-vehicles'
     },
     {
      texto: 'Asignación de herramientas',
      ruta: 'list-tools-assignment'
     },   
     {
      texto: 'Traslado de materiales',
      ruta: 'list-trasfers'
     },       
     {
      texto: 'Materiales de almacén',
      ruta: 'list-materials'
     },
     {
      texto: 'Medidores almacén',
      ruta: 'list-meters'
     },
     {
      texto: 'Herramientas',
      ruta: 'list-tools'
     },
     {
      texto: 'Contratos',
      ruta: 'list-work-register'
     },     
      {
      texto: 'Móviles',
      ruta: 'list-collaborators'
     }, 
     {
      texto: 'Porveedores',
      ruta: 'list-providers'
     },
     {
      texto: 'Vehículos',
      ruta: 'list-vehicles'
     },
     {
      texto: 'Cargas ecxel',
      ruta: 'load-file'
     },
     {
      texto: 'Bodegas',
      ruta: 'list-warehuses'
     },
     {
      texto: 'Usuarios',
      ruta: 'list-users'
     },

   ]

}
