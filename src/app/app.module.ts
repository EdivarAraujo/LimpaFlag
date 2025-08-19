import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { PoModule } from '@po-ui/ng-components';
import { RouterModule } from '@angular/router';
import { ProtheusLibCoreModule } from '@totvs/protheus-lib-core';
import { PoTemplatesModule } from '@po-ui/ng-templates';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { LimpaFlagCtgComponent } from './components/limpa-flag-ctg/limpa-flag-ctg.component';

@NgModule({
  declarations: [
    AppComponent,
    LimpaFlagCtgComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PoModule,
    RouterModule.forRoot([]),
    ProtheusLibCoreModule,
    PoTemplatesModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
