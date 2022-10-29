import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

import { environment } from '@environments/environment';
import { ApiService } from '@service/api.service';
import { AuthInterceptor } from '@service/authconfig.interceptor';
import { ErrorInterceptor } from '@service/error.interceptor';
import { AppRoutingModule } from './app-routing.module';

import { AdminDashboardComponent } from '@components/admin-dashboard/admin-dashboard.component';
import { AdminReportsComponent } from '@components/admin-reports/admin-reports.component';
import { AdminUsersComponent } from '@components/admin-users/admin-users.component';
import { AppComponent } from './app.component';
import { ContactComponent } from '@components/contact/contact.component';
import { CalendarComponent } from '@components/calendar/calendar.component';
import { DataViewerComponent } from '@components/data-viewer/data-viewer.component';
import { GalleryComponent } from '@components/gallery/gallery.component';
import { HomeComponent } from '@components/home/home.component';
import { LoginComponent } from '@components/login/login.component';
import { RegisterComponent } from '@app/components/register/register.component';
import { UserProfileComponent } from '@components/user-profile/user-profile.component';
import { RoleCreateComponent } from '@components/role-create/role-create.component';
import { RoleEditComponent } from '@components/role-edit/role-edit.component';
import { RoleListComponent } from '@components/role-list/role-list.component';
import { UserEditComponent } from '@components/user-edit/user-edit.component';
import { FileUploadComponent } from '@components/file-upload/file-upload.component';
import { ProgressComponent } from '@components/progress/progress.component';
import { TestFormComponent } from '@components/test/test-form/test-form.component';
import { UserViewComponent } from '@components/user-view/user-view.component';
import { PasswordResetComponent } from '@components/password-reset/password-reset.component';
import { UserVerifyComponent } from '@components/user-verify/user-verify.component';
import { PasswordResetCreateComponent } from '@components/password-reset-create/password-reset-create.component';
import { RsvpListComponent } from '@components/rsvp/rsvp-list/rsvp-list.component';
import { RsvpEditComponent } from '@components/rsvp/rsvp-edit/rsvp-edit.component';
import { RsvpCreateComponent } from '@components/rsvp/rsvp-create/rsvp-create.component';
import { RegistrationCodeListComponent } from '@components/registration-code/registration-code-list/registration-code-list.component';
import { RegistrationCodeCreateComponent } from '@components/registration-code/registration-code-create/registration-code-create.component';
import { InfoComponent } from '@components/info/info.component';
import { ScheduleComponent } from '@components/schedule/schedule.component';
import { RsvpReportComponent } from '@components/rsvp/rsvp-report/rsvp-report.component';

import { FocusInvalidInputDirective } from '@directives/focus-invalid-input.directive';
import { SwipeDirective } from '@directives/swipe.directive';

@NgModule({
  declarations: [
    AppComponent,
    DataViewerComponent,
    HomeComponent,
    ContactComponent,
    CalendarComponent,
    GalleryComponent,
    LoginComponent,
    RegisterComponent,
    UserProfileComponent,
    AdminDashboardComponent,
    AdminReportsComponent,
    AdminUsersComponent,
    RoleCreateComponent,
    RoleEditComponent,
    RoleListComponent,
    UserEditComponent,
    FocusInvalidInputDirective,
    FileUploadComponent,
    ProgressComponent,
    TestFormComponent,
    UserViewComponent,
    PasswordResetComponent,
    UserVerifyComponent,
    PasswordResetCreateComponent,
    RsvpListComponent,
    RsvpEditComponent,
    RsvpCreateComponent,
    RegistrationCodeListComponent,
    RegistrationCodeCreateComponent,
    InfoComponent,
    ScheduleComponent,
    RsvpReportComponent,
    SwipeDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    ToastrModule.forRoot({
      timeOut: 10000,
      preventDuplicates: true,
    })
  ],
  providers: [
    ApiService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
