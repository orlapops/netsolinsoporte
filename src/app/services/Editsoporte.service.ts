import { Injectable } from '@angular/core';
   import { Observable } from 'rxjs/Observable';
   import { AngularFireDatabase } from '@angular/fire/database';
import { Incidente } from '../modulos/soporte/modeldatoincidente';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';

   @Injectable()
   export class EditService{
       constructor(public db: AngularFireDatabase,
        private fbDb: AngularFirestore
        ) {}

        public grabarFb(data: any, isNew?: boolean) {
            console.log('save fb ', data, isNew);
            if(isNew){
             this.fbDb.collection(`/incidentes`)
             .doc(data.ticket).set(data);
            }else{
             this.fbDb.collection(`/incidentes`)
             .doc(data.ticket).update(data);
            }        
        }
 
       public read() {
        //    if (this.data.length) {
        //        return super.next(this.data);
        //    }
   
        //    this.fetch()
        //        .pipe(
        //            tap(data => {
        //                this.data = data;
        //            })
        //        )
        //        .subscribe(data => {
        //            super.next(data);
        //        });
       }
   
       public get(): Observable<any>{
           return this.db.list('products').valueChanges();
       }


       public remove(data: any) {
           this.db.database.ref('products/' + data.key).remove();
       }

       public resetData(){
           this.db.database.ref('/').set(Incidente);
       }
   }