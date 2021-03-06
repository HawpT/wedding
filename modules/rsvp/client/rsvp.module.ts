import { NgModule }       from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { HttpModule }     from '@angular/http';
import { NgbModule }      from '@ng-bootstrap/ng-bootstrap';
import { RouterModule, Routes }     from '@angular/router';
import { AppModule }      from '../../app/client/app.module';
import { RsvpRoutingModule }      from './config/rsvp-routing.module';
import { FormsModule } from '@angular/forms';

/* services the module uses */
import { RsvpService } from './services/rsvp.service';


/* import the components this module uses */
import { ListRsvpsComponent } from './components/list-rsvps.component';
import { RsvpFormComponent } from './components/rsvp-form.component';


@NgModule({
  imports:      [
    BrowserModule,
    NgbModule,
    HttpModule,
    RsvpRoutingModule,
    FormsModule

  ],
  /*components available inside of this module */
  declarations: [
    ListRsvpsComponent,
    RsvpFormComponent,
  ],


  providers: [RsvpService]

  
})

export class RsvpModule {}
