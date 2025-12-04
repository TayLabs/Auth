import { exec } from 'node:child_process';
import path from 'node:path';

export default function generateSchema() {
  console.log('Generating schema file from database');

  exec('npx drizzle-kit generate', {
    cwd: path.join(__dirname, '../../../../'),
  });

  console.log('Schema generation complete');
}
