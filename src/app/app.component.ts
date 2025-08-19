import { Component } from '@angular/core';
import { PoMenuItem } from '@po-ui/ng-components';
import  { ProAppConfigService, ProJsToAdvplService, ProtheusLibCoreModule } from '@totvs/protheus-lib-core'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private proAppConfigService: ProAppConfigService) {
    if(!this.proAppConfigService.insideProtheus()) {
      this.proAppConfigService.loadAppConfig();
    }
  }



  readonly menus: Array<PoMenuItem> = [
    { label: 'Sobre', action: this.sobre.bind(this) },
    { label: 'Fechar', action: this.closeApp.bind(this) }
  ];

  private sobre() {
    alert('Sistema de Limpeza de Flags CTG - Desenvolvido com PO-UI e Angular');
  }

  private closeApp() {
    if(this.proAppConfigService.insideProtheus()) {
      this.proAppConfigService.callAppClose();
    } else {
      alert('Aplicação não está dentro do Protheus');
    }
  }

  async ngOnInit() {
    if(this.proAppConfigService.insideProtheus()) {
      const jsToAdvplService = new ProJsToAdvplService();
      jsToAdvplService.jsToAdvpl('loadOpsLibCore', 'true');
    }
  }

}
