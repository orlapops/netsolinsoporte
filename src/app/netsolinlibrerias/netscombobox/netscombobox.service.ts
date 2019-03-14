import { Injectable } from '@angular/core';
// import { HttpClient, HttpClientModule } from '@angular/common/http';

import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { catchError, map, tap } from 'rxjs/operators';

import { NetsolinApp } from '../../shared/global';

import { BehaviorSubject } from 'rxjs/Rx';

@Injectable()

export class NetscomboboxService extends BehaviorSubject<any> {
    constructor(private http: HttpClient) {
        super(null);
    }

    public query(objrest:any,pvalor,pcombo): void  {
        // console.log("query");
        // console.log(pvalor);
        // console.log(objrest);
        // console.log(pcombo);
        // console.log("query");
        this.fetch(objrest,pvalor)
            .subscribe(x => {super.next(x);
            // console.log("query x"); 
            // console.log(x); 
            return x});
    }


    private fetch(objrest:any,filtro: any): any {
        // NetsolinApp.objenvrestsolcomobog.tabla = 'CIUDADES';
        // NetsolinApp.objenvrestsolcomobog.orden = '2';
        // NetsolinApp.objenvrestsolcomobog.aplica = 0;
        objrest.filtro = filtro;
        // NetsolinApp.objenvrestsolcomobog.cursor = "Tcursorx";
        // console.log('getch prueba combog objrest filtro');
        // console.log(filtro);
        // console.log('getch prueba combog objrest:');
        // console.log(objrest);

		return this.http.post(NetsolinApp.urlNetsolin + "NetsolComobog.csvc", NetsolinApp.objenvrestsolcomobog)
			.pipe(
			map(resul => {
				console.log('fetch por netsolin resul');
				console.log(resul);
				return resul;
			})
			);
        
    }
}
