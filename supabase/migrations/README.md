# Esquema do Banco de Dados

## Visão Geral
O esquema foi projetado para suportar um sistema de gestão de e-commerce com múltiplas integrações, focando em escalabilidade e flexibilidade.

## Tabelas Principais

### Profiles
- Extensão da tabela `auth.users` do Supabase
- Armazena informações adicionais dos usuários
- Campos: nome, avatar, timestamps

### Companies
- Empresas/organizações do sistema
- Campos: nome, documento, contato, endereço, configurações
- Relacionamento 1:N com a maioria das outras tabelas

### Integrations
- Integrações com plataformas externas (Tiny ERP, Mercado Livre, etc)
- Armazena tokens de acesso e configurações
- Campos para gerenciamento de OAuth2

### Products
- Produtos base do sistema
- Campos: SKU, nome, descrição, preço, custo, estoque
- Suporte a categorização e metadados
- Relacionamento com variações

### Product Categories
- Categorias de produtos em estrutura de árvore
- Suporte a categorias aninhadas (parent_id)

### Product Variations
- Variações de produtos (tamanhos, cores, etc)
- Estoque e preço independentes
- Atributos flexíveis via JSONB

### Price History
- Histórico de alterações de preços
- Rastreamento de quem fez a alteração
- Suporte a produtos base e variações

### Orders
- Pedidos de venda
- Campos: número, status, cliente, endereço, valores
- Metadados flexíveis via JSONB

### Order Items
- Itens individuais dos pedidos
- Referência a produtos e variações
- Preços e quantidades no momento da venda

### Order History
- Histórico de alterações de status dos pedidos
- Rastreamento de quem fez a alteração
- Suporte a notas/comentários

### Integration Mappings
- Mapeamento entre IDs locais e externos
- Suporte a diferentes tipos de entidades
- Metadados específicos por integração

### Notifications
- Sistema de notificações
- Tipos flexíveis de notificações
- Status de leitura

### Audit Log
- Log de auditoria do sistema
- Rastreamento de todas as alterações
- Armazena estado anterior e novo

## Características

### Segurança
- Row Level Security (RLS) em todas as tabelas
- Políticas de acesso baseadas em usuário/empresa
- Suporte a auditoria completa

### Performance
- Índices apropriados nas chaves primárias/estrangeiras
- Campos JSONB para dados flexíveis
- Triggers para atualização automática de timestamps

### Flexibilidade
- Suporte a múltiplas empresas (multi-tenant)
- Campos de metadados para extensibilidade
- Estruturas flexíveis via JSONB

### Integrações
- Suporte robusto a múltiplas integrações
- Mapeamento bidirecional de entidades
- Gestão de tokens e credenciais

## Uso

### Migrações
1. Certifique-se de ter o CLI do Supabase instalado
2. Execute: `supabase migration up`

### Políticas de Segurança
- As políticas RLS básicas estão definidas
- Adicione políticas específicas conforme necessário
- Use `auth.uid()` para filtrar por usuário atual

### Manutenção
- Monitore o tamanho das tabelas JSONB
- Implemente rotação de logs de auditoria
- Mantenha índices otimizados 