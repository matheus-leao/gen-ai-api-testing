# gen-ai-api-testing

API em Node.js para criação de usuários, login com JWT e geração de exercícios customizados de lógica de programação usando um provedor de LLM.

## Requisitos

- Node.js 18 ou superior

## Configuração

O projeto inclui um arquivo `.env` com as variáveis necessárias:

- `JWT_SECRET`: segredo usado para assinar o token JWT.
- `LLM_PROVIDER`: provedor usado para gerar exercícios. Valores suportados: `mock`, `gemini`, `codex`, `github_copilot`.
- `GEMINI_API_KEY`, `CODEX_API_KEY`, `GITHUB_COPILOT_TOKEN`: chaves/tokens dos provedores.

Por padrão, `LLM_PROVIDER=mock` permite executar a API sem chamar serviços externos.

## Executar

```bash
npm start
```

A API inicia em `http://localhost:3000`.

## Documentação Swagger

Com a API em execução, acesse:

- Swagger UI: `http://localhost:3000/docs`
- OpenAPI JSON: `http://localhost:3000/docs.json`

## Testes

```bash
npm test
```

## Endpoints

### Health check

```http
GET /health
```

### Criar usuário

```http
POST /users
Content-Type: application/json

{
  "name": "Ana",
  "email": "ana@example.com",
  "password": "secret123"
}
```

### Login

```http
POST /login
Content-Type: application/json

{
  "email": "ana@example.com",
  "password": "secret123"
}
```

Resposta:

```json
{
  "token": "jwt-token",
  "tokenType": "Bearer",
  "expiresInSeconds": 3600
}
```

### Criar exercício

Requer token JWT no header `Authorization`.

```http
POST /exercises
Authorization: Bearer jwt-token
Content-Type: application/json

{
  "level": "beginner",
  "topics": ["conditions", "vectors", "lists", "loops"],
  "context": "supermercado"
}
```

Resposta:

```json
{
  "id": "exercise-id",
  "userId": "user-id",
  "level": "beginner",
  "prompt": "prompt enviado ao provedor",
  "content": "exercicio gerado pelo provedor",
  "createdAt": "2026-07-03T00:00:00.000Z"
}
```
