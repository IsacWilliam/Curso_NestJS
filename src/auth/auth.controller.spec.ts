import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthGuard } from '../guards/auth.guard';
import { guardMock } from '../testing/guard.mock';
import { fileServiceMock } from '../testing/file-service.mock';
import { authLoginDTO } from '../testing/auth-login-dto.mock';
import { accessToken } from '../testing/access-token.mock';
import { authRegisterDTO } from '../testing/auth-register-dto.mock';
import { authForgetDTO } from '../testing/auth-forget-dto.mock';
import { authResetDTO } from '../testing/auth-reset-dto.mock';
import { userEntityList } from '../testing/user-entity-list.mock';
import { getPhoto } from '../testing/get-photo.mock';
import { AuthService } from './auth.service'; // Importação do serviço de autenticação

describe('AuthController', () => {
  let authController: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController], // Define o AuthController para o módulo de teste
      providers: [
        {
          provide: AuthService,
          useValue: {
            // Mock das funções do AuthService com valores resolvidos esperados
            login: jest.fn().mockResolvedValue({ accessToken }),
            register: jest.fn().mockResolvedValue({ accessToken }),
            forget: jest.fn().mockResolvedValue(accessToken),
            reset: jest.fn().mockResolvedValue({ accessToken }),
          },
        },
        fileServiceMock, // Mock do FileService
      ],
    })
      .overrideGuard(AuthGuard) // Substitui o AuthGuard pelo mock
      .useValue(guardMock)
      .compile();

    authController = module.get<AuthController>(AuthController); // Obtém a instância do AuthController
  });

  test('Validar a definição', () => {
    // Verifica se o AuthController foi definido
    expect(authController).toBeDefined();
  });

  describe('Fluxo de autenticação', () => {
    test('login method', async () => {
      // Chama o método login do AuthController e verifica se o resultado é igual ao accessToken esperado
      const result = await authController.login(authLoginDTO);
      expect(result).toEqual({ accessToken });
    });

    test('register method', async () => {
      // Chama o método register do AuthController e verifica se o resultado é igual ao accessToken esperado
      const result = await authController.register(authRegisterDTO);
      expect(result).toEqual({ accessToken });
    });

    test('forget method', async () => {
      // Chama o método forget do AuthController e verifica se o resultado é igual ao accessToken esperado
      const result = await authController.forget(authForgetDTO);
      expect(result).toEqual(accessToken);
    });

    test('reset method', async () => {
      // Chama o método reset do controller e verifica se o resultado é igual ao valor esperado
      const result = await authController.reset(authResetDTO);
      expect(result).toEqual({ accessToken });
    });
  });

  describe('Rotas autenticadas', () => {
    test('me method', async () => {
      // Seleciona o primeiro usuário da lista de entidades de usuário
      const userEntity = userEntityList[0];
      // Define o payload do token
      const tokenPayload = {
        id: 1,
        name: 'Isac',
        email: 'isac@teste.com',
        iat: 1718660801,
        exp: 1719092801,
        aud: 'users',
        iss: 'login',
        sub: '1',
      };

      // Chama o método me do AuthController e verifica se o resultado é igual ao usuário e payload esperados
      const result = await authController.me(userEntity, { tokenPayload });
      expect(result).toEqual({ user: userEntity, tokenPayload });
    });

    test('uploadPhoto method', async () => {
      // Obtém a foto mockada
      const photo = await getPhoto();
      // Chama o método uploadPhoto do AuthController e verifica se o resultado é igual à foto esperada
      const result = await authController.uploadPhoto(userEntityList[0], photo);
      expect(result).toEqual(photo);
    });
  });
});
