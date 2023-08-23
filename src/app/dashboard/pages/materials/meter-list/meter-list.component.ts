import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { MetersService } from 'src/app/dashboard/services/meters.service';
import { SearchService } from 'src/app/dashboard/services/search.service';
import { Router } from '@angular/router';
import { Meter } from 'src/app/dashboard/interfaces/metersInterface';

@Component({
  standalone: true,
  imports: [CommonModule],
  templateUrl: './meter-list.component.html',
  styleUrls: ['./meter-list.component.css']
})
export class MeterListComponent {


  public meters: any[] = [];
  public metersTemp: Meter[] = [];
  public total: number; 
  public loading: boolean = true;
  limit = 1; // Establecer el límite de unidades para marcar en amarillo
  constructor(private metersService: MetersService,
    private searchService: SearchService,
    private router: Router) { }

  ngOnInit(): void{

    this.getListMeters();

   };

   getListMeters(){

    this.loading = true;
    this.metersService.getMeters()
    .subscribe((data: any) =>{
      this.total = data.total;
      this.meters = data.meters;
      this.metersTemp = data.meters;
      this.loading = false;
    } );
   }

   //Buscar
 search (term: string ) {

  if ( term.length === 0 ) {
    this.meters = this.metersTemp;
    return ;
  }
   this.searchService.search('meters', term )
        .subscribe( resp => {
          this.meters = resp ;
        });
  }

   deleteMeter(meters:Meter) {


    Swal.fire({
      title: '¿Borrar medidor?',
      text: `Esta a punto de borrar a ${ meters.name }`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, borrarlo'
    }).then((result) => {
      if (result.value) {

        this.metersService.deleteMeter( meters )
          .subscribe( resp => {

            this.getListMeters();
            Swal.fire(
              'Medidor borrado',
              `${ meters.name } fue eliminado correctamente`,
              'success'
            );

          });

      }
    })


  }   

  updateMeter(meter: Meter){
    this.router.navigate(['dashboard/edit-meter/',meter.id]);
  }

  addMeter():void{
    this.router.navigate(['dashboard/add-meter']);
  }


}
