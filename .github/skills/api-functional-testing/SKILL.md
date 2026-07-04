---
name: api-functional-testing
description: "Use when: you need to create or expand functional API tests for an Express app using Swagger/OpenAPI, Mocha, and Supertest, following a VADER-based coverage strategy."
---

# API Functional Testing

## Objetivo

Criar testes funcionais automatizados para endpoints de API com foco em:
- contrato e documentação Swagger/OpenAPI;
- cenários positivos, negativos e de borda;
- isolamento entre testes;
- execução e validação via Mocha.

## Fluxo recomendado

1. Ler o Swagger/OpenAPI da API para entender:
   - endpoints;
   - métodos HTTP permitidos;
   - payloads esperados;
   - códigos de resposta e erros.

2. Identificar o endpoint alvo e mapear os cenários de teste.
   - Para o endpoint de exercises, priorizar cenários de criação e listagem.
   - Cobrir autenticação, validação de dados, tratamento de erros e comportamento de resposta.

3. Estruturar a suíte com Mocha e Supertest.
   - Criar testes em pastas específicas, como tests/api/exercises.
   - Usar helpers para reduzir duplicação e facilitar isolamento.
   - Aplicar hooks como beforeEach para preparar o ambiente por cenário.

4. Aplicar a heurística VADER com uma suite por foco.
   - V: Verbos (métodos HTTP e métodos não permitidos)
   - A: Authorization (token ausente, inválido ou insuficiente)
   - D: Data (payload, campos obrigatórios, tipos e limites)
   - E: Errors (400, 401, 404, 500 e mensagens esperadas)
   - R: Responsiveness (tempo de resposta e contrato JSON)

5. Garantir que os testes sejam únicos e desacoplados.
   - Cada teste deve conseguir rodar sozinho.
   - Evitar dependência entre cenários.
   - Usar dados novos por cenário sempre que possível.

6. Executar a suíte completa.
   - Rodar o comando de testes do projeto, por exemplo npm test.
   - Corrigir falhas e validar o resultado final.

## Critérios de conclusão

A tarefa é considerada concluída quando:
- os testes foram implementados na pasta esperada;
- cada foco da heurística VADER está representado por uma suite describe;
- cada cenário está em um it independente;
- todos os testes executam com sucesso no Mocha;
- o relatório de testes foi gerado, se o projeto estiver configurado para isso.

## Boas práticas

- Preferir testes de comportamento real via Supertest.
- Não depender de estado compartilhado entre testes.
- Validar respostas com assertivas claras e objetivas.
- Cobrir tanto o caminho feliz quanto os fluxos de falha.
- Reaproveitar helpers quando a estrutura da API se repetir.

## Exemplo de prompt para usar esta skill

- Crie testes funcionais para o endpoint /exercises com base no Swagger da API.
- Aplique a heurística VADER e execute a suíte completa com Mocha.
- Organize os testes em pastas de API e use helpers para isolar os cenários.
