import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Exit } from 'src/app/dashboard/interfaces/exitInterfaces';
import { ActivatedRoute, Router } from '@angular/router';
import { ExitService } from 'src/app/dashboard/services/exit.service';

@Component({
  standalone: true,
  imports: [CommonModule],
  templateUrl: './details-exit.component.html',
  styleUrls: ['./details-exit.component.css']
})
export class DetailsExitComponent {
  exit: Exit;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private exitService: ExitService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.exitService.getExitById(id).subscribe((data: any) => {
      this.exit = data;
             
         
    });
  }

  editExit(exit: Exit) {
    this.router.navigate(['dashboard/edit-exit-material', exit.id]);
  }
  prev() {
    this.router.navigate(['dashboard/list-exit-materials']);
  }

}
