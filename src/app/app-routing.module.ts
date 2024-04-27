import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'animals',
    loadChildren: () =>
      import('./pages/animal-list/animal-list.module').then( m => m.AnimalListPageModule)
  },
  {
    path: 'animals/:id',
    loadChildren: () =>
      import('./pages/animal-detail/animal-detail.module').then( m => m.AnimalDetailPageModule)
  },
  {
    path: '',
    redirectTo: 'animals',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
