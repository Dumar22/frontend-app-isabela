import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExitReg } from 'src/app/dashboard/interfaces/exitRegisterInterface';
import { ActivatedRoute, Router } from '@angular/router';
import { ExitRegisterService } from 'src/app/dashboard/services/exit-register.service';

@Component({
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detail-exit-series.component.html',
  styleUrls: ['./detail-exit-series.component.css']
})
export class DetailExitSeriesComponent {
  exit: ExitReg;
  workInstall : string;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private exitRegisterService: ExitRegisterService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.exitRegisterService.getExitById(id).subscribe((data: any) => {
      this.exit = data.exit; 
      console.log(this.exit);
      
      this.workInstall = data.exit.workInstall.registration 
     });
  }

  editExit(exit: ExitReg) {
    this.router.navigate(['dashboard/edit-exit-register', exit.id]);
  }
  prev() {
    this.router.navigate(['dashboard/list-exit-register']);
  }
}
