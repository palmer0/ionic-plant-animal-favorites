import { Component } from '@angular/core';
import {Platform} from "@ionic/angular";
import {Device} from "@capacitor/device";
//import {SqliteService} from "./services/sqlite.service";
import {DatabaseService} from "./services/database.service";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  public isWeb: boolean;
  public loading: boolean;

  constructor(
    private platform: Platform,
    //private sqlite: SqliteService
    private sqlite: DatabaseService) {

    this.isWeb = false;
    this.loading = false;
    this.initApp();
  }

  initApp(){

    this.platform.ready().then( async () => {

      // Comprobamos si estamos en web
      const info = await Device.getInfo();
      this.isWeb = info.platform == 'web';

      // Iniciamos la base de datos
      this.sqlite.init();

      // Esperamos a que la base de datos este lista
      this.sqlite.dbReady.subscribe(loading => {
        this.loading = loading;
      })
    })

  }
}
