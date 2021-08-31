import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StudentModule } from './student/student.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {HttpLinkModule} from 'apollo-angular-link-http';
import { GraphQlModule } from './graph-ql/graph-ql.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    StudentModule,
    BrowserAnimationsModule,
    HttpLinkModule,
    GraphQlModule
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
}
