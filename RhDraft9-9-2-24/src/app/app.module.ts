import { CUSTOM_ELEMENTS_SCHEMA,NgModule } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { SafeUrlPipe } from '../pipes/safe-url.pipe';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { DirectivesModule } from '../directives/directives.module';
import { NavbarComponent } from './navbar/navbar.component';
import { ServicesComponent } from './services/services.component';
import { LoaderComponent } from './loader/loader.component';
import { LoaderService } from './loader.service';
import { ReelsComponent } from './reels/reels.component';
import { AdminReelsPageComponent } from './admin-reels-page/admin-reels-page.component';
import { ReelsDetailsComponent } from './reels-details/reels-details.component';
import { VfxComponent } from './vfx/vfx.component';
import { AdminComponent } from './admin/admin.component';
import { VfxAdminComponent } from './vfx-admin/vfx-admin.component';
import { ProjectsComponent } from './projects/projects.component';

@NgModule({
  declarations: [
    SafeUrlPipe,
    AppComponent,
    HomeComponent,
    NavbarComponent,
    ServicesComponent,
    LoaderComponent,
    ReelsComponent,
    AdminReelsPageComponent,
    ReelsDetailsComponent,
    VfxComponent,
    VfxAdminComponent,
    AdminComponent,
    ProjectsComponent, 
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    DirectivesModule,
    ],
  providers: [ provideHttpClient(withInterceptorsFromDi()),LoaderService],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
