import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import yaml from 'js-yaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read the swagger.yaml file
const swaggerYamlPath = join(__dirname, '../swagger.yaml');
const swaggerDocument = yaml.load(readFileSync(swaggerYamlPath, 'utf8'));

export default swaggerDocument;
