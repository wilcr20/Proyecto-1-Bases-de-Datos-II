import { Component,  } from '@angular/core';
import {Http, Headers} from '@angular/http';
import { Observable } from "rxjs";
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from "rxjs/operators";
import swal from'sweetalert2';
import { RequestArgs } from '@angular/http/src/interfaces';

@Component({
  selector: 'app-ingreso',
  templateUrl: './ingreso.component.html',
  styleUrls: ['./ingreso.component.css']
})
export class IngresoComponent  {

  constructor(private http: HttpClient) { }



   ipServer:string="";
   user:string =":v";
   pasw:string="";
   datos:any;



   public conect(){

    let json ={
      server:this.ipServer,
      username:this.user,
      pasw:this.pasw
    }

      return this.http.put("http://localhost:3000/conectarServer",json)
         .subscribe(
           success => {
             this.datos = success;
             console.log("datos: ", this.datos);
             if(this.datos === true){
              swal('Correcto...', "Ingreso Exitoso.", 'success');
              document.getElementById("loginModal").remove();
             }
             if(this.datos === false){
              swal('Incorrecto...', "Verifique que las credenciales ingresadas sean correctas..", 'error');
             }

           },
           err => {
            swal('Incorrecto...', "Error de conexion con endpoint /conectarServer.", 'error');
             console.log("Error ",err);
           }
         )


}

}
