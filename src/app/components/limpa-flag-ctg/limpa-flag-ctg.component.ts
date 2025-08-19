import { Component, OnInit } from '@angular/core';
import { PoTableColumn, PoTableAction, PoPageAction, PoNotificationService } from '@po-ui/ng-components';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-limpa-flag-ctg',
  templateUrl: './limpa-flag-ctg.component.html',
  styleUrls: ['./limpa-flag-ctg.component.css']
})
export class LimpaFlagCtgComponent implements OnInit {

  // Campos de busca
  filtros: any = {
    E1_FILIAL: '',
    E1_PREFIXO: '',
    E1_NUM: '',
    E1_PARCELA: '',
    E1_TIPO: '',
    E1_NATUREZ: '',
    E1_CLIENTE: '',
    E1_NOMCLI: '',
    E1_LOJA: '',
    E1_EMISSAO: '',
    E1_VENCREA: '',
    E1_VALOR: ''
  };

  // Dados da tabela
  titulos: Array<any> = [];
  titulosSelecionados: Array<any> = [];

  // Colunas da tabela
  readonly columns: Array<PoTableColumn> = [
    { property: 'filial', label: 'Filial', width: '8%' },
    { property: 'prefixo', label: 'Prefixo', width: '8%' },
    { property: 'numero', label: 'Número', width: '10%' },
    { property: 'parcela', label: 'Parcela', width: '8%' },
    { property: 'tipo', label: 'Tipo', width: '8%' },
    { property: 'natureza', label: 'Natureza', width: '10%' },
    { property: 'cliente', label: 'Cliente', width: '10%' },
    { property: 'nomeCliente', label: 'Nome Cliente', width: '20%' },
    { property: 'loja', label: 'Loja', width: '8%' },
    { property: 'dataEmissao', label: 'Data Emissao', width: '10%', type: 'date' },
    { property: 'vencimentoReal', label: 'Vencimento Real', width: '10%', type: 'date' },
    { property: 'valor', label: 'Valor', width: '10%', type: 'currency', format: 'BRL' }
  ];

  // Ações da tabela
  readonly tableActions: Array<PoTableAction> = [
    { label: 'Limpar Flag', action: this.limparFlag.bind(this), icon: 'po-icon-delete' }
  ];

  // Ações da página
  readonly pageActions: Array<PoPageAction> = [
    { label: 'Buscar', action: this.buscarTitulos.bind(this), icon: 'po-icon-search' },
    { label: 'Limpar Filtros', action: this.limparFiltros.bind(this), icon: 'po-icon-refresh' },
    { label: 'Limpar Flags Selecionados', action: this.limparFlagsSelecionados.bind(this), icon: 'po-icon-delete', disabled: () => this.titulosSelecionados.length === 0 }
  ];

  constructor(private poNotification: PoNotificationService, private http: HttpClient) {}

  ngOnInit(): void {
    this.buscarTitulos();
  }

  // Busca títulos baseado nos filtros
  buscarTitulos(): void {
    const username = 'admin'; // usuário cadastrado no Protheus
    const password = '9682';   // senha desse usuário
    const basicAuth = btoa(`${username}:${password}`);

    // Envia apenas filtros preenchidos para evitar erro de array out of bounds
    const filtrosLimpos: any = {};
    Object.keys(this.filtros).forEach(key => {
      if (this.filtros[key]) {
        filtrosLimpos[key] = this.filtros[key];
      }
    });

    this.http.get<any>(
      'http://localhost:8084/rest/GETLISTATITULOS',
      {
        params: filtrosLimpos,
        headers: { Authorization: `Basic ${basicAuth}` }
      }
    ).subscribe({
      next: (data) => {
        console.log('Dados recebidos:', data);
        if (Array.isArray(data.items)) {
          this.titulos = data.items;
          } else if (data.items) {
          this.titulos = [data.items];
          } else if (data.retorno) {
          this.titulos = [data.retorno];
          } else {
          this.titulos = [];
          }
        this.poNotification.success('Busca realizada com sucesso!');
      },
      error: () => {
        this.poNotification.error('Erro ao buscar dados do Protheus.');
      }
    });
  }

  // Limpa todos os filtros
  limparFiltros(): void {
    this.filtros = {
      E1_FILIAL: '',
      E1_PREFIXO: '',
      E1_NUM: '',
      E1_PARCELA: '',
      E1_TIPO: '',
      E1_NATUREZ: '',
      E1_CLIENTE: '',
      E1_NOMCLI: '',
      E1_LOJA: '',
      E1_EMISSAO: '',
      E1_VENCREA: '',
      E1_VALOR: ''
    };
    this.buscarTitulos();
  }

  // Limpa flag de um título específico
  limparFlag(titulo: any): void {
    if (confirm(`Deseja realmente limpar a flag do título ${titulo.e1_num}?`)) {
      // Aqui você implementaria a lógica real de limpeza de flag
      this.poNotification.success(`Flag do título ${titulo.e1_num} foi limpa com sucesso!`);
      // Remove o título da lista após limpeza
      this.titulos = this.titulos.filter(t => t !== titulo);
    }
  }

  // Limpa flags de todos os títulos selecionados
  limparFlagsSelecionados(): void {
    if (this.titulosSelecionados.length === 0) {
      this.poNotification.warning('Selecione pelo menos um título para limpar a flag.');
      return;
    }

    if (confirm(`Deseja realmente limpar as flags de ${this.titulosSelecionados.length} título(s)?`)) {
      // Aqui você implementaria a lógica real de limpeza em lote
      this.poNotification.success(`${this.titulosSelecionados.length} flag(s) foram limpas com sucesso!`);
      // Remove os títulos selecionados da lista
      this.titulos = this.titulos.filter(titulo =>
        !this.titulosSelecionados.some(selecionado => selecionado.e1_num === titulo.e1_num)
      );
      this.titulosSelecionados = [];
    }
  }

  // Manipula seleção de títulos na tabela
  onSelectionChange(titulos: Array<any>): void {
    this.titulosSelecionados = titulos;
  }
}
