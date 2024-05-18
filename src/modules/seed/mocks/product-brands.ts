import { IdGenerator } from '../../../common/adapters';
import { IdGeneratorAdapter } from '../../../common/adapters/interfaces';

const idGenerator: IdGeneratorAdapter = new IdGenerator();

export const productBrandsSeed = [
  // * Herramientas Manuales
  { brandId: idGenerator.id(), name: 'Stanley' },
  { brandId: idGenerator.id(), name: 'DeWalt' },
  { brandId: idGenerator.id(), name: 'Bosch' },

  // * Herramientas Eléctricas
  { brandId: idGenerator.id(), name: 'Milwaukee' },
  { brandId: idGenerator.id(), name: 'Ryobi' },

  // * Materiales de Construcción - Materiales Básicos
  { brandId: idGenerator.id(), name: 'Cemex' },
  { brandId: idGenerator.id(), name: 'Holcim' },

  // * Equipos de Seguridad
  { brandId: idGenerator.id(), name: '3M' },
  { brandId: idGenerator.id(), name: 'Honeywell' },
];
