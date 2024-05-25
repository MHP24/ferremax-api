import { IdGenerator } from 'src/common/adapters';
import { IdGeneratorAdapter } from 'src/common/adapters/interfaces';

const idGenerator: IdGeneratorAdapter = new IdGenerator();

export const branchesSeed = [
  { branchId: idGenerator.id(), name: 'Cerrillos', isActive: true },
  { branchId: idGenerator.id(), name: 'Cerro Navia', isActive: true },
  { branchId: idGenerator.id(), name: 'Conchalí', isActive: true },
  { branchId: idGenerator.id(), name: 'El Bosque', isActive: true },
  { branchId: idGenerator.id(), name: 'Estación Central', isActive: true },
  { branchId: idGenerator.id(), name: 'Huechuraba', isActive: true },
  { branchId: idGenerator.id(), name: 'Independencia', isActive: true },
  { branchId: idGenerator.id(), name: 'La Cisterna', isActive: true },
  { branchId: idGenerator.id(), name: 'La Florida', isActive: true },
];
