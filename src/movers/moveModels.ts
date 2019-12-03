import * as fs from 'fs';
import * as yaml from 'js-yaml';
import { deepRemoveKey } from '../utils/objectUtilities';
import { SwaggerDefinition, SwaggerModelDefinition } from '../models';
import { DEFAULT_MODEL_DEFINITION } from '../constants';

export const moveModels = async (swaggerDefinition: SwaggerDefinition, baseModelFile: string) => {
  const { components } = swaggerDefinition;
  Object.keys(components.schemas).forEach(definitionKey => {
    const modelDefinition = DEFAULT_MODEL_DEFINITION;
    let baseModelDefinition = new Set<string>();
    if (fs.existsSync(baseModelFile)) {
      baseModelDefinition = new Set<string>(
        yaml
          .safeLoad(fs.readFileSync(baseModelFile, 'utf8'))
          .map((value: object) => JSON.stringify(value))
      );
    }
    modelDefinition.name = definitionKey;
    modelDefinition.schema = components.schemas[definitionKey];
    const modelDefinitionWithoutNullable = deepRemoveKey<SwaggerModelDefinition>(
      modelDefinition,
      'nullable'
    );
    const modelWithRefsAltered = modifyReferences(modelDefinitionWithoutNullable);
    baseModelDefinition.add(JSON.stringify(modelWithRefsAltered));
    fs.writeFileSync(
      baseModelFile,
      yaml.safeDump([...baseModelDefinition].map((value: string) => JSON.parse(value)))
    );
  });
};

export const modifyReferences = (model: SwaggerModelDefinition) => {
  const convertedModelSchema = { ...model };
  const modelProperties = convertedModelSchema.schema.properties;
  Object.keys(modelProperties).forEach((propertyKey: string) => {
    const responseSchema: string | object = modelProperties[propertyKey];
    if (
      responseSchema['type'] &&
      responseSchema['type'] === 'array' &&
      responseSchema['items'] &&
      responseSchema['items']['$ref']
    ) {
      responseSchema['items']['$ref'] = `{{model: ${
        modelProperties[propertyKey]['items']['$ref'].split('/')[
          modelProperties[propertyKey]['items']['$ref'].split('/').length - 1
        ]
      }}}`;
    } else if (responseSchema['$ref']) {
      responseSchema['$ref'] = `{{model: ${
        modelProperties[propertyKey]['$ref'].split('/')[
          modelProperties[propertyKey]['$ref'].split('/').length - 1
        ]
      }}}`;
    }
  });
  return convertedModelSchema;
};
