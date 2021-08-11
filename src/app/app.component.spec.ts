import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { StudentModule } from './student/student.module';
import { ApolloTestingController, ApolloTestingModule } from 'apollo-angular/testing';
import { GraphQlModule } from './graph-ql/graph-ql.module';
import { ApolloTestingModuleCore } from 'apollo-angular/testing/module';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpLink, HttpLinkModule } from 'apollo-angular-link-http';
import { AppRoutingModule } from './app-routing.module';
import { APOLLO_OPTIONS } from 'apollo-angular';
import { InMemoryCache } from '@apollo/client/core';

// let backend: ApolloTestingController;

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        BrowserModule,
        HttpClientModule,
        AppRoutingModule,
        StudentModule,
        BrowserAnimationsModule,
        HttpLinkModule,
        GraphQlModule
      ],
      declarations: [
        AppComponent
      ],
      providers: [
        {
          provide: APOLLO_OPTIONS,
          useFactory: (httpLink: HttpLink) => {
            return {
              cache: new InMemoryCache({ addTypename: true }),
              link: httpLink.create({
                uri: 'http://localhost:3000/graphql',
              }),
            };
          },
          deps: [HttpLink],
        },
      ],
    }).compileComponents();
  });

  // beforeEach(() => {
  //     backend = TestBed.get(ApolloTestingController);
  //   });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'student-ms'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('student-ms');
  });

  // it('should render title', () => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   fixture.detectChanges();
  //   const compiled = fixture.nativeElement as HTMLElement;
  //   expect(compiled.querySelector('.content span')?.textContent).toContain('student-ms app is running!');
  // });
});
