import { Component,  } from '@angular/core';
import {Http, Headers} from '@angular/http';
import { Observable } from "rxjs";
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from "rxjs/operators";
import swal from'sweetalert2';
import { RequestArgs } from '@angular/http/src/interfaces';
import {Router} from '@angular/router';

@Component({
  selector: 'app-ingreso',
  templateUrl: './ingreso.component.html',
  styleUrls: ['./ingreso.component.css']
})
export class IngresoComponent  {

  constructor(private http: HttpClient, private router:Router) { }


   ipServer:string="localhost";
   user:string ="Wilfred";
   pasw:string="123456789";
   public datos:any;

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
              //this.obtenerDB();
              document.getElementById("closemodal").click();
              this.router.navigate(['home']);  // redirecciona a ruta
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
