import * as bcrypt from 'bcrypt';
import { HasherAdapter } from './interfaces';

export class Hasher implements HasherAdapter {
  async hash(target: string): Promise<string> {
    return await bcrypt.hash(target, 10);
  }

  async compareHash(target: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(target, hash);
  }
}
