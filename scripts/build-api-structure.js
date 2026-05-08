import fs from 'fs';
import path from 'path';

const dirs = [
  'apps/api/dist',
  'apps/api/docs/prompts',
  'apps/api/docs/templates/module/application/use-cases',
  'apps/api/docs/templates/module/infrastructure',
  'apps/api/docs/templates/module/presentation/http',
  'apps/api/docs/typedoc',
  'apps/api/db/migrations',
  'apps/api/db/seeds',
  'apps/api/db/schema',
  'apps/api/scripts/metrics',
  'apps/api/tests',
  'apps/api/src/bootstrap/plugins',
  'apps/api/src/config',
  'apps/api/src/contracts',
  'apps/api/src/infra',
  'apps/api/src/legacy',
  'apps/api/src/lib',
  'apps/api/src/shared/errors',
  'apps/api/src/shared/http',
  'apps/api/src/shared/integrations/external',
  'apps/api/src/shared/logger',
  'apps/api/src/shared/utils',
  'apps/api/src/modules/proxy/application/dtos',
  'apps/api/src/modules/proxy/application/ports',
  'apps/api/src/modules/proxy/application/use-cases',
  'apps/api/src/modules/proxy/infrastructure/db',
  'apps/api/src/modules/proxy/infrastructure/integrations',
  'apps/api/src/modules/proxy/infrastructure/jobs',
  'apps/api/src/modules/proxy/presentation/http/controllers',
];

const files = [
  'apps/api/src/bootstrap/plugins/error-handler.ts',
  'apps/api/src/bootstrap/plugins/job-lock.ts',
  'apps/api/src/bootstrap/plugins/logger.ts',
  'apps/api/src/bootstrap/plugins/database.ts',
  'apps/api/src/bootstrap/app.ts',
  'apps/api/src/bootstrap/routes.ts',
  'apps/api/src/bootstrap/server.ts',
  'apps/api/src/config/.env',
  'apps/api/src/config/env.ts',
  'apps/api/src/config/index.ts',
  'apps/api/src/contracts/example.contract.ts',
  'apps/api/src/infra/db.ts',
  'apps/api/src/lib/http.ts',
  'apps/api/src/shared/errors/AppError.ts',
  'apps/api/src/shared/errors/domain-errors.ts',
  'apps/api/src/shared/errors/http-errors.ts',
  'apps/api/src/shared/http/response.ts',
  'apps/api/src/shared/http/validate.ts',
  'apps/api/src/shared/integrations/external/external.adapter.ts',
  'apps/api/src/shared/integrations/external/external.client.ts',
  'apps/api/src/shared/integrations/external/external.utils.ts',
  'apps/api/src/shared/logger/index.ts',
  'apps/api/src/shared/logger/logger.ts',
  'apps/api/src/shared/utils/backoff.ts',
  'apps/api/src/shared/utils/job-lock.ts',
  'apps/api/src/server.ts',
  'apps/api/src/modules/proxy/presentation/http/routes.ts',
  'apps/api/src/modules/proxy/presentation/http/schemas.ts',
  'apps/api/src/modules/proxy/index.ts',
];

for (const dir of dirs) {
  fs.mkdirSync(dir, { recursive: true });
}

for (const file of files) {
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, '// init\n');
  }
}

console.log('Structure created!');
