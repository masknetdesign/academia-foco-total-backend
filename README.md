
# Backend (Node.js)

Este backend será responsável por:
- Servir arquivos estáticos do frontend.
- Fornecer APIs para:
  - Listar aulas/planos/itens da loja.
  - Autenticação de administradores.
  - Gerenciamento de dados (CRUD para aulas, planos, etc. - para o dashboard do admin).

## Rotas Propostas:

### Rotas Públicas:
- `GET /api/classes`: Retorna uma lista de aulas.
- `GET /api/plans`: Retorna uma lista de planos.
- `GET /api/store`: Retorna uma lista de itens da loja.

### Rotas de Autenticação:
- `POST /api/admin/login`: Autentica um usuário administrador.

### Rotas de Administrador (protegidas):
- `GET /api/admin/dashboard`: Retorna dados para o dashboard do administrador.
- `POST /api/admin/classes`: Adiciona uma nova aula.
- `PUT /api/admin/classes/:id`: Atualiza uma aula existente.
- `DELETE /api/admin/classes/:id`: Exclui uma aula.
- `POST /api/admin/plans`: Adiciona um novo plano.
- `PUT /api/admin/plans/:id`: Atualiza um plano existente.
- `DELETE /api/admin/plans/:id`: Exclui um plano.
- `POST /api/admin/store`: Adiciona um novo item à loja.
- `PUT /api/admin/store/:id`: Atualiza um item da loja existente.
- `DELETE /api/admin/store/:id`: Exclui um item da loja.


