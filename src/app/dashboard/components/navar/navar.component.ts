import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/auth/services/auth.service';
import { interval } from 'rxjs';


@Component({
  selector: 'app-navar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navar.component.html',
  styleUrls: ['./navar.component.css']
})
export class NavarComponent implements AfterViewInit{
  username?: string ;
  currentTime: Date;
  elapsedTime: number;
  
  constructor(private authService: AuthService){}
  ngAfterViewInit(): void {
    this.getCurrentUser();
    this.startTimeInterval();
  }
 
 
   getCurrentUser(){
    this.username = this.authService.currentUser().fullName
    
    
  }

  startTimeInterval(): void {
    this.currentTime = new Date();
    interval(1000).subscribe(() => {
      this.currentTime = new Date();
    });
  }
      
  singOut() {
    this.authService.logout()     
  }

  
  }


 
