import { JwtSignOptions } from '@nestjs/jwt';
import { Hasher } from '../../../../common/adapters';

export class FakeJWTService {
  private hasher = new Hasher();

  sign(payload: object | Buffer, options?: JwtSignOptions) {
    return this.hasher.hash(
      `${JSON.stringify(payload)}${JSON.stringify(options)}`,
    );
  }
}
