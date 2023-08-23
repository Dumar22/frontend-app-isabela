import { Component, Inject, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/auth/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { User } from '../../interfaces/usersInterface';


@Component({
  selector: 'app-navar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navar.component.html',
  styleUrls: ['./navar.component.css']
})
export class NavarComponent implements OnInit{
  username: string;
  
  //private authService = Inject(AuthService);
  constructor(private authService: AuthService) {}

  ngOnInit() {
    const user = this.authService.currentUser
    this.username = user().name
    
  }
  

  singOut(): void{
    this.authService.logout()     
  }


  }


 
