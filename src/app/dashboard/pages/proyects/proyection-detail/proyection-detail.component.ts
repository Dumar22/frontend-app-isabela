import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProyectionsService } from 'src/app/dashboard/services/proyections.service';
import { ProyectsService } from 'src/app/dashboard/services/proyects.service';

@Component({
  selector: 'app-proyection-detail',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './proyection-detail.component.html',
  styleUrls: ['./proyection-detail.component.css'],
 
})
export class ProyectionDetailComponent {
  proyect: any;
  details: any[] = [];
  warehouse: any;
  mode: string;

constructor(
  private route: ActivatedRoute,
  private router: Router,
  private proyectService: ProyectsService,
  private proyectionService: ProyectionsService

){}

  ngOnInit(): void {
    const id:string = this.route.snapshot.paramMap.get('id');
    this.proyectService.getProyectById(id)
    .subscribe((data: any) =>{     
      
      
      this.proyect = data;

     
    } );
      
    }

    
  }

 

