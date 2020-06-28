import {
  AngularFireAuthGuard,
  redirectUnauthorizedTo,
} from '@angular/fire/auth-guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BASE, CREATE } from './constants/routes.const';
import { CreateComponent } from './components/create/create.component';
import { FeedComponent } from './components/feed/feed.component';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo([BASE]);

const routes: Routes = [
  {
    path: BASE,
    component: FeedComponent,
    pathMatch: 'full',
  },
  {
    path: CREATE,
    component: CreateComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
