import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@service/auth.guard';

import { AdminDashboardComponent } from '@components/admin-dashboard/admin-dashboard.component';
import { AdminReportsComponent } from '@components/admin-reports/admin-reports.component';
import { AdminUsersComponent } from '@components/admin-users/admin-users.component';
import { ContactComponent } from '@components/contact/contact.component';
import { CalendarComponent } from '@components/calendar/calendar.component';
import { GalleryComponent } from '@components/gallery/gallery.component';
import { HomeComponent } from '@components/home/home.component';
import { LoginComponent } from '@components/login/login.component';
import { RegisterComponent } from '@app/components/register/register.component';
import { RoleCreateComponent } from '@components/role-create/role-create.component';
import { RoleEditComponent } from '@components/role-edit/role-edit.component';
import { RoleListComponent } from '@components/role-list/role-list.component';
import { UserProfileComponent } from '@components/user-profile/user-profile.component';
import { UserEditComponent } from '@components/user-edit/user-edit.component';
import { TestFormComponent } from '@components/test/test-form/test-form.component';
import { PasswordResetComponent } from '@components/password-reset/password-reset.component';
import { UserVerifyComponent } from '@components/user-verify/user-verify.component';
import { PasswordResetCreateComponent } from '@components/password-reset-create/password-reset-create.component';
import { RsvpCreateComponent } from '@components/rsvp/rsvp-create/rsvp-create.component';
import { RsvpEditComponent } from '@components/rsvp/rsvp-edit/rsvp-edit.component';
import { RsvpListComponent } from '@components/rsvp/rsvp-list/rsvp-list.component';
import { RegistrationCodeCreateComponent } from '@components/registration-code/registration-code-create/registration-code-create.component';
import { RegistrationCodeListComponent } from '@components/registration-code/registration-code-list/registration-code-list.component';
import { InfoComponent } from '@components/info/info.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'admin', pathMatch: 'full', component: AdminDashboardComponent, canActivate: [AuthGuard] },
  { path: 'admin/test', component: TestFormComponent, canActivate: [AuthGuard] },
  { path: 'admin/dashboard', component: AdminDashboardComponent, canActivate: [AuthGuard] },
  { path: 'admin/reports', component: AdminReportsComponent, canActivate: [AuthGuard] },
  { path: 'admin/users', component: AdminUsersComponent, canActivate: [AuthGuard] },
  { path: 'contact', component: ContactComponent },
  { path: 'calendar', component: CalendarComponent },
  { path: 'info', component: InfoComponent },
  { path: 'registration-code', pathMatch: 'full', component: RegistrationCodeCreateComponent, canActivate: [AuthGuard] },
  { path: 'registration-code/create', component: RegistrationCodeCreateComponent, canActivate: [AuthGuard] },
  { path: 'registration-code/list', component: RegistrationCodeListComponent, canActivate: [AuthGuard] },
  { path: 'rsvp', pathMatch: 'full', component: RsvpCreateComponent, canActivate: [AuthGuard] },
  { path: 'rsvp/create', component: RsvpCreateComponent, canActivate: [AuthGuard] },
  { path: 'rsvp/edit', component: RsvpEditComponent, canActivate: [AuthGuard] },
  { path: 'rsvp/edit/:id', component: RsvpEditComponent, canActivate: [AuthGuard] },
  { path: 'rsvp/list', component: RsvpListComponent, canActivate: [AuthGuard] },
  { path: 'gallery', component: GalleryComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'role', pathMatch: 'full', component: RoleCreateComponent, canActivate: [AuthGuard] },
  { path: 'role/create', component: RoleCreateComponent, canActivate: [AuthGuard] },
  { path: 'role/edit/:id', component: RoleEditComponent, canActivate: [AuthGuard] },
  { path: 'role/list', component: RoleListComponent, canActivate: [AuthGuard] },
  { path: 'user/all', component: AdminUsersComponent, canActivate: [AuthGuard] },
  { path: 'user/edit', component: UserEditComponent, canActivate: [AuthGuard] },
  { path: 'user/edit/:id', component: UserEditComponent, canActivate: [AuthGuard] },
  { path: 'user/profile', component: UserProfileComponent, canActivate: [AuthGuard] },
  { path: 'user/profile/:id', component: UserProfileComponent, canActivate: [AuthGuard] },
  { path: 'user/verify', component: UserVerifyComponent },
  { path: 'password-reset', component: PasswordResetComponent },
  { path: 'password-reset-create', component: PasswordResetCreateComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
