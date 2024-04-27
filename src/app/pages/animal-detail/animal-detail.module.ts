import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AnimalDetailPageRoutingModule } from './animal-detail-routing.module';

import { AnimalDetailPage } from './animal-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AnimalDetailPageRoutingModule
  ],
  declarations: [AnimalDetailPage]
})
export class AnimalDetailPageModule {}
