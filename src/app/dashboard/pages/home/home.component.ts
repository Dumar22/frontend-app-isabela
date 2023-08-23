import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidenavComponent } from 'src/app/dashboard/components/sidenav/sidenav.component';
import { NavarComponent } from '../../components/navar/navar.component';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NavarComponent, SidenavComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  private authService = inject( AuthService );

   user = computed(() => this.authService.currentUser());

  // get user() { return this.authService.currentUser() }
  


}
