// import { Injectable } from '@angular/core';
// import { Http, Response, Headers } from '@angular/http';
// import 'rxjs/add/operator/map';
// import { Observable } from 'rxjs';
// import { NetsolinApp } from '../../netsolin/global';


import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { catchError, map, tap } from 'rxjs/operators';
import { NetsolinApp } from '../../shared/global';

// import { BehaviorSubject } from 'rxjs/Rx';
import { BehaviorSubject } from "rxjs/BehaviorSubject";
@Injectable()

export class NetscombogService extends BehaviorSubject<any> {
	constructor(private http: HttpClient) {
		// console.log(' constructor servico.ts ');  	
		super(null);
	}

	public query(objrest): void {
		// console.log("NetscombogService query");
		this.getItemsSg(objrest)
			.subscribe(x => super.next(x));
	}

	getItemsSg(objrest): Observable<any> {
		// console.log('getItemsSg NetsolinApp.objenvrestsolcomobog llama NetsolComobog');
		// console.log(objrest);
		// return this.http.post(NetsolinApp.urlNetsolin + "listacuentas.csvc",NetsolinApp.objenvrest)
		return this.http.post(NetsolinApp.urlNetsolin + "NetsolComobog.csvc", objrest)
			.pipe(
			map(resul => {
				// console.log('getItemsSg resul objrest.tabla'+objrest.tabla);
				// console.log(resul);
				return resul;
			})
			);
	}

	getRegSg(objrest): Observable<any> {
		// console.log('netsolinoapp getregsg llama nets_v_exi_ref');
		// console.log('NetsolinApp.objenvrestsolcomobog');
		// console.log(NetsolinApp.objenvrestsolcomobog);
		// console.log(NetsolinApp);
		// return this.http.post(NetsolinApp.urlNetsolin + "listacuentas.csvc",NetsolinApp.objenvrest)
		return this.http.post(NetsolinApp.urlNetsolin + "nets_v_exi_ref.csvc", objrest)
			.pipe(
			map(resul => {
				// console.log('getRegSg resul');
				// console.log(resul);
				return resul;
			})
			);
	}

}