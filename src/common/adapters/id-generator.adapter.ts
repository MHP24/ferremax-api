import { IdGeneratorAdapter } from './interfaces';
import { v4 as uuidv4 } from 'uuid';

export class IdGenerator implements IdGeneratorAdapter {
  id(arg?: string) {
    return `${arg}${arg ? '-' : ''}${uuidv4()}`;
  }
}
