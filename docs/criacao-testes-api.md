
Contexto: 
Aja como um SDET experiente, com habilidades em espress, api's, mocha, supertest

Objetivo:
Me ajude a realizar testes funcionais para a minha api.
- Leia o Swagger da api
- Crie testes automatizados para o endpoint de exercises
- Aplique a heurística VADER descrita abaixo
- Execute todos os testes do mocha

Regras:
- Os testes devem ser únicos e desacoplados, não devem depender de outros testes.
- Use os hooks para ajudar na otimização do código como before, each, e outros recursos do mocha
- Os testes devem ser criados na pasta tests/api/exercises
- Você é livre para criar helper na pasta tests/api/helpers
- Exercite os cenários positivos, negativos e de borda
- Cada um dos focos da heurística vader, deve ser representada com uma suite de describe e cada cenário com um it. 

Definição da Heurística VADER
V - Verbos (Métodos HTTP): Validar se a API responde corretamente aos métodos esperados (como GET, POST, PUT, DELETE) e como ela se comporta ao receber métodos não permitidos em determinados endpoints (ex: usar um POST onde apenas GET deveria ser aceito).
A - Authorization (Autorização): Testar os mecanismos de segurança e controle de acesso. Verificar se a API barra requisições sem o token correto, com credenciais inválidas ou com níveis de permissão insuficientes.
D - Data (Dados): Analisar o payload (corpo da requisição e resposta). Isso inclui validar tipos de dados, limites de caracteres, valores nulos, campos obrigatórios e testar falhas de injeção ou formatação incorreta.
E - Errors (Erros): Observar o tratamento de erros da aplicação. A API deve retornar o código de status HTTP correto (como 400, 401, 404, 500) e mensagens de erro amigáveis e descritivas quando algo sai do previsto.
R - Responsiveness (Capacidade de Resposta): Avaliar o desempenho e o tempo de resposta. Garantir que o sistema responda dentro de limites aceitáveis e que o contrato da estrutura de resposta (JSON/XML) esteja correto.