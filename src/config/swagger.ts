import swaggerUi from 'swagger-ui-express';
import { globSync } from 'glob';
import path from 'path';
import { pathToFileURL } from 'url';

interface ISwaggerPaths {
  [key: string]: {
    [method: string]: unknown;
  };
}

interface ISwaggerComponents {
  schemas: {
    [key: string]: object;
  };
}

const docsFiles: string[] = globSync('src/modules/**/*.docs.{js,ts}');
const paths: ISwaggerPaths = {};
const components: ISwaggerComponents = { schemas: {} };

const loadDocs = async (): Promise<void> => {
  for (const file of docsFiles) {
    const modulePath: string = pathToFileURL(path.resolve(file)).href;
    const docsModule = await import(modulePath);

    const docs = Object.values(docsModule)[0] as {
      paths: ISwaggerPaths;
      components: ISwaggerComponents;
    };

    if (docs) {
      Object.assign(paths, docs.paths);
      Object.assign(components.schemas, docs.components.schemas);
    }
  }
};

await loadDocs();

const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'API Documentation',
    version: '1.0.0',
    description: 'Documentación de la API con Swagger'
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Servidor local'
    }
  ],
  paths,
  components
};

export { swaggerSpec, swaggerUi };
