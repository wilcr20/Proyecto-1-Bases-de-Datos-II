import { Component, OnInit } from '@angular/core';
import {Http, Headers} from '@angular/http';
import { Observable } from "rxjs";
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from "rxjs/operators";
import swal from'sweetalert2';
import { RequestArgs } from '@angular/http/src/interfaces';
import {Router} from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor( private http: HttpClient) {
   }

   datos:any;
   DBActual:string ="NULL";  // variable usada para moverse entre bases de datos y obtener tablas
   dbSeleccionada:boolean= false;
   tablasDB:any;
   tablaSeleccionada= 'NULL';

   /// variables ngModel
   alias:string="";
   metodo:string="Insert";
   esquemaTabla:string;
   esquemaProc:string;

  public genera(){
    var xd = document.getElementById("metodoSelect");
    this.esquemaProc = xd.options[xd.selectedIndex].value;
    console.log(this.esquemaProc);

  }


  ngOnInit() {
    this.dbSeleccionada= false;
    this.obtenerDB(); // al inicar componente trae las bases de datos que posee
  }


  public cambioDb(db){
    this.tablaSeleccionada='NULL';
    this.tablasDB= [];
    this.DBActual= db.name;
    let envia= {
      db:this.DBActual
    }
    this.usarDB(envia);

  }

  public mostrarTablas(){
    let envia= {
      db:this.DBActual
    }
    this.mostrarTablasDB(envia);
  }

  public usarTabla(tabla:string){
    this.tablaSeleccionada= tabla;
  }





///////////////// Llamados de EndPoints



  public obtenerDB(){
    return this.http.get("http://localhost:3000/obtenerDB")
    .subscribe(
      success => {
        this.datos = success.data;
        console.log("datos: ", this.datos);
      },
      err => {
       swal('Incorrecto...', "Error de conexion con endpoint /obtenerdb.", 'error');
        console.log("Error ",err);
      }
    )
  }



  public usarDB(envia){
    console.log("EnviA, ",envia);
    return this.http.put("http://localhost:3000/usarDB",envia)
    .subscribe(
      success => {
        console.log("datos: ", success);
        this.dbSeleccionada=true;
        swal('Correcto...', "Ingreso de base de datos Exitoso.", 'success');

      },
      err => {
       swal('Incorrecto...', "Error de conexion con endpoint /usarDb.", 'error');
        console.log("Error ",err);
      }
    )
  }

  public mostrarTablasDB(envia){
    console.log("EnviA, ",envia);
    return this.http.put("http://localhost:3000/mostrarTablas",envia)
    .subscribe(
      success => {
        this.tablasDB= success.data;
        console.log("datos: ", this.tablasDB);

      },
      err => {
       swal('Incorrecto...', "Error de conexion con endpoint /mostrarTablas.", 'error');
        console.log("Error ",err);
      }
    )
  }




}
