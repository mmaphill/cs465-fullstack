import { Routes } from '@angular/router';
import { AddTripComponent } from './add-trip/add-trip';
import { TripListingComponent } from './trip-listing/trip-listing';
import { EditTripComponent } from './edit-trip/edit-trip';
import { LoginComponent } from './login/login';
import { RegisterComponent } from './register/register';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  { path: '', component: TripListingComponent, pathMatch: 'full', canActivate: [AuthGuard] },
  { path: 'add-trip', component: AddTripComponent, canActivate: [AuthGuard] },
  { path: 'edit-trip', component: EditTripComponent, canActivate: [AuthGuard] },

  { path: '**', redirectTo: 'login' }
];
