import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { WaitingVerificationPage } from './waiting-verification.page';

const routes: Routes = [
  {
    path: '',
    component: WaitingVerificationPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [WaitingVerificationPage]
})
export class WaitingVerificationPageModule {}
