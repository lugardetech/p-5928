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

## Estrutura do Projeto

```
src/
├── components/          # Componentes globais reutilizáveis
│   └── ui/             # Componentes UI base (shadcn)
├── modules/            # Módulos da aplicação
│   ├── products/       # Módulo de produtos
│   │   ├── components/ # Componentes específicos de produtos
│   │   └── pages/      # Páginas do módulo
│   ├── sales/         # Módulo de vendas
│   ├── purchases/     # Módulo de compras
│   ├── returns/       # Módulo de devoluções
│   ├── support/       # Módulo de suporte
│   └── integrations/  # Módulo de integrações
├── lib/               # Utilitários e configurações
└── integrations/      # Integrações com serviços externos
```

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