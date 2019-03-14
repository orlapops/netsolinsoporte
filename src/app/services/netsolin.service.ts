import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
// import { Http, Response, Headers, RequestOptions } from '@angular/http';
// import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

import { catchError, map, tap } from 'rxjs/operators';
import { NetsolinApp } from '../shared/global';
import { environment } from '../../environments/environment';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireStorage,  AngularFireStorageReference } from '@angular/fire/storage';

import { pipe } from '@angular/core/src/render3/pipe';
// import { Observable } from 'rxjs';
import { Incidente } from '../modulos/soporte/modeldatoincidente';

@Injectable()
export class NetsolinService {
	public cargo_ruta = false;
	public error_cargarruta = false;
	public men_errorcargarruta = "";
	public cargoidperiodo = false;
	public id_periodo: string;
	public id_ruta: number = 0;
	public oappNetsolin: any;
	public empreFb: any;
	public usuarFb: any;
	public cargo_empre = false;
	public cargo_usuar = false;

	public cargoparametrosb = false;
	public nivelescriticidad: any[] = [];
	public productosprin: any[] = [];
	public modulos: any[] = [];
	public consultores: any[] = [];
	public clientes: any[] = [];

	constructor(private http: HttpClient,
    private afStorage: AngularFireStorage,
		private fbDb: AngularFirestore) {
	}

//Consulta en Netsolin el usuario con la fecha para saber que ruta y periodo le corresponde
cargaPeriodoUsuar(pcod_usuar){
	return new Promise((resolve)=>{
		if (this.cargoidperiodo){
				resolve(true); 
		 }
			NetsolinApp.objenvrest.filtro = pcod_usuar;
			let url= NetsolinApp.urlNetsolin + "netsolin_servirestgo.csvc?VRCod_obj=IDRUTAPERAPP";
			this.http.post( url, NetsolinApp.objenvrest )   
			 .subscribe( (data:any) =>{ 
					 console.log('cargo periodo en netsolin', data);
				if( data.error){
						console.error(" cargaPeriodoUsuar ", data.error);
					//   this._parempre.reg_log('Error en cargaPeriodoUsuar por netsolin ', 'data.error');
					 this.cargoidperiodo = false;
					 this.cargo_ruta = false;
					 this.error_cargarruta = true;
					 this.men_errorcargarruta = data.men_error;
					 resolve(false);
					} else{
							// this._parempre.reg_log('coer', 'cargaPeriodoUsuar por netsolin ');
							this.cargoidperiodo = true;
						this.id_ruta = data.datos_ruta[0].id_ruta;
						this.id_periodo = data.datos_periodo[0].id_per;
						resolve(true);
					}
			 });
		 });
}



	getNetsolinArchIni() {
	}
	getNetsolinhtmlbase(): Observable<any> {
		// return this.http.get(this.baseUrl+'todo2s.csvc').map(res => res.json());
		console.log('a netsolinbase traer');
		console.log('netsolinbase urlNetsolin NetsolinApp: '+NetsolinApp.urlNetsolin);
		var paramSolicitud: string="";

		if (environment.production) {
			paramSolicitud=NetsolinApp.urlNetsolin + "netsolinhtmlgenbase.csvc?VRprod=ENPROD";
		} else {
			paramSolicitud=NetsolinApp.urlNetsolin + "netsolinhtmlgenbase.csvc?VRprod=NOPROD";
		}
		
		// return this.http.get(NetsolinApp.urlNetsolin + "netsolinhtmlgenbase.csvc")
		return this.http.get(paramSolicitud)
			.pipe(
			map(resul => {				
				return resul;
			})
			);

	}

	private handleError(error: HttpErrorResponse) {
		// console.error('Error en servidor:', error);
		if (error.error instanceof Error) {
			let errMessage = error.error.message;
			return Observable.throw(errMessage);
			// Use the following instead if using lite-server
			//return Observable.throw(err.text() || 'backend server error');
		}
		return Observable.throw(error || 'Node.js server error');
	}

	getNetsolinslide(): Observable<any> {
		return this.http.get(NetsolinApp.urlNetsolin + "netsolinmenu.csvc?VRTipo=MTB")
			.pipe(
			map(resul => {
				// console.log('map get');
				//  console.log(resul);
				return resul;
			}),
			catchError(this.handleError)
			);
	}


	getNetsolinMonitores(): Observable<any> {
		return this.http.get(NetsolinApp.urlNetsolin + "netsolinmenu.csvc?VRTipo=CRMI")
			.pipe(
			map(resul => {
				// console.log('map getNetsolinMonitores');
				//  console.log(resul);
				return resul;
			})
			);
	}

	getNetsolinMantbas(ptipo, pmodulo): Observable<any> {
		return this.http.get(NetsolinApp.urlNetsolin + "netsolinmenu.csvc?VRTipo=" + ptipo + "&VRModulo=" + pmodulo)
			.pipe(
			map(resul => {
				// console.log('map getNetsolinMantbas');
				//  console.log(resul);
				return resul;
			})
			);
	}
	getNetsolinAlertas(): Observable<any> {
		return this.http.get(NetsolinApp.urlNetsolin + "netsolinmenu.csvc?VRTipo=ALER")
			.pipe(
			map(resul => {
				console.log('map getNetsolinAlertas');
				 console.log(resul);
				return resul;
			})
			);
	}
	getNetsolinUsuar(): Observable<any> {
		return this.http.get(NetsolinApp.urlNetsolin + "netsolinmenu.csvc?VRTipo=USUAR")
			.pipe(
			map(resul => {
				// console.log('map getNetsolinAlertas');
				//  console.log(resul);
				return resul;
			})
			);
	}

	getNetsolinRecordatorio(): Observable<any> {
		return this.http.get(NetsolinApp.urlNetsolin + "netsolinmenu.csvc?VRTipo=SEG")
			.pipe(
			map(resul => {
				return resul;
			})
			);
	}

	getNetsolinProcesos(): Observable<any> {
		return this.http.get(NetsolinApp.urlNetsolin + "netsolinmenu.csvc?VRTipo=PROC")
			.pipe(
			map(resul => {
				// console.log('map getNetsolinProcesos');
				//  console.log(resul);
				return resul;
			})
			);
	}
	getNetsolinSolicitudes(): Observable<any> {
		return this.http.get(NetsolinApp.urlNetsolin + "netsolinmenu.csvc?VRTipo=SOLI")
			.pipe(
			map(resul => {
				// console.log('map getNetsolinSolicitudes');
				//  console.log(resul);
				return resul;
			})
			);
	}


	getNetsolinMessages(): Observable<any> {
		return this.http.get(NetsolinApp.urlNetsolin + "netsolinmenu.csvc?VRTipo=MENS")
			.pipe(
			map(resul => {
				// console.log('map getNetsolinMessages');
				//  console.log(resul);
				return resul;
			})
			);
	}
	getNetsolinSolic(): Observable<any> {
		return this.http.get(NetsolinApp.urlNetsolin + "netsolinmenu.csvc?VRTipo=SOLI")
			.pipe(
			map(resul => {
				return resul;
			})
			);
	}
	/**************************************************/
	getNetsolinDictabla(ptabla, paplica, pobjeto): Observable<any> {
        NetsolinApp.objenvrestddtabla.usuario = NetsolinApp.oapp.cuserid;
        NetsolinApp.objenvrestddtabla.psw = NetsolinApp.oapp.cuserpsw;
        NetsolinApp.objenvrestddtabla.prefijobd = NetsolinApp.oapp.prefijo_sqlbd;
		NetsolinApp.objenvrestddtabla.tabla = ptabla;
		NetsolinApp.objenvrestddtabla.aplica = paplica;
		NetsolinApp.objenvrestddtabla.objeto = pobjeto;
		// console.log('getNetsolinDictabla ant enviar ');	
		// console.log(NetsolinApp.objenvrestddtabla);
		return this.http.post(NetsolinApp.urlNetsolin + "Ejeservi_rest.csvc?VRCod_obj=RESTCONDDCAMTAB", NetsolinApp.objenvrestddtabla)
			.pipe(
			map(resul => {
				// console.log('getNetsolinDictabla resaulta');
				// console.log(resul);
				return resul;
			})
			);
	}
	//seguridad objeto en netsolin 
	getNetsolinSegObj(pobjeto): Observable<any> {
        NetsolinApp.objenvrestddtabla.usuario = NetsolinApp.oapp.cuserid;
        NetsolinApp.objenvrestddtabla.psw = NetsolinApp.oapp.cuserpsw;
        NetsolinApp.objenvrestddtabla.prefijobd = NetsolinApp.oapp.prefijo_sqlbd;
		NetsolinApp.objenvrestddtabla.tabla = "GENERAL";
		NetsolinApp.objenvrestddtabla.aplica = 0;
		NetsolinApp.objenvrestddtabla.objeto = pobjeto;
		return this.http.post(NetsolinApp.urlNetsolin + "Ejeservi_rest.csvc?VRCod_obj=RESTCONSEGOBJ", NetsolinApp.objenvrestddtabla)
			.pipe(
			map(resul => {
				// console.log('map getNetsolinSegObj');
				//  console.log(resul);
				//  console.log(resul[0]);
				return resul[0];
				// return resul;
			})
			);
	}
	//Lee objeto para mant tabla basica
	getNetsolinObjmantbasica(pobjeto): Observable<any> {
        NetsolinApp.objenvrestddtabla.usuario = NetsolinApp.oapp.cuserid;
        NetsolinApp.objenvrestddtabla.psw = NetsolinApp.oapp.cuserpsw;
        NetsolinApp.objenvrestddtabla.prefijobd = NetsolinApp.oapp.prefijo_sqlbd;
		NetsolinApp.objenvrestddtabla.tabla = "GENERAL";
		NetsolinApp.objenvrestddtabla.aplica = 0;
		NetsolinApp.objenvrestddtabla.objeto = pobjeto;
		return this.http.post(NetsolinApp.urlNetsolin + "Ejeservi_rest.csvc?VRCod_obj=RESTOBJMANTBASICA", NetsolinApp.objenvrestddtabla)
			.pipe(
			map(resul => {
				// console.log('map getNetsolinObjmantbasica');
				//  console.log(resul);
				return resul;
				//  return resul[0]; 
				// return resul;
			})
			);
	}



	//Verifica si variable VPAR... que se usa como parametros en localsotrage este creada si no la crea
	//ejemplo para llamado en monitores sin que tengan que ingresar primero a la tabla basica
	verificaVpar(pobjeto,pvarParam): Observable<any> {
        NetsolinApp.objenvrestddtabla.usuario = NetsolinApp.oapp.cuserid;
        NetsolinApp.objenvrestddtabla.psw = NetsolinApp.oapp.cuserpsw;
        NetsolinApp.objenvrestddtabla.prefijobd = NetsolinApp.oapp.prefijo_sqlbd;
		NetsolinApp.objenvrestddtabla.tabla = "GENERAL";
		NetsolinApp.objenvrestddtabla.aplica = 0;
		NetsolinApp.objenvrestddtabla.objeto = pobjeto;
		return this.http.post(NetsolinApp.urlNetsolin + "Ejeservi_rest.csvc?VRCod_obj=RESTOBJMANTBASICA", NetsolinApp.objenvrestddtabla)
			.pipe(
			map(result => {
				// console.log('map getNetsolinObjmantbasica');
				//  console.log(resul);
				var result0 = result[0];
				console.log(result0);
				// if (typeof (result.isCallbackError) != "undefined") {
				// 	var  orespuesta: any = {respuesta: "Error"};
				// 	return orespuesta;
				// }

				NetsolinApp.objpartablabas.aplica = parseInt(result0.aplica);
				NetsolinApp.objpartablabas.tabla = result0.tabla;
				NetsolinApp.objpartablabas.campollave = result0.campollave;
				NetsolinApp.objpartablabas.clase_val = result0.clase_val;
				NetsolinApp.objpartablabas.clase_nbs = result0.clase_nbs;        
				NetsolinApp.objpartablabas.camponombre = result0.camponombre;
				NetsolinApp.objpartablabas.titulo = result0.title;
				NetsolinApp.objpartablabas.subtitulo = "";
				NetsolinApp.objpartablabas.objeto = pobjeto;
				NetsolinApp.objpartablabas.rutamant = "mantbasica/" + pobjeto;
				NetsolinApp.objpartablabas.prefopermant = result0.prefomant;
				if (result0.campos_lista.length>2){
				  let var3 = JSON.parse(result0.campos_lista);
				  if (typeof(var3)=='object'){
					NetsolinApp.objpartablabas.campos_lista = var3;
				  }
				} 
				let var1 = JSON.stringify(NetsolinApp.objpartablabas);
				localStorage.setItem("VPAR" + result0.tabla, var1);		

				return result;
				//  return resul[0]; 
				// return resul;
			})
			);
	}

	verificaVparMal(pobjeto,pvarParam) : Observable<any> {
		let lvart: any;
        lvart = localStorage.getItem(pvarParam);
        if (lvart) {
		  // console.log('Existe');
			var  orespuesta: any = {respuesta: "Existe"};
		  	return orespuesta;
        } 
        NetsolinApp.objenvrestddtabla.usuario = NetsolinApp.oapp.cuserid;
        NetsolinApp.objenvrestddtabla.psw = NetsolinApp.oapp.cuserpsw;
        NetsolinApp.objenvrestddtabla.prefijobd = NetsolinApp.oapp.prefijo_sqlbd;
		NetsolinApp.objenvrestddtabla.tabla = "GENERAL";
		NetsolinApp.objenvrestddtabla.aplica = 0;
		NetsolinApp.objenvrestddtabla.objeto = pobjeto;
		this.getNetsolinObjmantbasica(pobjeto)
		.subscribe(result =>{
				var result0 = result[0];
				console.log(result0);
				if (typeof (result.isCallbackError) != "undefined") {
					var  orespuesta: any = {respuesta: "Error"};
					return orespuesta;
				}
				NetsolinApp.objpartablabas.aplica = parseInt(result0.aplica);
				NetsolinApp.objpartablabas.tabla = result0.tabla;
				NetsolinApp.objpartablabas.campollave = result0.campollave;
				NetsolinApp.objpartablabas.clase_val = result0.clase_val;
				NetsolinApp.objpartablabas.clase_nbs = result0.clase_nbs;        
				NetsolinApp.objpartablabas.camponombre = result0.camponombre;
				NetsolinApp.objpartablabas.titulo = result0.title;
				NetsolinApp.objpartablabas.subtitulo = "";
				NetsolinApp.objpartablabas.objeto = pobjeto;
				NetsolinApp.objpartablabas.rutamant = "mantbasica/" + pobjeto;
				NetsolinApp.objpartablabas.prefopermant = result0.prefomant;
				if (result0.campos_lista.length>2){
				  let var3 = JSON.parse(result0.campos_lista);
				  if (typeof(var3)=='object'){
					NetsolinApp.objpartablabas.campos_lista = var3;
				  }
				} 
				let var1 = JSON.stringify(NetsolinApp.objpartablabas);
				localStorage.setItem("VPAR" + result0.tabla, var1);		
				var  orespuesta: any = {respuesta: "Creado"};
				return orespuesta;
			});
	}

	//llama busqueda por objeto envia objeto objenvrest
	getNetsolinObjbusqueda(pobjeto,pcadbus,pfiltroadi): Observable<any> {
		// console.log('getNetsolinObjbusqueda pobjeto:'+pobjeto+' pcadbus:'+pcadbus+' pfiltroadi: '+pfiltroadi);
        NetsolinApp.objenvrestsolcomobog.usuario = NetsolinApp.oapp.cuserid;
        NetsolinApp.objenvrestsolcomobog.psw = NetsolinApp.oapp.cuserpsw;
        NetsolinApp.objenvrestsolcomobog.prefijobd = NetsolinApp.oapp.prefijo_sqlbd;
		NetsolinApp.objenvrestsolcomobog.tabla = "GENERAL";
		NetsolinApp.objenvrestsolcomobog.aplica = 0;
		NetsolinApp.objenvrestsolcomobog.filtro = pcadbus;
		NetsolinApp.objenvrestsolcomobog.filtroadi = pfiltroadi;
		return this.http.post(NetsolinApp.urlNetsolin + "Ejeservi_rest.csvc?VRCod_obj="+pobjeto, NetsolinApp.objenvrestsolcomobog)
			.pipe(
			map(resul => {
				// console.log('map getNetsolinObjbusqueda');
				//  console.log(resul);
				 var result0 = resul[0];
				//  console.log(result0);
				 //si hay error retorna lista de errores sino el registro solicitado
				 if (typeof (result0) == "undefined") {
					 return resul;
				 } else {
					 return resul;
				 }
			})
			);
	}
	//Ejecuta servicio rest en Netsolin con un objeto pparam que lleva parametros
	//retorna errores o cursor con resultado
	//Ejemplo de uso para retornar precio d eventa objeto: RESTCONLISTPREC
	///con parametro de llamado: "parametros":{"lista": "V01","cod_refven": "100    ","cod_tercer": "",
	///            "proc_ven": "016 ", "cantidad":10 }
	getNetsolinObjconParametros(pobjeto,pparam:any): Observable<any> {
		// console.log('getNetsolinObjconParametros pobjeto:'+pobjeto);
        NetsolinApp.objenvrest.usuario = NetsolinApp.oapp.cuserid;
        NetsolinApp.objenvrest.psw = NetsolinApp.oapp.cuserpsw;
        NetsolinApp.objenvrest.prefijobd = NetsolinApp.oapp.prefijo_sqlbd;
		NetsolinApp.objenvrest.filtro = "";
		NetsolinApp.objenvrest.parametros = pparam;
		if (NetsolinApp.objenvrest.tiporet != "OBJ")
			NetsolinApp.objenvrest.tiporet= "CON";
		return this.http.post(NetsolinApp.urlNetsolin + "Ejeservi_rest.csvc?VRCod_obj="+pobjeto, NetsolinApp.objenvrest)
			.pipe(
			map(resul => {
				// console.log('map getNetsolinObjconParametros');
				//  console.log(resul);
				 var result0 = resul[0];
				//  console.log(result0);
				 //si hay error retorna lista de errores sino el registro solicitado
				 if (typeof (result0) == "undefined") {
					 return resul;
				 } else {
					 return resul;
				 }
			})
			);
	}
//cadena formato AAAAMMDD A FECHA TIEMPO 0
cadafecha(cfecha){
  let ano = cfecha.slice(0,4);
  let mes = cfecha.slice(4,6);
  let dia = cfecha.slice(6,8);

  let dfecha = new Date(ano,mes,dia,0,0,0);
  return dfecha;
}

//recibe hora militar como numero y retorna cadena formato HH:MM AM/PM
cadhoramil(nhora){
  let ch = nhora.toString();
  let chh = '';
  let cmm = '';
  let campm = '';
  let nnh = 0;
  if (nhora < 1000) {
    chh = ch.slice(0,1);
    cmm = ch.slice(1,3); 
  } else {
    chh = ch.slice(0,2);
    cmm = ch.slice(2,4);  
  }
  if(nhora < 1200){
    campm = 'AM';      
  } else {
    nnh = parseInt(chh) - 12;
    chh = nnh.toString();
    campm = 'PM';      
  }

  return chh+':'+cmm+' '+campm;
}
//fecha a string para monitor en netsolin dd/mm/aa
fechacad(fechaf){
	console.log(fechaf);	
	// console.log(typeof(fechaf);	
	// console.log(fechaf.toDate());	
	// const fecha= fechaf.toDate();
	// console.log(fecha);
	// const dia = fecha.getDate();
	// const mes = fecha.getMonth() + 1;
	// const ano = fecha.getFullYear();

  const cfecha = fechaf.substring(8,10) + '/' + fechaf.substring(5,7) + '/' + fechaf.substring(0,4);
	console.log(cfecha);	
  return cfecha;
}
 //verifica empresa actual en firebase si no existe la crea
 public VeriExisteEmpresaActualFb(id){
	return new Promise( (resolve) => {
	console.log(id);
	const ref: AngularFirestoreDocument<any> = this.fbDb.collection(`clientes`).doc(id);
	ref.get().subscribe(snap => {
		if (snap.exists) {
			console.log('Existe', id);
			this.fbDb.collection(`/clientes`)
			.doc(id).update({datosoapp: this.oappNetsolin});
			// this.empreFb = ref.valueChanges();
			// this.cargo_empre = true;
			// console.log(this.empreFb);
			resolve(true);
		} else {
			const objempre = {
				nit: NetsolinApp.oapp.nit_empresa,
				nombre: NetsolinApp.oapp.nom_empresa,
				datosoapp: this.oappNetsolin
			}
			this.fbDb.collection(`/clientes`)
			.doc(id).set(objempre);
			console.log('no existe crear',id);
			resolve(true);
		}
	});
});
}
      //Se suscribe a empresa para traerla de FB
			public getEmpreFB(Id: string) {
				console.log('en getEmpreFB');
			return this.fbDb
				.collection(`/clientes`)
			 .doc(Id).valueChanges();
			}
 //Verifica usuario actual en firebase si no existe la crea
 public VeriUsuarioaActualFb(idusuar){
	return new Promise( (resolve) => {
	console.log(idusuar);
	const ref: AngularFirestoreDocument<any> = this.fbDb.collection(`clientes/${NetsolinApp.oapp.nit_empresa}/usuarios`).doc(idusuar);
	ref.get().subscribe(snap => {
		if (snap.exists) {
			console.log('Existe usuario', idusuar);
			// this.fbDb.collection(`/clientes`)
			// .doc(id).update({datosoapp: this.oappNetsolin});
			resolve(true);
		} else {
			console.log('no existe usuario crear',idusuar, NetsolinApp, this.oappNetsolin);
			const objempre = {
				id: NetsolinApp.oapp.cuserid,
				email: this.oappNetsolin.email_usuar,
				nombre: this.oappNetsolin.nomusuar,
				superusuar: this.oappNetsolin.superusuar,
				reportanetsolin: false
			}
			console.log('usuario a crea',idusuar,objempre);
			this.fbDb.collection(`/clientes/${NetsolinApp.oapp.nit_empresa}/usuarios`)
			.doc(idusuar).set(objempre);
			// this.usuarFb = ref.valueChanges();
			// this.cargo_usuar = true;
			// console.log(this.usuarFb);
			console.log('no existe crear',idusuar);
			resolve(true);
		}
	});
});
}
//Verifica usuario actual existe como consultor
public VeriConsultorActualFb(idusuar){
	return new Promise( (resolve) => {
		console.log(idusuar);
		const ref: AngularFirestoreDocument<any> = this.fbDb.collection(`consultores`).doc(idusuar);
		ref.get().subscribe(snap => {
			if (snap.exists) {
				console.log('Existe usuario', idusuar);
				// this.fbDb.collection(`/clientes`)
				// .doc(id).update({datosoapp: this.oappNetsolin});
				resolve(true);
			} else {
				console.log('no existe consultor crear',idusuar, NetsolinApp, this.oappNetsolin);
				const objempre = {
					id: NetsolinApp.oapp.cuserid,
					email: this.oappNetsolin.email_usuar,
					nombre: this.oappNetsolin.nomusuar,
					superusuar: this.oappNetsolin.superusuar
				}
				console.log('usuario a crea',idusuar,objempre);
				this.fbDb.collection(`/consultores`)
				.doc(idusuar).set(objempre);
				console.log('no existe crear',idusuar);
				resolve(true);
			}
		});
	});
	
}
      //Se suscribe a empresa para traerla de FB
			public getUsuarFB(Id: string) {
				console.log('en getUsuarFB', Id);
			return this.fbDb
				.collection(`/consultores`)
			 .doc(Id).valueChanges();
			}

						
      //Se suscribe a consultores
			public getConsultoresFB() {
				console.log('en getConsultoresFB');
			return this.fbDb
				.collection(`/consultores`)
			 .valueChanges();
			}			
      //Se suscribe a clientes
			public getClientesFB() {
				console.log('en getClientesFB');
			return this.fbDb
				.collection(`/clientes`)
			 .valueChanges();
			}			

      //Se suscribe a empresa para traerla de FB
			public getNivelescriticidadFB() {
				console.log('en getNivelescriticidadFB');
			return this.fbDb
				.collection(`/parametros/tablas/criticidad`)
			 .valueChanges();
			}			
      //Se suscribe a productos principales
			public getProductosFB() {
				console.log('en getProductosFB');
			return this.fbDb
				.collection(`/parametros/tablas/prodprincipales`)
			 .valueChanges();
			}			
      //Se suscribe a modulos
			public getModulosFB() {
				console.log('en getModulosFB');
			return this.fbDb
				.collection(`/parametros/tablas/modulos`)
			 .valueChanges();
			}			
      //Se suscribe a causales clientes
			public getCausalesclientesFB() {
				console.log('en getCausalesclientesFB');
			return this.fbDb
				.collection(`/parametros/tablas/causalescliente`)
			 .valueChanges();
			}			
      //Se suscribe a causales netsolin
			public getCausalesnetsolinFB() {
				console.log('en getCausalesnetsolinFB');
			return this.fbDb
				.collection(`/parametros/tablas/causalesnetsolin`)
			 .valueChanges();
			}			

			


			public generanumTicket(){
				const now = new Date();
				const dia = now.getDate();
				const mes = now.getMonth() + 1;
				const ano = now.getFullYear();
				const hora = now.getHours();
				const minutos = now.getMinutes();
				const segundos = now.getSeconds();
				const numaleator = Math.round(Math.random() * (1000 - 1999) + 1000);
				const numticket = ano.toString()+ mes.toString() + dia.toString() + hora.toString() + minutos.toString()+ segundos.toString()+numaleator.toString();
				return numticket;			
			}
		public addIncidenteFb(idt, objincidente){
			console.log('addincidente ', idt, objincidente);
			// this.fbDb.collection(`/clientes/${NetsolinApp.oapp.nit_empresa}/incidentes`)
			this.fbDb.collection(`/incidentes`)
			.doc(idt).set(objincidente);
		}
		public addRequerimientoFb(idt, objrequer){
			console.log('addRequerimientoFb ', idt, objrequer);
			this.fbDb.collection(`/requerimientos`)
			.doc(idt).set(objrequer);
		}
		public addCasofrecuenteFb(idt, objcaso){
			this.fbDb.collection(`/casosfrecuentes`)
			.doc(idt).set(objcaso);
		}

		public AntaddArchivoIncidenteFb(pticket,idt, objarch){
			console.log('addArchivoIncidenteFb ', idt, objarch);
			this.fbDb.collection(`/incidentes/${pticket}/archivos`)
			.doc(idt).set(objarch);
		}
		public addArchivoIncidenteFb(pticket,idt, nombre, nomarch, imageURL): Promise<any> {
			console.log('addArchivoIncidenteFb', pticket,idt, nombre, nomarch, imageURL);
			const now = new Date();
			const dia = now.getDate();
			const mes = now.getMonth() + 1;
			const ano = now.getFullYear();
			const hora = now.getHours();
			const minutos = now.getMinutes();
			const segundos = now.getSeconds();
			const idimg = ano.toString()+ mes.toString() + dia.toString() + hora.toString() + minutos.toString()+ segundos.toString();
		
			const storageRef: AngularFireStorageReference = this.afStorage.ref(`/incidentes/${pticket}/archivos/${nomarch}/`);
			// console.log('en actualizafotosVisitafirebase idclie,iddirec: ', idclie, idvisita);
			return storageRef
				.put(imageURL)
				.then(() => {
						console.log('a grabar registro en firebase ');          
					return storageRef.getDownloadURL().subscribe((linkref: any) => {
							console.log(linkref);
							const objarch = {
								id: idt,
								nombre: nombre,
								nomarch: nomarch,
								fecha: new Date(),
								usuarcrea: this.usuarFb.nombre,
								linkarch: linkref
							}
							this.fbDb.collection(`/incidentes/${pticket}/archivos`)
							.doc(idt).set(objarch);				
							// console.log(`/personal/${this._parempre.usuario.cod_usuar}/rutas/
							// ${this._visitas.visita_activa_copvdet.id_ruta}/periodos/${this._visitas.id_periodo}/visitas/${idvisita}/fotos`);
							// this.fbDb
							// // tslint:disable-next-line:max-line-length
							// .collection(`/personal/${this._parempre.usuario.cod_usuar}/rutas/${this._visitas.visita_activa_copvdet.id_ruta}/periodos/${this._visitas.id_periodo}/visitas/${idvisita}/fotos`)
							// .add({link_foto: linkref});
					}); 
			});
		}
		
		public actIncidenteFb(idt, objincidente){
			// console.log('actIncidenteFb ', idt, objincidente);
			// this.fbDb.collection(`/clientes/${NetsolinApp.oapp.nit_empresa}/incidentes`)
			this.fbDb.collection(`/incidentes`)
			.doc(idt).update(objincidente);
		}		
		public actRequerimientoFb(idt, objrequer){
			this.fbDb.collection(`/requerimientos`)
			.doc(idt).update(objrequer);
		}		
		public actCasofrecuenFb(idt, objrequer){
			this.fbDb.collection(`/casosfrecuentes`)
			.doc(idt).update(objrequer);
		}		

		public actArchivoIncidenteFb(pticket,idt, objarch){
			// console.log('actArchivoIncidenteFb ', idt, objarch);
			this.fbDb.collection(`/incidentes/${pticket}/archivos`)
			.doc(idt).update(objarch);
		}			
		public deleteIncidenteFb(idt){
			// console.log('deleteIncidenteFb ', idt);
			this.fbDb.collection(`/incidentes`)
			.doc(idt).delete();
		}		
		public deleteRequerimientoFb(idt){
			this.fbDb.collection(`/requerimientos`)
			.doc(idt).delete();
		}	
		public deleteCasofrecuenFb(idt){
			this.fbDb.collection(`/casosfrecuentes`)
			.doc(idt).delete();
		}	

		public deleteArchivoIncidenteFb(pticket,idt){
			// console.log('deleteArchivoIncidenteFb ', idt);
			this.fbDb.collection(`/incidentes/${pticket}/archivos`)
			.doc(idt).delete();
		}		

		public addArchivoRequerimientoFb(pid,idt, nombre, nomarch, imageURL): Promise<any> {
			console.log('addArchivoRequerimientoFb', pid,idt, nombre, nomarch, imageURL);
			const now = new Date();
			const dia = now.getDate();
			const mes = now.getMonth() + 1;
			const ano = now.getFullYear();
			const hora = now.getHours();
			const minutos = now.getMinutes();
			const segundos = now.getSeconds();
			const idimg = ano.toString()+ mes.toString() + dia.toString() + hora.toString() + minutos.toString()+ segundos.toString();
		
			const storageRef: AngularFireStorageReference = this.afStorage.ref(`/requerimientos/${pid}/archivos/${nomarch}/`);
			return storageRef
				.put(imageURL)
				.then(() => {
						console.log('a grabar registro en firebase ');          
					return storageRef.getDownloadURL().subscribe((linkref: any) => {
							console.log(linkref);
							const objarch = {
								id: idt,
								nombre: nombre,
								nomarch: nomarch,
								fecha: new Date(),
								usuarcrea: this.usuarFb.nombre,
								linkarch: linkref
							}
							this.fbDb.collection(`/requerimientos/${pid}/archivos`)
							.doc(idt).set(objarch);				
					}); 
			});
		}
		public actArchivoRequerimientoFb(pid,idt, objarch){
			this.fbDb.collection(`/requerimientos/${pid}/archivos`)
			.doc(idt).update(objarch);
		}			
		public deleteArchivoRequerimientoFb(pid,idt){
			this.fbDb.collection(`/requerimientos/${pid}/archivos`)
			.doc(idt).delete();
		}				
		public deleteLogIncidenteFb(pticket,idt){
			this.fbDb.collection(`/incidentes/${pticket}/log`)
			.doc(idt).delete();
		}		

		public getCasofrecuentesFB(){
			return this.fbDb
			.collection(`/casosfrecuentes`)
		 .valueChanges()
		 .pipe(
			map(actions =>
				actions.map((a: any) => {
					// console.log(a);
					a.fecha = a.fecha.toDate();
					return a;
				})
			)
		 );
		}
		
		public getIncidentePendientesFB(){
			// .collection(`/clientes/${NetsolinApp.oapp.nit_empresa}/incidentes`
			return this.fbDb
			.collection(`/incidentes`
			,ref => ref.where('solucionado', '==', false)
			.where('reportadoanetsolin', '==', true))
		 .valueChanges()
		 .pipe(
			map(actions =>
				actions.map((a: any) => {
					// console.log(a);
					a.fecha = a.fecha.toDate();
					a.fechaevalua = a.fechaevalua.toDate();
					a.fecharepornetsolin= a.fecharepornetsolin.toDate();
					a.fechasolucionado = a.fechasolucionado.toDate();
					return a;

				})
			)
		 );
		}
		public getIncidenteCerradosFB(){
			// .collection(`/clientes/${NetsolinApp.oapp.nit_empresa}/incidentes`
			return this.fbDb
			.collection(`/incidentes`
			,ref => ref.where('solucionado', '==', true)
			.limit(100))
		 .valueChanges()
		 .pipe(
			map(actions =>
				actions.map((a: any) => {
					// console.log(a);
					a.fecha = a.fecha.toDate();
					a.fechaevalua = a.fechaevalua.toDate();
					a.fecharepornetsolin= a.fecharepornetsolin.toDate();
					a.fechasolucionado = a.fechasolucionado.toDate();
					return a;

				})
			)
		 );
		}

		public grabarincidenteFb(data: any, isNew?: boolean) {
			console.log('save fb ', data, isNew);
			if(isNew){
			 this.fbDb.collection(`/incidentes`)
			 .doc(data.ticket).set(data);
			}else{
			 this.fbDb.collection(`/incidentes`)
			 .doc(data.ticket).update(data);
			}        
	}
	public getRequerimientosPendientesFB(){
		return this.fbDb
		.collection(`/requerimientos`
		,ref => ref.where('entregado', '==', false))
	 .valueChanges()
	 .pipe(
		map(actions =>
			actions.map((a: any) => {
				// console.log(a);
				a.fecha = a.fecha.toDate();
				a.fechaevalua = a.fechaevalua.toDate();
				a.fechaasignado = a.fechaasignado.toDate();				
				a.fechaentregado = a.fechaentregado.toDate();
				return a;

			})
		)
	 );
	}
	public getrequerimientosCerradosFB(){
		return this.fbDb
		.collection(`/requerimientos`
		,ref => ref.where('entregado', '==', true)
		.limit(100))
	 .valueChanges()
	 .pipe(
		map(actions =>
			actions.map((a: any) => {
				// console.log(a);
				a.fecha = a.fecha.toDate();
				a.fechaevalua = a.fechaevalua.toDate();
				a.fechaentregado = a.fechaentregado.toDate();
				return a;

			})
		)
	 );
	}

	public grabarRequerimientoteFb(data: any, isNew?: boolean) {
		console.log('save fb ', data, isNew);
		if(isNew){
		 this.fbDb.collection(`/requerimientos`)
		 .doc(data.ticket).set(data);
		}else{
		 this.fbDb.collection(`/requerimientos`)
		 .doc(data.ticket).update(data);
		}        
}

	public regLogincidenteFb(maninterno: boolean, incidente: any, cliente: boolean, accion: string, seguimiento: string, soluciona: boolean) {
		const now = new Date();
		const dia = now.getDate();
		const mes = now.getMonth() + 1;
		const ano = now.getFullYear();
		const hora = now.getHours();
		const minutos = now.getMinutes();
		const segundos = now.getSeconds();
		const numaleator = Math.round(Math.random() * (1000 - 1999) + 1000);
		const idlog = ano.toString()+ mes.toString() + dia.toString() + hora.toString() + minutos.toString()+ segundos.toString()+numaleator.toString();

		const reglog = {
			id: idlog,
			fecha: now,
			regcliente: cliente,
			maninterno: maninterno,
			accion: accion,			 
			nombrereporta: this.usuarFb.nombre,
			seguimiento: seguimiento,
			soluciona: soluciona
		}
		console.log('save fb ', reglog);
		 this.fbDb.collection(`/incidentes/${incidente.ticket}/log`)
		 .doc(idlog).set(reglog);
}

public regLogRequerimientoFb(maninterno: boolean, requerimiento: any, cliente: boolean, etapa: string, accion: string, seguimiento: string, terminaetapa, entregado: boolean) {
	const now = new Date();
	const dia = now.getDate();
	const mes = now.getMonth() + 1;
	const ano = now.getFullYear();
	const hora = now.getHours();
	const minutos = now.getMinutes();
	const segundos = now.getSeconds();
	const numaleator = Math.round(Math.random() * (1000 - 1999) + 1000);
	const idlog = ano.toString()+ mes.toString() + dia.toString() + hora.toString() + minutos.toString()+ segundos.toString()+numaleator.toString();

	const reglog = {
		id: idlog,
		fecha: now,
		regcliente: cliente,
		maninterno: maninterno,
		etapa: etapa,			 
		terminaetapa: terminaetapa,
		accion: accion,
		nombrereporta: this.usuarFb.nombre,
		seguimiento: seguimiento,
		entregado: entregado
	}
	console.log('save fb ', reglog);
	 this.fbDb.collection(`/requerimientos/${requerimiento.idrequer}/log`)
	 .doc(idlog).set(reglog);
}
public actLogrequerimientoFb(idlog, maninterno: boolean, requer: any, cliente: boolean, accion: string, seguimiento: string, etapa:string, terminaetapa, entregado: boolean) {
	const reglog = {
		regcliente: cliente,
		maninterno: maninterno,
		etapa: etapa,	 
		accion: accion,		
		terminaetapa: terminaetapa,
		nombrereporta: this.usuarFb.nombre,
		seguimiento: seguimiento
	}
	console.log('save fb ', reglog);
	 this.fbDb.collection(`/requerimientos/${requer.idrequer}/log`)
	 .doc(idlog).update(reglog);
}
public deleteLogRequerimientoFb(pidreq,idt){
	this.fbDb.collection(`/requerimientos/${pidreq}/log`)
	.doc(idt).delete();
}		
public regChatincidenteFb(incidente: any, texto: string) {
	//En libreria cliente maninterno siempre en falso ya que solo se maneja en lado de Netsolin
			const now = new Date();
			const dia = now.getDate();
			const mes = now.getMonth() + 1;
			const ano = now.getFullYear();
			const hora = now.getHours();
			const minutos = now.getMinutes();
			const segundos = now.getSeconds();
			const numaleator = Math.round(Math.random() * (1000 - 1999) + 1000);
			const idchat = ano.toString()+ mes.toString() + dia.toString() + hora.toString() + minutos.toString()+ segundos.toString()+numaleator.toString();
	
			const regchat = {
				id: idchat,
				fecha: now,
				cliente: false,
				usuario: this.usuarFb.nombre,
				texto: texto,
				leido: false
			}
			// console.log('save fb ', regchat);
			 this.fbDb.collection(`/incidentes/${incidente.ticket}/chat`)
			 .doc(idchat).set(regchat);
	}
	public regChatrequerimientoFb(requer: any, texto: string) {
		//En libreria cliente maninterno siempre en falso ya que solo se maneja en lado de Netsolin
				const now = new Date();
				const dia = now.getDate();
				const mes = now.getMonth() + 1;
				const ano = now.getFullYear();
				const hora = now.getHours();
				const minutos = now.getMinutes();
				const segundos = now.getSeconds();
				const numaleator = Math.round(Math.random() * (1000 - 1999) + 1000);
				const idchat = ano.toString()+ mes.toString() + dia.toString() + hora.toString() + minutos.toString()+ segundos.toString()+numaleator.toString();
		
				const regchat = {
					id: idchat,
					fecha: now,
					cliente: false,
					usuario: this.usuarFb.nombre,
					texto: texto,
					leido: false
				}
				// console.log('save fb ', regchat);
				 this.fbDb.collection(`/requerimientos/${requer.idrequer}/chat`)
				 .doc(idchat).set(regchat);
		}
	
public actLogincidenteFb(idlog, maninterno: boolean, incidente: any, cliente: boolean, accion: string, seguimiento: string, soluciona: boolean) {

	const reglog = {
		id: idlog,
		regcliente: cliente,
		maninterno: maninterno,
		accion: accion,			 
		nombrereporta: this.usuarFb.nombre,
		seguimiento: seguimiento,
		soluciona: soluciona
	}
	console.log('save fb ', reglog);
	 this.fbDb.collection(`/incidentes/${incidente.ticket}/log`)
	 .doc(idlog).update(reglog);
}


public getLogIncidenteFB(pticket){
	// .collection(`/clientes/${NetsolinApp.oapp.nit_empresa}/incidentes`
	return this.fbDb
	.collection(`/incidentes/${pticket}/log`)
	 .valueChanges()
 	.pipe(
		map(actions =>
			actions.map((a: any) => {
				const fecha = a.fecha.toDate();
				const fechastr = fecha.toLocaleDateString()
				const horastr = fecha.toLocaleTimeString()
				const fechalog = a.fecha.toDate();
				// const dia = now.getDate();
				// const mes = now.getMonth() + 1;
				// const ano = now.getFullYear();
				// const hora = now.getHours();
				// const minutos = now.getMinutes();
				// const segundos = now.getSeconds();
				// const data = a.payload.doc.data();
				// const id = a.payload.doc.id;
				return { fechalog, fechastr, horastr, ...a };
		})
	)
 );
}
public getChatIncidenteFB(pticket){
	return this.fbDb
	.collection(`/incidentes/${pticket}/chat`)
	 .valueChanges()
 	.pipe(
		map(actions =>
			actions.map((a: any) => {
				const fecha = a.fecha.toDate();
				const fechastr = fecha.toLocaleDateString()
				const horastr = fecha.toLocaleTimeString()
				const fechachat = a.fecha.toDate();
				// const dia = now.getDate();
				// const mes = now.getMonth() + 1;
				// const ano = now.getFullYear();
				// const hora = now.getHours();
				// const minutos = now.getMinutes();
				// const segundos = now.getSeconds();
				// const data = a.payload.doc.data();
				// const id = a.payload.doc.id;
				return { fechachat, fechastr, horastr, ...a };
		})
	)
 );
}


public getLogRequerimientoFB(pid){
	return this.fbDb
	.collection(`/requerimientos/${pid}/log`)
	 .valueChanges()
 	.pipe(
		map(actions =>
			actions.map((a: any) => {
				const fecha = a.fecha.toDate();
				const fechastr = fecha.toLocaleDateString()
				const horastr = fecha.toLocaleTimeString()
				const fechalog = a.fecha.toDate();
				return { fechalog, fechastr, horastr, ...a };
		})
	)
 );
}
public getChatRequerimientoFB(pid){
	return this.fbDb
	.collection(`/requerimientos/${pid}/chat`)
	 .valueChanges()
 	.pipe(
		map(actions =>
			actions.map((a: any) => {
				const fecha = a.fecha.toDate();
				const fechastr = fecha.toLocaleDateString()
				const horastr = fecha.toLocaleTimeString()
				const fechachat = a.fecha.toDate();
				return { fechachat, fechastr, horastr, ...a };
		})
	)
 );
}
	}

