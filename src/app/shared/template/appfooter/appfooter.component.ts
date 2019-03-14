import { Component, OnInit } from '@angular/core';
import { NetsolinApp } from '../../global';

@Component({
  selector: 'app-appfooter',
  templateUrl: './appfooter.component.html',
  styleUrls: ['./appfooter.component.css']
})
export class AppfooterComponent implements OnInit {
  objoapp:any;
  cargoini=false;
  today = Date.now();
  constructor() { }

  ngOnInit() {
       this.objoapp=NetsolinApp.oapp;
       this.cargoini=true;
  }

}
