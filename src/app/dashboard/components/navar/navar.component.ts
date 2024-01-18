import { Component, OnInit, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/auth/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { User } from '../../interfaces/usersInterface';
import { interval } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-navar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navar.component.html',
  styleUrls: ['./navar.component.css']
})
export class NavarComponent implements OnInit{
  username: string;
  currentTime: Date;
  elapsedTime: number;
  
  private authService = inject( AuthService );
 
  //public user = computed(() => this.authService.currentUser() );
 
  ngOnInit() {
 const  user = this.authService.currentUser() ;

    this.username =  user.fullName
 
    this.currentTime = new Date();
    interval(1000).subscribe(() => {
      this.currentTime = new Date();
    });
  }
      
  singOut() {
    this.authService.logout()     
  }


  }


 
