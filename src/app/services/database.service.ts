import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Device} from "@capacitor/device";
import {
  CapacitorSQLite, capSQLiteChanges, capSQLiteValues, JsonSQLite
} from "@capacitor-community/sqlite";
import {Preferences} from "@capacitor/preferences";
import {Animal} from "../models/animal.model";

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {


  // Atributos

  // Observable para comprobar si la base de datos esta lista
  public dbReady: BehaviorSubject<boolean>;
  // Indica si estamos en web
  public isWeb: boolean;
  // Indica si estamos en IOS
  public isIOS: boolean;
  // Nombre de la base de datos
  public dbName: string;

  constructor(
    private http: HttpClient
  ) {
    this.dbReady = new BehaviorSubject(false);
    this.isWeb = false;
    this.isIOS = false;
    this.dbName = '';
  }

  async init() {

    const info = await Device.getInfo();
    // CapacitorSQLite no tiene disponible el metodo requestPermissions
    // pero si existe y es llamable
    const sqlite = CapacitorSQLite as any;

    // Si estamos en android, pedimos permiso
    if (info.platform == 'android') {
      try {
        await sqlite.requestPermissions();
      } catch (error) {
        console.error("Esta app necesita permisos para funcionar")
      }

      // Si estamos en web, iniciamos la web store
    } else if (info.platform == 'web') {
      this.isWeb = true;
      await sqlite.initWebStore();

    } else if (info.platform == 'ios') {
      this.isIOS = true;
    }

    // Arrancamos la base de datos
    this.setupDatabase();

  }

  async setupDatabase() {

    // Obtenemos si ya hemos creado la base de datos
    const dbSetup = await Preferences.get({key: 'first_setup'})

    // Sino la hemos creado, descargamos y creamos la base de datos
    if (!dbSetup.value) {
      this.downloadDatabase();

    } else {
      // Nos volvemos a conectar
      this.dbName = await this.getDbName();
      await CapacitorSQLite.createConnection({database: this.dbName});
      await CapacitorSQLite.open({database: this.dbName})
      this.dbReady.next(true);
    }


  }

  downloadDatabase() {

    // Obtenemos el fichero assets/db/db.json
    this.http.get('assets/db/favorites.json')
      .subscribe(async (jsonExport: JsonSQLite) => {


        const jsonstring = JSON.stringify(jsonExport);
        // Validamos el objeto
        const isValid =
          await CapacitorSQLite.isJsonValid({jsonstring});

        // Si es valido
        if (isValid.result) {

          // Obtengo el nombre de la base de datos
          this.dbName = jsonExport.database;
          // Lo importo a la base de datos
          await CapacitorSQLite.importFromJson({jsonstring});
          // Creo y abro una conexion a sqlite
          await CapacitorSQLite.createConnection({database: this.dbName});
          await CapacitorSQLite.open({database: this.dbName})

          // Marco que ya hemos descargado la base de datos
          await Preferences.set({key: 'first_setup', value: '1'})
          // Guardo el nombre de la base de datos
          await Preferences.set({key: 'db_name', value: this.dbName})

          // Indico que la base de datos esta lista
          this.dbReady.next(true);

        }

      })

  }

  async getDbName() {

    if (!this.dbName) {
      const dbname = await Preferences.get({key: 'db_name'})
      if (dbname.value) {
        this.dbName = dbname.value
      }
    }
    return this.dbName;
  }

  async create(animal: Animal) {
    // Sentencia para insertar un registro
    let sql =
      'insert into animals(id, name, description, imageUrl) VALUES(?, ?, ?, ?)';
    // Obtengo la base de datos
    const dbName = await this.getDbName();

    // Ejecutamos la sentencia
    return CapacitorSQLite.executeSet({
      database: dbName,
      set: [
        {
          statement: sql,
          values: [
            animal.id,
            animal.name,
            animal.description,
            animal.imageUrl
          ]
        }
      ]
    }).then((changes: capSQLiteChanges) => {

      // Si es web, debemos guardar el cambio en la webstore manualmente
      if (this.isWeb) {
        CapacitorSQLite.saveToStore({database: dbName});
      }
      return changes;
    }).catch(err => Promise.reject(err))
  }

  async read() {
    // Sentencia para leer todos los registros
    let sql = 'SELECT * FROM animals';
    // Obtengo la base de datos
    const dbName = await this.getDbName();

    // Ejecutamos la sentencia
    return CapacitorSQLite.query({
      database: dbName,
      statement: sql,
      values: [] // necesario para android
    }).then((response: capSQLiteValues) => {
      let animals: Animal[] = [];

      // Si es IOS y hay datos, elimino la primera fila
      // Esto se debe a que la primera fila es informacion de las tablas
      if (this.isIOS && response.values.length > 0) {
        response.values.shift();
      }

      // recorremos los datos
      for (let index = 0; index < response.values.length; index++) {
        const animal = response.values[index];
        animals.push(animal);
      }
      return animals;

    }).catch(err => Promise.reject(err))
  }


  async delete(id: string) {
    // Sentencia para eliminar un registro
    let sql = 'DELETE FROM animals WHERE id=?';
    // Obtengo la base de datos
    const dbName = await this.getDbName();

    // Ejecutamos la sentencia
    return CapacitorSQLite.executeSet({
      database: dbName,
      set: [
        {
          statement: sql,
          values: [
            id
          ]
        }
      ]
    }).then((changes: capSQLiteChanges) => {

      // Si es web, debemos guardar el cambio en la webstore manualmente
      if (this.isWeb) {
        CapacitorSQLite.saveToStore({database: dbName});
      }
      return changes;
    }).catch(err => Promise.reject(err))
  }


}
