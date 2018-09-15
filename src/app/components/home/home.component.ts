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
   procediListo:boolean= false;
   tablasDB:any;
   tablaSeleccionada= 'NULL';
   esquemadb:any;  // guarad lista de esqumeas de la bd actual

   datos2:any;//para recibir los parametros en un lista

   parametros:string;


   /// variables ngModel para enviar
   alias:string="GA";
   metodo:string="Insert";
   esquemaTabla:any="";  // esquema q posee tabla
   esquemaProc:string="dbo";   // nuevo o ya existente
   metodoProc:string;
   esquemaTablaAct:any; // esquema al que pertence la tabla seleccioanda
   queryGenerado:any= "Select * from ...";

   parametrosTabla:any;
   parametrosAEnviar:any;

   pr:any;
   prr:any;
   keysTabla:any;


      //// Para saber que boton de ejecutar mostrar xd
  procediInsert=false;
  procediSelect=false;
  procediUpdate=false;
  procediDelete=false;



  public genera(){
    var xd = document.getElementById("metodoSelect");
    this.metodoProc = xd.options[xd.selectedIndex].value;
    this.crearEsquemas();
  }


/////////////////////////////////////  metodos de ejecucion de procediemientos

  public  ejecutarInsert(){
    console.log("insertar");
    this.obtenerParametross();
  }

  public ejecutarSelect(){
    console.log("select");
    this.obtenerParametross();
  }
  public ejecutarDelete(){
    console.log("delete");
    this.obtenerPk();

  }
  public ejecutarUpdate(){
    console.log("update");
  }


  public insertar(){
    this.parametrosAEnviar="";
    var tamaParms = this.parametrosTabla.length;

    this.parametrosAEnviar= " '"+document.getElementById("insert0").value+ "'" ;

    var n=1;

    while( n < tamaParms){
      this.parametrosAEnviar = this.parametrosAEnviar + " , '" + document.getElementById("insert"+n).value+ "' ";
      n++;
    }
    console.log("parmas :V  ", this.parametrosAEnviar);


    var eT= this.esquemaTablaAct.data[0].TABLE_SCHEMA;
    let envia= {
      db:this.DBActual,
      nombreEP:this.esquemaProc,
      prefijo:this.alias,
      tipo:'Insert',
      nombreT:this.tablaSeleccionada,
      nombreET:eT,
      parametros:this.parametrosAEnviar
    }

    this.ejecutarProcedimiento(envia);
  }


  public select(){
    this.parametrosAEnviar="";
    var tamaParms = this.parametrosTabla.length;

    if (document.getElementById("insert0").value == ""){
    this.parametrosAEnviar="NULL";
    }
    else{
      this.parametrosAEnviar= " '"+document.getElementById("insert0").value+ "'" ;
    }


    var n=1;

    while( n < tamaParms){
      if (document.getElementById("insert"+n).value == ""){
        this.parametrosAEnviar = this.parametrosAEnviar + ", NULL ";
      }else{
        this.parametrosAEnviar = this.parametrosAEnviar + " , '" + document.getElementById("insert"+n).value+ "' ";
      }

      n++;
    }
    console.log();
    console.log("parmas :V desde select  ", this.parametrosAEnviar);
    console.log();

    var eT= this.esquemaTablaAct.data[0].TABLE_SCHEMA;
    let enviaS= {
      db:this.DBActual,
      nombreEP:this.esquemaProc,
      prefijo:this.alias,
      tipo:'Select',
      nombreT:this.tablaSeleccionada,
      nombreET:eT,
      parametros:this.parametrosAEnviar
    }
    this.ejecutarProcedimiento(enviaS);
  }


  ////////////
  public delete (){            // unicamente una llave primaria por tabla
    this.parametrosAEnviar="";
    var tamaParms = this.parametrosTabla.length;

    if (document.getElementById("insert0").value == ""){
    this.parametrosAEnviar="NULL";
    }
    else{
      this.parametrosAEnviar= " '"+document.getElementById("insert0").value+ "'" ;
    }

    console.log();
    console.log("parmas :V desde delete  ", this.parametrosAEnviar);
    console.log();

    var eT= this.esquemaTablaAct.data[0].TABLE_SCHEMA;
    let enviaS= {
      db:this.DBActual,
      nombreEP:this.esquemaProc,
      prefijo:this.alias,
      tipo:'Delete',
      nombreT:this.tablaSeleccionada,
      nombreET:eT,
      parametros:this.parametrosAEnviar
    }
    this.ejecutarProcedimiento(enviaS);


  }
















//////////////////////////////////////////////

  ngOnInit() {
    this.procediListo= false;
    this.procediInsert=false;
    this.procediSelect=false;
    this.procediUpdate=false;
    this.procediDelete=false;
    this.dbSeleccionada= false;
    this.tablaSeleccionada='NULL';
    this.obtenerDB(); // al inicar componente trae las bases de datos que posee
  }


  public cambioDb(db){
    this.procediListo= false;
    this.procediInsert=false;
    this.procediSelect=false;
    this.procediUpdate=false;
    this.procediDelete=false;
    this.tablaSeleccionada='NULL';
    this.tablasDB= [];
    this.DBActual= db.name;
    let envia= {
      db:this.DBActual
    }
    this.usarDB(envia);
  }

  public mostrarTablas(){
    this.procediListo= false;
    this.procediInsert=false;
    this.procediSelect=false;
    this.procediUpdate=false;
    this.procediDelete=false;
    this.tablaSeleccionada= 'NULL';
    let envia= {
      db:this.DBActual
    }
    this.mostrarTablasDB(envia);

  }

  public usarTabla(tabla:string){
    this.procediListo= false;
    this.procediInsert=false;
    this.procediSelect=false;
    this.procediUpdate=false;
    this.procediDelete=false;
    this.queryGenerado="Select * from ...";
    this.tablaSeleccionada= tabla;
    this.mostrarEsquema();
    this.obtenerEsquemaTablas();
  }

  public mostrarEsquema(){
    this.procediListo= false;
    this.procediInsert=false;
    this.procediSelect=false;
    this.procediUpdate=false;
    this.procediDelete=false;
    let envia= {
      db:this.DBActual
    }
    this.mostrarEsquemas(envia);
  }

  public crearEsquemas(){
    this.procediListo= false;
    this.procediInsert=false;
    this.procediSelect=false;
    this.procediUpdate=false;
    this.procediDelete=false;
    let envia= {
      db:this.DBActual,
      nombre:this.esquemaProc
    }
    var l=this.esquemadb.data.length;

    var i=0;

    while (i< l){
      if(this.esquemadb.data[i].SCHEMA_NAME == this.esquemaProc){
        console.log("Iguales.... ", this.esquemaProc);
        this.hacerProcedimientos(); // se hace procedimiernto con esquema ya en db
        break;
      }
      i++;
    }
    if(i == l){
      console.log("No hayado crear");
      this.crearEsquema(envia);
      setTimeout(() => {
        this.hacerProcedimientos();
      }, 2000);

    }
  }


  public obtenerEsquemaTablas(){
    this.procediListo= false;
    this.procediInsert=false;
    this.procediSelect=false;
    this.procediUpdate=false;
    this.procediDelete=false;
    let envia= {
      db:this.DBActual,
      nombreT:this.tablaSeleccionada
    }
    this.obtenerEsquemaTabla(envia);
  }

  public hacerProcedimientos(){
    this.procediListo= false;
    this.procediInsert=false;
    this.procediSelect=false;
    this.procediUpdate=false;
    this.procediDelete=false;
    var eT= this.esquemaTablaAct.data[0].TABLE_SCHEMA;

    let envia= {
      db:this.DBActual,
      tipo:this.metodoProc,
      prefijo:this.alias,
      nombreT:this.tablaSeleccionada,
      nombreET:eT,
      nombreEP:this.esquemaProc
    }
    this.hacerProcedimiento(envia);
    setTimeout(() => {

      var xd = this.queryGenerado.data[0];
      var que=xd.query
      console.log("procc xd", que);
      this.queryGenerado=que;
    }, 2000);
  }




  public obtenerParametross(){
    var eT= this.esquemaTablaAct.data[0].TABLE_SCHEMA;
    let envia= {
      db:this.DBActual,
      nombreT:this.tablaSeleccionada,
      nombreET:eT
    }
    this.obtenerParametros(envia);
  }

  public obtenerPk(){
    var eT= this.esquemaTablaAct.data[0].TABLE_SCHEMA;
    let envia= {
      db:this.DBActual,
      nombreT:this.tablaSeleccionada,
      nombreET:eT
    }
    this.obtenerPks(envia);


  }



















///////////////// Llamados de EndPoints



  public obtenerDB(){
    return this.http.get("http://localhost:3000/obtenerDB")
    .subscribe(
      success => {
        this.datos = success;
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
        this.tablasDB= success;
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
        this.esquemadb= success;

      },
      err => {
       swal('Incorrecto...', "Error de conexion con endpoint /obtenerEsquemas.", 'error');
        console.log("Error ",err);
      }
    )
  }

  public crearEsquema(envia){
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
    return this.http.put("http://localhost:3000/obtenerEsquemaTabla",envia)
    .subscribe(
      success => {
        this.esquemaTablaAct= success;
        console.log("sucessss esuqma tabla. ",this.esquemaTablaAct);
      },
      err => {
       swal('Incorrecto...', "Error de conexion con endpoint /obtenerEsquemaTabla.", 'error');
        console.log("Error ",err);
      }
    )
  }

  public hacerProcedimiento(envia){
    console.log("---------------Entra a enviA desde hacerProcedimiento, ",envia);
    return this.http.put("http://localhost:3000/hacerProcedimiento",envia)
    .subscribe(
      success => {
        this.queryGenerado = success;
        console.log("sucessss query generado. ",this.queryGenerado);
        swal('Correcto', "Procedimiento generado y creado en base de dato correctamente.", 'info');
        this.procediListo=true;
        console.log("--------------------" ,this.metodoProc);
        //
        if(this.metodoProc == 'Insertar'){
          this.procediInsert=true;
          this.procediDelete=false;
          this.procediSelect=false;
          this.procediUpdate=false;
        }
        if(this.metodoProc == 'Select'){
          this.procediInsert=false;
          this.procediDelete=false;
          this.procediSelect=true;
          this.procediUpdate=false;
        }
        if(this.metodoProc == 'Delete'){
          this.procediInsert=false;
          this.procediDelete=true;
          this.procediSelect=false;
          this.procediUpdate=false;
        }
        if(this.metodoProc == 'Update'){
          this.procediInsert=false;
          this.procediDelete=false;
          this.procediSelect=false;
          this.procediUpdate=true;
        }
      },
      err => {
       swal('Incorrecto...', "Error de conexion con endpoint /hacerProcedimiento.", 'error');
        console.log("Error ",err);
      }
    )

  }

  public ejecutarProcedimiento(envia){

    console.log("Entra a enviA desde ejecutarProcedimiento, ",envia);

    return this.http.put("http://localhost:3000/ejecutarProcedimiento",envia)
    .subscribe(
      success => {
        this.prr= success;
        console.log("Success de jecutar proc:  " ,this.prr);

        if(this.metodoProc == 'Select'){
          swal('Correcto...', "Datos obtenidos:  " + JSON.stringify(this.prr.data)  , 'info');
        }
        if (this.metodoProc == 'Insert'){
          swal('Correcto...', "Inserción ejecutada Correctamnete. ", 'info');
        }
        if (this.metodoProc == 'Delete'){
          swal('Correcto...', "Eliminado Correctamnete. ", 'info');
        }


      },
      err => {
       swal('Incorrecto...', "Error de conexion con endpoint /ejecutarProcedimiento.", 'error');
        console.log("Error ",err);
      }
    )

  }

  public obtenerParametros(envia){
    console.log("Entra a enviA desde obtenerParametros, ",envia);

    return this.http.put("http://localhost:3000/obtenerParametros",envia)
    .subscribe(
      success => {
        this.parametrosTabla= success.data;//agregar la variable para extraer los datos
        console.log("sucessss de obtener param. ",this.parametrosTabla);
      },
      err => {
       swal('Incorrecto...', "Error de conexion con endpoint /obtenerParametros.", 'error');
        console.log("Error ",err);
      }
    )

  }


  public obtenerPks(envia){
    console.log("Entra a enviA desde obtenerPks, ",envia);

    return this.http.put("http://localhost:3000/obtenerPrimaryKey",envia)
    .subscribe(
      success => {
        this.parametrosTabla= success.data;//agregar la variable para extraer los datos
        console.log("sucessss de obtener pks. ",this.parametrosTabla);
      },
      err => {
       swal('Incorrecto...', "Error de conexion con endpoint /obtenerPks.", 'error');
        console.log("Error ",err);
      }
    )

  }




}

