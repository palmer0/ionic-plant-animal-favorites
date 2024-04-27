import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AnimalService } from "../../services/animal.service";
import { Animal } from "../../models/animal.model";
import {DatabaseService} from "../../services/database.service";

@Component({
  selector: "app-animal-detail",
  templateUrl: "./animal-detail.page.html",
  styleUrls: ["./animal-detail.page.scss"],
})
export class AnimalDetailPage implements OnInit {

  animal?: Animal;
  favorite = false;
  favorites: Animal[] = [];

  constructor(
    private route: ActivatedRoute,
    private animalService: AnimalService,
    private sqlite: DatabaseService
  ) {}

  ngOnInit() {
    console.log("ngOnInit");
    //this.getAnimal();
  }

  // Al entrar, leemos la base de datos
  ionViewWillEnter() {
    console.log("ionViewWillEnter");
    this.readFavorites();
  }

  readFavorites() {
    // Leemos los datos de la base de datos
    this.sqlite.read().then((animals: Animal[]) => {
      console.log("readFavorites");
      console.log(JSON.stringify(animals));

      this.favorites = animals;
      this.getAnimal();

    }).catch(err => {
      console.error(err);
    })
  }

  getAnimal(): void {
    const id: string = this.route.snapshot.paramMap.get("id");

    if (id) {
      this.animalService
        .getAnimalById(id)
        .subscribe((animal) => {
          this.animal = animal;
          //this.favorite = animal.favorite;

          let item =
            this.favorites.find(elem => elem.id === animal.id);

          this.favorite = !!item;

          if(this.favorite) console.log("isFavorite");

      });
    }
  }


  createFavorite() {
    // Creamos un elemento en la base de datos
    this.sqlite.create(this.animal)
      .then((changes) => {
        //console.log(changes);
        console.log("createFavorite");

        this.readFavorites(); // Volvemos a leer

      }).catch(err => {
      console.error(err);
    })
  }

  deleteFavorite() {
    // Borramos el elemento
    this.sqlite.delete(this.animal.id)
      .then((changes) => {
        //console.log(changes);
        console.log("deleteFavorite");

        this.readFavorites(); // Volvemos a leer

      }).catch(err => {
      console.error(err);
    })
  }


  toggleFavorite(): void {
    if (this.animal) {
      //this.animal.favorite = this.favorite;
      //this.animalService.toggleFavorite(this.animal);

      if(this.favorite) this.createFavorite();
      else this.deleteFavorite();

    }
  }
}
