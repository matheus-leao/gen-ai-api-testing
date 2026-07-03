import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../..');

function loadDotEnv(filePath) {
  if (!fs.existsSync(filePath)) {
    return;
  }

  const content = fs.readFileSync(filePath, 'utf8');

  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    const separatorIndex = trimmed.indexOf('=');

    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    let value = trimmed.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!Object.prototype.hasOwnProperty.call(process.env, key)) {
      process.env[key] = value;
    }
  }
}

loadDotEnv(path.join(projectRoot, '.env'));

export const config = {
  port: Number(process.env.PORT ?? 3000),
  jwtSecret: process.env.JWT_SECRET ?? 'change-this-secret-before-production',
  jwtExpiresInSeconds: Number(process.env.JWT_EXPIRES_IN_SECONDS ?? 3600),
  llm: {
    provider: process.env.LLM_PROVIDER ?? 'mock',
    geminiApiKey: process.env.GEMINI_API_KEY ?? '',
    codexApiKey: process.env.CODEX_API_KEY ?? '',
    githubCopilotToken: process.env.GITHUB_COPILOT_TOKEN ?? '',
    geminiModel: process.env.GEMINI_MODEL ?? 'gemini-1.5-flash',
    codexModel: process.env.CODEX_MODEL ?? 'gpt-4.1-mini',
    githubCopilotModel: process.env.GITHUB_COPILOT_MODEL ?? 'gpt-4o-mini'
  }
};
