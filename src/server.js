import { createApp } from './app.js';
import { config } from './config/index.js';

const server = createApp({ config });

server.listen(config.port, () => {
  console.log(`API running on http://localhost:${config.port}`);
  console.log(`Swagger UI on http://localhost:${config.port}/docs/`);
});
