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
      texto: 'Salidas',
      ruta: 'list-exit-materials'
     },
    {
      texto: 'Salidas con matrícula',
      ruta: 'list-exit-register'
     },
     {
      texto: 'Traslados',
      ruta: 'list-trasfers'
     },       
     {
      texto: 'Materiales almacén',
      ruta: 'list-materials'
     },
     {
      texto: 'Medidores almacén',
      ruta: 'list-meters'
     },
     {
      texto: 'Matriculas',
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
      texto: 'Cargas ecxel',
      ruta: 'load-file'
     },
    //  {
    //   texto: 'Bodegas',
    //   ruta: 'list-warehuses'
    //  },
    //  {
    //   texto: 'Usuarios',
    //   ruta: 'list-users'
    //  },

   ]

}
