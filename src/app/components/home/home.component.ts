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
   esquemadb:any;  // guarad lista d eesqumeas de la bd actual

   datos2:any;//para recibir los parametros en un lista

   parametros:string;

   /// variables ngModel
   alias:string="";
   metodo:string="Insert";
   esquemaTabla:string;  // esquema q posee tabla
   esquemaProc:string="dbo";   // nuevo o ya existente
   metodoProc:string;
  prefijo:string="GA";

   pr:any;

  public genera(){
    var xd = document.getElementById("metodoSelect");
    this.metodoProc = xd.options[xd.selectedIndex].value;
    console.log(this.metodoProc);
    //this.crearEsquemas();
    this.obtenerEsquemaTablas();
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
    this.mostrarEsquema();
  }

  public mostrarEsquema(){
    let envia= {
      db:this.DBActual
    }
    this.mostrarEsquemas(envia);
  }

  public crearEsquemas(){
    let envia= {
      db:this.DBActual,
      nombre:this.esquemaProc
    }
    var l=this.esquemadb.length;

    var i=0;

    while (i< l){
      if(this.esquemadb[i].SCHEMA_NAME == this.esquemaProc){
        console.log("Iguales.... ", this.esquemaProc);
        break;
      }
      i++;
    }
    if(i == l){
      console.log("No hayado crear");
      this.crearEsquema(envia);
    }



  }

  

  public obtenerEsquemaTablas(){
    let envia= {
      db:this.DBActual,

      nombreT:this.tablaSeleccionada
    }
    this.obtenerEsquemaTabla(envia);
  }

  public hacerProcedimientos(){
    let envia= {
      db:this.DBActual,
      tipo:this.metodo,
      prefijo:this.prefijo,
      nombreT:this.tablaSeleccionada,
      nombreET:this.esquemaTabla,
      nombreEP:this.esquemaProc
    }
    this.hacerProcedimiento(envia);
  }

  public ejecutarProcedimientos(){
    let envia= {
      db:this.DBActual,
      nombreEP:this.esquemaProc,
      prefijo:this.prefijo,
      tipo:this.metodo,
      nombreT:this.tablaSeleccionada,
      nombreET:this.esquemaTabla,
      parametros:this.parametros
    }

    var l=this.datos2.length;

    var i=0;

    while (i< l){
      this.parametros+=this.datos2[i];
      console.log(this.datos2[i]);
      i++;
    }

    this.ejecutarProcedimiento(envia);
  }

  public obtenerParametross(){
    let envia= {
      db:this.DBActual,
      nombreT:this.tablaSeleccionada,
      nombreET:this.esquemaTabla
    }
    this.obtenerParametros(envia);
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

  public mostrarEsquemas(envia){
    console.log("Entra a enviA, ",envia);
    return this.http.put("http://localhost:3000/obtenerEsquemas",envia)
    .subscribe(
      success => {
        this.esquemadb= success.data;

      },
      err => {
       swal('Incorrecto...', "Error de conexion con endpoint /obtenerEsquemas.", 'error');
        console.log("Error ",err);
      }
    )
  }

  public crearEsquema(envia){
    console.log("Entra a enviA desde crear esquema, ",envia);
    return this.http.put("http://localhost:3000/crearEsquema",envia)
    .subscribe(
      success => {
        console.log("sucessss de crear esquema. ",success);
      },
      err => {
       swal('Incorrecto...', "Error de conexion con endpoint /crearEsquema.", 'error');
        console.log("Error ",err);
      }
    )
  }


  public obtenerEsquemaTabla(envia){
    console.log("Entra a enviA desde obtenerEsquemaTabla, ",envia);
    return this.http.put("http://localhost:3000/obtenerEsquemaTabla",envia)
    .subscribe(
      success => { 
        this.pr= success;
        console.log("sucessss. ",this.pr);
      },
      err => {
       swal('Incorrecto...', "Error de conexion con endpoint /obtenerEsquemaTabla.", 'error');
        console.log("Error ",err);
      }
    )
  }
  
  public hacerProcedimiento(envia){
    console.log("Entra a enviA desde hacerProcedimiento, ",envia);
    return this.http.put("http://localhost:3000/hacerProcedimiento",envia)
    .subscribe(
      success => { 
        this.pr= success;//agregar la variable para extraer los datos
        console.log("sucessss. ",this.pr);
      },
      err => {
       swal('Incorrecto...', "Error de conexion con endpoint /hacerProcedimiento.", 'error');
        console.log("Error ",err);
      }
    )
  }

  public ejecutarProcedimiento(envia){
    console.log("Entra a enviA desde hacerProcedimiento, ",envia);
    return this.http.put("http://localhost:3000/hacerProcedimiento",envia)
    .subscribe(
      success => { 
        this.pr= success;
        console.log("sucessss. ",this.pr);
      },
      err => {
       swal('Incorrecto...', "Error de conexion con endpoint /hacerProcedimiento.", 'error');
        console.log("Error ",err);
      }
    )
  }

  public obtenerParametros(envia){
    console.log("Entra a enviA desde obtenerParametros, ",envia);
    return this.http.put("http://localhost:3000/obtenerParametros",envia)
    .subscribe(
      success => { 
        this.datos2= success;//agregar la variable para extraer los datos
        console.log("sucessss. ",this.datos2);
      },
      err => {
       swal('Incorrecto...', "Error de conexion con endpoint /obtenerParametros.", 'error');
        console.log("Error ",err);
      }
    )
  }

}

