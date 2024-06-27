import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProyectionsService } from 'src/app/dashboard/services/proyections.service';

@Component({
  selector: 'app-proyection-detail',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './proyection-detail.component.html',
  styleUrls: ['./proyection-detail.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProyectionDetailComponent {
  proyect: any;
  details: any[] = [];
  warehouse: any;
  mode: string;

constructor(
  private route: ActivatedRoute,
  private router: Router,
  private proyectionService: ProyectionsService

){}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.proyectionService.searchProyection(id)
    .subscribe((data:any) =>{      
      console.log(data);
      this.proyect = data[0].proyect
      this.details = data[0].details
      
      
    });
      
    }

    
  }

 

