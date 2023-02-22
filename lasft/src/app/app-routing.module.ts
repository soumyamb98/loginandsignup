import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginsComponent } from './logins/logins.component';
import { SignupsComponent } from './signups/signups.component';
import { HomesComponent } from './homes/homes.component';

const routes: Routes = [
  { path: '', component: LoginsComponent },
  { path: 'signup', component: SignupsComponent },
  {path:'user', component:HomesComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
