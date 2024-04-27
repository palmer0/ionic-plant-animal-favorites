import { Injectable } from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from "@angular/fire/compat/firestore";
import { Plant } from "../models/plant.model";

@Injectable({
  providedIn: "root",
})
export class PlantService {

  private plantsCollection: AngularFirestoreCollection<Plant>;

  constructor(private afs: AngularFirestore) {
    this.plantsCollection = afs.collection<Plant>("plants");
  }

  getAllPlants() {
    return this.plantsCollection.valueChanges({ idField: "id" });
  }

  getPlantById(plantId: string) {
    return this.afs
      .doc<Plant>(`plants/${plantId}`)
      .valueChanges({ idField: "id" });
  }

  toggleFavorite(plant: Plant) {
    plant.favorite = !plant.favorite;
    this.afs.doc<Plant>(`plants/${plant.id}`).update(plant);
  }
}
