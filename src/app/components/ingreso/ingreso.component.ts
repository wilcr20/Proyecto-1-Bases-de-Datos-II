import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ingreso',
  templateUrl: './ingreso.component.html',
  styleUrls: ['./ingreso.component.css']
})
export class IngresoComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

   ipServer:string;
   user:string =":v";
   pasw:string;


   conect(){
     console.log("");
     console.log("IP: ", this.ipServer);
     console.log("User: ", this.user);
     console.log("Pasw: ",this.pasw);
   }

}
