import { IdGenerator } from '../../../common/adapters';
import { IdGeneratorAdapter } from '../../../common/adapters/interfaces';

const idGenerator: IdGeneratorAdapter = new IdGenerator();

export const productCategoriesSeed = [
  {
    categoryId: idGenerator.id(),
    name: 'Herramientas Manuales',
  },
  {
    categoryId: idGenerator.id(),
    name: 'Herramientas Eléctricas',
  },
  {
    categoryId: idGenerator.id(),
    name: 'Materiales de Construcción - Materiales Básicos',
  },
  {
    categoryId: idGenerator.id(),
    name: 'Materiales de Construcción - Acabados',
  },
  {
    categoryId: idGenerator.id(),
    name: 'Equipos de Seguridad',
  },
];
