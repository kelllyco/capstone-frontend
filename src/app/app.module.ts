import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SidebarModule } from './shared/sidebar/sidebar.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EffectsModule } from '@ngrx/effects';
import { dashboardReducer } from './dashboard/redux/dashboard.reducer';
import { DashboardEffects } from './dashboard/redux/dashboard.effects';
import { HttpClientModule } from '@angular/common/http';
import { projectReducer } from './project/redux/project.reducer';
import { ProjectEffects } from './project/redux/project.effects';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() }),
    NgbModule,
    SidebarModule,
    HttpClientModule,
    BrowserAnimationsModule,
    StoreModule.forRoot({ dashboardStore: dashboardReducer, projectStore: projectReducer }, {
        runtimeChecks: {
            strictStateImmutability: true, // state in store is never accidentally mutated by app code
            strictActionImmutability: true, // actions cannot be mutated either, important for most dev tools (no good reason to mutate it)
            strictActionSerializability: true, // ensures actions are serializable (ie no date object)
            strictStateSerializability: true // ensures states in store are always serializable (useful when storing state locally)
        }
    }),
    EffectsModule.forRoot([DashboardEffects, ProjectEffects]),
    StoreDevtoolsModule.instrument({ maxAge: 25 }),
],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
