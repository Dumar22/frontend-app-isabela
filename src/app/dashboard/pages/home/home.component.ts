import { Component, OnInit,  } from '@angular/core';
import { SidenavComponent } from 'src/app/dashboard/components/sidenav/sidenav.component';
import { NavarComponent } from '../../components/navar/navar.component';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ NavarComponent, SidenavComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  ngOnInit(): void {
    
    
  }

 

  
  


}
