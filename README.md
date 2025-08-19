# LIMPA FLAG CTG - Protheus 2.4.10 + PO-UI

## Descrição
Sistema para limpeza de flags CTG (Contabilização) de títulos contabilizados no Protheus 2.4.10, desenvolvido com Angular e PO-UI.

## Funcionalidades
- ✅ Busca de títulos com filtros avançados
- ✅ Visualização de títulos contabilizados
- ✅ Limpeza individual de flags CTG
- ✅ Limpeza em lote de flags CTG
- ✅ Controle de permissões de usuário
- ✅ Interface responsiva com PO-UI
- ✅ Integração completa com ADVPL/Protheus

## Pré-requisitos
- Protheus 2.4.10 ou superior
- Angular 14+
- PO-UI 14+
- Node.js 16+
- npm ou yarn

## Estrutura do Projeto

```
src/
├── app/
│   ├── components/
│   │   └── limpa-flag-ctg/
│   │       ├── limpa-flag-ctg.component.ts
│   │       ├── limpa-flag-ctg.component.html
│   │       └── limpa-flag-ctg.component.css
│   ├── services/
│   │   ├── advpl.service.ts
│   │   └── notification.service.ts
│   └── config/
│       └── protheus.config.ts
├── assets/
│   └── advpl/
│       └── U_LimpaFlagCTG.prw
└── package.json
```

## Instalação

### 1. Dependências do Angular
```bash
npm install
```

### 2. Dependências do PO-UI
```bash
npm install @po-ui/ng-components @po-ui/ng-templates
npm install @totvs/protheus-lib-core
```

### 3. Configuração do Protheus
- Copie o arquivo `U_LimpaFlagCTG.prw` para a pasta de fontes do Protheus
- Compile o fonte no ambiente de desenvolvimento
- Transfira para o ambiente de produção

## Configuração

### 1. Configurações do Protheus
Edite o arquivo `src/app/config/protheus.config.ts`:

```typescript
export const PROTHEUS_CONFIG: ProtheusConfig = {
  ambiente: 'PRODUCAO', // ou 'HOMOLOGACAO', 'DESENVOLVIMENTO'
  servidor: 'seu-servidor',
  porta: 8080,
  empresa: '01',
  filial: '0101',
  usuario: ''
};
```

### 2. Configurações de Tabelas
No arquivo de configuração, ajuste as tabelas conforme seu ambiente:

```typescript
export const FINANCEIRO_CONFIG = {
  tabelas: {
    titulos: 'SE5', // Tabela de títulos a receber
    titulosPagar: 'SE1', // Tabela de títulos a pagar
    // ... outras tabelas
  }
};
```

## Uso

### 1. Executar o Projeto
```bash
ng serve
```

### 2. Acessar a Aplicação
Abra o navegador e acesse: `http://localhost:4200`

### 3. Funcionalidades Disponíveis

#### Busca de Títulos
- Aplique filtros nos campos disponíveis
- Clique em "Buscar Títulos"
- Visualize os resultados na tabela

#### Limpeza Individual
- Selecione um título na tabela
- Clique na ação "Limpar Flag"
- Confirme a operação

#### Limpeza em Lote
- Selecione múltiplos títulos na tabela
- Clique em "Limpar Flags Selecionados"
- Confirme a operação

## Implementação no ADVPL

### 1. Função Principal
A função `U_LimpaFlagCTG()` é o ponto de entrada no ADVPL:

```advpl
User Function LimpaFlagCTG()
    Local aParam := {}
    Local cFuncao := ""
    
    aParam := ParamIxb
    cFuncao := aParam[2]
    
    // Executa função específica
    Do Case
        Case cFuncao == "BuscarTitulos"
            // Busca títulos
        Case cFuncao == "LimparFlag"
            // Limpa flag individual
        // ... outras funções
    EndCase
    
Return .T.
```

### 2. Funções de Busca
A função `BuscarTitulos()` executa queries SQL para buscar títulos:

```advpl
Static Function BuscarTitulos(aFiltros)
    Local cQuery := ""
    
    cQuery := "SELECT E5_FILIAL, E5_PREFIXO, E5_NUM, E5_PARCELA, "
    cQuery += "E5_TIPO, E5_NATUREZ, E5_CLIENTE, E5_LOJA, "
    cQuery += "E5_EMISSAO, E5_VENCTO, E5_VALOR, E5_CTG "
    cQuery += "FROM " + RetSqlName("SE5") + " SE5 "
    cQuery += "WHERE SE5.D_E_L_E_T_ = ' ' "
    cQuery += "AND E5_CTG = 'S'"
    
    // Executa query e retorna resultados
Return aTitulos
```

### 3. Funções de Limpeza
A função `LimparFlag()` atualiza os registros na tabela SE5:

```advpl
Static Function LimparFlag(aTitulo)
    // Posiciona no registro
    If SE5->(DbSeek(cFilial + cPrefixo + cNumero + cParcela))
        RecLock("SE5", .F.)
        
        // Limpa flag CTG
        SE5->E5_CTG := "N"
        SE5->E5_DTCONT := CToD("")
        SE5->E5_USUARIO := ""
        
        MsUnlock()
    EndIf
    
Return lRetorno
```

## Segurança e Permissões

### 1. Controle de Acesso
Implemente o controle de permissões na função `VerificaPermissaoUsuario()`:

```advpl
Static Function VerificaPermissaoUsuario(cUsuario, cPermissao)
    Local lRetorno := .F.
    
    // Implemente sua lógica de verificação
    // Pode ser baseada em tabelas de permissões
    // Grupos de usuários, etc.
    
Return lRetorno
```

### 2. Logs de Auditoria
Adicione logs para auditoria das operações:

```advpl
// No início da função LimparFlag
ConOut("Usuário " + UsrRetName(RetCodUsr()) + " limpou flag CTG do título " + cPrefixo + cNumero + "-" + cParcela)
```

## Personalizações

### 1. Novos Filtros
Para adicionar novos filtros:

1. Adicione o campo no HTML
2. Atualize a interface `FiltrosBusca`
3. Modifique a função `BuscarTitulos` no ADVPL

### 2. Novas Ações
Para adicionar novas ações:

1. Crie a função no ADVPL
2. Adicione o case na função principal
3. Implemente a chamada no serviço Angular

### 3. Novas Tabelas
Para trabalhar com outras tabelas:

1. Atualize as configurações em `protheus.config.ts`
2. Modifique as queries no ADVPL
3. Ajuste as interfaces TypeScript

## Troubleshooting

### 1. Erro de Comunicação
- Verifique se o Protheus está rodando
- Confirme as configurações de servidor e porta
- Verifique se o fonte foi compilado corretamente

### 2. Erro de Permissão
- Verifique se o usuário tem acesso à funcionalidade
- Confirme as configurações de permissões no ADVPL
- Verifique se o grupo de usuário está correto

### 3. Erro de Tabela
- Confirme se as tabelas existem no ambiente
- Verifique se os campos estão corretos
- Confirme se os índices estão criados

## Suporte

Para suporte técnico:
- Consulte a documentação do Protheus
- Verifique os logs do sistema
- Entre em contato com a equipe de desenvolvimento

## Versão
- **Versão Atual**: 1.0.0
- **Última Atualização**: Janeiro 2025
- **Compatibilidade**: Protheus 2.4.10+
- **Angular**: 14+
- **PO-UI**: 14+
