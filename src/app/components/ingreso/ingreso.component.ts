import { Component } from '@angular/core';
import {Http, HttpClient} from '@angular/http';
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import swal from'sweetalert2';

@Component({
  selector: 'app-ingreso',
  templateUrl: './ingreso.component.html',
  styleUrls: ['./ingreso.component.css']
})
export class IngresoComponent  {

  constructor(private http: Http) { }


   ipServer:string="";
   user:string =":v";
   pasw:string="";

   datos:any;


   public conect(){
     console.log("");



      return this.http.get("http://localhost:3000/conectarServer") // , {'username':this.user,   'password':this.pasw, 'server':this.ipServer } 
         .subscribe(
           success => {
             this.datos = success;
             swal('Correcto...', "Ingreso Exitoso.", 'success');
             console.log("Data: ", this.datos);
           },
           err => {
            swal('Incorrecto...', "Verifique las credenciales ingresadas y reintente.", 'error');
             console.log("Error ",err);
           }
         )


}

}
