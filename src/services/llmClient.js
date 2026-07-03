function ensureApiKey(value, provider) {
  if (!value || value.startsWith('replace-with-')) {
    throw new Error(`Missing API key/token for provider: ${provider}`);
  }
}

function extractOpenAiStyleText(data) {
  return data?.choices?.[0]?.message?.content ?? data?.output_text ?? '';
}

export async function generateExerciseWithLlm(prompt, llmConfig) {
  switch (llmConfig.provider) {
    case 'mock':
      return `Title: Lista de compras inteligente

Description of the problem: Crie um algoritmo que ajude uma pessoa a conferir uma lista de compras no supermercado. O algoritmo deve receber uma lista de produtos, em que cada produto possui nome, preco e quantidade. Use repeticoes para percorrer todos os produtos e condicoes para identificar quais itens custam mais de 50 reais no total.

Goal: Calcular o valor total da compra e criar uma lista com os nomes dos produtos cujo subtotal seja maior que 50 reais.

Example of Input data: [["arroz", 25.00, 2], ["feijao", 9.00, 3], ["cafe", 18.00, 1]]

Example of Output data: {"total": 95.00, "produtosAcimaDe50": ["arroz"]}`;

    case 'gemini': {
      ensureApiKey(llmConfig.geminiApiKey, 'gemini');

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${llmConfig.geminiModel}:generateContent?key=${llmConfig.geminiApiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        }
      );

      if (!response.ok) {
        throw new Error(`Gemini request failed with status ${response.status}`);
      }

      const data = await response.json();
      return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    }

    case 'codex': {
      ensureApiKey(llmConfig.codexApiKey, 'codex');

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${llmConfig.codexApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: llmConfig.codexModel,
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`Codex request failed with status ${response.status}`);
      }

      return extractOpenAiStyleText(await response.json());
    }

    case 'github_copilot': {
      ensureApiKey(llmConfig.githubCopilotToken, 'github_copilot');

      const response = await fetch('https://api.githubcopilot.com/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${llmConfig.githubCopilotToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: llmConfig.githubCopilotModel,
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`GitHub Copilot request failed with status ${response.status}`);
      }

      return extractOpenAiStyleText(await response.json());
    }

    default:
      throw new Error(`Unsupported LLM provider: ${llmConfig.provider}`);
  }
}
