# Sistema de Gestão Empresarial

## Visão Geral

Este é um sistema de gestão empresarial desenvolvido com tecnologias modernas para auxiliar no controle de produtos, vendas, estoque e integrações com sistemas externos.

## Tecnologias Utilizadas

- **Frontend**:
  - React com TypeScript
  - Vite para build e desenvolvimento
  - Tailwind CSS para estilização
  - Shadcn/ui para componentes de interface
  - React Query para gerenciamento de estado e cache
  - React Router para navegação

- **Backend**:
  - Supabase para autenticação e banco de dados
  - PostgreSQL como banco de dados
  - Edge Functions para lógica serverless

## Diretrizes de Layout

### Estrutura de Páginas
- Cabeçalho com título (text-2xl font-bold text-primary)
- Subtítulo descritivo (text-sm text-muted-foreground)
- Card principal com padding consistente (p-6)
- Espaçamento vertical entre seções (space-y-8)

### Tabelas
1. **Container**
   - Usar Card do Shadcn como wrapper
   - Padding: p-6
   - Borda arredondada: rounded-lg
   - Sombra suave: shadow-sm

2. **Barra de Ações**
   - Layout flexbox com justify-between
   - Filtros à esquerda
   - Botões de ação à direita
   - Espaçamento: gap-4
   - Margem inferior: mb-4

3. **Componentes de Filtro**
   - Input de busca: max-w-sm
   - Selects: w-[180px]
   - DatePickers: w-[180px]
   - Gap entre filtros: gap-2

4. **DataTable**
   - Cabeçalhos: font-medium text-muted-foreground
   - Células: text-sm
   - Altura das linhas: h-12
   - Hover: hover:bg-muted/50

5. **Paginação**
   - Margem superior: mt-4
   - Botões: size="sm"
   - Texto: text-sm text-muted-foreground

### Estados
- Loading: Usar Skeleton
- Estado vazio: Mensagem centralizada
- Erros: Toast com variant="destructive"

### Organização de Código
```
src/
  components/
    tables/
      [entidade]/
        index.tsx        # Componente principal
        columns.tsx      # Definição das colunas
        types.ts         # Tipos e interfaces
        components/      # Componentes específicos
```

## Funcionalidades Principais

- Gestão de Produtos
  - Cadastro e edição de produtos
  - Controle de estoque
  - Categorização
  - Upload de imagens

- Gestão de Vendas
  - Registro de pedidos
  - Acompanhamento de status
  - Histórico de vendas

- Integrações
  - Tiny ERP
  - Outros sistemas via API

## Como Executar o Projeto

1. **Instalação das Dependências**:
```bash
npm install
```

2. **Executar em Desenvolvimento**:
```bash
npm run dev
```

3. **Build para Produção**:
```bash
npm run build
```

## Contribuição

Para contribuir com o projeto:

1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Faça commit das mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Faça push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## Suporte

Em caso de dúvidas ou problemas, abra uma issue no repositório ou entre em contato com a equipe de desenvolvimento.

## Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.