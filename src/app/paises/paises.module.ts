import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaisesRoutingModule } from './paises-routing.module';
import { SelectorPageComponent } from './pages/selector-page/selector-page.component';
import { OthePageComponent } from './pages/othe-page/othe-page.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    SelectorPageComponent,
    OthePageComponent
  ],
  imports: [
    CommonModule,
    PaisesRoutingModule,
    ReactiveFormsModule     //PARA LOS FORMULARIOS REACTIVOS !..
  ]
})
export class PaisesModule { }
