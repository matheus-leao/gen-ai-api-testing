# Contexto:
Crie uma api responsável por permitir que alunos possam receber exercícios de lógica de programação customizados para suas necessidades.

# Regras para a api:
- A api deve ser criada em node.js, utilize o express para criação mais simplificada da api.
- A api deve ter um endpoint para criação de usuário, login de usuário e um endpoint para criação de um exercício para um usuário que está logado.
- O login de usuário deve retornar um token jwt
- O endpoint para criação do exercício precisa de um token jwt 
- Utilize um Banco de dados em memória para salvar essas informações
- O projeto deve ter um arquivo .env que contem a api key da api do provedor de LLM responsável por gerar o exercício. A api key deve suportar diferentes tipos de token para provedores diferentes, github copilot, Gemini e Codex.
- O projeto deve ser organizado com as seguintes pastas config, database, middlewares, models, routes, services, utils.
- O projeto deve ser documentado utilizando o swagger.

# Regras para testes:
- Para a pasta de testes utilize o mocha e siga o padrão AAA (Arrange, Act, Assert)
- Utilize o supertest para os testes.


# Prompt utilizado para criação de exercícios: 
Goal:
Create an algorithm exercice for a beginner|intermediate|advanced student.


Topics:

- Only one exercise should be created 1 exercise
- The exercise should have the following concepts: conditions, vectors, lists, and loops.
- Use common examples on a daily basis to help people to understand the concepts. Example: Supermarket, shopping, bank, coffee shop, etc.
- The exercise should be created in Portuguese.
- The exercise should have the following structure:
- Title
- Description of the problem
- Goal
- Example of Input data
- Example of Output data


Rules:
- The exercise should be created in Portuguese.
- Don't create the solution, just the problem.
- Don't add hints, just the problem.
- Don't add any other information, just the problem.
- The exercise should have the following structure only:
- Title
- Description of the problem
- Goal
- Example of Input data
- Example of Output data



Example: Orders in a coffee shop


Title: Orders in a coffee shop

Description: Create an algorithm that simulates the orders in a coffee shop. The algorithm will get a list of arrays that represent the list of orders of the day.

Goal: Calculate the total amount of the order.

Input: [["coffee", 5.00], ["cake", 3.00], ["tea", 2.00]]

Output: 10.00 