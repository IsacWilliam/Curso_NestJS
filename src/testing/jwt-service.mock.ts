import { JwtService } from '@nestjs/jwt';
import { accessToken } from './access-token.mock';

export const jwtServiceMock = {
  provide: JwtService,
  useValue: {
    sign: jest.fn().mockReturnValue(accessToken),
    verify: jest.fn().mockReturnValue({
      id: 1,
      name: 'Isac',
      email: 'isac@teste.com',
      iat: 1718467872,
      exp: 1718899872,
      aud: 'users',
      iss: 'login',
      sub: '1',
    }),
  },
};
