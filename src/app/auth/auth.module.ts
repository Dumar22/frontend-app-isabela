import { NgModule } from '@angular/core';
import { AuthRoutingModule } from './auth-routing.module';
import { BrowserModule } from '@angular/platform-browser';



@NgModule({

  imports: [
    BrowserModule,
    AuthRoutingModule
  ]
})
export class AuthModule { }
